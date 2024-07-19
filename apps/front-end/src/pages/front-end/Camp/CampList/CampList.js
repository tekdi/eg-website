import {
  CustomAlert,
  FrontEndTypo,
  GetEnumValue,
  IconByName,
  ObservationService,
  TitleCard,
  benificiaryRegistoryService,
  campService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { Avatar, Center, HStack, Modal, Stack, VStack } from "native-base";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function List({ userTokenInfo, stateName }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [nonRegisteredUser, setNonRegisteredUser] = useState([]);
  const [campList, setCampList] = useState();
  const [enumOptions, setEnumOptions] = useState();
  const [communityLength, setCommunityLength] = useState(0);
  const [ipStatus, setIpStatus] = useState();
  const [campSelected, setCampSelected] = useState("");
  const [campCount, setCampCount] = useState();
  const [chartData, SetChartData] = useState();
  const [leanerList, setLeanerList] = useState([]);

  const campSettingData = (item) => {
    return (
      item?.preferred_start_time === null &&
      item?.preferred_end_time === null &&
      item?.week_off === null
    );
  };

  useEffect(async () => {
    const result = await campService.campNonRegisteredUser();
    const campList = await campService.campList();
    const enums = await enumRegistryService.listOfEnum();
    if (campList?.data?.camps?.length === 0) {
      const getData = await benificiaryRegistoryService.getCommunityReferences({
        context: "community.user",
      });
      setCommunityLength(getData?.data?.community_response?.length || 0);
    } else {
      setCommunityLength(2);
    }
    const prerak_status = localStorage.getItem("status");
    setIpStatus(prerak_status);
    setEnumOptions(enums?.data || {});
    setNonRegisteredUser(result?.data?.user || []);
    setCampList(campList?.data);
    setCampCount(
      campList?.data?.pcr_camp?.length + campList?.data?.camps?.length
    );
    setLoading(false);
  }, []);

  const flattenList = (list) => {
    let flattenedArray = [];
    list?.forEach((item) => {
      item.group.group_users.forEach((userObj) => {
        const { user_id, first_name, middle_name, last_name } = userObj.user;
        flattenedArray.push({
          user_id,
          first_name,
          middle_name: middle_name || "",
          last_name: last_name || "",
          group_id: item.group.group_id,
          camp_id: item.camp_id,
        });
      });
    });

    return flattenedArray;
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let observation = "EPCP";
      const listData = await ObservationService.getCampLearnerList();
      const flattenedList = flattenList(listData?.data);
      const userIds = listData?.data?.flatMap((group) =>
        group.group.group_users.map((user) => user.user.user_id)
      );
      const data = await ObservationService.getSubmissionData(
        userIds,
        observation
      );

      const report = data?.data?.[0]?.observation_fields;

      mergingData(flattenedList, report);
      setLoading(false);
    };
    fetchData();
  }, []);

  const mergingData = (flattenedList, report) => {
    const mergedArray = flattenedList?.map((user) => {
      const userData = { ...user };
      const responses = report?.reduce((acc, observation) => {
        const fieldResponse = observation?.field_responses?.find(
          (response) => response.context_id === user?.user_id
        );
        if (fieldResponse) {
          acc.push({
            field_id: observation.field_id,
            response_value: fieldResponse.response_value,
          });
        }
        return acc;
      }, []);
      userData.responses = responses;
      return userData;
    });
    const data = ProcessData(mergedArray);
    setLeanerList(data);
  };
  const getStatus = (responses) => {
    const response1 = responses?.find((response) => response.field_id === 1);
    const response2 = responses?.find((response) => response.field_id === 2);
    const response3 = responses?.find((response) => response.field_id === 3);
    const response5 = responses?.find((response) => response.field_id === 5);
    const response7 = responses?.find((response) => response.field_id === 7);
    if (!response1 || !response2 || !response3 || !response5 || !response7) {
      return t("NOT_ENTERED");
    } else if (
      response1.response_value === "NO" &&
      response2 &&
      response2.response_value !== ""
    ) {
      return t("NOT_STARTED");
    } else if (
      response1.response_value === "YES" &&
      (response3.response_value === "NO" ||
        response5.response_value === "NO" ||
        response7.response_value === "NO")
    ) {
      return t("IN_PROGRESS");
    } else if (
      response1.response_value === "YES" &&
      response3.response_value === "YES" &&
      response5.response_value === "YES" &&
      response7.response_value === "YES"
    ) {
      return t("COMPLETED");
    } else if (responses.every((response) => response.response_value === "")) {
      return t("NOT_ENTERED");
    } else {
      return "unknown";
    }
  };

  const ProcessData = (mergedArray) => {
    const newData = mergedArray?.map((user) => {
      const status = getStatus(user.responses);
      return { ...user, status };
    });
    countStatus(newData);
    return newData;
  };

  const countStatus = (data) => {
    let statusCounts = {};
    data.forEach((item) => {
      const status = item.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    SetChartData(statusCounts);
    return statusCounts;
  };

  const statusArray = [["Task", "Hours per Day"]];

  if (chartData) {
    Object.entries(chartData).forEach(([status, count]) => {
      statusArray.push([status, count]);
    });
  }

  const options = {
    title: `${t("TOTAL_STUDENTS")} : ${leanerList?.length}`,
    // pieHole: 0.3,
    is3D: true,
  };
  return (
    <Stack>
      <VStack p="4" space="5">
        <FrontEndTypo.H3>
          {`${t("HELLO")}, ${userTokenInfo?.authUser?.first_name}!`}
        </FrontEndTypo.H3>

        {campList?.pcr_camp?.length > 0 && campList?.pcr_camp?.length <= 2 && (
          <VStack
            // bg="boxBackgroundColour.200"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            padding="4"
            shadow="AlertShadow"
            // background={"bgYellowColor.400"}
          >
            {["selected_for_onboarding", "selected_prerak"].includes(
              ipStatus
            ) ? (
              <VStack>
                {communityLength >= 2 ? (
                  <VStack space={5}>
                    <HStack
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <VStack flex={1}>
                        <FrontEndTypo.H2 bold color={"textGreyColor.750"}>
                          {t("PCR_CAMPS")}
                        </FrontEndTypo.H2>
                        {/* <VStack>
                          <FrontEndTypo.H3 color="textMaroonColor.400">
                            {`${nonRegisteredUser?.length} `}
                            {t("UNMAPPED_LEARNERS")}
                          </FrontEndTypo.H3>
                        </VStack> */}
                        <HStack justifyContent={"space-between"}>
                          <FrontEndTypo.H3 color="textMaroonColor.400">
                            {`${nonRegisteredUser?.length} `}
                            {t("UNMAPPED_LEARNERS")}
                          </FrontEndTypo.H3>
                          <Center>
                            {nonRegisteredUser.length > 0 && (
                              <Avatar.Group
                                _avatar={{
                                  size: "sm",
                                }}
                                max={3}
                              >
                                {nonRegisteredUser?.map((item) => {
                                  return (
                                    <Avatar
                                      key={item}
                                      bg="red.500"
                                      {...(item?.profile_photo_1?.fileUrl
                                        ? {
                                            source: {
                                              uri: item?.profile_photo_1
                                                ?.fileUrl,
                                            },
                                          }
                                        : {})}
                                    >
                                      {item?.program_beneficiaries[0]
                                        ?.enrollment_first_name
                                        ? item?.program_beneficiaries[0]?.enrollment_first_name?.substring(
                                            0,
                                            2
                                          )
                                        : "NA"}
                                    </Avatar>
                                  );
                                })}
                              </Avatar.Group>
                            )}
                          </Center>
                        </HStack>

                        <CustomAlert
                          status={""}
                          title={t("PCR_CAMP_ALERT_MESSAGE")}
                        />
                      </VStack>
                    </HStack>
                    {campList?.pcr_camp?.map((item, i) => {
                      const index = i + 1;
                      return (
                        <CampCard
                          {...{ index, item, enumOptions, setCampSelected }}
                        />
                      );
                    })}
                    {campCount >= 0 && campCount < 2 && (
                      <FrontEndTypo.Secondarybutton
                        onPress={() => {
                          navigate(`/camps/new/learners`, { state: "camp" });
                        }}
                      >
                        <FrontEndTypo.H3 color="textMaroonColor.400">
                          {campCount == 0
                            ? t("START_FIRST_CAMP_REGISTER")
                            : t("START_SECOND_CAMP_REGISTER")}
                        </FrontEndTypo.H3>
                      </FrontEndTypo.Secondarybutton>
                    )}
                    <CustomAlert title={t("CAMP_WARNING")} status={"info"} />
                  </VStack>
                ) : (
                  <CustomAlert
                    status={"warning"}
                    title={t("COMMUNITY_MIN_ERROR")}
                  />
                )}
              </VStack>
            ) : (
              <CustomAlert status={"warning"} title={t("CAMP_ACCESS_ERROR")} />
            )}
          </VStack>
        )}

        {campList?.camps && (
          <VStack
            // bg="boxBackgroundColour.200"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            padding="4"
            shadow="AlertShadow"
          >
            <VStack>
              <VStack space={5}>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                  <VStack flex={1}>
                    <FrontEndTypo.H2 bold color={"textGreyColor.750"}>
                      {t("MAIN_CAMPS")}
                    </FrontEndTypo.H2>
                  </VStack>
                </HStack>
                {campList?.camps?.map((item, i) => {
                  const index = i + 1;
                  return (
                    <CampCard
                      {...{ index, item, enumOptions, setCampSelected }}
                    />
                  );
                })}
              </VStack>
            </VStack>
          </VStack>
        )}
      </VStack>
      {stateName === "RAJASTHAN" && (
        <Chart chartType="PieChart" data={statusArray} options={options} />
      )}
      <Modal
        isOpen={campSelected}
        onClose={() => setCampSelected()}
        safeAreaTop={true}
        size="xl"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body p={5} marginTop={"20px"}>
            <VStack space={4}>
              <Stack alignItems={"center"}>
                <FrontEndTypo.H4 bold color="textGreyColor.750">{`${t(
                  "CAMP_ID"
                )} : ${campSelected?.id}`}</FrontEndTypo.H4>
              </Stack>
              <FrontEndTypo.Primarybutton
                m="2"
                onPress={() => {
                  navigate(`/camps/${campSelected?.id}`);
                }}
              >
                {campSelected?.type === "pcr"
                  ? t("PCR_CAMP_PROFILE")
                  : t("MAIN_CAMP_PROFILE")}
              </FrontEndTypo.Primarybutton>
              {["registered", "camp_ip_verified"].includes(
                campSelected?.group?.status
              ) && (
                <Stack space={4}>
                  <FrontEndTypo.Secondarybutton
                    onPress={() => {
                      navigate(`/camps/${campSelected?.id}/settings`);
                    }}
                  >
                    {campSelected?.type === "pcr"
                      ? t("PCR_CAMP_SETTINGS")
                      : t("MAIN_CAMP_SETTINGS")}
                  </FrontEndTypo.Secondarybutton>
                  {campSettingData(campSelected) ? (
                    <CustomAlert
                      status={"warning"}
                      title={t("CAMP_EXECUTION_MESSAGE")}
                    />
                  ) : (
                    <FrontEndTypo.Primarybutton
                      onPress={() => {
                        navigate(`/camps/${campSelected?.id}/campexecution`);
                      }}
                    >
                      {campSelected?.type === "pcr"
                        ? t("PCR_CAMP_EXECUTION")
                        : t("MAIN_CAMP_EXECUTION")}
                    </FrontEndTypo.Primarybutton>
                  )}
                </Stack>
              )}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Stack>
  );
}

List.PropTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};

