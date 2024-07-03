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
  enumRegistryService,
  CustomAlert,
} from "@shiksha/common-lib";
import Chip from "component/Chip";
import moment from "moment";
import {
  Box,
  HStack,
  VStack,
  Alert,
  Image,
  Stack,
  Pressable,
  Spinner,
  Progress,
} from "native-base";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import CampExecutionEnd from "./CampExecutionEnd";
import CampAttendance from "./CampAttendance";
import CampTodayActivities from "./CampTodayActivities";

export default function CampExecution({
  footerLinks,
  userTokenInfo,
  setAlert,
}) {
  const { t } = useTranslation();
  const { id, step } = useParams();
  const [error, setError] = useState();
  const [data, setData] = useState({});
  const [facilitator, setFacilitator] = useState();
  const [start, setStart] = useState(false);
  const [cameraFile, setCameraFile] = useState();
  const [cameraUrl, setCameraUrl] = useState();
  const [activityId, setActivityId] = useState();
  const [todaysActivity, setTodaysActivity] = useState();
  const navigate = useNavigate();
  const [latData, longData] = useLocationData() || [];
  const [loading, setLoading] = useState(true);
  const [learnerCount, setLearnerCount] = useState();
  const [moodList, setMoodList] = useState();
  const [activeChip, setActiveChip] = useState(null);
  const [page, setPage] = useState("");
  const [progress, setProgress] = useState(0);
  const [campDetail, setCampDetail] = useState({});
  const [campType, setCampType] = useState("");

  const campDetails = useCallback(async () => {
    if (!["attendance"].includes(step)) {
      const result = await campService.getCampDetails({ id });
      setCampDetail(result?.data);
      setFacilitator(userTokenInfo?.authUser || {});
      setLearnerCount(result?.data?.group_users?.length);
      setCampType(result?.data);
    }
    const obj = {
      id: id,
      start_date: moment(new Date()).format("YYYY-MM-DD"),
    };
    const data = await campService.getActivity(obj);
    const activity = data?.data?.camp_days_activities_tracker;
    setTodaysActivity(activity?.[0] || {});
    setActivityId(activity?.[0]?.id);
    setLoading(false);
  }, [navigate, setTodaysActivity]);

  useEffect(() => {
    campDetails();
  }, [campDetails]);

  const enumData = useCallback(async () => {
    if (cameraFile && cameraUrl?.url) {
      const listOfEnum = await enumRegistryService.listOfEnum();
      const newMoodList = listOfEnum?.data?.FACILITATOR_MOOD_LIST;
      const images = [
        "/./smiley_1.png",
        "/./smiley_2.png",
        "/./smiley_3.png",
        "/./smiley_4.png",
        "/./smiley_5.png",
        "/./smiley_6.png",
      ];
      const moodListWithImages = newMoodList?.map((mood, index) => ({
        ...mood,
        img: images[index % images?.length],
      }));
      setMoodList(moodListWithImages);
    }
  }, [cameraFile, cameraUrl]);

  useEffect(async () => {
    enumData();
  }, [enumData]);

  const handleChipClick = useCallback(
    (item) => {
      setActiveChip(item);
    },
    [setActiveChip]
  );

  useEffect(() => {
    setData({ ...data, lat: `${latData}`, long: `${longData}` });
  }, [latData]);

  const startCamp = useCallback(async () => {
    setLoading(true);
    if (activeChip && cameraFile) {
      const payLoad = {
        camp_id: id,
        camp_day_happening: "yes",
        mood: activeChip,
        ...data,
        photo_1: `${cameraFile}`,
        camp_type: campType?.type,
      };
      const result = await campService.campActivity(payLoad);
      const activitiesData = result?.insert_camp_days_activities_tracker_one;
      setActivityId(activitiesData?.id);
      setTodaysActivity(activitiesData);
      setCameraFile();
      setCameraUrl();
    } else {
      setError("SELECT_MESSAGE");
    }
    setLoading(false);
  }, [activeChip, id, setLoading, setTodaysActivity]);

  // start Camp
  const closeCamera = useCallback(() => {
    try {
      setStart(false);
    } catch (e) {}
  }, [setStart]);

  const campBegin = useCallback(() => {
    setStart(true);
  }, [setStart]);

  // uploadAttendencePicture from start camp
  // const uploadAttendencePicture = async (activitiesId) => {
  //   if (cameraFile) {
  //     const dataQ = {
  //       ...data,
  //       context_id: activitiesId,
  //       user_id: facilitator?.id,
  //       status: "present",
  //       reason: "camp_started",
  //       photo_1: `${cameraFile}`,
  //     };
  //     await campService.markCampAttendance(dataQ);
  //     setCameraFile();
  //   } else {
  //     setError("Capture Picture First");
  //   }
  //   setCameraUrl();
  // };

  const getAccess = useCallback(async () => {
    if (
      todaysActivity?.camp_day_happening === "no" ||
      todaysActivity?.end_date !== null ||
      !todaysActivity.id
    ) {
    } else if (["attendance", "activities"].includes(step)) {
      setPage(step);
    } else if (todaysActivity?.end_date === null) {
      setPage("endcamp");
    }
  }, [step, todaysActivity, setPage]);

  useEffect(() => {
    getAccess();
  }, [getAccess]);

  const airplaneImageUri = useMemo(() => "/airoplane.png", []);

  if (start && data?.lat && data?.long && !loading) {
    return (
      <Suspense fallback={<Loading />}>
        <Layout _footer={{ menues: footerLinks }}>
          <VStack p={4} space={3}>
            <FrontEndTypo.H1>{t("MARK_ATTENDANCE")}</FrontEndTypo.H1>
            <FrontEndTypo.H4 bold color="textGreyColor.750">{`${t(
              "CAMP_ID"
            )} : ${campDetail?.id}`}</FrontEndTypo.H4>
            <Camera
              messageComponent={
                <VStack>
                  <FrontEndTypo.H3 color="white" textAlign="center">
                    {t("ATTENDANCE_PHOTO_MSG")}
                  </FrontEndTypo.H3>
                </VStack>
              }
              loading={
                progress && (
                  <VStack space={4} justifyContent="center" p="4">
                    <Spinner
                      color={"primary.500"}
                      accessibilityLabel="Loading posts"
                      size="lg"
                    />
                    <Progress value={progress} colorScheme="red" />
                    <FrontEndTypo.H3 textAlign="center" color="white">
                      {progress}%
                    </FrontEndTypo.H3>
                  </VStack>
                )
              }
              {...{
                onFinish: (e) => closeCamera(),
                cameraModal: start,
                setCameraModal: (e) => {
                  setCameraUrl();
                  setStart(e);
                },
                cameraUrl,
                filePreFix: `camp_prerak_attendace_user_id_${facilitator?.id}_`,
                setCameraUrl: async (url, file) => {
                  setProgress(0);
                  if (file) {
                    setError("");
                    let formData = new FormData();
                    formData.append("user_id", facilitator?.id);
                    formData.append("document_type", "camp_attendance");
                    formData.append("file", file);
                    const uploadDoc = await uploadRegistryService.uploadFile(
                      formData,
                      {},
                      (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        let percent = Math.floor((loaded * 100) / total);
                        setProgress(percent);
                      }
                    );
                    if (
                      uploadDoc?.data?.insert_documents?.returning?.[0]?.name
                    ) {
                      setCameraFile(
                        uploadDoc?.data?.insert_documents?.returning?.[0]?.name
                      );
                    }
                    setCameraUrl({ url, file });
                  } else {
                    setCameraUrl();
                  }
                },
                cameraSide: true,
              }}
            />
          </VStack>
        </Layout>
      </Suspense>
    );
  }
  if (cameraFile) {
    return (
      <Suspense fallback={<Loading />}>
        <Layout
          _appBar={{
            name: t("CAMP_EXECUTION"),
            onPressBackButton: () => navigate("/camps"),
          }}
          facilitator={facilitator}
          loading={loading}
          // _footer={{ menues: footerLinks }}
          analyticsPageTitle={"CAMP_EXECUTION"}
          pageTitle={t("CAMP_EXECUTION")}
          stepTitle={`${
            campType === "main" ? t("MAIN_CAMP") : t("PCR_CAMP")
          }/${t("CAMP_EXECUTION")}`}
        >
          <VStack py={6} px={4} mb={5} space="6">
            <FrontEndTypo.H2>{t("MARK_ATTENDANCE")}</FrontEndTypo.H2>
            <FrontEndTypo.H4 bold color="textGreyColor.750">{`${t(
              "CAMP_ID"
            )} : ${campDetail?.id}`}</FrontEndTypo.H4>
            <HStack justifyContent={"center"} flexWrap={"wrap"}>
              <ImageView
                urlObject={{ fileUrl: cameraUrl?.url }}
                alt={`Alternate`}
                width={"190px"}
                height={"190px"}
                borderRadius="0"
                _image={{ borderRadius: 0 }}
              />
            </HStack>
            <FrontEndTypo.H4 bold color="textGreyColor.750">
              {t("LEARNER_ENVIRONMENT")}
            </FrontEndTypo.H4>
            <HStack justifyContent={"center"} flexWrap={"wrap"}>
              {moodList?.map((item) => {
                return (
                  <VStack
                    space={4}
                    my={2}
                    mx={3}
                    alignItems={"center"}
                    key={item}
                    width={"42%"}
                    borderColor="btnGray.100"
                    borderRadius="10px"
                    borderWidth="1px"
                    shadow="AlertShadow"
                    bg={activeChip === item?.value && "#E0E0FF"}
                  >
                    <Pressable
                      isActive={activeChip === item?.value}
                      onPress={() => handleChipClick(item?.value)}
                    >
                      <Image
                        w={"120"}
                        h={"120"}
                        borderRadius="0"
                        source={{
                          uri: `${item?.img}`,
                        }}
                        alt="airoplane.png"
                      />
                      <FrontEndTypo.H5
                        bold
                        color={"textGreyColor.750"}
                        textAlign={"center"}
                        fontSize={"12px"}
                      >
                        {t(item?.title)}
                      </FrontEndTypo.H5>
                    </Pressable>
                  </VStack>
                );
              })}
            </HStack>
            {error && (
              <CustomAlert status={"warning"} title={t("SELECT_MESSAGE")} />
            )}
            <FrontEndTypo.Primarybutton onPress={startCamp}>
              {t("START_CAMP")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              onPress={(e) => {
                setCameraFile();
                setCameraUrl();
                setStart(true);
                setProgress(0);
              }}
            >
              {t("TAKE_ANOTHER_PHOTO")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
        </Layout>
      </Suspense>
    );
  } else if (page === "endcamp") {
    return (
      <Suspense fallback={<Loading />}>
        <CampExecutionEnd
          {...{
            learnerCount,
            todaysActivity,
            userTokenInfo,
            campType,
            facilitator,
          }}
        />
      </Suspense>
    );
  } else if (page === "attendance") {
    return (
      <Suspense fallback={<Loading />}>
        <CampAttendance
          activityId={activityId}
          campType={campType}
          facilitator={facilitator}
        />
      </Suspense>
    );
  } else if (page === "activities") {
    return (
      <Suspense fallback={<Loading />}>
        <CampTodayActivities
          userTokenInfo={userTokenInfo}
          campType={campType}
          footerLinks={footerLinks}
          setAlert={setAlert}
          activityId={activityId}
        />
      </Suspense>
    );
  }

  const currectDate = moment().format("D MMMM, YYYY");
  return (
    <Layout
      _appBar={{
        name: t("CAMP_EXECUTION"),
        onPressBackButton: () => navigate("/camps"),
      }}
      loading={loading}
      _footer={{ menues: footerLinks }}
      facilitator={facilitator}
      analyticsPageTitle={"CAMP"}
      pageTitle={t("CAMP_EXECUTION")}
      stepTitle={`${campType === "main" ? t("MAIN_CAMP") : t("PCR_CAMP")}/${t(
        "CAMP_EXECUTION"
      )}`}
    >
      {!todaysActivity?.id ? (
        <VStack space="5" p="5">
          <FrontEndTypo.H2>{t("CAMP_EXECUTION")}</FrontEndTypo.H2>
          <HStack justifyContent={"space-between"}>
            <FrontEndTypo.H3 bold color="textGreyColor.750">
              {`${t("CAMP_ID")}: ${campDetail?.id}`}
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
              {/* <CardComponent
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
              </CardComponent> */}
            </VStack>
          </Box>
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
            <VStack
              space="4"
              borderColor="btnGray.100"
              borderRadius="10px"
              borderWidth="1px"
              padding="4"
              shadow="AlertShadow"
            >
              <Stack space={4}>
                <VStack>
                  <FrontEndTypo.H3>
                    {t("WILL_THE_CAMP_BE_CONDUCTED_TODAY")}
                  </FrontEndTypo.H3>
                  <FrontEndTypo.H4 color="grayTitleCard">{`${t(
                    "DATE"
                  )} : ${currectDate}`}</FrontEndTypo.H4>
                </VStack>
                <FrontEndTypo.Primarybutton onPress={campBegin}>
                  {t("YES_ABSOLUTELY")}
                </FrontEndTypo.Primarybutton>
                <FrontEndTypo.Secondarybutton
                  onPress={(e) => navigate(`/camps/${id}/campotherplans`)}
                >
                  {t("NO_PLAN")}
                </FrontEndTypo.Secondarybutton>
              </Stack>
            </VStack>
          </VStack>
        </VStack>
      ) : (
        <Stack space="3" p="5">
          <CustomAlert
            status={"warning"}
            title={t(
              todaysActivity?.camp_day_happening === "no"
                ? "CAMP_LEAVE"
                : "TODAYS_CAMP_HAS_BEEN_COMPLETED"
            )}
          />
          <FrontEndTypo.Primarybutton onPress={(e) => navigate(`/camps`)}>
            {t("GO_TO_PROFILE")}
          </FrontEndTypo.Primarybutton>
        </Stack>
      )}
    </Layout>
  );
}
