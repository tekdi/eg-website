import {
  FrontEndTypo,
  Layout,
  Loading,
  UserCard,
  campService,
  enumRegistryService,
} from "@shiksha/common-lib";
import { CheckIcon, HStack, Modal, Select, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

export default function CampSubjectScores({ userTokenInfo }) {
  const { t } = useTranslation();
  const params = useParams();
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fa_id = localStorage.getItem("id");
  const [facilitator, setFacilitator] = useState();
  const [showModal, setShowModal] = useState(false);
  const [scoresArray, setScoresArray] = useState([]);
  const [totalLearners, setTotalLearners] = useState(0);
  const [submit, setSubmit] = useState(false);

  const programDetails = JSON.parse(localStorage.getItem("program"));

  const getStudentData = async () => {
    if (programDetails?.program_id) {
      try {
        const result = await campService.getStudentsList({
          program_id: programDetails?.program_id,
          type: params?.type,
          subject_name: params?.subject,
          camp_id: params?.id,
        });
        const groupedLearners = groupLearnersByBoard(result?.data);
        setStudentsData(groupedLearners);
        setTotalLearners(result?.data?.length);
      } catch (error) {
        console.log("Error fetching students list:", error);
      }
    }
  };

  const onScoreUpdate = async (data) => {
    try {
      await campService.updateAssessmentScore(data);
    } catch (error) {
      console.log("Error updating score:", error);
    } finally {
      getStudentData();
    }
  };

  useEffect(() => {
    const init = async () => {
      await getStudentData();
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
        const scoresData = enumData?.data?.PCR_SCORES_RAPID_QUESTION?.map(
          (item) => item.value
        );
        setScoresArray(scoresData || []);
      }
      setLoading(false);
    };
    init();
  }, []);

  const assessmentTitle =
    params.type === "formative-assessment-1"
      ? t("PCR_EVALUATION_1")
      : t("PCR_EVALUATION_2");

  const checkSubmissionStatus = () => {
    const assessmentTypes = {
      "formative-assessment-1": "formative_assessment_first_learning_level",
      "formative-assessment-2": "formative_assessment_second_learning_level",
    };
    const canSubmit = studentsData.every((item) => {
      const key = Object.keys(item)[0];
      return item[key].every((user) =>
        scoresArray.includes(user[assessmentTypes[params.type]])
      );
    });

    if (canSubmit) {
      setShowModal(true);
      setSubmit(true);
    } else {
      setShowModal(true);
    }
  };

  const groupLearnersByBoard = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const boardName = item.name;
      if (!groupedData[boardName]) {
        groupedData[boardName] = [];
      }
      groupedData[boardName].push(item);
    });

    return Object.entries(groupedData).map(([key, value]) => ({
      [key]: value,
    }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("SESSION_LIST")}</FrontEndTypo.H2>,
        _box: { bg: "white", shadow: "appBarShadow" },
        name: t(params?.subject),
        onPressBackButton: checkSubmissionStatus,
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      // _footer={{ menues: footerLinks }}
    >
      <VStack p="4" space={4}>
        <FrontEndTypo.H2 color="textMaroonColor.400" ali>
          {assessmentTitle}
        </FrontEndTypo.H2>
        <HStack justifyContent={"space-between"}>
          <FrontEndTypo.H4 color="textMaroonColor.400">
            {params?.subject}
          </FrontEndTypo.H4>
          <FrontEndTypo.H4 color="textMaroonColor.400">
            {`${t("TOTAL_STUDENTS")} : ${totalLearners || 0}`}
          </FrontEndTypo.H4>
        </HStack>{" "}
        {studentsData?.length ? (
          studentsData.map((item, index) => {
            const key = Object.keys(item)[0];
            const users = item[key];

            return (
              <VStack key={index} space={2}>
                <FrontEndTypo.H2>{key}</FrontEndTypo.H2>
                {users.map((student) => (
                  <StudentCard
                    key={student?.user_id}
                    student={student}
                    updateScore={onScoreUpdate}
                    subject={params?.subject}
                    program_id={programDetails?.program_id}
                    scoresArray={scoresArray}
                  />
                ))}
              </VStack>
            );
          })
        ) : (
          <FrontEndTypo.H2>{t("NO_LEARNERS_FOR_THIS_SUBJECT")}</FrontEndTypo.H2>
        )}
        {studentsData?.length && (
          <HStack justifyContent={"center"}>
            <FrontEndTypo.Primarybutton onPress={checkSubmissionStatus}>
              {t("SUBMIT")}
            </FrontEndTypo.Primarybutton>
          </HStack>
        )}
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
                navigate(`/camps/${params?.id}/${params?.type}/subjectslist`);
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

const StudentCard = ({
  student,
  updateScore,
  subject,
  program_id,
  scoresArray,
}) => {
  const [data, setData] = useState(student);
  const params = useParams();

  const updateValue = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
    const newData = {
      subject,
      program_id,
      user_id: data.user_id,
      [key]: value,
    };
    updateScore(newData);
  };
  return (
    <UserCard
      key={data?.user_id}
      _hstack={{
        p: 2,
        space: 1,
        flex: 1,
        bg:
          params.type === "formative-assessment-1" &&
          scoresArray?.includes(data?.formative_assessment_first_learning_level)
            ? "green.100"
            : params.type === "formative-assessment-2" &&
              scoresArray?.includes(
                data?.formative_assessment_second_learning_level
              )
            ? "green.100"
            : "grey.100",
      }}
      _vstack={{ py: 2 }}
      _image={{ size: 45, color: "gray" }}
      rightElement={
        <Select
          maxH={"30px"}
          overflow="none"
          selectedValue={
            params.type === "formative-assessment-1"
              ? data.formative_assessment_first_learning_level
              : data.formative_assessment_second_learning_level
          }
          accessibilityLabel="Choose Score"
          placeholder="Choose Score"
          width={100}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="2" />,
          }}
          onValueChange={(itemValue) =>
            updateValue(
              params.type === "formative-assessment-1"
                ? "formative_assessment_first_learning_level"
                : "formative_assessment_second_learning_level",
              itemValue
            )
          }
        >
          {scoresArray.map((score, index) => (
            <Select.Item key={index} label={score} value={score} />
          ))}
        </Select>
      }
      title={[
        data?.enrollment_first_name,
        data?.enrollment_middle_name,
        data?.enrollment_last_name,
      ]
        .filter((e) => e)
        .join(" ")}
      isIdtag={data?.user_id}
    />
  );
};
