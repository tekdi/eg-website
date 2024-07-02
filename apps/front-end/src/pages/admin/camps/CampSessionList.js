import {
  FrontEndTypo,
  IconByName,
  Layout,
  campService,
  Loading,
  enumRegistryService,
} from "@shiksha/common-lib";
import moment from "moment";
import {
  Alert,
  HStack,
  Modal,
  Pressable,
  ScrollView,
  Stack,
  VStack,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import SessionActions, { SessionList } from "./CampSessionModal";
import Chip from "component/BeneficiaryStatus";

const checkNext = (status, updated_at) => {
  return (
    status === "complete" &&
    updated_at &&
    moment.utc(updated_at).format("YYYY-MM-DD") ===
      moment.utc().format("YYYY-MM-DD")
  );
};

export default function CampSessionList({ footerLinks }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [sessionList, setSessionList] = useState([]);
  const [sessionActive, setSessionActive] = useState();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [sessionDetails, setSessionDetails] = useState();
  const [previousSessionDetails, setPreviousSessionDetails] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const [submitStatus, setSubmitStatus] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const [bodyHeight, setBodyHeight] = useState();
  const [campDetails, setCampDetails] = useState();

  const getData = useCallback(async () => {
    if (modalVisible) {
      const result = await campService.getCampSessionDetails({
        id: modalVisible,
        camp_id: id,
      });
      if (result?.data?.ordering > 1) {
        const data = sessionList?.find(
          (e) => e?.ordering === result?.data?.ordering - 1
        );
        setPreviousSessionDetails(data);
      }
      setSessionDetails(result?.data);
    }
  }, [modalVisible]);

  useEffect(() => {
    const completeItem = sessionList?.filter(
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
    const campDetails = await campService.getCampDetails({ id });
    setCampDetails(campDetails?.data);
    const result = await campService.getCampSessionsList({
      id: id,
    });
    const data = result?.data?.learning_lesson_plans_master || [];
    setSessionList(data);
    setSessionActive(getSessionCount(data));
  };

  useEffect(async () => {
    await getCampSessionsList();
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
        });
        if (!result?.success) {
          setError(
            <SessionErrorMessage {...result} navigate={navigate} t={t} />
          );
        } else {
          await getCampSessionsList();
          setSubmitStatus();
          setModalVisible();
        }
      } else {
        let newData = { status: submitStatus?.status };
        if (submitStatus?.status === "incomplete") {
          newData = {
            ...newData,
            lesson_plan_incomplete_feedback: submitStatus?.reason,
          };
        } else if (submitStatus?.status === "complete") {
          newData = {
            ...newData,
            lesson_plan_complete_feedback: submitStatus?.reason,
          };
        }
        const result = await campService.creatCampSession({
          ...newData,
          learning_lesson_plan_id: modalVisible,
          camp_id: id,
        });
        if (!result?.success) {
          setError(
            <SessionErrorMessage {...result} navigate={navigate} t={t} />
          );
        } else {
          await getCampSessionsList();
          setSubmitStatus();
          setModalVisible();
        }
      }
    } else {
      setError("PLEASE_SELECT");
    }
    setIsDisable(false);
  }, [submitStatus]);

  const handleCancel = () => {
    setError();
    setSubmitStatus();
  };

  const getSessionCount = (data) => {
    let count = 0;
    const result = data
      .filter((e) => e.session_tracks?.[0]?.id)
      .map((e) => ({ ...e.session_tracks?.[0], ordering: e?.ordering }));
    let sessionData = result?.[result?.length - 1] || { ordering: 1 };
    const c1 = result.filter((e) => {
      const format = "YYYY-MM-DD";
      return (
        e.status === "complete" &&
        moment(e.created_at).format(format) !== moment().format(format) &&
        moment(e.updated_at).format(format) === moment().format(format)
      );
    });

    const c2 = result.filter((e) => {
      const format = "YYYY-MM-DD";
      return (
        e.status === "incomplete" &&
        moment(e.created_at).format(format) === moment().format(format) &&
        moment(e.updated_at).format(format) === moment().format(format)
      );
    });

    const c3 = result.filter((e) => {
      const format = "YYYY-MM-DD";
      return (
        e.status === "complete" &&
        moment(e.created_at).format(format) === moment().format(format) &&
        moment(e.updated_at).format(format) === moment().format(format)
      );
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
      sessionData = data.find((e) => sessionData?.ordering + 1 === e?.ordering);
    }
    if (count >= 1.5) {
      sessionData = {};
    }

    return { ...sessionData, countSession: count };
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
      }}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _footer={{ menues: footerLinks }}
      getBodyHeight={(e) => setBodyHeight(e)}
      analyticsPageTitle={"CAMP_SESSION_LIST"}
      pageTitle={t("CAMP")}
      stepTitle={`${
        campDetails?.type === "main" ? t("MAIN_CAMP") : t("PCR_CAMP")
      }/${t("SESSION_LIST")}`}
    >
      <Stack>
        <VStack flex={1} space="5" p="5">
          <HStack space="2">
            <IconByName name="BookOpenLineIcon" />
            <FrontEndTypo.H2 color="textMaroonColor.400">
              {t("SESSION")}
            </FrontEndTypo.H2>
          </HStack>
          <ScrollView maxH={bodyHeight - 150} p="4">
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
      </Stack>
    </Layout>
  );
}

const SessionErrorMessage = ({ t, message, data, navigate }) => (
  <VStack>
    {t("CAMP_SESSION_INCOMPLETE_UNTIL_ALL_ASSESSMENTS_COMPLETED")}
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
