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
} from "@shiksha/common-lib";
import moment from "moment";
import { Box, HStack, VStack, Alert, Image } from "native-base";
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
  const navigate = useNavigate();
  const [latData, longData, errors] = useLocationData() || [];

  React.useEffect(async () => {
    const result = await campService.getCampDetails({ id });
    setCamp(result?.data || {});
    setFacilitator(result?.data?.faciltator?.[0] || {});
  }, [id]);

  React.useEffect(async () => {
    if (errors) {
      setError(errors);
    } else {
      setData({ ...data, lat: `${latData}`, long: `${longData}` });
    }
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
        } else {
          endCamp();
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

  // endCamp
  const endCamp = () => {
    localStorage.removeItem("startCamp");
    setTimer({
      h: 0,
      m: 0,
      s: 0,
      cs: 0,
    });
  };

  // uploadAttendencePicture from start camp
  const uploadAttendencePicture = async (e) => {
    setError("");
    const photo_1 = cameraFile?.data?.insert_documents?.returning?.[0]?.name;
    const attendanceId = cameraFile?.data?.insert_documents?.returning?.[0]?.id;
    if (photo_1) {
      const dataQ = {
        ...data,
        context_id: id,
        user_id: facilitator?.id,
        status: "present",
        photo_1: `${photo_1}`,
      };
      await campService.markCampAttendance(dataQ);
      localStorage.setItem("attendancePicture", attendanceId);
      navigate(`/camps/${id}/campexecutionstart`);
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
            cameraUrl && (
              <Alert status="success">
                <HStack alignItems="center" space="2">
                  <Alert.Icon />
                  <FrontEndTypo.H4>{t("ATTENDANCE_SUCCESS")}</FrontEndTypo.H4>
                </HStack>
              </Alert>
            )
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
          width={"380px"}
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
            ></ImageView>

            <FrontEndTypo.H2
              marginTop={"15px"}
              textAlign="center"
              fontSize="16px"
              fontWeight="bold"
            >
              {t("You're welcome! Are you ready for your dream to come true?")}
            </FrontEndTypo.H2>
          </VStack>
        </Box>
        <VStack alignItems="center" space="5">
          <FrontEndTypo.H1 color="textMaroonColor.400" pl="1">
            {t("Will the camp be conducted today?")}
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
          <FrontEndTypo.H3>{t("STARTS_YOUR_DAY")}</FrontEndTypo.H3>
          <VStack space="4">
            <FrontEndTypo.Primarybutton onPress={(e) => setStart(true)}>
              {t("Yes, Absolutely ")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              onPress={(e) => navigate(`/camps/${id}/campotherplans`)}
            >
              {t("No, I have other plans for today.")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
