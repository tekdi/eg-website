import {
  facilitatorRegistryService,
  t,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  FrontEndTypo,
  SelectStyle,
  Loading,
  CardComponent,
} from "@shiksha/common-lib";
import { HStack, VStack, Box, Select, Pressable, Stack } from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chip, { ChipStatus } from "component/BeneficiaryStatus";
import InfiniteScroll from "react-infinite-scroll-component";
import Clipboard from "component/Clipboard";
import PropTypes from "prop-types";

const LearnerMessage = ({ program_beneficiaries }) => {
  const [reason, setReason] = useState({});
  useEffect(() => {
    if (
      program_beneficiaries?.enrollment_verification_status ===
      "change_required"
    ) {
      setReason(
        JSON.parse(program_beneficiaries?.enrollment_verification_reason)
      );
    }
  }, []);

  const getTitle = () => {
    if (
      reason?.learner_enrollment_details === "no" &&
      reason?.enrollment_details === "no"
    ) {
      return t("ENROLLMENT_RECEIPT_AND_DETAILS_MISMATCH");
    } else if (reason?.learner_enrollment_details === "no") {
      return t("CORRECT_ENROLLMENT_DETAILS");
    } else if (reason?.enrollment_details === "no") {
      return t("CORRECT_ENROLLMENT_LEARNER_DETAILS");
    } else {
      return t("FOLLOW_UP_WITH_IP");
    }
  };

  return (
    <HStack color="LearnerListCardLink.500" alignItems="center">
      <FrontEndTypo.H4 color="LearnerListCardLink.500">
        {getTitle()}
      </FrontEndTypo.H4>
    </HStack>
  );
};

