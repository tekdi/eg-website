import React, { useEffect, useState } from "react";
import {
  FrontEndTypo,
  Layout,
  ObservationService,
  jsonParse,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { Alert, Avatar, HStack, Pressable, VStack } from "native-base";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const EpcpLearnerList = ({ footerLinks, userTokenInfo: { authUser } }) => {
  const [loading, setLoading] = useState(true);
  const [leanerList, setLeanerList] = useState([]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate("/camps");
  };

  const flattenList = (list, report) => {
    let flattenedArray = [];
    list?.forEach((item) => {
      item?.group?.group_users?.forEach((userObj) => {
        const { user_id, program_beneficiaries } = userObj?.user || {};
        const userData = mergingData(
          {
            user_id,
            first_name: program_beneficiaries?.[0]?.enrollment_first_name,
            middle_name: program_beneficiaries?.[0]?.enrollment_middle_name,
            last_name: program_beneficiaries?.[0]?.enrollment_last_name,
            group_id: item.group.group_id,
            camp_id: item.camp_id,
          },
          report,
        );
        flattenedArray?.push(userData);
      });
    });

    return flattenedArray;
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let observation = "EPCP";
      const listData = await ObservationService.getCampLearnerList();
      const userIds = listData?.data?.flatMap((group) =>
        group.group.group_users.map((user) => user.user.user_id),
      );
      const data = await ObservationService.getSubmissionData({
        id: userIds,
        board_id:
          listData?.data?.[0]?.group?.group_users?.[0]?.user
            ?.program_beneficiaries?.[0]?.enrolled_for_board,

        observation,
      });
      const report = data?.data?.[0]?.observation_fields;
      const flattenedList = flattenList(listData?.data, report);
      setLeanerList(flattenedList);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser,
      }}
      loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"EPCP_LIST"}
      pageTitle={t("EPCP_LIST")}
    >
      {leanerList.length === 0 ? (
        <Alert mt={4} status="warning">
          <HStack space={2}>
            <Alert.Icon />
            <FrontEndTypo.H3>{t("EPCP_WARNING")}</FrontEndTypo.H3>
          </HStack>
        </Alert>
      ) : (
        <VStack space={4} padding={4}>
          <HStack mt={3} space={4} justifyContent={"space-evenly"}>
            <VStack space={4}>
              <HStack space={2} alignItems={"center"}>
                <Avatar bg="textBlack.500" size={["15px", "30px"]} />
                <FrontEndTypo.H3>{t("NOT_ENTERED")}</FrontEndTypo.H3>
              </HStack>
              <HStack space={2} alignItems={"center"}>
                <Avatar bg="textRed.300" size={["15px", "30px"]} />
                <FrontEndTypo.H3>{t("NOT_STARTED")}</FrontEndTypo.H3>
              </HStack>
            </VStack>
            <VStack space={4}>
              <HStack space={2} alignItems={"center"}>
                <Avatar bg="amber.300" size={["15px", "30px"]} />
                <FrontEndTypo.H3>{t("IN_PROGRESS")}</FrontEndTypo.H3>
              </HStack>
              <HStack space={2} alignItems={"center"}>
                <Avatar bg="green.300" size={["15px", "30px"]} />
                <FrontEndTypo.H3>{t("COMPLETED")}</FrontEndTypo.H3>
              </HStack>
            </VStack>
          </HStack>
          <VStack>
            <Pressable borderBottomWidth={1} borderColor={"gray.300"} p={4}>
              <HStack alignItems={"center"} justifyContent={"space-between"}>
                <HStack space={10}>
                  <FrontEndTypo.H3>{t("ID")}</FrontEndTypo.H3>
                  <FrontEndTypo.H3>{t("NAME")}</FrontEndTypo.H3>
                </HStack>
                <FrontEndTypo.H3>{t("STATUS")}</FrontEndTypo.H3>
              </HStack>
            </Pressable>
            {leanerList?.map((item) => {
              return (
                <Pressable
                  key={item?.user_id}
                  borderBottomWidth={1}
                  borderColor={"gray.300"}
                  p={4}
                  onPress={() => {
                    navigate(`/camps/epcplearnerlist/${item.user_id}`, {
                      state: item,
                    });
                  }}
                >
                  <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <HStack space={4}>
                      <FrontEndTypo.H3>{item.user_id}</FrontEndTypo.H3>
                      <FrontEndTypo.H3>{item.first_name}</FrontEndTypo.H3>
                      <FrontEndTypo.H3>
                        {item.middle_name || ""}
                      </FrontEndTypo.H3>
                      <FrontEndTypo.H3>{item.last_name || ""}</FrontEndTypo.H3>
                    </HStack>
                    <Avatar
                      bg={
                        item?.status == "completed"
                          ? "green.300"
                          : item?.status == "in_progress"
                            ? "amber.300"
                            : item?.status == "not_started"
                              ? "textRed.300"
                              : "textBlack.500"
                      }
                      size={["15px", "30px"]}
                    />
                  </HStack>
                </Pressable>
              );
            })}
          </VStack>
        </VStack>
      )}
    </Layout>
  );
};

export default EpcpLearnerList;

EpcpLearnerList.propTypes = {
  userTokenInfo: PropTypes.object,
  footerLinks: PropTypes.any,
};

const mergingData = (userData, report) => {
  const responses = report?.reduce((acc, observation) => {
    const fieldResponse = observation?.field_responses?.find(
      (response) => response.context_id === userData.user_id,
    );
    if (fieldResponse) {
      acc?.push({
        field_id: observation.field_id,
        field_name: observation.fields?.[0].title,
        response_value: fieldResponse.response_value,
      });
    }
    return acc;
  }, []);
  const status = getStatus(responses);
  return { ...userData, status };
};

const getStatus = (responses) => {
  const HAS_LOGGED_RSOS_APP = responses?.find(
    (response) => response.field_name === "HAS_LOGGED_RSOS_APP",
  );
  const SELECTED_SUBJECT_BY_LEARNER = responses?.find(
    (response) => response.field_name === "SELECTED_SUBJECT_BY_LEARNER",
  );
  const TOOK_EPCP_EXAM_ON_RSOS_APP = responses?.find(
    (response) => response.field_name === "TOOK_EPCP_EXAM_ON_RSOS_APP",
  );
  const subjectData = jsonParse(
    SELECTED_SUBJECT_BY_LEARNER?.response_value,
    [],
  );
  const allSelectedYes = subjectData?.every(
    (subject) => subject.selected === "yes",
  );

  if (!HAS_LOGGED_RSOS_APP) {
    return "not_entered";
  } else if (HAS_LOGGED_RSOS_APP?.response_value === "NO") {
    return "not_started";
  } else if (
    (HAS_LOGGED_RSOS_APP?.response_value === "YES" &&
      TOOK_EPCP_EXAM_ON_RSOS_APP?.response_value === "NO") ||
    (HAS_LOGGED_RSOS_APP?.response_value === "YES" &&
      TOOK_EPCP_EXAM_ON_RSOS_APP?.response_value === "YES" &&
      !allSelectedYes)
  ) {
    return "in_progress";
  } else if (
    HAS_LOGGED_RSOS_APP?.response_value === "YES" &&
    TOOK_EPCP_EXAM_ON_RSOS_APP?.response_value === "YES" &&
    allSelectedYes
  ) {
    return "completed";
  } else if (responses.every((response) => response?.response_value === "")) {
    return "not_entered";
  } else {
    return "unknown";
  }
};
