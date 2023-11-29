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
} from "@shiksha/common-lib";
import Chip from "component/Chip";
import moment from "moment";
import {
  HStack,
  Pressable,
  VStack,
  Alert,
  Text,
  Image,
  Box,
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function CampExecutionStart({ footerLinks }) {
  const { t } = useTranslation();
  const [camp, setCamp] = React.useState();
  const { id } = useParams();
  const location = useLocation();
  const { activityId } = useParams();
  const [error, setError] = React.useState();
  const [data, setData] = React.useState({});
  const [facilitator, setFacilitator] = React.useState();
  const [start, setStart] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  const [cameraFile, setCameraFile] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [activeChip, setActiveChip] = React.useState(null);
  const [groupUsers, setGroupUsers] = React.useState();
  const [page, setPage] = React.useState(location?.state || "");
  const [moodList, setMoodList] = React.useState();
  const navigate = useNavigate();
  const [latData, longData] = useLocationData() || [];

  React.useEffect(async () => {
    setLoading(true);
    const incompleteData = await campService.getcampstatus({ id });
    const incompleteDate = moment(incompleteData?.data?.start_date).format(
      "YYYY-MM-DD"
    );
    const obj = {
      id: id,
      start_date: incompleteDate || moment(new Date()).format("YYYY-MM-DD"),
    };
    const result = await campService.getCampDetails({ id });
    setCamp(result?.data || {});
    setFacilitator(result?.data?.faciltator?.[0] || {});
    const resultAttendance = await campService.CampAttendance({ id });
    const todaysActivity = await campService.getActivity(obj);
    let attendances = [];
    if (resultAttendance?.data?.length > 0) {
      attendances = resultAttendance?.data;
    }

    if (
      resultAttendance?.data?.length > 0 &&
      todaysActivity?.data?.camp_days_activities_tracker?.[0]?.misc_activities
    ) {
      setDisable(false);
    }
    result?.data?.faciltator?.map((item, index) => {
      let attendance = attendances.find((e) => e?.user?.id === item.id);
      setGroupUsers(attendance);
    });

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
      localStorage.setItem("startCamp", moment());
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
    const attendanceId = cameraFile?.data?.insert_documents?.returning?.[0]?.id;
    if (photo_1) {
      const dataQ = {
        ...data,
        id: groupUsers?.id,
        context_id: activityId,
        user_id: facilitator?.id,
        status: "present",
        reason: "camp_started",
        photo_1: `${photo_1}`,
      };
      await campService.updateCampAttendance(dataQ);
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
        onlyIconsShow: ["langBtn", "userInfo", "backBtn"],
      }}
      loading={loading}
      _footer={{ menues: page !== "campInprogress" ? footerLinks : [] }}
    >
      {page == "campInprogress" ? (
        <CampExecutionEnd
          disable={disable}
          facilitator={facilitator}
          activityId={activityId}
        />
      ) : (
        <VStack py={6} px={4} mb={5} space="6">
          <FrontEndTypo.H2 color={"textMaroonColor.400"}>
            {t("LEARNER_ENVIRONMENT")}
          </FrontEndTypo.H2>

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
                  <Image
                    w={"150"}
                    h={"150"}
                    borderRadius="0"
                    source={{
                      uri: `${item?.img}`,
                    }}
                    alt="airoplane.gif"
                  />
                  <Pressable onPress={() => handleChipClick(item?.value)}>
                    <Chip width="150px" isActive={activeChip === item?.value}>
                      <Text textAlign={"center"} fontSize={"12px"}>
                        {t(item?.title)}
                      </Text>
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

const CampExecutionEnd = ({ disable, activityId, facilitator }) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const navigate = useNavigate();

  const endCamp = async () => {
    const obj = {
      id: activityId,
      edit_page_type: "edit_end_date",
    };
    await campService.addMoodActivity(obj);
    navigate(`/camps/${id}/campexecution`);
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
          ></ImageView>
          <FrontEndTypo.H2
            marginTop={"15px"}
            textAlign="center"
            fontSize="16px"
            fontWeight="bold"
          >
            {t("LETS_START_TODAYS_CAMP")}
          </FrontEndTypo.H2>
        </VStack>
      </Box>
      <Alert status="warning">
        <HStack alignItems={"center"} space={2}>
          <Alert.Icon />
          <FrontEndTypo.H3>{t("DONT_CLOSE_SCREEN")}</FrontEndTypo.H3>
        </HStack>
      </Alert>
      <HStack space={4} alignSelf={"center"}>
        <FrontEndTypo.Secondarybutton
          onPress={() => navigate(`/camps/${id}/attendance`)}
        >
          {t("ATTENDANCE")}
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