const List = ({ data }) => {
  const navigate = useNavigate();

  return (
    <VStack space="4" p="4" alignContent="center">
      {(data && data?.length > 0) || data?.constructor?.name === "Array" ? (
        data &&
        data?.constructor?.name === "Array" &&
        data?.map((item) => (
          <CardComponent
            key={item?.id}
            _body={{ px: "0", py: "2" }}
            _vstack={{ p: 0, space: 0, flex: 1 }}
          >
            <Pressable
              onPress={async () => {
                navigate(`/beneficiary/${item?.id}`);
              }}
              flex={1}
            >
              <VStack
                alignItems="center"
                p="1"
                borderBottomColor={"LeanerListCardIDBorder.500"}
                borderStyle={"dotted"}
                borderBottomWidth={"1px"}
              >
                <Clipboard text={item?.id}>
                  <FrontEndTypo.H4 color="floatingLabelColor.500" bold>
                    {item?.id}
                  </FrontEndTypo.H4>
                </Clipboard>
              </VStack>
              <HStack pt={2} px={3} justifyContent="space-between" space={1}>
                <HStack alignItems="Center" flex={[1, 2, 4]}>
                  <VStack
                    pl="2"
                    flex="1"
                    wordWrap="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {item?.program_beneficiaries?.status ===
                    "enrolled_ip_verified" ? (
                      <FrontEndTypo.H3 bold color="textGreyColor.800">
                        {item?.program_beneficiaries?.enrollment_first_name}
                        {item?.program_beneficiaries?.enrollment_middle_name &&
                          item?.program_beneficiaries
                            ?.enrollment_middle_name !== "null" &&
                          ` ${item?.program_beneficiaries?.enrollment_middle_name}`}
                        {item?.program_beneficiaries?.enrollment_last_name &&
                          item?.program_beneficiaries?.enrollment_last_name !==
                            "null" &&
                          ` ${item?.program_beneficiaries?.enrollment_last_name}`}
                      </FrontEndTypo.H3>
                    ) : (
                      <FrontEndTypo.H4 bold color="grayTitleCard">
                        {item?.first_name}
                        {item?.middle_name &&
                          item?.middle_name !== "null" &&
                          ` ${item.middle_name}`}
                        {item?.last_name &&
                          item?.last_name !== "null" &&
                          ` ${item.last_name}`}
                      </FrontEndTypo.H4>
                    )}

                    <FrontEndTypo.H5 color="LearnerListCardNumber.500">
                      {item?.mobile}
                    </FrontEndTypo.H5>
                  </VStack>
                </HStack>
                <VStack alignItems="end" flex={[1]}>
                  <ChipStatus
                    w="fit-content"
                    status={item?.program_beneficiaries?.status}
                    is_duplicate={item?.is_duplicate}
                    is_deactivated={item?.is_deactivated}
                    rounded={"sm"}
                  />
                </VStack>
              </HStack>
            </Pressable>
            <VStack px={2} bg="white" alignItems={"end"}>
              {item?.program_beneficiaries?.status === "identified" && (
                <Pressable
                  onPress={() => {
                    navigate(`/beneficiary/${item?.id}/docschecklist`);
                  }}
                >
                  <HStack color="LearnerListCardLink.500" alignItems="center">
                    <FrontEndTypo.H4 color="LearnerListCardLink.500">
                      {t("COMPLETE_THE_DOCUMENTATION")}
                    </FrontEndTypo.H4>
                    <IconByName name="ArrowRightSLineIcon" py="0" />
                  </HStack>
                </Pressable>
              )}
              {item?.program_beneficiaries?.status === "enrollment_pending" && (
                <Pressable
                  onPress={() => {
                    navigate(`/beneficiary/${item?.id}/docschecklist`);
                  }}
                >
                  <HStack color="LearnerListCardLink.500" alignItems="center">
                    <FrontEndTypo.H4 color="blueText.450">
                      {t("CONTINUE_ENROLLMENT")}
                    </FrontEndTypo.H4>
                    <IconByName name="ArrowRightSLineIcon" />
                  </HStack>
                </Pressable>
              )}
              {item?.program_beneficiaries?.status === "ready_to_enroll" && (
                <Pressable
                  onPress={() => {
                    navigate(`/beneficiary/${item?.id}/enrollmentdetails`);
                  }}
                >
                  <HStack color="LearnerListCardLink.500" alignItems="center">
                    <FrontEndTypo.H4 color="blueText.450">
                      {t("ENTER_THE_ENROLLMENT_DETAILS")}
                    </FrontEndTypo.H4>
                    <IconByName name="ArrowRightSLineIcon" />
                  </HStack>
                </Pressable>
              )}
              {["duplicated", "enrolled_ip_verified"]?.includes(
                item?.program_beneficiaries?.status
              ) && (
                <HStack
                  color="LearnerListCardLink.500"
                  alignItems="center"
                  mb="2"
                >
                  <FrontEndTypo.H4 color="blueText.450">
                    {item?.program_beneficiaries?.status === "duplicated"
                      ? t("FOLLOW_UP_WITH_IP_ASSIGNMENT")
                      : t("TO_BE_REGISTERED_IN_CAMP")}
                  </FrontEndTypo.H4>
                </HStack>
              )}
              {item?.program_beneficiaries?.status === "enrolled" && (
                <LearnerMessage
                  program_beneficiaries={item?.program_beneficiaries}
                />
              )}
            </VStack>
          </CardComponent>
        ))
      ) : (
        <FrontEndTypo.H3>{t("DATA_NOT_FOUND")}</FrontEndTypo.H3>
      )}
    </VStack>
  );
};
const select2 = [
  { label: "SORT_ASC", value: "asc" },
  { label: "SORT_DESC", value: "desc" },
];

const styles = {
  inforBox: {
    style: {
      background: "textMaroonColor.50",
    },
  },
};

