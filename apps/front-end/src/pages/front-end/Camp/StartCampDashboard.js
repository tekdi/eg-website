import {
  campService,
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  GeoLocation,
  Alert,
  Loading,
  Camera,
  uploadRegistryService,
  ImageView,
} from "@shiksha/common-lib";
import moment from "moment";
import { Box, HStack, Pressable, Progress, Stack, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function StartCampDashboard({ footerLinks }) {
  const { t } = useTranslation();
  const [camp, setCamp] = React.useState();
  const { id } = useParams();
  const [error, setError] = React.useState();
  const [data, setData] = React.useState({});
  const [facilitator, setFacilitator] = React.useState();
  const [start, setStart] = React.useState(false);
  const [cameraFile, setcameraFile] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [timer, setTimer] = React.useState();
  const navigate = useNavigate();

  React.useEffect(async () => {
    const result = await campService.getCampDetails({ id });
    setCamp(result?.data || {});
    setFacilitator(result?.data?.faciltator?.[0] || {});
  }, [id]);

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
    const photo_1 = cameraFile?.data?.insert_documents?.returning?.[0]?.id;
    if (photo_1) {
      const dataQ = {
        ...data,
        context_id: id,
        user_id: facilitator?.id,
        status: "present",
        photo_1: `${photo_1}`,
      };
      await campService.markCampAttendance(dataQ);
    } else {
      setError("Capture Picture First");
    }
    setCameraUrl();
  };

  if (start && data?.lat && data?.long) {
    return (
      <React.Suspense fallback={<Loading />}>
        <Camera
          // webcamOver={
          //   <VStack bg="transparent">
          //     <IconByName
          //       _icon={{ color: "white" }}
          //       left="0"
          //       position={"absolute"}
          //     />
          //     <IconByName
          //       _icon={{ color: "white" }}
          //       righ="0"
          //       position={"absolute"}
          //     />
          //     <IconByName
          //       _icon={{ color: "white" }}
          //       top="0"
          //       position={"absolute"}
          //     />
          //     <IconByName
          //       _icon={{ color: "white" }}
          //       botam="0"
          //       position={"absolute"}
          //     />
          //   </VStack>
          // }
          // footerComponent={
          //   <HStack space={3} width="100%" justifyContent="space-between">
          //     {error && (
          //       <FrontEndTypo.H4 style={{ color: "red" }}>{error}</FrontEndTypo.H4>
          //     )}
          //     <FrontEndTypo.Secondarybutton
          //       shadow="BlueOutlineShadow"
          //       onPress={() => {
          //         setcameraFile("");
          //         setCameraUrl();
          //       }}
          //     >
          //       {t("RETRY")}
          //     </FrontEndTypo.Secondarybutton>
          //     <FrontEndTypo.Secondarybutton
          //       // isDisabled={userData?.index + 1 === users.length}
          //       variant="secondary"
          //       ml="4"
          //       px="5"
          //       onPress={() => {
          //         cameraFile && uploadAttendencePicture();
          //       }}
          //     >
          //       {t("SUBMIT")}
          //     </FrontEndTypo.Secondarybutton>
          //   </HStack>
          // }
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
                  setcameraFile(uploadDoc);
                }
                setCameraUrl({ url, file });
              } else {
                setCameraUrl();
              }
            },
          }}
        />
      </React.Suspense>
    );
  }

  return (
    <Layout
      _appBar={{ name: t("Attendance") }}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      {start && (
        <GeoLocation
          getLocation={(lat, long, error) => {
            if (error) {
              setError(error);
            } else {
              setData({ ...data, lat: `${lat}`, long: `${long}` });
            }
          }}
        />
      )}
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
            <ImageView
              urlObject={facilitator?.profile_photo_1 || {}}
              width="100"
              height="100"
            />
          </HStack>
        </Box>
        <VStack space="4">
          <Alert
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
          <FrontEndTypo.H3>Let's Starts your day!!</FrontEndTypo.H3>
          <CardComponent
            title={
              <HStack justifyContent={"space-around"} space="4" flex={1}>
                <FrontEndTypo.H5 bold>{"Preferred camp time"}</FrontEndTypo.H5>
                <FrontEndTypo.H5 bold>{"2:00 pm - 5:00 pm"}</FrontEndTypo.H5>
              </HStack>
            }
            _header={{ bg: "red.100", pb: 4 }}
            isHideDivider
          >
            <VStack space="8" pt="8">
              <HStack
                divider={
                  <Stack py="4" px="2">
                    :
                  </Stack>
                }
                alignSelf="center"
              >
                <CardComponent _body={{ p: 4, bg: "gray.200" }}>
                  {("0" + `${timer?.h || 0}`).slice(-2)}
                </CardComponent>
                <CardComponent _body={{ p: 4, bg: "gray.200" }}>
                  {("0" + `${timer?.m || 0}`).slice(-2)}
                </CardComponent>
                <CardComponent _body={{ p: 4, bg: "gray.200" }}>
                  {("0" + `${timer?.s || 0}`).slice(-2)}
                </CardComponent>
              </HStack>
              <Progress
                value={timer?.cs}
                size="md"
                colorScheme="primary"
                max={60 * 60 * 2}
              />
              {localStorage.getItem("startCamp") ? (
                <VStack space={4}>
                  <HStack space={4}>
                    <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
                      <Pressable
                        onPress={(e) => navigate(`/camps/${id}/activities`)}
                      >
                        <VStack alignItems="center" space={3}>
                          <IconByName
                            name="CalendarEventLineIcon"
                            color="gray.600"
                            bg="gray.300"
                            rounded="full"
                            p="5"
                          />
                          <FrontEndTypo.H5>Today's Activities</FrontEndTypo.H5>
                        </VStack>
                      </Pressable>
                    </CardComponent>
                    <CardComponent
                      _vstack={{ flex: 1, alignItems: "center" }}
                      _body={{ pt: 4 }}
                    >
                      <Pressable
                        onPress={(e) => navigate(`/camps/${id}/attendance`)}
                      >
                        <VStack alignItems="center" space={3}>
                          <IconByName
                            name="BookOpenLineIcon"
                            color="gray.600"
                            bg="gray.300"
                            rounded="full"
                            p="5"
                          />
                          <FrontEndTypo.H5 textAlign="center">
                            Learner Attendance
                          </FrontEndTypo.H5>
                        </VStack>
                      </Pressable>
                    </CardComponent>
                  </HStack>
                  <FrontEndTypo.Primarybutton onPress={(e) => endCamp()}>
                    End Camp
                  </FrontEndTypo.Primarybutton>
                </VStack>
              ) : (
                <VStack space="4">
                  <FrontEndTypo.Primarybutton onPress={(e) => setStart(true)}>
                    Start Camp
                  </FrontEndTypo.Primarybutton>
                  <FrontEndTypo.Secondarybutton>
                    Apply For Leave
                  </FrontEndTypo.Secondarybutton>
                </VStack>
              )}
            </VStack>
          </CardComponent>
        </VStack>
        <VStack pt="6" space="4">
          <FrontEndTypo.H3>Other Activites,</FrontEndTypo.H3>
          <HStack space="6">
            <Pressable onPress={(e) => navigate(`/camps/${id}/attendance`)}>
              <VStack alignItems="center" space={3}>
                <IconByName name="CalendarEventLineIcon" color="gray.400" />
                <FrontEndTypo.H5>View Attendance</FrontEndTypo.H5>
              </VStack>
            </Pressable>
            <Pressable
              onPress={(e) =>
                navigate(`/camps/${id}/edit_camp_selected_learners`)
              }
            >
              <VStack alignItems="center" space={3}>
                <IconByName name="UserAddLineIcon" color="gray.400" />
                <FrontEndTypo.H5>Add Learner</FrontEndTypo.H5>
              </VStack>
            </Pressable>
          </HStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
