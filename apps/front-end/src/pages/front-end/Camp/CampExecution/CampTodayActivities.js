import { Suspense, useEffect, useState } from "react";

import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  Loading,
  campService,
  enumRegistryService,
  jsonParse,
} from "@shiksha/common-lib";
import { MultiCheck } from "component/BaseInput";
import moment from "moment";
import {
  Actionsheet,
  Alert,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Stack,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";
import { CampSessionPlan } from "./CampSessionPlan";

export default function CampTodayActivities({
  setAlert,
  activityId,
  campType,
  userTokenInfo,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [enums, setEnums] = useState();
  const [enumOptions, setEnumOptions] = useState(null);
  const [selectValue, setSelectValue] = useState([]);
  const [miscActivities, setMiscActivities] = useState([]);
  const [activitiesValue, setActivitiesValue] = useState(false);
  const [isSaving] = useState(false);
  const [sessionList, setSessionList] = useState(false);
  const [buttonName, setButtonName] = useState();
  const fa_id = localStorage.getItem("id");
  const [facilitator, setFacilitator] = useState();
  const [loading, setLoading] = useState(true);

  const getActivity = async () => {
    const obj = {
      id: id,
      start_date: moment(new Date()).format("YYYY-MM-DD"),
    };
    const result = await campService.getActivity(obj);
    if (result?.data?.camp_days_activities_tracker?.[0]?.misc_activities) {
      setSelectValue(
        result?.data?.camp_days_activities_tracker?.[0]?.misc_activities || []
      );
      setActivitiesValue(true);
      setMiscActivities(
        result?.data?.camp_days_activities_tracker?.[0]?.misc_activities || []
      );
    } else {
      setActivitiesValue(false);
    }
  };

  const handleSubmitData = async () => {
    const dataToSave = {
      edit_page_type: "edit_misc_activities",
      id: activityId,
      misc_activities: selectValue,
    };
    const activities_response = await campService.addMoodActivity(dataToSave);
    if (activities_response) {
      getActivity();
      setEnums();
      setAlert({ type: "success", title: t("MISSILINEOUS_SUCCESS_MESSAGE") });
    }
  };

  useEffect(() => {
    const init = async () => {
      if (userTokenInfo) {
        const IpUserInfo = await getIpUserInfo(fa_id);
        let ipUserData = IpUserInfo;
        if (!IpUserInfo) {
          ipUserData = await setIpUserInfo(fa_id);
        }

        setFacilitator(ipUserData);
      }

      try {
        setLoading(true);
        const qData = await enumRegistryService.listOfEnum();
        const LearningActivitydata = qData?.data;
        setEnumOptions(LearningActivitydata);
        const result = await campService.getCampSessionsList({ id: id });
        const data = result?.data?.learning_lesson_plans_master || [];
        if (campType.type === "main") {
          setButtonName({ main: "main" });
        } else {
          let filteredData = data.filter(
            (item) => item.session_tracks.length > 0
          );
          filteredData = filteredData?.[filteredData?.length - 1];
          let assessment_type = "";
          if (!filteredData?.ordering) {
            assessment_type = "base-line";
          } else if (
            filteredData?.ordering == 6 &&
            filteredData?.session_tracks?.[0]?.status == "complete"
          ) {
            assessment_type = "fa1";
          } else if (
            filteredData?.ordering == 13 &&
            filteredData?.session_tracks?.[0]?.status == "complete"
          ) {
            assessment_type = "fa2";
          } else if (
            filteredData?.ordering == 19 &&
            filteredData?.session_tracks?.[0]?.status == "complete"
          ) {
            assessment_type = "end-line";
          }
          const resultScore = await campService.getCampLearnerScores({
            camp_id: id,
            assessment_type,
          });
          const incompleteUser = getIncompleteAssessments(
            resultScore?.data,
            assessment_type
          );
          if (
            incompleteUser?.learners?.data?.length > 0 &&
            assessment_type != ""
          ) {
            const { learners, ...other } = incompleteUser || {};
            setButtonName(other || {});
          } else {
            setButtonName();
          }
        }
        const { countSession } = getSessionCount(data);
        if (countSession >= 1.5) {
          setSessionList(true);
        } else {
          setSessionList(false);
        }
      } catch (error) {
        console.log("Error in getCampSessionsList:", error);
      } finally {
        setLoading(false);
      }
    };
    getActivity();
    init();
  }, []);

  const handleActivities = async (item) => {
    const data = enumOptions && enumOptions[item] ? enumOptions[item] : null;
    setEnums({ type: item, data });
  };

  const handleClose = () => {
    if (!activitiesValue) {
      setSelectValue([]);
    } else {
      setSelectValue(miscActivities);
    }
    setEnums();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        name: t("ADD_TODAYS_ACTIVITIES"),
        onPressBackButton: () => navigate(`/camps/${id}/campexecution`),
      }}
      // _footer={{ menues: footerLinks }}
      analyticsPageTitle={"CAMP_ACTIVITIES"}
      facilitator={facilitator}
      pageTitle={t("TODAYS_ACTIVITIES")}
      stepTitle={`${campType === "main" ? t("MAIN_CAMP") : t("PCR_CAMP")}/${t(
        "TODAYS_ACTIVITIES"
      )}`}
    >
      <VStack p="4" space={4}>
        <CampSessionPlan
          button_list={buttonName || {}}
          id={id}
          campType={campType}
          sessionList={sessionList}
          activityId={activityId}
        />
        <CardComponent
          _vstack={{
            flex: 1,
            borderColor: activitiesValue && "greenIconColor",
          }}
          _body={{ pl: 8, pt: 4 }}
        >
          <Pressable
            onPress={() => {
              campType?.type === "main"
                ? handleActivities("MISCELLANEOUS_ACTIVITIES")
                : handleActivities("PCR_MISCELLANEOUS_ACTIVITIES");
            }}
          >
            <HStack alignItems="center" justifyContent="center" space={5}>
              <Image
                source={{
                  uri: "/images/activities/missilaneous-activity.png",
                }}
                resizeMode="contain"
                alignSelf={"center"}
                w="75px"
                h="60px"
              />
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {campType?.type === "main"
                  ? t("MISCELLANEOUS_ACTIVITIES")
                  : t("PCR_ACTIVITIES")}
              </FrontEndTypo.H2>
              {activitiesValue && (
                <IconByName
                  name="CheckboxCircleFillIcon"
                  _icon={{ size: "36" }}
                  color="successColor"
                />
              )}
            </HStack>
          </Pressable>
        </CardComponent>

        {(activitiesValue || sessionList) === true && (
          <VStack pt={"10%"}>
            <FrontEndTypo.Primarybutton
              onPress={() => navigate(`/camps/${id}/campexecution/endcamp`)}
            >
              {t("GO_BACK")}
            </FrontEndTypo.Primarybutton>
          </VStack>
        )}
      </VStack>
      <Actionsheet isOpen={enums?.data} onClose={(e) => setEnums()}>
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <HStack
              width={"100%"}
              justifyContent={"space-between"}
              alignItems="center"
            >
              <FrontEndTypo.H1 bold color="textGreyColor.450"></FrontEndTypo.H1>
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => handleClose()}
              />
            </HStack>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="2" p="1" rounded="lg" w="100%">
              <VStack alignItems="center" space="1" flex="1">
                <Suspense fallback={<HStack>Loading...</HStack>}>
                  <MultiCheck
                    value={selectValue}
                    options={{
                      enumOptions: enums?.data || [],
                    }}
                    schema={{
                      grid: 1,
                      minItems: 1,
                      maxItems: 4,
                    }}
                    onChange={(newSelectValue) => {
                      setSelectValue(newSelectValue);
                    }}
                  />
                </Suspense>
              </VStack>
            </VStack>
            <VStack space="5" pt="5">
              <Alert status="warning" alignItems={"start"}>
                <HStack alignItems="center" space="2">
                  <Alert.Icon />
                  {t("PLEASE_SELECT_OPTION_1_TO_3")}
                </HStack>
              </Alert>
              <FrontEndTypo.Primarybutton
                flex={1}
                onPress={handleSubmitData}
                isLoading={isSaving}
                isDisabled={
                  selectValue?.length >= 4 || selectValue?.length <= 0
                }
              >
                {isSaving ? "Saving..." : t("SAVE")}
              </FrontEndTypo.Primarybutton>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>
    </Layout>
  );
}

