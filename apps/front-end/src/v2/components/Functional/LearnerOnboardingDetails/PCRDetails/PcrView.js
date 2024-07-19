import {
  CardComponent,
  FrontEndTypo,
  Layout,
  Loading,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import { VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function PcrView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [allScoresDetails, setAllScoresDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getScoresData = async () => {
      setLoading(true);
      try {
        const result = await benificiaryRegistoryService.getBeneficiaryScores({
          id,
        });
        const groupedData = getAllScores(result?.data);
        setAllScoresDetails(groupedData);
      } catch (error) {
        console.error("Failed to fetch scores data", error);
      } finally {
        setLoading(false);
      }
    };
    getScoresData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "loginBtn", "langBtn", "userInfo"],

        name: t("PCR_DETAILS"),
        onPressBackButton: (e) => {
          navigate(`/beneficiary/profile/${id}`);
        },
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      analyticsPageTitle={"BENEFICIARY_PCR_VIEW"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("PCR_DETAILS")}
    >
      <VStack space={4} padding={5}>
        <FrontEndTypo.H1 fontWeight="600">{t("PCR_DETAILS")}</FrontEndTypo.H1>
        <CardComponent
          title={t("PCR_EDUCATION_LEVEL")}
          item={{
            baseline_learning_level:
              allScoresDetails?.basics?.baseline_learning_level?.toUpperCase(),
            endline_learning_level:
              allScoresDetails?.basics?.endline_learning_level?.toUpperCase(),
          }}
          label={["PRIAMRY_LEVEL_EDUCATION", "FINAL_LEVEL_EDUCATION"]}
          arr={["baseline_learning_level", "endline_learning_level"]}
        />
        {allScoresDetails?.subjects?.length ? (
          <VStack space={4}>
            <CardComponent
              title={t("EVALUATION_1")}
              item={{
                ...allScoresDetails?.fa1,
              }}
              label={[...allScoresDetails?.subjects]}
              arr={[...allScoresDetails?.subjects]}
            />
            <CardComponent
              title={t("EVALUATION_2")}
              item={{
                ...allScoresDetails?.fa2,
              }}
              label={[...allScoresDetails?.subjects]}
              arr={[...allScoresDetails?.subjects]}
            />
          </VStack>
        ) : (
          <FrontEndTypo.H3>{t("NO_SUBJECTS_FOR_THIS_LEARNER")}</FrontEndTypo.H3>
        )}
      </VStack>
    </Layout>
  );
}

const getAllScores = (data) => {
  let result = {
    fa1: {},
    fa2: {},
    subjects: [],
    basics: {
      baseline_learning_level: null,
      endline_learning_level: null,
    },
  };
  // Populate basics key
  if (data?.learnerScores?.[0].pcr_scores.length > 0) {
    const pcrScore = data.learnerScores[0].pcr_scores[0];
    result.basics.baseline_learning_level =
      pcrScore?.baseline_learning_level || null;
    result.basics.endline_learning_level =
      pcrScore?.endline_learning_level || null;
  }

  // Handle empty learnerSubject array case
  if (data?.learnerSubject?.length === 0) {
    return result;
  }

  // Populate the subjects array
  result.subjects = data?.learnerSubject?.map((subject) => subject.name);

  // Populate formative assessment scores
  const subjectScores =
    data?.learnerScores?.[0]?.pcr_formative_assesments.reduce(
      (acc, assessment) => {
        acc[assessment.subject.id] = {
          fa1: assessment.formative_assessment_first_learning_level,
          fa2: assessment.formative_assessment_second_learning_level || "",
        };
        return acc;
      },
      {}
    );

  data?.learnerSubject?.forEach((subject) => {
    if (subjectScores[subject.id]) {
      result.fa1[subject.name] = subjectScores[subject.id].fa1;
      result.fa2[subject.name] = subjectScores[subject.id].fa2;
    } else {
      result.fa1[subject.name] = "";
      result.fa2[subject.name] = "";
    }
  });

  return result;
};
