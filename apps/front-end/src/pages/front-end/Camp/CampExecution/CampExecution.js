import {
  campService,
  FrontEndTypo,
  Layout,
  Alert as TAlert,
  Loading,
  Camera,
  uploadRegistryService,
  ImageView,
  useLocationData,
  CardComponent,
} from "@shiksha/common-lib";
import moment from "moment";
import { Box, HStack, VStack, Alert, Image, Stack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function CampExecution({ footerLinks }) {
  const { t } = useTranslation();
  const [camp, setCamp] = React.useState();
  const { id } = useParams();
  const [error, setError] = React.useState();
  const [data, setData] = React.useState({});
  const [facilitator, setFacilitator] = React.useState();
  const [start, setStart] = React.useState(false);
  const [cameraFile, setCameraFile] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [timer, setTimer] = React.useState();
  const [activityId, setActivityId] = React.useState();
  const [todaysData, setTodaysData] = React.useState();
  const navigate = useNavigate();
  const [latData, longData, errors] = useLocationData() || [];

  React.useEffect(async () => {
    const result = await campService.getCampDetails({ id });
    setCamp(result?.data || {});
    setFacilitator(result?.data?.faciltator?.[0] || {});
  }, [id]);

  React.useEffect(async () => {
    const obj = {
      id: id,
      start_date: moment(new Date()).format("YYYY-MM-DD"),
    };
    const result = await campService.getcampstatus({ id });
    const todaysActivity = await campService.getActivity(obj);
    setTodaysData(todaysActivity?.data?.camp_days_activities_tracker);
    const endDate = result?.data?.end_date;
    const startDate = result?.data?.start_date;
    const camp_day_happening = result?.data?.camp_day_happening;
    const mood = result?.data?.mood;
    const activity_id = result?.data?.id;
    if (!endDate && startDate && camp_day_happening !== "no" && mood) {
      navigate(`/camps/${id}/campexecutionstart/${activity_id}`, {
        state: "campInprogress",
      });
    } else if (!endDate && startDate && camp_day_happening !== "no" && !mood) {
      navigate(`/camps/${id}/campexecutionstart/${activity_id}`);
    }
  }, []);

  React.useEffect(async () => {
    setData({ ...data, lat: `${latData}`, long: `${longData}` });
  }, [latData]);

  React.useEffect(() => {
    const lastTime = localStorage.getItem("startCamp");
    let set_interval;
    if (lastTime) {
      set_interval = setInterval(() => {
        const a = moment();
        const b = moment(lastTime);
        const h = a.diff(b, "hours");
        const m = a.diff(b, "minutes");
        const s = a.diff(b, "seconds");
        if (h < 2) {
          setTimer({
            h,
            m: m > 60 ? m % (h * 60) : m,
            s: s > 60 ? s % (m * 60) : s,
            cs: s,
          });
        }
      }, 1000);
    } else {
      clearInterval(set_interval);
    }

    return (e) => {
      clearInterval(set_interval);
    };
  }, [localStorage.getItem("startCamp")]);

  // start Camp
  const startCamp = () => {
    try {
      localStorage.setItem("startCamp", moment());
      uploadAttendencePicture();
      setCameraUrl();
      setStart(false);
    } catch (e) {}
  };

  const campBegin = async () => {
    setStart(true);
    if (todaysData?.[0]?.id) {
      const payLoad = {
        edit_page_type: "edit_camp_day_happening",
        camp_day_happening: "yes",
        id: todaysData?.[0]?.id,
      };
      await campService.addMoodActivity(payLoad);
    } else {
      const payLoad = {
        camp_id: id,
        camp_day_happening: "yes",
      };
      const data = await campService.campActivity(payLoad);
      setActivityId(data?.insert_camp_days_activities_tracker_one?.id);
    }
  };
  // uploadAttendencePicture from start camp
  const uploadAttendencePicture = async (e) => {
    setError("");
    const photo_1 = cameraFile?.data?.insert_documents?.returning?.[0]?.name;
    const attendanceId = cameraFile?.data?.insert_documents?.returning?.[0]?.id;
    if (photo_1) {
      const dataQ = {
        ...data,
        context_id: todaysData?.[0]?.id || activityId,
        user_id: facilitator?.id,
        status: "present",
        reason: "camp_started",
        photo_1: `${photo_1}`,
      };
      await campService.markCampAttendance(dataQ);
      localStorage.setItem("attendancePicture", attendanceId);
      navigate(
        `/camps/${id}/campexecutionstart/${todaysData?.[0]?.id || activityId}`
      );
    } else {
      setError("Capture Picture First");
    }
    setCameraUrl();
  };

  if (start && data?.lat && data?.long) {
    return (
      <React.Suspense fallback={<Loading />}>
        <Camera
          messageComponent={
            <VStack>
              <FrontEndTypo.H3 color="white" textAlign="center">
                {t("ATTENDANCE_PHOTO_MSG")}
              </FrontEndTypo.H3>
            </VStack>
          }
          {...{
            onFinish: (e) => startCamp(),
            cameraModal: start,
            setCameraModal: (e) => {
              setCameraUrl();
              setStart(e);
            },
            cameraUrl,
            setCameraUrl: async (url, file) => {
              if (file) {
                setError("");
                let formData = new FormData();
                formData.append("user_id", facilitator?.id);
                formData.append("document_type", "camp_attendance");
                formData.append("file", file);
                const uploadDoc = await uploadRegistryService.uploadFile(
                  formData
                );
                if (uploadDoc) {
                  setCameraFile(uploadDoc);
                }
                setCameraUrl({ url, file });
              } else {
                setCameraUrl();
              }
            },
            cameraSide: true,
          }}
        />
      </React.Suspense>
    );
  }

  return (
    <Layout
      _appBar={{ name: t("CAMP_EXECUTION") }}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack space="5" p="5">
        <Box alignContent="center">
          <HStack justifyContent={"space-between"}>
            <FrontEndTypo.H1 color="textMaroonColor.400" pl="1">
              {t("WELCOME")}{" "}
              {[
                facilitator?.first_name,
                facilitator?.middle_name,
                facilitator?.last_name,
              ]
                .filter((e) => e)
                .join(" ")}
              ,
            </FrontEndTypo.H1>
          </HStack>
        </Box>
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
              _vstack={{
                bg: "light.100",
                flex: 1,
                pt: 2,
                m: 4,
                mb: 4,
              }}
            >
              {t("YOUR_WELCOME_READY_TO_FLY")}
            </CardComponent>
          </VStack>
        </Box>
        <VStack alignItems="center" space="5">
          <FrontEndTypo.H1 color="textMaroonColor.400" pl="1">
            {t("STARTS_YOUR_DAY")}
          </FrontEndTypo.H1>
        </VStack>
        <VStack space="4">
          <TAlert
            alert={error}
            setAlert={(e) => {
              setStart(false);
              setError(e);
            }}
            _alert={{
              status: "warning",
            }}
            type="warning"
          />
          <VStack space="4">
            {todaysData?.[0]?.end_date === null ? (
              <Stack>
                <FrontEndTypo.H3>
                  {t("WILL_THE_CAMP_BE_CONDUCTED_TODAY")}
                </FrontEndTypo.H3>
                <FrontEndTypo.Primarybutton onPress={campBegin}>
                  {t("YES_ABSOLUTELY")}
                </FrontEndTypo.Primarybutton>
                <FrontEndTypo.Secondarybutton
                  onPress={(e) => navigate(`/camps/${id}/campotherplans`)}
                >
                  {t("NO_PLAN")}
                </FrontEndTypo.Secondarybutton>
              </Stack>
            ) : (
              <Stack space="3">
                <Alert status="warning" alignItems={"center"}>
                  <HStack alignItems="center" space="2">
                    <Alert.Icon />
                    <FrontEndTypo.H3>
                      {t("TODAYS_CAMP_HAS_BEEN_COMPLETED")}
                    </FrontEndTypo.H3>
                  </HStack>
                </Alert>
                <FrontEndTypo.Primarybutton onPress={(e) => navigate(`/camps`)}>
                  {t("GO_TO_PROFILE")}
                </FrontEndTypo.Primarybutton>
              </Stack>
            )}
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
