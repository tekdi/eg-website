import {
  FrontEndTypo,
  Layout,
  Loading,
  campService,
  enumRegistryService,
  jsonParse,
} from "@shiksha/common-lib";
import Chip from "component/BeneficiaryStatus";
import moment from "moment";
import {
  Alert,
  HStack,
  Modal,
  Pressable,
  Progress,
  ScrollView,
  Stack,
  VStack,
} from "native-base";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";
import SessionActions, { SessionList } from "./CampSessionModal";

export default function CampSessionList({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const { id, activityId } = useParams();
  const [sessionList, setSessionList] = useState([]);
  const [sessionActive, setSessionActive] = useState();
  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [sessionDetails, setSessionDetails] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const [submitStatus, setSubmitStatus] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const [bodyHeight, setBodyHeight] = useState();
  const fa_id = localStorage.getItem("id");
  const [facilitator, setFacilitator] = useState();
  const [showModal, setShowModal] = useState(false);
  const [assessmentWarning, setAssessmentWarning] = useState();

  const getData = useCallback(async () => {
    if (modalVisible) {
      const result = await campService.getCampSessionDetails({
        id: modalVisible,
        camp_id: id,
      });
      setSessionDetails(result?.data);
    }
  }, [modalVisible]);

  useEffect(() => {
    const completeItem = sessionList.filter(
      (item) => item?.session_tracks?.[0]?.status === "complete"
    );
    const lastCompleteItem = completeItem.pop();

    setTimeout(() => {
      const targetSection = document.getElementById(lastCompleteItem?.id - 1);
      if (targetSection) {
        // Scroll to the section
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 2000);
  }, [sessionList]);

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, [modalVisible]);

  const getCampSessionsList = async () => {
    const resultCamp = await campService.getCampDetails({ id });
    const result = await campService.getCampSessionsList({
      id: id,
    });
    const data = result?.data?.learning_lesson_plans_master || [];
    setSessionList(data);
    const sessionResult = getSessionCount(data);
    setSessionActive(sessionResult);
    setTotalSessionsCompleted(
      sessionResult?.lastSession?.ordering -
        (sessionResult?.lastSession?.status === "incomplete" ? 0.5 : 0) || 0
    );
    if (resultCamp?.data?.type == "pcr") {
      //PCR Validations here
      let filteredData = data.filter((item) => item.session_tracks.length > 0);
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
      if (assessment_type != "") {
        const resultScore = await campService.getCampLearnerScores({
          camp_id: id,
          assessment_type,
        });
        const incompleteUser = getIncompletLeaner(
          resultScore?.data,
          assessment_type
        );
        if (incompleteUser?.length > 0) {
          navigate(`/camps/${id}/campexecution/activities`);
        }
      }
    }
  };

  useEffect(async () => {
    await getCampSessionsList();
    if (userTokenInfo) {
      const IpUserInfo = await getIpUserInfo(fa_id);
      let ipUserData = IpUserInfo;
      if (!IpUserInfo) {
        ipUserData = await setIpUserInfo(fa_id);
      }

      setFacilitator(ipUserData);
    }
    const enumData = await enumRegistryService.listOfEnum();
    setEnumOptions(enumData?.data ? enumData?.data : {});
    setLoading(false);
  }, []);

  // const handleStartSession = useCallback(
  //   async (modalVisible) => {
  //     setIsDisable(true);
  //     await campService.creatCampSession({
  //       learning_lesson_plan_id: modalVisible,
  //       camp_id: id,
  //     });
  //     await getData();
  //     setIsDisable(false);
  //   },
  //   [getData, submitStatus]
  // );

  const handlePartiallyDone = useCallback(async () => {
    setError();
    setIsDisable(true);
    if (submitStatus?.reason) {
      if (sessionDetails?.session_tracks?.[0]?.id) {
        const result = await campService.updateCampSession({
          id: sessionDetails?.session_tracks?.[0]?.id,
          edit_session_type:
            submitStatus?.status === "complete"
              ? "edit_complete_session"
              : "edit_incomplete_session",
          session_feedback: submitStatus?.reason,
          ...(assessmentWarning && { warning: "accepted" }),
        });
        if (!result?.success) {
          if (result?.data?.[0]?.assessment_type?.length > 0) {
            setAssessmentWarning(
              <SessionErrorMessage
                {...result}
                navigate={navigate}
                t={t}
                show={false}
              />
            );
          } else {
            setError(
              <SessionErrorMessage {...result} navigate={navigate} t={t} />
            );
          }
        } else {
          await getCampSessionsList();
          setSubmitStatus();
          setModalVisible();
          setAssessmentWarning();
        }
      } else {
        let newData = { status: submitStatus?.status };
        if (submitStatus?.status === "incomplete") {
          newData = {
            ...newData,
            lesson_plan_incomplete_feedback: submitStatus?.reason,
            ...(assessmentWarning && { warning: "accepted" }),
          };
        } else if (submitStatus?.status === "complete") {
          newData = {
            ...newData,
            lesson_plan_complete_feedback: submitStatus?.reason,
            ...(assessmentWarning && { warning: "accepted" }),
          };
        }
        if (
          sessionDetails?.ordering == 20 &&
          submitStatus.status == "complete" &&
          !showModal &&
          campDetails.type !== "main"
        ) {
          setShowModal(true);
        } else {
          const result = await campService.creatCampSession({
            ...newData,
            learning_lesson_plan_id: modalVisible,
            camp_id: id,
          });
          if (!result?.success) {
            if (result?.data?.[0]?.assessment_type?.length > 0) {
              setAssessmentWarning(
                <SessionErrorMessage
                  {...result}
                  navigate={navigate}
                  t={t}
                  show={false}
                />
              );
            } else {
              setError(
                <SessionErrorMessage {...result} navigate={navigate} t={t} />
              );
            }
          } else if (showModal) {
            const obj = {
              id: activityId,
              edit_page_type: "edit_end_date",
            };
            await campService.addMoodActivity(obj);
            navigate("/camps");
          } else {
            await getCampSessionsList();
            setSubmitStatus();
            setModalVisible();
            setAssessmentWarning();
          }
        }
      }
    } else {
      setError("PLEASE_SELECT");
    }
    setIsDisable(false);
  }, [submitStatus, showModal, assessmentWarning]);

  const handleCancel = () => {
    setError();
    setSubmitStatus();
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

      if (
        e.status === "complete" &&
        createdAt !== today &&
        updatedAt === today
      ) {
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

  if (loading) {
    return <Loading />;
  }

  const calculateProgress = (completedSessions, totalSessions) => {
    if (totalSessions === 0) return 0; // to avoid division by zero
    return (completedSessions / totalSessions) * 100;
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("SESSION_LIST")}</FrontEndTypo.H2>,
        _box: { bg: "white", shadow: "appBarShadow" },
        onPressBackButton: () =>
          navigate(`/camps/${id}/campexecution/activities`),
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      // _footer={{ menues: footerLinks }}
      getBodyHeight={(e) => setBodyHeight(e)}
    >
      {/* {campType === "pcr" ? (
        <Alert status="warning" alignItems="start" mb="3" mt="4">
          <HStack alignItems="center" space="2">
            <Alert.Icon />
            <FrontEndTypo.H3>{t("PAGE_NOT_ACCESSABLE")}</FrontEndTypo.H3>
          </HStack>
        </Alert>
      ) : ( */}
      <Stack>
        <VStack flex={1} space="5" p="5">
          <FrontEndTypo.H2>{t("SESSION")}</FrontEndTypo.H2>
          <FrontEndTypo.H4 bold color="textGreyColor.750">{`${t(
            "CAMP_ID"
          )} : ${id}`}</FrontEndTypo.H4>
          <VStack>
            <HStack space={4} alignItems={"center"}>
              <FrontEndTypo.H3 bold color="textGreyColor.750">
                {t("COMPLETED_SESSIONS")} :
              </FrontEndTypo.H3>
              <FrontEndTypo.H2 bold color="textGreyColor.750">
                {totalSessionsCompleted}/{sessionList?.length}
              </FrontEndTypo.H2>
            </HStack>
            <Progress
              value={calculateProgress(
                totalSessionsCompleted,
                sessionList?.length
              )}
              size="sm"
              colorScheme="warning"
            />
          </VStack>
          <ScrollView maxH={bodyHeight - 190} p="4">
            <SessionList {...{ sessionList, sessionActive, setModalVisible }} />
          </ScrollView>
        </VStack>
        {!sessionActive?.ordering && (
          <VStack px="4">
            <FrontEndTypo.Primarybutton
              onPress={() => {
                navigate(`/camps/${id}/campexecution/activities`);
              }}
            >
              {t("SUBMIT")}
            </FrontEndTypo.Primarybutton>
          </VStack>
        )}
        <Modal isOpen={modalVisible} avoidKeyboard size="xl">
          <Modal.Content>
            <Modal.Header>
              <FrontEndTypo.H3
                textAlign="center"
                color="textMaroonColor.400"
                bold
              >
                {t("LESSON")} {sessionDetails?.ordering}
              </FrontEndTypo.H3>
              <Modal.CloseButton
                onPress={() => {
                  setModalVisible();
                  handleCancel();
                }}
              />
            </Modal.Header>
            <Modal.Body p="6">
              <SessionActions
                {...{
                  sessionActive,
                  isDisable,
                  enumOptions,
                  submitStatus,
                  setSubmitStatus,
                  handlePartiallyDone,
                  handleCancel,
                  error,
                }}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header textAlign={"center"}>
              {t("EXPIRY_CONTENT.HEADING")}
            </Modal.Header>
            <Modal.Body>
              <FrontEndTypo.H2>{t("ALL_SESSIONS_COMPLETED")}</FrontEndTypo.H2>
            </Modal.Body>
            <Modal.Footer justifyContent={"space-evenly"}>
              <FrontEndTypo.Secondarybutton onPress={() => setShowModal(false)}>
                {t("CANCEL")}
              </FrontEndTypo.Secondarybutton>
              <FrontEndTypo.Primarybutton
                onPress={() => handlePartiallyDone(submitStatus?.id)}
              >
                {t("CONTINUE")}
              </FrontEndTypo.Primarybutton>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <Modal
          isOpen={assessmentWarning}
          onClose={() => {
            setAssessmentWarning();
          }}
        >
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header textAlign={"center"}>
              {t("EXPIRY_CONTENT.HEADING")}
            </Modal.Header>
            <Modal.Body>
              <Alert status="warning" alignItems={"start"}>
                {assessmentWarning}
                <FrontEndTypo.H3>
                  {t("DO_YOU_WISH_TO_CONTINUE")}
                </FrontEndTypo.H3>
              </Alert>
            </Modal.Body>
            <Modal.Footer justifyContent={"space-evenly"}>
              <FrontEndTypo.Secondarybutton
                onPress={() => {
                  setAssessmentWarning();
                }}
              >
                {t("CANCEL")}
              </FrontEndTypo.Secondarybutton>
              <FrontEndTypo.Primarybutton onPress={() => handlePartiallyDone()}>
                {t("CONTINUE")}
              </FrontEndTypo.Primarybutton>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Stack>
      {/* )} */}
    </Layout>
  );
}

const SessionErrorMessage = ({ t, message, data, navigate, show = true }) => (
  <VStack>
    {show && t("CAMP_SESSION_INCOMPLETE_UNTIL_ALL_ASSESSMENTS_COMPLETED")}
    <FrontEndTypo.H3>{t(message)}</FrontEndTypo.H3>
    {data && (
      <HStack flexWrap={"wrap"}>
        {data?.map((e) => (
          <Pressable onPress={() => navigate(`/beneficiary/${e?.id}/pcrview`)}>
            <Chip children={e?.id} />
          </Pressable>
        ))}
      </HStack>
    )}
  </VStack>
);

const getIncompletLeaner = (data, type) => {
  if (!data) return [];

  const { learners, subjects_name } = data;
  let result = [];

  if (!learners || !subjects_name) return result;

  result = learners.filter((learner) => {
    const subjectIds = jsonParse(
      learner?.program_beneficiaries?.[0]?.subjects,
      []
    );

    if (!subjectIds || subjectIds.length === 0) return false;

    const eligibleSubjects = subjects_name.filter((subject) =>
      subjectIds.includes(`${subject?.id}`)
    );

    if (eligibleSubjects.length === 0) return false;

    let validAssessment = false;

    switch (type) {
      case "base-line":
        validAssessment = !learner.pcr_scores?.some(
          (score) => score.baseline_learning_level
        );
        break;

      case "fa1":
        const fa1Assessments = learner.pcr_formative_assesments?.filter(
          (assessment) =>
            assessment.formative_assessment_first_learning_level &&
            subjectIds.includes(`${assessment?.subject_id}`)
        );
        validAssessment = fa1Assessments?.length < eligibleSubjects.length;
        break;

      case "fa2":
        const fa2Assessments = learner.pcr_formative_assesments?.filter(
          (assessment) =>
            assessment.formative_assessment_second_learning_level &&
            subjectIds.includes(`${assessment?.subject_id}`)
        );
        validAssessment = fa2Assessments?.length < eligibleSubjects.length;
        break;

      case "end-line":
        validAssessment = !learner.pcr_scores?.some(
          (score) => score.endline_learning_level
        );
        break;

      default:
        return false;
    }

    return validAssessment;
  });

  return result;
};