export default function BenificiaryListView({ userTokenInfo, footerLinks }) {
  const [facilitator, setFacilitator] = useState({});
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ limit: 6 });
  const [data, setData] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);
  const fa_id = localStorage.getItem("id");

  useEffect(async () => {
    const data = await benificiaryRegistoryService.getStatusList();
    if (data.length > 0) {
      setSelectStatus(data);
    }
  }, []);

  useEffect(() => {
    if (ref?.current?.clientHeight >= 0 && bodyHeight >= 0) {
      setLoadingHeight(bodyHeight - ref?.current?.clientHeight);
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight, ref]);

  useEffect(async () => {
    const { currentPage, totalPages, error, ...result } =
      await benificiaryRegistoryService.getBeneficiariesList(filter);
    if (!error) {
      setHasMore(parseInt(`${currentPage}`) < parseInt(`${totalPages}`));
      if (filter?.page > 1) {
        setData([...data, ...(result.data || [])]);
      } else {
        setData(result.data || []);
      }
    } else {
      setData([]);
    }
    setLoadingList(false);
  }, [filter]);

  useEffect(async () => {
    if (userTokenInfo) {
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      _appBar={{
        onlyIconsShow: ["userInfo", "loginBtn", "langBtn"],
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setFilter({ ...filter, search: value, page: 1 });
        },
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      // _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <VStack ref={ref}>
        <HStack
          justifyContent="space-between"
          space="2"
          alignItems="Center"
          p="4"
        >
          <Box flex="2">
            <SelectStyle
              overflowX="hidden"
              selectedValue={filter?.status}
              placeholder={t("STATUS_ALL")}
              onValueChange={(nextValue) => {
                setFilter({ ...filter, status: nextValue, page: 1 });
              }}
              _selectedItem={{
                bg: "cyan.600",
                endIcon: <IconByName name="ArrowDownSLineIcon" />,
              }}
              accessibilityLabel="Select a position for Menu"
            >
              <Select.Item key={0} label={t("BENEFICIARY_ALL")} value={""} />
              {Array.isArray(selectStatus) &&
                selectStatus.map((option, index) => (
                  <Select.Item
                    key={index || ""}
                    label={t(option.title)}
                    value={option.value}
                  />
                ))}
            </SelectStyle>
          </Box>
          <Box flex="2">
            <SelectStyle
              overflowX="hidden"
              selectedValue={filter?.sortType ? filter?.sortType : ""}
              placeholder={t("SORT_BY")}
              onValueChange={(nextValue) => {
                setFilter({ ...filter, sortType: nextValue, page: 1 });
              }}
              _selectedItem={{
                bg: "secondary.700",
              }}
              accessibilityLabel="Select a position for Menu"
            >
              {select2.map((option, index) => (
                <Select.Item
                  key={index || ""}
                  label={t(option.label)}
                  value={option.value}
                  p="5"
                />
              ))}
            </SelectStyle>
          </Box>
        </HStack>
      </VStack>
      {!loadingList ? (
        <InfiniteScroll
          dataLength={data?.length}
          next={(e) =>
            setFilter({
              ...filter,
              page: (filter?.page ? filter?.page : 1) + 1,
            })
          }
          hasMore={hasMore}
          height={loadingHeight}
          loader={<Loading height="100" />}
          endMessage={
            <FrontEndTypo.H3 bold display="inherit" textAlign="center">
              {data?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
          // below props only if you need pull down functionality
          pullDownToRefreshThreshold={50}
        >
          <List data={data} />
          <Pressable
            onPress={(e) => {
              if (
                [
                  "pragati_mobilizer",
                  "selected_prerak",
                  "selected_for_training",
                  "selected_for_onboarding",
                ].includes(facilitator.status)
              ) {
                navigate(`/beneficiary`);
              } else {
                navigate("/beneficiary");
              }
            }}
          >
            {/* <HStack alignItems="Center">
              <IconByName
                isDisabled
                name="UserFollowLineIcon"
                _icon={{ size: "30px" }}
                onPress={(e) => {
                  navigate("/beneficiary");
                }}
              />
              <VStack flex="0.8"> */}
            <FrontEndTypo.Secondarybutton
              onPress={(e) => {
                if (
                  [
                    "pragati_mobilizer",
                    "selected_prerak",
                    "selected_for_training",
                    "selected_for_onboarding",
                  ].includes(facilitator.status)
                ) {
                  navigate(`/beneficiary`);
                } else {
                  navigate("/beneficiary");
                }
              }}
              // rightIcon={}
              mx="auto"
              my="2"
              minW="70%"
            >
              {t("ADD_MORE_AG")}
            </FrontEndTypo.Secondarybutton>
            {/* </VStack>
            </HStack> */}
          </Pressable>
        </InfiniteScroll>
      ) : (
        <Loading height={loadingHeight} />
      )}
    </Layout>
  );
}

BenificiaryListView.PropTypes = {
  userTokenInfo: PropTypes.any,
  footerLinks: PropTypes.any,
};
