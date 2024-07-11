import {
  CardComponent,
  FrontEndTypo,
  Layout,
  Loading,
  campService,
  jsonParse,
} from "@shiksha/common-lib";
import { HStack, Pressable, Progress, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

export default function CampSubjectsList({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const params = useParams();
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fa_id = localStorage.getItem("id");
  const [facilitator, setFacilitator] = useState();
  const [complete, setComplete] = useState();

  const programDetails = JSON.parse(localStorage.getItem("program"));

  const getSubjectsData = async () => {
    if (programDetails?.program_id) {
      try {
        const result = await campService.getSubjectsList({
          program_id: programDetails?.program_id,
        });
        setSubjectsList(result?.data);
      } catch (error) {
        console.error("Error fetching subjects list:", error);
      }
    }
  };

  const assessmentTitle =
    params.type === "formative-assessment-1"
      ? t("PCR_EVALUATION_1")
      : t("PCR_EVALUATION_2");

  useEffect(() => {
    const init = async () => {
      await getSubjectsData();
      if (userTokenInfo) {
        const IpUserInfo = await getIpUserInfo(fa_id);
        let ipUserData = IpUserInfo;
        if (!IpUserInfo) {
          ipUserData = await setIpUserInfo(fa_id);
        }

        setFacilitator(ipUserData);
      }
      let assessment_type =
        params?.type == "formative-assessment-1" ? "fa1" : "fa2";
      const resultScore = await campService.getCampLearnerScores({
        camp_id: params?.id,
        assessment_type,
      });
      const incompleteUser = getIncompleteAssessments(
        resultScore?.data,
        assessment_type
      );
      setComplete(incompleteUser?.[assessment_type] || {});
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("SESSION_LIST")}</FrontEndTypo.H2>,
        _box: { bg: "white", shadow: "appBarShadow" },
        name:
          params.type === "formative-assessment-1"
            ? t("PCR_EVALUATION_1")
            : t("PCR_EVALUATION_2"),
        onPressBackButton: () =>
          navigate(`/camps/${params?.id}/campexecution/activities`),
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      // _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {`${assessmentTitle} ${t("SUBJECTS")}`}
        </FrontEndTypo.H2>
        {subjectsList?.map((item, i) => (
          <Pressable
            onPress={() =>
              navigate(`/camps/${params?.id}/${params?.type}/${item?.name}`)
            }
            key={i}
          >
            <CardComponent
              _vstack={{
                flex: 1,
                borderColor: "greenIconColor",
              }}
              _body={{ pt: 4, space: 2 }}
            >
              <VStack space={1}>
                <HStack space={4} alignItems={"center"}>
                  <FrontEndTypo.H5 bold color="textGreyColor.750">
                    {t("COMPLETED")} :
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H4 bold color="textGreyColor.750">
                    {complete?.[item?.name]?.total_count
                      ? `${
                          complete?.[item?.name]?.total_count -
                          complete?.[item?.name]?.data?.length
                        } / ${complete?.[item?.name]?.total_count}`
                      : "0 / 0"}
                  </FrontEndTypo.H4>
                </HStack>
                <Progress
                  value={calculateProgress(
                    complete?.[item?.name]?.total_count -
                      complete?.[item?.name]?.data?.length,
                    complete?.[item?.name]?.total_count
                  )}
                  size="xs"
                  colorScheme="progressBarRed"
                />
              </VStack>

              <HStack space={3}>
                <FrontEndTypo.H2 color="textMaroonColor.400">
                  {item?.name}
                </FrontEndTypo.H2>
              </HStack>
            </CardComponent>
          </Pressable>
        ))}
      </VStack>
    </Layout>
  );
}

const getIncompleteAssessments = (data, assessmentType) => {
  if (!data) return {};

  const { learners, subjects_name } = data;
  let result = {
    fa1: {},
    fa2: {},
  };

  if (!learners || !subjects_name) return result;

  learners.forEach((learner) => {
    const subjectIds = jsonParse(
      learner?.program_beneficiaries?.[0]?.subjects,
      []
    );

    const eligibleSubjects = subjects_name.filter((subject) =>
      subjectIds.includes(`${subject?.id}`)
    );

    if (!assessmentType || ["fa1", "fa2"].includes(assessmentType)) {
      eligibleSubjects.forEach((subject) => {
        const subjectName = subject.name;

        // Check fa1
        if (!assessmentType || assessmentType === "fa1") {
          const fa1Assessments = learner.pcr_formative_assesments?.filter(
            (assessment) =>
              assessment.formative_assessment_first_learning_level &&
              `${assessment.subject_id}` === `${subject.id}`
          );

          if (!result.fa1[subjectName]) {
            result.fa1[subjectName] = { data: [], total_count: 0 };
          }
          if (!fa1Assessments || fa1Assessments.length === 0) {
            result.fa1[subjectName].data.push(learner);
          }
          result.fa1[subjectName].total_count++;
        }

        // Check fa2
        if (!assessmentType || assessmentType === "fa2") {
          const fa2Assessments = learner.pcr_formative_assesments?.filter(
            (assessment) =>
              assessment.formative_assessment_second_learning_level &&
              `${assessment.subject_id}` === `${subject.id}`
          );
          if (!result.fa2[subjectName]) {
            result.fa2[subjectName] = { data: [], total_count: 0 };
          }
          if (!fa2Assessments || fa2Assessments.length === 0) {
            result.fa2[subjectName].data.push(learner);
          }
          result.fa2[subjectName].total_count++;
        }
      });
    }
  });

  return result;
};

const calculateProgress = (completedSessions, totalSessions) => {
  if (!totalSessions || totalSessions === 0) return 100; // to avoid division by zero
  return (completedSessions / totalSessions) * 100;
};
