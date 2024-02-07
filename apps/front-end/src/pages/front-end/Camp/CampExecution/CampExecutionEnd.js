import {
  campService,
  FrontEndTypo,
  Layout,
  ImageView,
  CardComponent,
  IconByName,
} from "@shiksha/common-lib";
import { HStack, VStack, Alert, Image, Box, Modal } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function CampExecutionEnd({
  facilitator,
  learnerCount,
  todaysActivity,
}) {
  const { t } = useTranslation();
  const { id, step } = useParams();
  const [miscActivities, setMiscActivities] = useState();
  const [disable, setDisable] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionList, setSessionList] = useState(false);
  const [learnerAttendanceCount, setLearnerAttendanceCount] = useState(false);

  const navigate = useNavigate();

  useEffect(async () => {
    if (todaysActivity?.id) {
      const resultAttendance = await campService.CampAttendance({
        id: todaysActivity?.id,
      });
      setMiscActivities(todaysActivity?.misc_activities);
      let attendances = resultAttendance?.data || [];
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

      const faciltatorAttendanceData = attendances?.find((item, index) => {
        return facilitator?.id === item?.user?.id;
      });

      const learnerAttendance = attendances?.filter((item) => {
        return facilitator?.id !== item?.user?.id;
      });

      if (learnerAttendance?.length >= learnerCount) {
        setLearnerAttendanceCount(true);
      }

      if (
        learnerAttendance?.length >= learnerCount &&
        faciltatorAttendanceData?.id &&
        (todaysActivity?.misc_activities || sessionListData)
      ) {
        setDisable(false);
      }
    }
    setLoading(false);
  }, [todaysActivity?.id, step, learnerCount, facilitator]);

  const endCamp = async () => {
    setDisable(true);
    const obj = {
      id: todaysActivity?.id,
      edit_page_type: "edit_end_date",
    };
    await campService.addMoodActivity(obj);
    navigate(`/camps`);
  };
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
              uri: "/airoplane.gif",
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
        <Alert status="warning">
          <HStack alignItems={"center"} space={2}>
            <Alert.Icon />
            <FrontEndTypo.H3>{t("DONT_CLOSE_SCREEN")}</FrontEndTypo.H3>
          </HStack>
        </Alert>
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
          onPress={() => navigate(`/camps/${id}/campexecution/activities`)}
        >
          <HStack alignItems={"center"} space={3}>
            <FrontEndTypo.H1 color={"textMaroonColor.400"}>
              {t("TODAYS_TASKS")}
            </FrontEndTypo.H1>
            {(miscActivities || sessionList) && (
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
    </Layout>
  );
}
