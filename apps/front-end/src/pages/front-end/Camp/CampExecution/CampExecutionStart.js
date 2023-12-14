import {
  campService,
  FrontEndTypo,
  Layout,
  Loading,
  Camera,
  uploadRegistryService,
  useLocationData,
  enumRegistryService,
  ImageView,
  CardComponent,
} from "@shiksha/common-lib";
import Chip from "component/Chip";
import moment from "moment";
import { HStack, Pressable, VStack, Alert, Image, Box } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function CampExecutionStart({ footerLinks }) {
  const { t } = useTranslation();
  const [camp, setCamp] = React.useState();
  const { activityId, id } = useParams();
  const location = useLocation();
  const [error, setError] = React.useState();
  const [data, setData] = React.useState({});
  const [facilitator, setFacilitator] = React.useState();
  const [facilitatorAttendance, setFacilitatorAttendance] = React.useState();
  const [start, setStart] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  const [cameraFile, setCameraFile] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [activeChip, setActiveChip] = React.useState(null);
  const [page, setPage] = React.useState(location?.state || "");
  const [moodList, setMoodList] = React.useState();
  const navigate = useNavigate();
  const [latData, longData] = useLocationData() || [];

  React.useEffect(async () => {
    setLoading(true);
    let incompleteData = await campService.getcampstatus({ id });
    const today = moment();
    const startDateMoment = moment(incompleteData?.data?.start_date);
    if (startDateMoment.isSame(today, "day")) {
      setError("");
    } else if (startDateMoment.isBefore(today)) {
      setError("PLEASE_END_YESTERDAYS_CAMP");
    }
    let incompleteDate = moment(incompleteData?.data?.start_date).format(
      "YYYY-MM-DD"
    );
    const obj = {
      id: id,
      start_date: incompleteDate || moment(new Date()).format("YYYY-MM-DD"),
    };
    const result = await campService.getCampDetails({ id });
    setCamp(result?.data || {});
    const facilitatorData = result?.data?.faciltator?.[0] || {};
    setFacilitator(facilitatorData);
    const resultAttendance = await campService.CampAttendance({
      id: activityId,
    });
    const todaysActivity = await campService.getActivity(obj);
    let attendances = resultAttendance?.data || [];

    const session = await campService.getCampSessionsList({ id: id });
    const data = session?.data?.learning_lesson_plans_master || [];
    let sessionList = false;
    data.forEach((element) => {
      const currentDate = new Date();
      const createdAtDate = new Date(element?.session_tracks?.[0]?.created_at);
      if (currentDate.toDateString() === createdAtDate.toDateString()) {
        sessionList = true;
      }
    });

    const faciltatorAttendanceData = attendances?.find((item, index) => {
      return facilitatorData?.id === item?.user?.id;
    });

    if (
      attendances?.length > 1 &&
      faciltatorAttendanceData?.id &&
      (todaysActivity?.data?.camp_days_activities_tracker?.[0]
        ?.misc_activities ||
        sessionList)
    ) {
      setDisable(false);
    }

    if (!faciltatorAttendanceData?.id) {
      setStart(true);
    } else if (incompleteData?.data?.mood) {
      setFacilitatorAttendance(faciltatorAttendanceData);
      setPage("campInprogress");
    } else {
      setFacilitatorAttendance(faciltatorAttendanceData);
    }

    setLoading(false);
  }, [id]);

  const onPressBackButton = () => {
    if (page !== "campInprogress") {
      navigate(`/camps/${id}/campexecution`);
    }
  };

  const handleChipClick = (item) => {
    setActiveChip(item);
  };

  React.useEffect(async () => {
    const listOfEnum = await enumRegistryService.listOfEnum();
    const moodList = listOfEnum?.data?.FACILITATOR_MOOD_LIST;
    const images = [
      "/smiley_1.svg",
      "/smiley_2.svg",
      "/smiley_3.svg",
      "/smiley_4.svg",
      "/smiley_5.svg",
      "/smiley_6.svg",
    ];
    const moodListWithImages = moodList?.map((mood, index) => ({
      ...mood,
      img: images[index % images?.length],
    }));
    setMoodList(moodListWithImages);
  }, []);

  React.useEffect(async () => {
    setData({ ...data, lat: `${latData}`, long: `${longData}` });
  }, [latData]);

  // start Camp
  const startCamp = () => {
    try {
      uploadAttendencePicture();
      setCameraUrl();
      setStart(false);
    } catch (e) {}
  };

  const addMood = async () => {
    if (activeChip) {
      const payload = {
        id: activityId,
        edit_page_type: "edit_mood",
        mood: activeChip,
      };
      const data = await campService.addMoodActivity(payload);
      if (data) {
        setPage("campInprogress");
      }
    } else {
      setError("SELECT_MESSAGE");
    }
  };
  // uploadAttendencePicture from start camp
  const uploadAttendencePicture = async (e) => {
    setError("");
    const photo_1 = cameraFile?.data?.insert_documents?.returning?.[0]?.name;
    if (photo_1) {
      const dataQ = {
        ...data,
        context_id: activityId,
        user_id: facilitator?.id,
        status: "present",
        reason: "camp_started",
        photo_1: `${photo_1}`,
      };
      if (facilitatorAttendance?.id) {
        const result = await campService.updateCampAttendance({
          ...dataQ,
          id: facilitatorAttendance?.id,
        });
        if (result?.attendance?.id) {
          setFacilitatorAttendance({ ...result?.attendance, photo_1 });
        }
      } else {
        const result = await campService.markCampAttendance(dataQ);
        if (result?.attendance?.id) {
          setFacilitatorAttendance({ ...result?.attendance, photo_1 });
        }
      }
      // markCampAttendance
      navigate(`/camps/${id}/campexecutionstart/${activityId}`);
    } else {
      setError("Capture Picture First");
    }

    setCameraUrl();
  };

  if (start && data?.lat && data?.long && !loading) {
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
      _appBar={{
        name: t("CAMP_EXECUTION"),
        onPressBackButton,
        onlyIconsShow: ["langBtn", "userInfo", "loginBtn"],
      }}
      loading={loading}
      _footer={{ menues: page !== "campInprogress" ? footerLinks : [] }}
    >
      {page == "campInprogress" ? (
        <CampExecutionEnd
          setDisable={setDisable}
          disable={disable}
          facilitator={facilitator}
          activityId={activityId}
          error={error}
        />
      ) : (
        <VStack py={6} px={4} mb={5} space="6">
          <FrontEndTypo.H2 color={"textMaroonColor.400"}>
            {t("LEARNER_ENVIRONMENT")}
          </FrontEndTypo.H2>
          <HStack justifyContent={"center"} flexWrap={"wrap"}>
            {facilitatorAttendance?.photo_1 && (
              <ImageView
                source={{
                  uri: facilitatorAttendance?.photo_1,
                }}
                alt={`Alternate`}
                width={"190px"}
                height={"190px"}
                borderRadius="0"
                _image={{ borderRadius: 0 }}
              />
            )}
          </HStack>
          <HStack justifyContent={"center"} flexWrap={"wrap"}>
            {moodList?.map((item) => {
              return (
                <VStack
                  space={4}
                  my={2}
                  mx={3}
                  alignItems={"center"}
                  key={item}
                  width={"40%"}
                >
                  <Pressable onPress={() => handleChipClick(item?.value)}>
                    <Image
                      w={"150"}
                      h={"150"}
                      borderRadius="0"
                      source={{
                        uri: `${item?.img}`,
                      }}
                      alt="airoplane.gif"
                    />
                    <Chip width="150px" isActive={activeChip === item?.value}>
                      <FrontEndTypo.H4
                        color={activeChip === item?.value ? "white" : "black"}
                        textAlign={"center"}
                        fontSize={"12px"}
                      >
                        {t(item?.title)}
                      </FrontEndTypo.H4>
                    </Chip>
                  </Pressable>
                </VStack>
              );
            })}
          </HStack>
          {error && (
            <Alert status="warning">
              <HStack space={2}>
                <Alert.Icon />
                <FrontEndTypo.H3>{t("SELECT_MESSAGE")}</FrontEndTypo.H3>
              </HStack>
            </Alert>
          )}
          <FrontEndTypo.Secondarybutton onPress={(e) => setStart(true)}>
            {t("TAKE_ANOTHER_PHOTO")}
          </FrontEndTypo.Secondarybutton>
          <FrontEndTypo.Primarybutton onPress={addMood}>
            {t("START_CAMP")}
          </FrontEndTypo.Primarybutton>
        </VStack>
      )}
    </Layout>
  );
}

const CampExecutionEnd = ({
  disable,
  setDisable,
  activityId,
  facilitator,
  error,
}) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const navigate = useNavigate();

  const endCamp = async () => {
    setDisable(true);
    const obj = {
      id: activityId,
      edit_page_type: "edit_end_date",
    };
    await campService.addMoodActivity(obj);
    navigate(`/camps`);
  };

  return (
    <VStack py={6} px={4} mb={5} space="6">
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
      <HStack space={4} alignSelf={"center"}>
        <FrontEndTypo.Secondarybutton
          onPress={() => navigate(`/camps/${id}/attendance`)}
        >
          {t("LEARNER_ATTENDANCE")}
        </FrontEndTypo.Secondarybutton>
        <FrontEndTypo.Secondarybutton
          onPress={() => navigate(`/camps/${id}/activities`)}
        >
          {t("TODAYS_TASKS")}
        </FrontEndTypo.Secondarybutton>
      </HStack>
      <FrontEndTypo.Primarybutton isDisabled={disable} onPress={endCamp}>
        {t("END_CAMP")}
      </FrontEndTypo.Primarybutton>
    </VStack>
  );
};
