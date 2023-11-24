import {
  campService,
  FrontEndTypo,
  Layout,
  Loading,
  Camera,
  uploadRegistryService,
  ImageView,
  useLocationData,
} from "@shiksha/common-lib";
import Chip from "component/Chip";
import moment from "moment";
import { HStack, Pressable, VStack, Alert, Text } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function CampExecutionStart({ footerLinks }) {
  const { t } = useTranslation();
  const [camp, setCamp] = React.useState();
  const { id } = useParams();
  const [error, setError] = React.useState();
  const [data, setData] = React.useState({});
  const [facilitator, setFacilitator] = React.useState();
  const [start, setStart] = React.useState(false);
  const [cameraFile, setCameraFile] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [timer, setTimer] = React.useState();
  const [activeChip, setActiveChip] = React.useState(null);

  const navigate = useNavigate();
  const [latData, longData, errors] = useLocationData() || [];

  React.useEffect(async () => {
    const result = await campService.getCampDetails({ id });
    setCamp(result?.data || {});
    setFacilitator(result?.data?.faciltator?.[0] || {});
    setLoading(false);
  }, [id]);

  React.useEffect(async () => {
    if (errors) {
      setError(errors);
    } else {
      setData({ ...data, lat: `${latData}`, long: `${longData}` });
    }
  }, [latData]);

  // start Camp
  const startCamp = () => {
    try {
      localStorage.setItem("startCamp", moment());
      uploadAttendencePicture();
      setCameraUrl();
      setStart(false);
    } catch (e) {}
  };

  //   // endCamp
  //   const endCamp = () => {
  //     localStorage.removeItem("startCamp");
  //     setTimer({
  //       h: 0,
  //       m: 0,
  //       s: 0,
  //       cs: 0,
  //     });
  //   };

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

  const pdata = [
    "COURAGEOUS",
    "CREATIVE",
    "FEEL_GOOD",
    "ASPIRATIONS",
    "CARING",
    "COLLABORATION",
  ];

  const handleChipClick = (item) => {
    setActiveChip(item);
    console.log("Clicked on chip:", item);
  };

  return (
    <Layout
      _appBar={{ name: t("CAMP_EXECUTION") }}
      loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack py={6} px={4} mb={5} space="6">
        <FrontEndTypo.H2 color={"textMaroonColor.400"}>
          {t("LEARNER_ENVIRONMENT")}
        </FrontEndTypo.H2>

        <HStack justifyContent={"center"} flexWrap={"wrap"}>
          {pdata.map((item) => {
            return (
              <VStack
                space={4}
                my={2}
                mx={3}
                alignItems={"center"}
                key={item}
                width={"40%"}
              >
                <ImageView
                  w={"150"}
                  h={"150"}
                  borderRadius="0"
                  source={{
                    document_id: localStorage.getItem("attendancePicture"),
                  }}
                  _image={{ rounded: 0 }}
                />
                <Pressable onPress={() => handleChipClick(item)}>
                  <Chip width="150px" isActive={activeChip === item}>
                    <Text textAlign={"center"} fontSize={"12px"}>
                      {t(item)}
                    </Text>
                  </Chip>
                </Pressable>
              </VStack>
            );
          })}
        </HStack>
        <FrontEndTypo.Secondarybutton onPress={(e) => setStart(true)}>
          {t("TAKE_ANOTHER_PHOTO")}
        </FrontEndTypo.Secondarybutton>
        <FrontEndTypo.Primarybutton
          onPress={() => navigate(`/camps/${id}/campexecutionend`)}
        >
          {t("START_CAMP")}
        </FrontEndTypo.Primarybutton>
      </VStack>
    </Layout>
  );
}
