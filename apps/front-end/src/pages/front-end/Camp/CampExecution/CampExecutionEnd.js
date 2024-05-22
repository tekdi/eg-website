import {
  campService,
  FrontEndTypo,
  Layout,
  ImageView,
  CardComponent,
  IconByName,
  CustomAlert,
} from "@shiksha/common-lib";
import moment from "moment";
import { HStack, VStack, Alert, Image, Box, Modal } from "native-base";
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

function CampExecutionEnd({ facilitator, learnerCount }) {
  const { t } = useTranslation();
  const { id, step } = useParams();
  const [disable, setDisable] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionList, setSessionList] = useState(false);
  const [learnerAttendanceCount, setLearnerAttendanceCount] = useState(false);
  const [todaysActivity, setTodaysActivity] = useState();
  const [disableTodayAct, setdisableTodayAct] = useState(true);

  const navigate = useNavigate();

  useEffect(async () => {
    const obj = {
      id: id,
      start_date: moment(new Date()).format("YYYY-MM-DD"),
    };
    const data = await campService.getActivity(obj);
    const activity = data?.data?.camp_days_activities_tracker;
    setTodaysActivity(activity?.[0] || {});
    const object = {
      camp_id: Number(id),
      context_id: activity?.[0]?.id,
    };
    const result = await campService.getCampDetailsCount(object);
    if (result?.data?.beneficairesPresentAttendaceCount?.aggregate?.count < 1) {
      setdisableTodayAct(true);
    } else {
      setLearnerAttendanceCount(true);
      setdisableTodayAct(false);
    }
    if (
      result?.data?.beneficairesAttendaceCount?.aggregate?.count >= 1 &&
      (result?.data?.misc_activities?.misc_activities?.length > 0 ||
        result?.data?.today_session_count?.aggregate?.count > 0)
    ) {
      setDisable(false);
    }
    if (
      result?.data?.beneficairesAttendaceCount?.aggregate?.count > 1 &&
      result?.data?.beneficairesPresentAttendaceCount?.aggregate?.count < 1
    ) {
      setModalVisible(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (todaysActivity?.id) {
      const session = await campService.getCampSessionsList({ id: id });
      const data = session?.data?.learning_lesson_plans_master || [];
      let sessionListData = false;
      data.forEach((element) => {
        const currentDate = new Date();
        const createdAtDate = new Date(
          element?.session_tracks?.[0]?.created_at
        );
        if (currentDate.toDateString() === createdAtDate.toDateString()) {
          sessionListData = true;
          setSessionList(true);
        }
      });
    }
    setLoading(false);
  }, [todaysActivity?.id, step, learnerCount, facilitator, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const endCamp = useCallback(async () => {
    setDisable(true);
    const obj = {
      id: todaysActivity?.id,
      edit_page_type: "edit_end_date",
    };
    await campService.addMoodActivity(obj);
    navigate(`/camps`);
  }, [todaysActivity?.id, navigate]);

  const airplaneImageUri = useMemo(() => "/airoplane.gif", []);
  return (
    <Layout
      _appBar={{
        name: t("CAMP_EXECUTION"),
        onlyIconsShow: ["langBtn", "userInfo", "loginBtn"],
      }}
      loading={loading}
    >
      <VStack py={6} px={4} mb={5} space="6">
        <Box
          margin={"auto"}
          height={"200px"}
          width={"340px"}
          borderColor={"black"}
          bg={"red.100"}
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            source={{
              uri: airplaneImageUri,
            }}
            alt="airoplane.gif"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={-1}
          />

          <VStack alignItems="center" justifyContent="center">
            <ImageView
              width="80px"
              height="80px"
              source={{ document_id: facilitator?.profile_photo_1?.id }}
            />
            <CardComponent
              _header={{ bg: "light.100" }}
              _vstack={{ bg: "light.100", space: 1, flex: 1, paddingTop: 4 }}
            >
              {t("LETS_START_TODAYS_CAMP")}
            </CardComponent>
          </VStack>
        </Box>
        <CustomAlert status={""} title={t("DONT_CLOSE_SCREEN")} />
        <FrontEndTypo.Secondarybutton
          onPress={() => navigate(`/camps/${id}/campexecution/attendance`)}
        >
          <HStack alignItems={"center"} space={3}>
            <FrontEndTypo.H1 color={"textMaroonColor.400"}>
              {t("LEARNER_ATTENDANCE")}
            </FrontEndTypo.H1>
            {learnerAttendanceCount && (
              <IconByName name="CheckboxCircleFillIcon" color="successColor" />
            )}
          </HStack>
        </FrontEndTypo.Secondarybutton>
        <FrontEndTypo.Secondarybutton
          isDisabled={disableTodayAct}
          onPress={() => navigate(`/camps/${id}/campexecution/activities`)}
        >
          <HStack alignItems={"center"} space={3}>
            <FrontEndTypo.H1 color={"textMaroonColor.400"}>
              {t("TODAYS_TASKS")}
            </FrontEndTypo.H1>
            {(todaysActivity?.misc_activities || sessionList) && (
              <IconByName name="CheckboxCircleFillIcon" color="successColor" />
            )}
          </HStack>
        </FrontEndTypo.Secondarybutton>
        <FrontEndTypo.Primarybutton
          isDisabled={disable}
          onPress={() => setOpenModal(true)}
        >
          {t("END_CAMP")}
        </FrontEndTypo.Primarybutton>
      </VStack>
      <Modal isOpen={openModal} size="xs">
        <Modal.Content>
          <Modal.Header alignItems={"center"}>{t("CONFIRMATION")}</Modal.Header>
          <Modal.Body alignItems={"center"} p="5">
            <FrontEndTypo.H3>{t("CONFIRMATION_MESSAGE")}</FrontEndTypo.H3>
          </Modal.Body>
          <Modal.Footer alignSelf={"center"}>
            <HStack space={4}>
              <FrontEndTypo.Secondarybutton onPress={() => setOpenModal(false)}>
                {t("CANCEL")}
              </FrontEndTypo.Secondarybutton>
              <FrontEndTypo.Primarybutton onPress={endCamp}>
                {t("CONFIRM")}
              </FrontEndTypo.Primarybutton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal isOpen={modalVisible} size="xs">
        <Modal.Content>
          <Modal.Header alignItems={"center"}>{t("CONFIRMATION")}</Modal.Header>
          <Modal.Body alignItems={"center"} p="5">
            <FrontEndTypo.H3>{t("LEARNER_ATTENDANCE_MESSAGE")}</FrontEndTypo.H3>
          </Modal.Body>
          <Modal.Footer alignSelf={"center"}>
            <HStack space={4}>
              <FrontEndTypo.Secondarybutton onPress={() => navigate(`/`)}>
                {t("QUIT")}
              </FrontEndTypo.Secondarybutton>
              <FrontEndTypo.Primarybutton
                onPress={() => {
                  navigate(`/camps/${id}/campexecution/attendance`);
                }}
              >
                {t("MARK_ATTENDANCE")}
              </FrontEndTypo.Primarybutton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

export default CampExecutionEnd;

CampExecutionEnd.propTypes = {
  facilitator: PropTypes.any,
  learnerCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
