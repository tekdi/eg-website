import React from "react";
import { Box, HStack, VStack } from "native-base";
import {
  Layout,
  FrontEndTypo,
  AdminTypo,
  ImageView,
  IconByName,
  campService,
  Camera,
  Loading,
  uploadRegistryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// App
export default function ConsentForm() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [groupUsers, setGroupUsers] = React.useState();
  const [attendances, setAttendances] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [userData, setUserData] = React.useState({});
  const [error, setError] = React.useState("");
  const [cameraFile, setcameraFile] = React.useState();

  React.useEffect(async () => {
    const result = await campService.getCampDetails({ id });
    const resultAttendance = await campService.CampAttendance({ id });
    if (Object.keys(resultAttendance?.data).length === 0) {
      setAttendances([]);
    } else {
      setAttendances(resultAttendance?.data);
    }
    setGroupUsers(
      result?.data?.group_users.map((item, index) => ({ ...item, index }))
    );
    setLoading(false);
  }, [id]);

  // update schema

  // const onClickSubmit = () => {
  //   navigate(`/camps/${id}`);
  // };

  // Camera MOdule

  const uploadAttendencePicture = async (e) => {
    setError("");
    const photo_1 = cameraFile?.data?.insert_documents?.returning?.[0]?.id;
    if (photo_1) {
      await campService.markCampAttendance({
        ...data,
        context_id: id,
        user_id: userData?.id,
        status: "present",
        photo_1: `${photo_1}`,
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

  const updateUserData = async ({ status, user_id }) => {
    if (status === "present" || status === "absent") {
      await campService.markCampAttendance({
        context_id: id,
        user_id: user_id,
        status,
      });
    }
  };

  if (userData?.id) {
    return (
      <Box>
        {
          <React.Suspense fallback={<Loading />}>
            <Camera
              headerComponent={
                <VStack bg="black" flex="1" py="2" px="4">
                  <HStack
                    space={2}
                    divider={
                      <AdminTypo.H6 color="white" bold>
                        :
                      </AdminTypo.H6>
                    }
                  >
                    <AdminTypo.H6 color="white">{t("NAME")}</AdminTypo.H6>
                    <AdminTypo.H6 color="white">
                      {
                        userData?.program_beneficiaries[0]
                          ?.enrollment_first_name
                      }
                    </AdminTypo.H6>
                  </HStack>
                  <HStack
                    space={2}
                    divider={
                      <AdminTypo.H6 color="white" bold>
                        :
                      </AdminTypo.H6>
                    }
                  >
                    <AdminTypo.H6 color="white">{t("CANDIDATES")}</AdminTypo.H6>
                    <AdminTypo.H6 color="white">
                      {groupUsers?.length ? groupUsers?.length : 0}
                    </AdminTypo.H6>
                  </HStack>
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
                      uploadAttendencePicture();
                      cameraFile
                        ? setUserData()
                        : setError("Capture Picture First");
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
                      cameraFile
                        ? uploadAttendencePicture()
                        : setError("Capture Picture First");
                    }}
                  >
                    {t("NEXT")}
                  </AdminTypo.Secondarybutton>
                </HStack>
              }
              {...{
                cameraModal: true,
                setCameraModal: async (item) => {
                  setUserData();
                },
                cameraUrl,
                setCameraUrl: async (url, file) => {
                  if (file) {
                    setError("");
                    let formData = new FormData();
                    formData.append("user_id", userData?.id);
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
        _box: { bg: "white" },
      }}
    >
      <VStack py={6} px={4} space="6">
        <HStack justifyContent={"space-between"}>
          <AdminTypo.H3 color={"textMaroonColor.400"}>
            {t("LEARNERS")}
          </AdminTypo.H3>
          <AdminTypo.H3>({groupUsers?.length || 0})</AdminTypo.H3>
        </HStack>
        <FrontEndTypo.Primarybutton onPress={(e) => setUserData(groupUsers[0])}>
          {t("MARK_ATTENDANCE")}
        </FrontEndTypo.Primarybutton>
        <VStack space="4">
          {groupUsers?.map((item) => {
            const document = attendances?.find((e) => e.user?.id === item?.id);
            return (
              <HStack
                key={item}
                bg="white"
                shadow="FooterShadow"
                rounded="sm"
                space="1"
                alignItems={"center"}
                justifyContent="space-between"
              >
                <HStack space={2}>
                  {(!document?.status || document?.status === "present") && (
                    <IconByName
                      onPress={(e) => {
                        updateUserData({
                          status: "absent",
                          user_id: item?.id,
                        });
                      }}
                      py="4"
                      px="2"
                      bg="red.100"
                      name="CloseCircleLineIcon"
                      _icon={{ size: "25px", color: "gray" }}
                    />
                  )}
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
                        {item?.program_beneficiaries[0]
                          ?.enrollment_middle_name &&
                          ` ${item?.program_beneficiaries[0]?.enrollment_middle_name}`}
                        {item?.program_beneficiaries[0]?.enrollment_last_name &&
                          ` ${item?.program_beneficiaries[0]?.enrollment_last_name}`}
                      </FrontEndTypo.H3>
                    </VStack>
                  </HStack>
                </HStack>
                {/* <HStack alignItems={"center"} justifyContent={"space-evenly"}>
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
              </HStack> */}

                {(!document?.status || document?.status === "absent") && (
                  <IconByName
                    onPress={(e) => {
                      setUserData(item);
                    }}
                    py="4"
                    px="2"
                    bg="green.100"
                    name="CheckboxCircleLineIcon"
                    color="gray.500"
                    _icon={{ size: "25px", color: "gray" }}
                  />
                )}
              </HStack>
            );
          })}
        </VStack>
      </VStack>
    </Layout>
  );
}
