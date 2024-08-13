import {
  CustomAlert,
  FrontEndTypo,
  ImageView,
  Layout,
  campService,
} from "@shiksha/common-lib";
import moment from "moment";
import { Box, HStack, Image, Modal, VStack } from "native-base";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import TimelineItem from "./TimeLine";

function CampExecutionEnd({ facilitator, learnerCount, campType }) {
  const { t } = useTranslation();
  const { id, step } = useParams();
  const [disableEndCamp, setDisableEndCamp] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
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
      setdisableTodayAct(false);
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
      const { countSession } = getSessionCount(data);
      if (countSession > 0 || todaysActivity?.misc_activities) {
        setDisableEndCamp(false);
      } else {
        setDisableEndCamp(true);
      }
    }
    setLoading(false);
  }, [todaysActivity?.id, step, learnerCount, facilitator, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const endCamp = useCallback(async () => {
    setDisableEndCamp(true);
    const obj = {
      id: todaysActivity?.id,
      edit_page_type: "edit_end_date",
    };
    await campService.addMoodActivity(obj);
    navigate(`/camps`);
  }, [todaysActivity?.id, navigate]);

  const airplaneImageUri = useMemo(() => "/airoplane.png", []);
  return (
    <Layout
      _appBar={{
        name: t("CAMP_EXECUTION"),
        onlyIconsShow: ["langBtn", "userInfo", "loginBtn"],
        onPressBackButton: () => navigate("/camps"),
      }}
      facilitator={facilitator}
      loading={loading}
      analyticsPageTitle={"CAMP_EXECUTION"}
      pageTitle={t("CAMP_EXECUTION")}
      stepTitle={`${
        campType === "main" ? t("MAIN_CAMP") : t("PCR_CAMP")
      }/${step}`}
    >
      <VStack py={6} px={4} mb={5} space="6">
        <FrontEndTypo.H2>{t("CAMP_EXECUTION")}</FrontEndTypo.H2>
        <HStack justifyContent={"space-between"}>
          <FrontEndTypo.H3 bold color="textGreyColor.750">
            {`${t("CAMP_ID")}: ${id}`}
          </FrontEndTypo.H3>
        </HStack>
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
            alt="airoplane.png"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={-1}
          />

          <VStack pr={"55px"} pb={"130px"}>
            <ImageView
              style={{ boxShadow: "0px 4px 4px 0px #ffffff" }}
              width="71px"
              height="71px"
              source={{ document_id: facilitator?.profile_photo_1?.id }}
            />
          </VStack>
        </Box>
        <CustomAlert title={t("DONT_CLOSE_SCREEN")} />
        <TimelineItem
          _vstack={{ space: "9" }}
          data={[
            {
              title: t("LEARNER_ATTENDANCE"),
              isDone: true,
              onPress: () => navigate(`/camps/${id}/campexecution/attendance`),
            },
            {
              title: t("TODAYS_TASKS"),
              isDone: !disableTodayAct,
              onPress: () => {
                if (!disableTodayAct) {
                  navigate(`/camps/${id}/campexecution/activities`);
                }
              },
            },
            {
              title: t("END_CAMP"),
              isDone: !disableEndCamp,
              onPress: () => {
                if (!disableEndCamp) {
                  setOpenModal(true);
                }
              },
            },
          ]}
        />
        <FrontEndTypo.Primarybutton
          onPress={() => {
            !disableEndCamp
              ? setOpenModal(true)
              : !disableTodayAct
              ? navigate(`/camps/${id}/campexecution/activities`)
              : navigate(`/camps/${id}/campexecution/attendance`);
          }}
        >
          {!disableEndCamp
            ? t("END_CAMP")
            : !disableTodayAct
            ? t("TODAYS_TASKS")
            : t("LEARNER_ATTENDANCE")}
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
