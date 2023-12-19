import {
  campService,
  FrontEndTypo,
  Layout,
  ImageView,
  CardComponent,
  IconByName,
} from "@shiksha/common-lib";
import { HStack, VStack, Alert, Image, Box } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function CampExecutionEnd({
  todaysActivity,
  facilitator,
  learnerCount,
}) {
  const { t } = useTranslation();
  const { id, step } = useParams();
  const [error, setError] = React.useState();
  const [miscActivities, setMiscActivities] = React.useState({});
  const [disable, setDisable] = React.useState(true);

  const [loading, setLoading] = React.useState(true);
  const [sessionList, setSessionList] = React.useState(false);
  const [learnerAttendanceCount, setLearnerAttendanceCount] =
    React.useState(false);
  const navigate = useNavigate();

  React.useEffect(async () => {
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
        onlyIconsShow: ["loginBtn", "langBtn", "pwaBtn"],
        leftIcon: <FrontEndTypo.H2> {t("CAMP_EXECUTION")} </FrontEndTypo.H2>,
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
        {error && (
          <Alert status="danger">
            <HStack alignItems={"center"} space={2}>
              <Alert.Icon />
              <FrontEndTypo.H3>{t(error)}</FrontEndTypo.H3>
            </HStack>
          </Alert>
        )}
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
        <FrontEndTypo.Primarybutton isDisabled={disable} onPress={endCamp}>
          {t("END_CAMP")}
        </FrontEndTypo.Primarybutton>
      </VStack>
    </Layout>
  );
}
