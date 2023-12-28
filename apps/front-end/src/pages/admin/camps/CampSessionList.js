import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  campService,
  Loading,
  enumRegistryService,
} from "@shiksha/common-lib";
import moment from "moment";
import { HStack, Modal, Pressable, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import SessionActions from "./CampSessionModal";

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
  const [sessionList, setSessionList] = React.useState([]);
  const [sessionActive, setSessionActive] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState();
  const [enumOptions, setEnumOptions] = React.useState({});
  const [sessionDetails, setSessionDetails] = React.useState();
  const [previousSessionDetails, setPreviousSessionDetails] = React.useState();
  const [isDisable, setIsDisable] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState();
  const [error, setError] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const navigate = useNavigate();

  const getData = React.useCallback(async () => {
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

  React.useEffect(() => {
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

  React.useEffect(() => {
    const fetchData = async () => {
      await getData();
      const enumData = await enumRegistryService.listOfEnum();
      setEnumOptions(enumData?.data ? enumData?.data : {});
    };
    fetchData();
  }, [getData]);

  const handleStartSession = React.useCallback(
    async (modalVisible) => {
      setIsDisable(true);
      await campService.creatCampSession({
        learning_lesson_plan_id: modalVisible,
        camp_id: id,
      });
      await getData();
      setIsDisable(false);
    },
    [getData, submitStatus]
  );

  const handlePartiallyDone = React.useCallback(async () => {
    setSubmitBtn(true);
    setError();
    setIsDisable(true);
    if (submitStatus?.reason) {
      await campService.updateCampSession({
        id: sessionDetails?.session_tracks?.[0]?.id,
        edit_session_type:
          submitStatus?.status === "complete"
            ? "edit_complete_session"
            : "edit_incomplete_session",

        session_feedback: submitStatus?.reason,
      });
      await getData();
      setSubmitStatus();
      setModalVisible();
    } else {
      setError("PLEASE_SELECT");
    }
    setIsDisable(false);
  }, [getData, submitStatus]);

  const handleCancel = () => {
    setError();
    setSubmitStatus();
  };

  React.useEffect(async () => {
    const result = await campService.getCampSessionsList({ id: id });
    const data = result?.data?.learning_lesson_plans_master || [];
    setSessionList(data);
    let dataSession;
    data.forEach((e, i) => {
      if (!i || e.session_tracks?.[0]?.status) {
        dataSession = {
          ...(e.session_tracks?.[0] || {}),
          ordering: e.ordering,
        };
      }
    });
    if (!dataSession.status) {
      setSessionActive(dataSession?.ordering);
    } else if (dataSession.status === "incomplete") {
      const result = data.find(
        (item) => item?.ordering === dataSession?.ordering - 1
      );
      if (
        checkNext(
          result?.session_tracks?.[0]?.status,
          result?.session_tracks?.[0]?.updated_at
        )
      ) {
        setSessionActive(dataSession?.ordering - 1);
      } else {
        setSessionActive(dataSession?.ordering);
      }
    } else if (dataSession?.status === "complete") {
      setSessionActive(dataSession?.ordering + 1);
    } else if (checkNext(dataSession.status, dataSession.updated_at)) {
      setSessionActive(dataSession?.ordering);
    } else {
      setSessionActive(dataSession?.ordering + 1);
    }
    setLoading(false);
  }, [modalVisible]);

  if (loading) {
    return <Loading />;
  }

  const handleCompleteButton = () => {
    return (
      submitStatus?.status === "complete" ||
      (!submitStatus?.status &&
        previousSessionDetails?.session_tracks?.[0] &&
        previousSessionDetails?.session_tracks?.[0]?.status === "complete" &&
        previousSessionDetails?.session_tracks?.[0]?.updated_at &&
        moment(previousSessionDetails?.session_tracks?.[0]?.updated_at).format(
          "YYYY-MM-DD"
        ) !== moment().format("YYYY-MM-DD")) ||
      (submitStatus?.status === undefined &&
        previousSessionDetails === undefined)
    );
  };
  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("SESSION_LIST")}</FrontEndTypo.H2>,
      }}
      _footer={{ menues: footerLinks }}
    >
      <div id="scroll_id">
        <VStack flex={1} space={"5"} p="5" background={"bgGreyColor.200"}>
          <HStack space="2">
            <IconByName name="BookOpenLineIcon" />
            <FrontEndTypo.H2 color="textMaroonColor.400">
              {t("SESSION")}
            </FrontEndTypo.H2>
          </HStack>

          {sessionList?.map((item) => (
            <div key={item?.id} id={item?.id}>
              <Pressable
                onPress={() => setModalVisible(item?.id)}
                isDisabled={
                  sessionActive !== item?.ordering ||
                  item?.session_tracks?.[0]?.status === "complete"
                }
              >
                <CardComponent
                  key={item?.id}
                  _header={{ px: "0", pt: "0" }}
                  _body={{
                    px: "4",
                    py: "2",
                    // pt: "0",
                    bg:
                      sessionActive !== item?.ordering ||
                      item?.session_tracks?.[0]?.status === "complete"
                        ? "gray.100"
                        : "white",
                  }}
                  _vstack={{ p: 0, space: 0, flex: 1 }}
                >
                  <HStack justifyContent={"space-between"}>
                    <HStack
                      space="4"
                      alignItems={"center"}
                      // justifyContent={"space-between"}
                    >
                      {item?.session_tracks?.[0]?.status === "complete" && (
                        <IconByName
                          name="CheckboxCircleFillIcon"
                          color="greenIconColor"
                          _icon={{ size: "24px" }}
                        />
                      )}
                      {item?.session_tracks?.[0]?.status === "incomplete" && (
                        <IconByName
                          color="warningColor"
                          name="TimeFillIcon"
                          _icon={{ size: 30 }}
                        />
                      )}

                      <FrontEndTypo.H2 alignItem="center">
                        {t("SESSION") + " " + item?.ordering}
                      </FrontEndTypo.H2>
                    </HStack>
                    <IconByName
                      alignContent={"right"}
                      name="ArrowRightSLineIcon"
                      _icon={{ size: "25px" }}
                    />
                  </HStack>
                </CardComponent>
              </Pressable>
            </div>
          ))}
        </VStack>
      </div>
      {submitBtn && (
        <FrontEndTypo.Primarybutton
          width="50%"
          position="absolute"
          left="25%"
          bottom="22%"
          right="25%"
          onPress={() => {
            navigate(`/camps/${id}/campexecution/activities`);
          }}
        >
          {t("SUBMIT")}
        </FrontEndTypo.Primarybutton>
      )}

      <Modal isOpen={modalVisible} avoidKeyboard size="xl">
        <Modal.Content>
          <Modal.Header>
            <FrontEndTypo.H3
              textAlign={"Center"}
              color="textMaroonColor.400"
              bold
            >
              {t("LESSON")} {sessionDetails?.ordering}
            </FrontEndTypo.H3>
            <Modal.CloseButton
              onPress={() => {
                setModalVisible();
              }}
            />
          </Modal.Header>
          <Modal.Body p="6">
            <SessionActions
              sessionDetails={sessionDetails}
              isDisable={isDisable}
              handleStartSession={handleStartSession}
              handleCompleteButton={handleCompleteButton}
              setSubmitStatus={setSubmitStatus}
              handlePartiallyDone={handlePartiallyDone}
              handleCancel={handleCancel}
              submitStatus={submitStatus}
              enumOptions={enumOptions}
              error={error}
              t={t}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
