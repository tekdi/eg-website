import React, { useEffect, useRef, useState, Suspense } from "react";
import { Alert, Box, Button, HStack, VStack } from "native-base";
import {
  Layout,
  FrontEndTypo,
  IconByName,
  campService,
  Camera,
  Loading,
  uploadRegistryService,
  GeoLocation,
  UserCard,
  useLocationData,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Chip from "component/Chip";
import InfiniteScroll from "react-infinite-scroll-component";

const PRESENT = "present";
const ABSENT = "absent";

// App
export default function CampAttendance({ activityId }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [groupUsers, setGroupUsers] = useState();
  const [cameraUrl, setCameraUrl] = useState();
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");
  const [cameraFile, setCameraFile] = useState();
  const [data, setData] = useState({});
  const [isEditable, setIsEditable] = useState();
  const [randomAttendance, setRandomAttendance] = useState(false);
  const [latData, longData] = useLocationData() || [];
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);

  useEffect(async () => {
    const data = await campService.getrandomAttendance({ id });
    if (data?.learner_camp_attendance_data === 1) {
      setRandomAttendance(true);
    }
  }, []);

  useEffect(async () => {
    setData({ ...data, lat: `${latData}`, long: `${longData}` });
  }, [latData]);

  const getData = async () => {
    const result = await campService.getCampDetails({ id });
    let totalPages = 5;
    let currentPage = 1;
    // setHasMore(parseInt(`${currentPage}`) < parseInt(`${totalPages}`));
    const resultAttendance = await campService.CampAttendance({
      id: activityId,
    });
    let attendances = [];
    if (resultAttendance?.data?.length > 0) {
      attendances = resultAttendance?.data;
    }
    setGroupUsers(
      result?.data?.group_users?.map((item, index) => {
        let attendance = attendances.find((e) => e?.user?.id === item.id);
        return { ...item, index, attendance };
      })
    );
    setLoading(false);
  };

  useEffect(async () => {
    await getData();
  }, [id, !userData]);
  // update schema

  // const onClickSubmit = () => {
  //   navigate(`/camps/${id}`);
  // };

  // Camera MOdule
  useEffect(() => {
    if (ref?.current?.clientHeight >= 0 && bodyHeight >= 0) {
      setLoadingHeight(bodyHeight - ref?.current?.clientHeight - 50);
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight, ref]);

  const uploadAttendence = async (user, status = PRESENT, finish = false) => {
    setError("");
    setIsEditable({ ...isEditable, [user?.id]: null });
    if (user?.attendance?.status) {
      if (status === PRESENT || status === ABSENT) {
        let payLoad = {
          ...data,
          id: user?.attendance?.id,
          context_id: activityId,
          user_id: user?.id,
          status,
        };
        if (status === PRESENT && randomAttendance) {
          const photo_1 =
            cameraFile?.data?.insert_documents?.returning?.[0]?.name;
          payLoad = { ...payLoad, photo_1: photo_1 ? `${photo_1}` : null };
        }
        await campService.updateCampAttendance(payLoad);
        await getData();
      }
    } else {
      if (status === PRESENT) {
        const photo_1 = randomAttendance
          ? cameraFile?.data?.insert_documents?.returning?.[0]?.name
          : null;
        if (activityId) {
          const payLoad = {
            ...data,
            context_id: activityId,
            user_id: user?.id,
            status: PRESENT,
            photo_1: photo_1 ? `${photo_1}` : null,
          };
          await campService.markCampAttendance(payLoad);
          await getData();
        } else {
          setError("Capture Picture First");
        }
      } else if (status === ABSENT) {
        const payLoad = {
          ...data,
          context_id: activityId,
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

  const addAttendance = (item) => {
    if (randomAttendance) {
      setUserData(item);
    } else {
      uploadAttendence(item, PRESENT, true);
    }
  };

  if (userData?.id) {
    return (
      <Box>
        {
          <Suspense fallback={<Loading />}>
            <Camera
              facing={true}
              headerComponent={
                <VStack bg="black" flex="1" py="2" px="4">
                  <HStack
                    space={2}
                    divider={
                      <FrontEndTypo.H6 color="white" bold>
                        :
                      </FrontEndTypo.H6>
                    }
                  >
                    <FrontEndTypo.H6 color="white">{t("NAME")}</FrontEndTypo.H6>
                    <FrontEndTypo.H6 color="white">
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
                    </FrontEndTypo.H6>
                  </HStack>
                  {/* <HStack
                    space={2}
                    divider={
                      <FrontEndTypo.H6 color="white" bold>
                        :
                      </FrontEndTypo.H6>
                    }
                  >
                    <FrontEndTypo.H6 color="white">{t("CANDIDATES")}</FrontEndTypo.H6>
                    <FrontEndTypo.H6 color="white">
                      {groupUsers?.length ? groupUsers?.length : 0}
                    </FrontEndTypo.H6>
                  </HStack> */}
                  {error && (
                    <FrontEndTypo.H4 style={{ color: "red" }}>
                      {error}
                    </FrontEndTypo.H4>
                  )}
                </VStack>
              }
              messageComponent={
                <VStack>
                  <FrontEndTypo.H3 color="white" textAlign="center">
                    {t("ATTENDANCE_PHOTO_MSG")}
                  </FrontEndTypo.H3>
                </VStack>
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
                    setCameraUrl();
                    setUserData();
                  }
                },
              }}
            />
          </Suspense>
        }
      </Box>
    );
  }
  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("ATTENDANCE"),
        _box: { bg: "white" },
      }}
    >
      {/* <GeoLocation
        getLocation={(lat, long, err) => {
          if (err) {
            setError(err);
          } else {
            setData({ ...data, lat: `${lat}`, long: `${long}` });
          }
        }}
      /> */}
      <HStack justifyContent={"space-between"} ref={ref} px={4} pt="4">
        <HStack>
          <FrontEndTypo.H3 color={"textMaroonColor.400"}>
            {t("LEARNERS")}
          </FrontEndTypo.H3>
          <FrontEndTypo.H3>({groupUsers?.length || 0})</FrontEndTypo.H3>
        </HStack>
      </HStack>
      <VStack py={6} px={4} space="6">
        {/* <FrontEndTypo.Primarybutton onPress={(e) => setUserData(groupUsers[0])}>
          {t("MARK_ATTENDANCE")}
        </FrontEndTypo.Primarybutton> */}
        <InfiniteScroll
          dataLength={groupUsers?.length || 0}
          next={() => {
            if (!loading) {
              // setLoading(true);
              // fetchData().then((newData) => {
              //   setGroupUsers((prevData) => [...prevData, ...newData]);
              //   setLoading(false);
              // });
            }
          }}
          hasMore={hasMore}
          height={loadingHeight}
          loader={<Loading height="100" />}
          endMessage={
            <FrontEndTypo.H3 bold display="inherit" textAlign="center">
              {groupUsers?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
          pullDownToRefreshThreshold={50}
        >
          <VStack space="4">
            {groupUsers?.map((item) => {
              return (
                <HStack key={item} flex="1" minHeight={12}>
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
                            addAttendance(item);
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
                          shadow="4"
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
                    // subTitle={
                    //   <HStack>
                    //     <RenderAttendee row={item?.attendance || {}} t={t} />
                    //   </HStack>
                    // }
                    // image={
                    //   item?.profile_photo_1?.fileUrl
                    //     ? { urlObject: item?.profile_photo_1 }
                    //     : null
                    // }
                    isIdtag={item?.id}
                  />
                </HStack>
              );
            })}
          </VStack>
        </InfiniteScroll>
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