const getIncompleteAssessments = (data, assessmentType) => {
  if (!data) return {};

  const { learners, subjects_name } = data;
  let result = {
    base_line: { data: [], total_count: 0 },
    fa1: { data: [], total_count: 0 },
    fa2: { data: [], total_count: 0 },
    end_line: { data: [], total_count: 0 },
    learners: { data: [], total_count: 0 },
  };

  if (!learners || !subjects_name) return result;

  learners.forEach((learner, index) => {
    const subjectIds = jsonParse(
      learner?.program_beneficiaries?.[0]?.subjects,
      []
    );

    const eligibleSubjects = subjects_name.filter((subject) =>
      subjectIds.includes(`${subject?.id}`)
    );

    const eligibleSubjectIds = eligibleSubjects.map(
      (subject) => `${subject.id}`
    );

    let learnerAssessment = {
      id: learner.id,
      assessment_type: [],
    };

    if (
      !assessmentType ||
      ["base_line", "base-line", "fa1", "fa2", "end_line", "end-line"].includes(
        assessmentType
      )
    ) {
      // Check base_line
      if (!learner.pcr_scores?.some((score) => score.baseline_learning_level)) {
        result["base_line"].data.push(learner);
        learnerAssessment.assessment_type.push("base_line");
      }
      result["base_line"].total_count++;
    }

    if (
      !assessmentType ||
      ["fa1", "fa2", "end_line", "end-line"].includes(assessmentType)
    ) {
      // Check fa1
      const fa1Assessments = learner.pcr_formative_assesments?.filter(
        (assessment) =>
          assessment.formative_assessment_first_learning_level &&
          eligibleSubjectIds.includes(`${assessment?.subject_id}`)
      );

      if (!fa1Assessments || fa1Assessments?.length < eligibleSubjects.length) {
        result["fa1"].data.push(learner);
        learnerAssessment.assessment_type.push("fa1");
      }

      if (eligibleSubjects.length > 0) {
        result["fa1"].total_count++;
      }
    }

    if (
      !assessmentType ||
      ["fa2", "end_line", "end-line"].includes(assessmentType)
    ) {
      // Check fa2
      const fa2Assessments = learner.pcr_formative_assesments?.filter(
        (assessment) =>
          assessment.formative_assessment_second_learning_level &&
          eligibleSubjectIds.includes(`${assessment?.subject_id}`)
      );
      if (!fa2Assessments || fa2Assessments?.length < eligibleSubjects.length) {
        result["fa2"].data.push(learner);
        learnerAssessment.assessment_type.push("fa2");
      }
      if (eligibleSubjects.length > 0) {
        result["fa2"].total_count++;
      }
    }

    if (!assessmentType || ["end_line", "end-line"].includes(assessmentType)) {
      // Check end_line
      if (!learner.pcr_scores?.some((score) => score.endline_learning_level)) {
        result["end_line"].data.push(learner);
        learnerAssessment.assessment_type.push("end_line");
      }
      result["end_line"].total_count++;
    }

    if (learnerAssessment.assessment_type.length > 0) {
      result["learners"].data.push(learnerAssessment);
      result["learners"].total_count++;
    }
  });

  // Remove empty arrays from the result object except for total_count
  const filteredResult = {};
  for (const key in result) {
    if (Array.isArray(result[key].data) && result[key].data.length === 0) {
      continue;
    } else {
      filteredResult[key] = result[key];
    }
  }

  return filteredResult;
};

