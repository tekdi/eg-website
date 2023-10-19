import React from "react";
import {
  Actionsheet,
  Alert,
  Avatar,
  Box,
  HStack,
  Pressable,
  Stack,
  VStack,
} from "native-base";
import {
  Layout,
  FrontEndTypo,
  AdminTypo,
  ImageView,
  IconByName,
  CampService,
  ConsentService,
  BodyMedium,
  Camera,
  Loading,
  uploadRegistryService,
  eventService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileUpload } from "component/BaseInput";

// App
export default function ConsentForm() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [uploadData, setUploadData] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [groupUsers, setGroupUsers] = React.useState();
  const [consents, setConsents] = React.useState();
  const [cameraModal, setCameraModal] = React.useState(false);
  const [cameraUrl, setCameraUrl] = React.useState();
  const [userData, setUserData] = React.useState({});
  const [error, setError] = React.useState("");
  const [cameraFile, setcameraFile] = React.useState();

  React.useEffect(async () => {
    const result = await CampService.getCampDetails({ id });
    const campConsent = await CampService.CampAttendance({ id });
    if (Object.keys(campConsent?.data).length === 0) {
      setConsents([]);
    } else {
      setConsents(campConsent?.data);
    }
    setGroupUsers(result?.data?.group_users);
    setLoading(false);
  }, [consents]);

  const onPressBackButton = async () => {
    navigate(`/camps/${id}`);
  };

  // update schema

  const onClickSubmit = () => {
    navigate(`/camps/${id}`);
  };

  const handleUpload = async (data) => {
    await ConsentService.createConsent(data);
    setUploadData();
    // api call
  };

  // Camera MOdule

  const uploadAttendencePicture = async (e) => {
    setError("");
    if (cameraFile?.key) {
      const apiResponse = await CampService.markCampAttendance({
        context: "camp",
        context_id: id,
        user_id: userData?.id,
        status: "present",
        photo_1: cameraFile ? cameraFile?.key : "",
      });
    } else {
      setError("Capture Picture First");
    }
    const coruntIndex = groupUsers.findIndex(
      (item) => item?.id === userData?.id
    );
    if (groupUsers[coruntIndex + 1]) {
      setCameraUrl();
      setUserData({ ...groupUsers[coruntIndex + 1], index: coruntIndex + 1 });
    }
  };

  const updateUserData = async () => {
    if (cameraFile?.key) {
      const apiResponse = await CampService.markCampAttendance({
        context: "camp",
        context_id: id,
        user_id: userData?.id,
        status: "present",
        photo_1: cameraFile ? cameraFile?.key : "",
      });
    } else {
      setError("Capture Picture First");
    }
  };

  if (userData?.id) {
    return (
      <Box>
        {
          <React.Suspense fallback={<Loading />}>
            <Camera
              headerComponent={
                <VStack bg="black" width="94%" pl="4">
                  {/* <AdminTypo.H6 color="white" bold>
                    {t("MARK_ATTENDANCE_ORIENTATION")}
                  </AdminTypo.H6>
                  <HStack direction={["row", "row", "row"]}>
                    <AdminTypo.H6 color="white" bold flex="0.3">
                      {t("PRESENT")} :
                      {users.filter((e) => e.status === "present").length}
                    </AdminTypo.H6>
                    <AdminTypo.H6 color="white" bold flex="0.3">
                      {t("ABSENT")} :
                      {users.filter((e) => e.status !== "present").length}
                    </AdminTypo.H6>
                  </HStack> */}
                  <HStack direction={["row", "row", "row"]}>
                    <AdminTypo.H6 color="white">
                      {t("CANDIDATES_NAME")}{" "}
                      {
                        userData?.program_beneficiaries[0]
                          ?.enrollment_first_name
                      }
                    </AdminTypo.H6>
                  </HStack>
                  <HStack>
                    <AdminTypo.H6
                      color="white"
                      direction={["row", "row", "row"]}
                    >
                      {t("CANDIDATES")} -{" "}
                      {groupUsers?.length ? groupUsers?.length : 0}
                    </AdminTypo.H6>
                  </HStack>
                  <Stack>
                    <AdminTypo.H6 my="2" color="white">
                      {t("ATTENDANCE_CAMERA_SUBTITLE")}
                    </AdminTypo.H6>
                  </Stack>
                </VStack>
              }
              footerComponent={
                <HStack space={3} width="100%" justifyContent="space-between">
                  {error && (
                    <AdminTypo.H4 style={{ color: "red" }}>
                      {error}
                    </AdminTypo.H4>
                  )}
                  <AdminTypo.Secondarybutton
                    shadow="BlueOutlineShadow"
                    onPress={() => {
                      updateUserData();
                      cameraFile ? setUserData() : error;
                      setcameraFile("");
                      setCameraUrl();
                    }}
                  >
                    {t("FINISH")}
                  </AdminTypo.Secondarybutton>
                  <AdminTypo.Secondarybutton
                    isDisabled={userData?.index + 1 === groupUsers.length}
                    variant="secondary"
                    ml="4"
                    px="5"
                    onPress={() => {
                      cameraFile ? uploadAttendencePicture() : error;
                    }}
                  >
                    {t("NEXT")}
                  </AdminTypo.Secondarybutton>
                </HStack>
              }
              {...{
                cameraModal,
                setCameraModal: async (item) => {
                  setUserData();
                  setCameraModal(item);
                },
                cameraUrl,
                setCameraUrl: async (url, file) => {
                  if (file) {
                    setError("");
                    let formData = new FormData();
                    formData.append("file", file);
                    const uploadDoc = await uploadRegistryService.uploadPicture(
                      formData
                    );
                    if (uploadDoc) {
                      setcameraFile(uploadDoc);
                    }
                    setCameraUrl({ url, file });
                  } else {
                    setUserData();
                  }
                },
              }}
            />
          </React.Suspense>
        }
      </Box>
    );
  }

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("ATTENDANCE"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
    >
      <Box py={6} px={4} mb={5}>
        <AdminTypo.H3 color={"textMaroonColor.400"}>
          {t("ATTENDANCE")}
        </AdminTypo.H3>

        {groupUsers?.map((item) => {
          const document = consents?.find((e) => e.user?.id === item?.id);
          return (
            <HStack
              key={item}
              bg="white"
              p="2"
              my={2}
              shadow="FooterShadow"
              rounded="sm"
              space="1"
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <HStack justifyContent="space-between" width={"40%"} space={4}>
                <HStack alignItems="Center" flex="5">
                  {item?.profile_photo_1?.id ? (
                    <ImageView
                      source={{
                        uri: item?.profile_photo_1?.name,
                      }}
                      // alt="Alternate Text"
                      width={"45px"}
                      height={"45px"}
                    />
                  ) : (
                    <IconByName
                      isDisabled
                      name="AccountCircleLineIcon"
                      color="gray.300"
                      _icon={{ size: "51px" }}
                    />
                  )}

                  <VStack
                    pl="2"
                    flex="1"
                    wordWrap="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    <FrontEndTypo.H3 bold color="textGreyColor.800">
                      {item?.program_beneficiaries[0]?.enrollment_first_name}
                      {item?.program_beneficiaries[0]?.enrollment_middle_name &&
                        ` ${item?.program_beneficiaries[0]?.enrollment_middle_name}`}
                      {item?.program_beneficiaries[0]?.enrollment_last_name &&
                        ` ${item?.program_beneficiaries[0]?.enrollment_last_name}`}
                    </FrontEndTypo.H3>
                  </VStack>
                </HStack>
              </HStack>

              <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                {document?.status ? (
                  document?.status === "present" ? (
                    <HStack space={2}>
                      <Avatar bg="green.300" size={["15px", "30px"]} />
                      <FrontEndTypo.H2>{t("PRESENT")}</FrontEndTypo.H2>
                    </HStack>
                  ) : (
                    <HStack space={2}>
                      <Avatar bg="amber.300" size={["15px", "30px"]} />
                      <FrontEndTypo.H2>{t("ABSENT")}</FrontEndTypo.H2>
                    </HStack>
                  )
                ) : (
                  <HStack alignItems={"center"} space={2}>
                    <Avatar bg="gray.300" size={["15px", "30px"]} />
                    <FrontEndTypo.H2>{t("PENDING")}</FrontEndTypo.H2>
                  </HStack>
                )}
              </HStack>
              <HStack width={"10%"}>
                {document?.status !== "present" && (
                  <Pressable
                    onPress={(e) => {
                      setUserData(item);
                      setCameraModal(true);
                    }}
                  >
                    <IconByName
                      isDisabled
                      name="CameraLineIcon"
                      color="blueText.450"
                      _icon={{ size: "25px" }}
                    />
                  </Pressable>
                )}
              </HStack>
            </HStack>
          );
        })}

        {/* <HStack space={4} alignItems={"center"}>
          <Alert
            status="warning"
            alignItems={"start"}
            mb="3"
            mt="4"
            width={"100%"}
          >
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <BodyMedium>{t("CONSENT_DISCLAIMER")}</BodyMedium>
            </HStack>
          </Alert>
        </HStack> */}
        {/* <FrontEndTypo.Primarybutton
          isLoading={loading}
          p="4"
          mt="4"
          onPress={() => onClickSubmit()}
        >
          {t("SAVE")}
        </FrontEndTypo.Primarybutton> */}
      </Box>

      {/* <Actionsheet isOpen={uploadData?.user_id}>
        <Actionsheet.Content alignItems={"left"}>
          <HStack justifyContent={"space-between"} alignItems="strat">
            <FrontEndTypo.H1 color="textGreyColor.800" p="2">
              {t("UPLOAD_CONSENT_FORM")}
            </FrontEndTypo.H1>
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setUploadData()}
            />
          </HStack>
        </Actionsheet.Content>
        <VStack bg="white" width={"100%"} space="5" p="5">
          <FileUpload
            schema={{
              label: "UPLOAD_CONSENT_FORM",
              document_type: "camp",
              document_sub_type: "consent_form",
            }}
            value={uploadData?.document_id}
            onChange={(e) => setUploadData({ ...uploadData, document_id: e })}
          />
          <FrontEndTypo.Primarybutton onPress={(e) => handleUpload(uploadData)}>
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
        </VStack>
      </Actionsheet> */}
    </Layout>
  );
}
