import { useEffect, useRef, useState, Suspense, memo } from "react";
import { HStack, Modal, Progress, Spinner, VStack } from "native-base";
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
import InfiniteScroll from "react-infinite-scroll-component";

const PRESENT = "present";
const ABSENT = "absent";

// App
export default function CampAttendancePage({
  activityId,
  campType,
  facilitator,
}) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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
  const [filter, setFilter] = useState({ limit: 50 });
  const [hasMore, setHasMore] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loadingHeight, setLoadingHeight] = useState(0);
  const ref = useRef(null);
  const refBtn = useRef(null);
  const [progress, setProgress] = useState(0);
  const [learnerTotalCount, setLearnerTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(async () => {
    async function fetchData() {
      const data = await campService.getrandomAttendance({ id });
      if (data?.learner_camp_attendance_data === 1) {
        setRandomAttendance(true);
      }
    }
    fetchData();
  }, []);

  useEffect(async () => {
    setData({ ...data, lat: `${latData}`, long: `${longData}` });
  }, [latData]);

  useEffect(async () => {
    const {
      currentPage,
      totalCount,
      totalPages,
      error,
      data: newData,
    } = await campService.getCampLeaners({
      ...filter,
      id,
      context_id: activityId,
      order_by: { id: "desc" },
    });
    if (!error) {
      setLearnerTotalCount(totalCount);
      setTimeout(async () => {
        if (filter?.page > 1) {
          setGroupUsers([...groupUsers, ...(newData || [])]);
        } else {
          setGroupUsers(newData || []);
        }
        setHasMore(parseInt(`${currentPage}`) < parseInt(`${totalPages}`));
      }, 1000);
    } else {
      setGroupUsers([]);
    }

    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  }, [filter, id]);

  // Camera MOdule
  useEffect(() => {
    if (ref?.current?.clientHeight >= 0 && bodyHeight >= 0) {
      setLoadingHeight(
        bodyHeight -
          ref?.current?.clientHeight -
          (refBtn?.current?.clientHeight || 0) -
          30
      );
    } else {
      setLoadingHeight(bodyHeight);
    }
  }, [bodyHeight, ref, refBtn]);

  const uploadAttendence = async (user, status = PRESENT, finish = false) => {
    try {
      setLoading(true);
      setError("");
      setIsEditable({ ...isEditable, [user?.id]: null });
      if (user?.attendances?.[0]?.status) {
        if (status === PRESENT || status === ABSENT) {
          let payLoad = {
            ...data,
            id: user?.attendances?.[0]?.id,
            context_id: activityId,
            user_id: user?.id,
            status,
          };
          if (status === PRESENT && randomAttendance) {
            const photo_1 =
              cameraFile?.data?.insert_documents?.returning?.[0]?.name;
            payLoad = { ...payLoad, photo_1: photo_1 ? `${photo_1}` : null };
          }
          const result = await campService.updateCampAttendance(payLoad);
          const coruntIndex = groupUsers.findIndex(
            (item) => item?.id === user?.id
          );
          let newData = groupUsers;
          newData[coruntIndex]["attendances"] = [result?.attendance];
          setGroupUsers(newData);
        }
      } else if (status === PRESENT) {
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
          const result = await campService.markCampAttendance(payLoad);
          const coruntIndex = groupUsers.findIndex(
            (item) => item?.id === user?.id
          );
          let newData = groupUsers;
          newData[coruntIndex]["attendances"] = [result?.attendance];
          setGroupUsers(newData);
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
        const result = await campService.markCampAttendance(payLoad);
        const coruntIndex = groupUsers.findIndex(
          (item) => item?.id === user?.id
        );
        let newData = groupUsers;
        newData[coruntIndex]["attendances"] = [result?.attendance];
        setGroupUsers(newData);
      }

      if (finish) {
        setCameraUrl();
        setCameraFile();
        setUserData();
      } else {
        const coruntIndex = groupUsers.findIndex(
          (item) => item?.id === user?.id
        );
        if (groupUsers[coruntIndex + 1]) {
          setCameraUrl();
          setUserData({
            ...groupUsers[coruntIndex + 1],
            index: coruntIndex + 1,
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  };

  const addAttendance = (item) => {
    if (randomAttendance) {
      if (data?.lat && data?.long) {
        setError("");
        setProgress(0);
        setUserData(item);
      } else {
        setError("GEO_USER_DENIED_THE_REQUEST_FOR_GEOLOCATION");
      }
    } else {
      uploadAttendence(item, PRESENT, true);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (userData?.id) {
    return (
      <Layout>
        <Suspense fallback={<Loading />}>
          <VStack padding={"4"} space={4}>
            <FrontEndTypo.H2>{t("MARK_ATTENDANCE")}</FrontEndTypo.H2>
            <FrontEndTypo.H4 bold color="textGreyColor.750">{`${t(
              "CAMP_ID"
            )} : ${id}`}</FrontEndTypo.H4>
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
                    <FrontEndTypo.H3 color="white">{t("NAME")}</FrontEndTypo.H3>
                    <FrontEndTypo.H3 color="white">
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
                    </FrontEndTypo.H3>
                  </HStack>
                  <HStack
                    space={2}
                    divider={
                      <FrontEndTypo.H6 color="white" bold>
                        :
                      </FrontEndTypo.H6>
                    }
                  >
                    <FrontEndTypo.H3 color="white">
                      {t("LATITUDE")} {t("LONGITUDE")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H3 color="white">
                      {`${[data.lat, data.long].filter((e) => e).join(" ")}`}
                    </FrontEndTypo.H3>
                  </HStack>
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
                onFinish: (e) => uploadAttendence(userData, PRESENT, true),
                cameraModal: true,
                setCameraModal: async (item) => {
                  setUserData();
                },
                cameraUrl,
                filePreFix: `camp_leaner_attendace_user_id_${userData?.id}_`,
                setCameraUrl: async (url, file) => {
                  setProgress(0);
                  if (file) {
                    setError("");
                    let formData = new FormData();
                    formData.append("user_id", userData?.id);
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
                    if (uploadDoc) {
                      setCameraFile(uploadDoc);
                    }
                    setCameraUrl({ url, file });
                  } else if (cameraUrl) {
                    setCameraUrl();
                  } else {
                    setUserData();
                  }
                },
              }}
            />
          </VStack>
        </Suspense>
      </Layout>
    );
  }

  return (
    <Layout
      getBodyHeight={(e) => setBodyHeight(e)}
      loading={loading}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        onPressBackButton: (e) => navigate(`/camps/${id}/campexecution`),
        name: t("ATTENDANCE"),
        _box: { bg: "white" },
        isEnableSearchBtn: "true",
        setSearch: (value) => {
          setFilter({ ...filter, search: value, page: 1 });
        },
      }}
      analyticsPageTitle={"CAMP_LEARNER_ATTENDANCE"}
      pageTitle={t("ATTENDANCE")}
      stepTitle={`${campType === "main" ? t("MAIN_CAMP") : t("PCR_CAMP")}/${t(
        "ATTENDANCE"
      )}`}
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
      <Modal
        isOpen={error}
        avoidKeyboard
        size="lg"
        onClose={(e) => setError("")}
      >
        <Modal.Content>
          <Modal.Body alignItems="center">
            <FrontEndTypo.H4 style={{ color: "red" }}>
              {t(error)}
            </FrontEndTypo.H4>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <HStack justifyContent={"space-between"} ref={ref} px={4} pt="4">
        <HStack>
          <FrontEndTypo.H3 color={"textMaroonColor.400"}>
            {t("LEARNERS")}
          </FrontEndTypo.H3>
          <FrontEndTypo.H3>({learnerTotalCount})</FrontEndTypo.H3>
        </HStack>
      </HStack>
      <VStack px={4} space="4">
        {/* <FrontEndTypo.Primarybutton onPress={(e) => setUserData(groupUsers[0])}>
          {t("MARK_ATTENDANCE")}
        </FrontEndTypo.Primarybutton> */}
        <InfiniteScroll
          key={loadingHeight}
          dataLength={groupUsers?.length || 0}
          next={(e) => {
            setFilter({
              ...filter,
              page: (filter?.page ? filter?.page : 1) + 1,
            });
          }}
          hasMore={hasMore}
          height={loadingHeight}
          loader={<Loading height="100" _vstack={{ space: 4 }} />}
          endMessage={
            <FrontEndTypo.H3 bold display="inherit" textAlign="center">
              {groupUsers?.length > 0
                ? t("COMMON_NO_MORE_RECORDS")
                : t("DATA_NOT_FOUND")}
            </FrontEndTypo.H3>
          }
          pullDownToRefreshThreshold={50}
        >
          <List
            {...{
              groupUsers,
              isEditable,
              addAttendance,
              setIsEditable,
              uploadAttendence,
            }}
          />
        </InfiniteScroll>
        {/* <FrontEndTypo.Primarybutton
          ref={refBtn}
          onPress={(e) => navigate(`/camps/${id}/campexecution`)}
        >
          {t("SUBMIT")}
        </FrontEndTypo.Primarybutton> */}
      </VStack>
    </Layout>
  );
}

const List = memo(
  ({
    groupUsers,
    isEditable,
    addAttendance,
    setIsEditable,
    uploadAttendence,
  }) => {
    return (
      <VStack space="4" p="4" alignContent="center">
        {Array.isArray(groupUsers) &&
          groupUsers?.map((item) => {
            return (
              <HStack key={item} flex="1" minHeight={12}>
                <UserCard
                  _hstack={{
                    ...(!isEditable?.[item.id] && item?.attendances?.[0]?.status
                      ? { py: 0 }
                      : // : item?.attendances?.[0]?.status &&
                        //   item?.attendances?.[0]?.status !== PRESENT
                        // ? { p: 0, pl: 4 }
                        { p: 0 }),
                    space: 1,
                    flex: 1,
                    bg:
                      isEditable?.[item.id] || !item?.attendances?.[0]?.status
                        ? "white"
                        : item?.attendances?.[0]?.status === PRESENT
                        ? "green.100"
                        : item?.attendances?.[0]?.status === ABSENT
                        ? "red.100"
                        : "",
                  }}
                  _vstack={{ py: 2 }}
                  _image={{ size: 45, color: "gray" }}
                  leftElement={
                    (isEditable?.[item.id] ||
                      !item?.attendances?.[0]?.status) && (
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
                    isEditable?.[item.id] || !item?.attendances?.[0]?.status ? (
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
                  //     <RenderAttendee row={item?.attendances?.[0] || {}} t={t} />
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
    );
  }
);