const getSessionCount = (data) => {
  let count = 0;

  const format = "YYYY-MM-DD";
  const today = moment().format(format);

  const result = data
    .filter((e) => e.session_tracks?.[0]?.id)
    ?.map((e) => ({ ...e.session_tracks?.[0], ordering: e?.ordering }));
  let sessionData = result?.[result?.length - 1] || { ordering: 1 };

  const c1 = [];
  const c2 = [];
  const c3 = [];

  result.forEach((e) => {
    const createdAt = moment(e.created_at).format(format);
    const updatedAt = moment(e.updated_at).format(format);

    if (e.status === "complete" && createdAt !== today && updatedAt === today) {
      c1.push(e);
    } else if (
      e.status === "incomplete" &&
      createdAt === today &&
      updatedAt === today
    ) {
      c2.push(e);
    } else if (
      e.status === "complete" &&
      createdAt === today &&
      updatedAt === today
    ) {
      c3.push(e);
    }
  });

  if (c1?.length > 0) {
    count += 0.5;
    sessionData = c1[0];
  }

  if (c2?.length > 0) {
    count += 0.5;
    sessionData = c2[0];
  }

  if (c3?.length > 0) {
    count += 1;
    sessionData = c3[0];
  }

  if (sessionData?.status === "complete" && count < 1.5) {
    sessionData =
      data.find((e) => sessionData?.ordering + 1 === e?.ordering) ||
      sessionData;
  }

  if (count >= 1.5) {
    sessionData = {};
  }

  return {
    ...sessionData,
    countSession: count,
    lastSession: result?.[result?.length - 1],
  };
};
