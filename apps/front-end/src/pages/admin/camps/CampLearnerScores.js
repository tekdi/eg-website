import {
  FrontEndTypo,
  Layout,
  Loading,
  UserCard,
  benificiaryRegistoryService,
  campService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { CheckIcon, HStack, Modal, Select, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

export default function CampLearnerScores({ userTokenInfo }) {
  const { t } = useTranslation();
  const params = useParams();
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fa_id = localStorage.getItem("id");
  const [facilitator, setFacilitator] = useState();
  const [showModal, setShowModal] = useState(false);
  const [scoresArray, setScoresArray] = useState([]);
  const [submit, setSubmit] = useState(false);

  const getStudentsData = async () => {
    try {
      const result = await campService.getCampLearnerScores({
        camp_id: params?.id,
        assessment_type: params?.type,
      });
      setStudentsData(result?.data?.learners);
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
  };

  const getPageTitle = () => {
    switch (params.type) {
      case "base-line":
        return t("PCR_INITIAL_LEVEL");
      case "end-line":
        return t("PCR_FINAL_EVALUATON");
      default:
        return t("PCR_INITIAL_LEVEL");
    }
  };

  useEffect(async () => {
    await getStudentsData();
    if (userTokenInfo) {
      const IpUserInfo = await getIpUserInfo(fa_id);
      let ipUserData = IpUserInfo;
      if (!IpUserInfo) {
        ipUserData = await setIpUserInfo(fa_id);
      }
      setFacilitator(ipUserData);
    }
    const enumData = await enumRegistryService.listOfEnum();
    if (enumData?.data) {
      const scoresData = enumData?.data?.PCR_SCORES_BASELINE_AND_ENDLINE?.map(
        (item) => item.value
      );
      setScoresArray(scoresData || []);
    }
    setLoading(false);
  }, []);

  const checkSubmissionStatus = () => {
    const key =
      params.type === "base-line"
        ? "baseline_learning_level"
        : "endline_learning_level";

    const canSubmit = studentsData?.every((item) => {
      return scoresArray.includes(item?.pcr_scores?.[0]?.[key]);
    });

    if (canSubmit) {
      setShowModal(true);
      setSubmit(true);
    } else {
      setShowModal(true);
    }
  };

  const handleUpdateStudentScore = (userId, updatedScores) => {
    setStudentsData((prevStudentsData) =>
      prevStudentsData.map((student) =>
        student.id === userId
          ? { ...student, pcr_scores: updatedScores }
          : student
      )
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        name:
          params.type === "base-line"
            ? t("PCR_INITIAL_LEVEL")
            : t("PCR_FINAL_EVALUATON"),
        onPressBackButton: checkSubmissionStatus,
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("SESSION_LIST")}</FrontEndTypo.H2>,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      // _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {getPageTitle()}
        </FrontEndTypo.H2>
        {studentsData?.map((student) => (
          <StudentCard
            key={student?.user_id}
            student={student}
            updateStudentScore={handleUpdateStudentScore}
            scoresArray={scoresArray}
          />
        ))}
        <HStack justifyContent={"center"}>
          <FrontEndTypo.Primarybutton onPress={checkSubmissionStatus}>
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </HStack>
      </VStack>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header textAlign={"center"}>
            {t("EXPIRY_CONTENT.HEADING")}
          </Modal.Header>
          <Modal.Body>
            <FrontEndTypo.H2>
              {submit ? t("SCORES_SUBMIT_SUCCESS") : t("SCORES_SUBMIT_WARNING")}
            </FrontEndTypo.H2>
          </Modal.Body>
          <Modal.Footer justifyContent={"space-evenly"}>
            {!submit && (
              <FrontEndTypo.Secondarybutton onPress={() => setShowModal(false)}>
                {t("CANCEL")}
              </FrontEndTypo.Secondarybutton>
            )}
            <FrontEndTypo.Primarybutton
              onPress={() => {
                setShowModal(false);
                navigate(`/camps/${params?.id}/campexecution/activities`);
              }}
            >
              {t("CONTINUE")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

const StudentCard = ({ student, updateStudentScore, scoresArray }) => {
  const [data, setData] = useState(student);
  const params = useParams();

  const updateValue = async (key, value) => {
    const scoreKey =
      params.type === "base-line"
        ? "baseline_learning_level"
        : "endline_learning_level";

    const newPcrScores =
      data.pcr_scores && data.pcr_scores.length > 0
        ? data.pcr_scores.map((score) => ({ ...score, [scoreKey]: value }))
        : [{ [scoreKey]: value }];
    setData((prevData) => ({
      ...prevData,
      pcr_scores: newPcrScores,
    }));

    updateStudentScore(data?.id, newPcrScores);

    await benificiaryRegistoryService.createPCRScores({
      user_id: data?.id,
      [key]: value,
    });
  };

  return (
    <UserCard
      key={data?.id}
      _hstack={{
        p: 2,
        space: 1,
        flex: 1,
        bg: data?.pcr_scores?.[0]?.[
          params.type === "base-line"
            ? "baseline_learning_level"
            : "endline_learning_level"
        ]
          ? "green.100"
          : "gray.100",
      }}
      _vstack={{ py: 2 }}
      _image={{ size: 45, color: "gray" }}
      rightElement={
        <Select
          maxH={"30px"}
          overflow="none"
          accessibilityLabel="Choose Score"
          selectedValue={
            data?.pcr_scores?.[0]?.[
              params.type === "base-line"
                ? "baseline_learning_level"
                : "endline_learning_level"
            ]
          }
          placeholder="Choose Score"
          width={100}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="2" />,
          }}
          onValueChange={(itemValue) =>
            updateValue(
              params.type === "base-line"
                ? "baseline_learning_level"
                : "endline_learning_level",
              itemValue
            )
          }
        >
          {scoresArray.map((score, index) => (
            <Select.Item
              key={index}
              label={score.toUpperCase()}
              value={score}
            />
          ))}
        </Select>
      }
      title={[
        data?.program_beneficiaries[0]?.enrollment_first_name,
        data?.program_beneficiaries[0]?.enrollment_middle_name,
        data?.program_beneficiaries[0]?.enrollment_last_name,
      ]
        .filter((e) => e)
        .join(" ")}
      isIdtag={data?.id}
    />
  );
};