const CampCard = ({ index, item, enumOptions, setCampSelected }) => {
  const { t } = useTranslation();
  return (
    <TitleCard
      onPress={() => {
        setCampSelected(item);
      }}
      _title={{
        flex: 12,
        px: 2.5,
        py: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
      _body={{ px: 2.5, py: 5 }}
      title={
        <FrontEndTypo.H1 bold color={"white"}>
          {`C${String(index).padStart(2)}`}
        </FrontEndTypo.H1>
      }
    >
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <VStack flex={50}>
          <FrontEndTypo.H3>{`${t("CAMP_ID")} `}</FrontEndTypo.H3>
          {item?.group?.description && (
            <FrontEndTypo.H6>{item?.group?.description}</FrontEndTypo.H6>
          )}
          <FrontEndTypo.H3>{item?.id}</FrontEndTypo.H3>
        </VStack>

        <HStack space={2} flex="50" justifyContent={"end"}>
          <IconByName
            isDisabled
            name={
              ["camp_ip_verified"].includes(item?.group?.status)
                ? "CheckLineIcon"
                : "ErrorWarningLineIcon"
            }
            color={
              ["camp_ip_verified"].includes(item?.group?.status)
                ? "textGreen.700"
                : "textMaroonColor.400"
            }
            _icon={{ size: "20px" }}
          />
          <GetEnumValue
            t={t}
            enumType={"GROUPS_STATUS"}
            enumOptionValue={item?.group?.status}
            enumApiData={enumOptions}
            color={
              ["camp_ip_verified"].includes(item?.group?.status)
                ? "textGreen.700"
                : "textMaroonColor.400"
            }
          />
        </HStack>
      </HStack>
    </TitleCard>
  );
};
