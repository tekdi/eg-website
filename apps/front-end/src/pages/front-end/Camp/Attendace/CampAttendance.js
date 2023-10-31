import React from "react";
import { Alert, Box, Button, HStack, VStack } from "native-base";
import {
  Layout,
  FrontEndTypo,
  AdminTypo,
  IconByName,
  campService,
  Camera,
  Loading,
  uploadRegistryService,
  GeoLocation,
  UserCard,
} from "@shiksha/common-lib";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chip from "component/Chip";

const PRESENT = "present";
const ABSENT = "absent";

// App
export default function ConsentForm() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const [groupUsers, setGroupUsers] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [userData, setUserData] = React.useState({});
  const [error, setError] = React.useState("");
  const [cameraFile, setCameraFile] = React.useState();
  const [data, setData] = React.useState({});
  const [isEditable, setIsEditable] = React.useState();

  React.useEffect(async () => {
    await getData();
  }, [id, !userData]);

  const getData = async () => {
    const result = await campService.getCampDetails({ id });
    const resultAttendance = await campService.CampAttendance({ id });
    let attendances = [];
    if (resultAttendance?.data?.length > 0) {
      attendances = resultAttendance?.data;
    }
    setGroupUsers(
      result?.data?.group_users.map((item, index) => {
        let attendance = attendances.find((e) => e?.user?.id === item.id);
        return { ...item, index, attendance };
      })
    );
    setLoading(false);
  };

  // update schema

  // const onClickSubmit = () => {
  //   navigate(`/camps/${id}`);
  // };

  // Camera MOdule

  const uploadAttendence = async (user, status = PRESENT, finish = false) => {
    setError("");
    setIsEditable({ ...isEditable, [user?.id]: null });
    if (user?.attendance?.status) {
      if (status === PRESENT || status === ABSENT) {
        let payLoad = {
          ...data,
          id: user?.attendance?.id,
          context_id: id,
          user_id: user?.id,
          status,
        };
        if (status === PRESENT) {
          const photo_1 =
            cameraFile?.data?.insert_documents?.returning?.[0]?.name;
          payLoad = { ...payLoad, photo_1: `${photo_1}` };
        }
        await campService.updateCampAttendance(payLoad);
        await getData();
      }
    } else {
      if (status === PRESENT) {
        const photo_1 =
          cameraFile?.data?.insert_documents?.returning?.[0]?.name;
        if (photo_1) {
          const payLoad = {
            ...data,
            context_id: id,
            user_id: user?.id,
            status: PRESENT,
            photo_1: `${photo_1}`,
          };

          await campService.markCampAttendance(payLoad);
          await getData();
        } else {
          setError("Capture Picture First");
        }
      } else if (status === ABSENT) {
        const payLoad = {
          ...data,
          context_id: id,
          user_id: user?.id,
          status: ABSENT,
        };

        await campService.markCampAttendance(payLoad);
        await getData();
      }
    }

    if (finish) {
      setCameraUrl();
      setCameraFile();
      setUserData();
    } else {
      const coruntIndex = groupUsers.findIndex((item) => item?.id === user?.id);
      if (groupUsers[coruntIndex + 1]) {
        setCameraUrl();
        setUserData({ ...groupUsers[coruntIndex + 1], index: coruntIndex + 1 });
      }
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
                      {/* ${userData?.index + 1}) */}
                      {`${[
                        userData?.program_beneficiaries[0]
                          ?.enrollment_first_name,
                        userData?.program_beneficiaries[0]
                          ?.enrollment_middle_name,
                        userData?.program_beneficiaries[0]
                          ?.enrollment_last_name,
                      ]
                        .filter((e) => e)
                        .join(" ")}`}
                    </AdminTypo.H6>
                  </HStack>
                  {/* <HStack
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
                  </HStack> */}
                  {error && (
                    <AdminTypo.H4 style={{ color: "red" }}>
                      {error}
                    </AdminTypo.H4>
                  )}
                </VStack>
              }
              // footerComponent={
              //   <HStack space={3} width="100%" justifyContent="space-between">
              //     {error && (
              //       <AdminTypo.H4 style={{ color: "red" }}>
              //         {error}
              //       </AdminTypo.H4>
              //     )}
              //     <AdminTypo.Secondarybutton
              //       shadow="BlueOutlineShadow"
              //       onPress={() => uploadAttendence(userData, PRESENT, true)}
              //     >
              //       {t("FINISH")}
              //     </AdminTypo.Secondarybutton>
              //     <AdminTypo.Secondarybutton
              //       isDisabled={userData?.index + 1 === groupUsers.length}
              //       variant="secondary"
              //       ml="4"
              //       px="5"
              //       onPress={() => uploadAttendence(userData)}
              //     >
              //       {t("NEXT")}
              //     </AdminTypo.Secondarybutton>
              //   </HStack>
              // }
              messageComponent={
                cameraUrl && (
                  <Alert status="success">
                    <HStack alignItems="center" space="2">
                      <Alert.Icon />
                      <AdminTypo.H4>{t("ATTENDANCE_SUCCESS")}</AdminTypo.H4>
                    </HStack>
                  </Alert>
                )
              }
              {...{
                cameraModal: true,
                setCameraModal: async (item) => {
                  setUserData();
                },
                cameraUrl,
                onFinish: (e) => uploadAttendence(userData, PRESENT, true),
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
                      setCameraFile(uploadDoc);
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
  console.log({ isEditable });
  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("ATTENDANCE"),
        _box: { bg: "white" },
      }}
    >
      <GeoLocation
        getLocation={(lat, long, err) => {
          if (err) {
            setError(err);
          } else {
            setData({ ...data, lat: `${lat}`, long: `${long}` });
          }
        }}
      />
      <VStack py={6} px={4} space="6">
        <HStack justifyContent={"space-between"}>
          <HStack>
            <AdminTypo.H3 color={"textMaroonColor.400"}>
              {t("LEARNERS")}
            </AdminTypo.H3>
            <AdminTypo.H3>({groupUsers?.length || 0})</AdminTypo.H3>
          </HStack>
        </HStack>
        {/* <FrontEndTypo.Primarybutton onPress={(e) => setUserData(groupUsers[0])}>
          {t("MARK_ATTENDANCE")}
        </FrontEndTypo.Primarybutton> */}
        <VStack space="4">
          {groupUsers?.map((item) => {
            return (
              <HStack key={item} flex="1">
                <UserCard
                  _hstack={{
                    ...(!isEditable?.[item.id] && item?.attendance?.status
                      ? { py: 0 }
                      : // : item?.attendance?.status &&
                        //   item?.attendance?.status !== PRESENT
                        // ? { p: 0, pl: 4 }
                        { p: 0 }),
                    space: 1,
                    flex: 1,
                    bg:
                      isEditable?.[item.id] || !item?.attendance?.status
                        ? "white"
                        : item?.attendance?.status === PRESENT
                        ? "green.100"
                        : item?.attendance?.status === ABSENT
                        ? "red.100"
                        : "",
                  }}
                  _vstack={{ py: 2 }}
                  _image={{ size: 45, color: "gray" }}
                  leftElement={
                    (isEditable?.[item.id] || !item?.attendance?.status) && (
                      <IconByName
                        onPress={(e) => {
                          uploadAttendence(item, ABSENT, true);
                        }}
                        height="100%"
                        roundedRight="0"
                        bg="red.100"
                        name="CloseCircleLineIcon"
                        _icon={{ size: "25px", color: "gray" }}
                      />
                    )
                  }
                  rightElement={
                    isEditable?.[item.id] || !item?.attendance?.status ? (
                      <IconByName
                        onPress={(e) => {
                          setUserData(item);
                        }}
                        height="100%"
                        roundedLeft="0"
                        bg="green.100"
                        name="CheckboxCircleLineIcon"
                        _icon={{ size: "25px", color: "gray" }}
                      />
                    ) : (
                      <IconByName
                        name="EditBoxLineIcon"
                        _icon={{ color: "garkGray", size: "15" }}
                        bg="gray.100"
                        rounded="full"
                        onPress={(e) =>
                          setIsEditable({
                            ...isEditable,
                            [item.id]: !isEditable?.[item.id],
                          })
                        }
                      />
                    )
                  }
                  title={[
                    item?.program_beneficiaries[0]?.enrollment_first_name,
                    item?.program_beneficiaries[0]?.enrollment_middle_name,
                    item?.program_beneficiaries[0]?.enrollment_last_name,
                  ]
                    .filter((e) => e)
                    .join(" ")}
                  subTitle={
                    <HStack>
                      <RenderAttendee row={item?.attendance || {}} t={t} />
                    </HStack>
                  }
                  image={
                    item?.profile_photo_1?.fileUrl
                      ? { urlObject: item?.profile_photo_1 }
                      : null
                  }
                />
              </HStack>
            );
          })}
        </VStack>
      </VStack>
    </Layout>
  );
}

const RenderAttendee = ({ row, t }) => (
  <Chip
    py="1px"
    label={
      <FrontEndTypo.H5 bold>
        {row?.fa_is_processed === null
          ? t("NO")
          : row?.fa_is_processed === true
          ? t("YES") + " " + row?.fa_similarity_percentage?.toFixed(2) + "%"
          : t("NO")}
      </FrontEndTypo.H5>
    }
    rounded="lg"
  />
);
