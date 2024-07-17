import React, { useEffect, useState } from "react";
import { FrontEndTypo, Layout, ObservationService } from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { Alert, Avatar, HStack, Pressable, VStack } from "native-base";
import { useNavigate } from "react-router-dom";

const ExamLearnerList = ({ footerLinks, userTokenInfo: { authUser } }) => {
  const [loading, setLoading] = useState(true);
  const [leanerList, setLeanerList] = useState([]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate("/camps");
  };

  const flattenList = (list) => {
    let flattenedArray = [];
    list?.forEach((item) => {
      item?.group?.group_users?.forEach((userObj) => {
        const { user_id, program_beneficiaries } = userObj?.user;
        flattenedArray?.push({
          user_id,
          first_name: program_beneficiaries?.[0]?.enrollment_first_name,
          middle_name: program_beneficiaries?.[0]?.enrollment_middle_name,
          last_name: program_beneficiaries?.[0]?.enrollment_last_name,
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
      let observation = "EXAM_PREPARATION";
      const listData = await ObservationService.getCampLearnerList();
      const flattenedList = flattenList(listData?.data);
      const userIds = listData?.data.flatMap((group) =>
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
          (response) => response.context_id === user.user_id
        );
        if (fieldResponse) {
          acc?.push({
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

  const ProcessData = (mergedArray) => {
    const newData = mergedArray?.map((user) => {
      const status = getStatus(user.responses);
      return { ...user, status };
    });
    return newData;
  };

  const getStatus = (responses) => {
    const WILL_LEARNER_APPEAR_FOR_EXAM = responses?.find(
      (response) => response.field_id === 25
    );
    const WILL_LEARNER_APPEAR_FOR_EXAM_REASONS = responses?.find(
      (response) => response.field_id === 26
    );
    const DID_LEARNER_RECEIVE_ADMIT_CARD = responses?.find(
      (response) => response.field_id === 27
    );
    const HAS_LEARNER_PREPARED_PRACTICAL_FILE = responses?.find(
      (response) => response.field_id === 28
    );
    const LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER = responses?.find(
      (response) => response.field_id === 29
    );
    // const response6 = responses.find((response) => response.field_id === 15);
    if (
      !WILL_LEARNER_APPEAR_FOR_EXAM ||
      !WILL_LEARNER_APPEAR_FOR_EXAM_REASONS ||
      !DID_LEARNER_RECEIVE_ADMIT_CARD ||
      !HAS_LEARNER_PREPARED_PRACTICAL_FILE ||
      !LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER
    ) {
      return "not_entered";
    } else if (
      WILL_LEARNER_APPEAR_FOR_EXAM.response_value === "NO" &&
      WILL_LEARNER_APPEAR_FOR_EXAM_REASONS &&
      WILL_LEARNER_APPEAR_FOR_EXAM_REASONS.response_value !== ""
    ) {
      return "not_started";
    } else if (
      WILL_LEARNER_APPEAR_FOR_EXAM.response_value === "YES" &&
      (DID_LEARNER_RECEIVE_ADMIT_CARD.response_value === "NO" ||
        DID_LEARNER_RECEIVE_ADMIT_CARD.response_value === "YET_TO_BE_PROCEED" ||
        HAS_LEARNER_PREPARED_PRACTICAL_FILE.response_value === "NO" ||
        LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER.response_value ===
          "NO_MEANS_TO_TRAVEL" ||
        LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER.response_value ===
          "CANT_AFFORD_TRAVEL_FARE")
    ) {
      return "in_progress";
    } else if (
      WILL_LEARNER_APPEAR_FOR_EXAM.response_value === "YES" &&
      DID_LEARNER_RECEIVE_ADMIT_CARD.response_value === "YES" &&
      LEARNER_HAVE_TRAVEL_ARRANGEMENTS_TO_EXAM_CENTER.response_value ===
        "YES" &&
      (HAS_LEARNER_PREPARED_PRACTICAL_FILE.response_value === "YES" ||
        HAS_LEARNER_PREPARED_PRACTICAL_FILE.response_value === "NOT_APPLICABLE")
    ) {
      return "completed";
    } else if (responses.every((response) => response.response_value === "")) {
      return "not_entered";
    } else {
      return "unknown";
    }
  };

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"EXAM_PREPARATION"}
      pageTitle={t("CAMP_EXAM_PREPARATION")}
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
                <FrontEndTypo.H3>{t("THEY_WONT_GO")}</FrontEndTypo.H3>
              </HStack>
            </VStack>
            <VStack space={4}>
              <HStack space={2} alignItems={"center"}>
                <Avatar bg="amber.300" size={["15px", "30px"]} />
                <FrontEndTypo.H3>
                  {t("IT_WILL_NOT_BE_DETERMINED")}
                </FrontEndTypo.H3>
              </HStack>
              <HStack space={2} alignItems={"center"}>
                <Avatar bg="green.300" size={["15px", "30px"]} />
                <FrontEndTypo.H3>{t("WILL_BE_DETERMINED")}</FrontEndTypo.H3>
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
                    navigate(`/camps/exampreparation/${item.user_id}`, {
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

export default ExamLearnerList;
