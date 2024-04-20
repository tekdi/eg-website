import {
  AdminTypo,
  BodyMedium,
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  RedOutlineButton,
  arrList,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getOnboardingURLData,
  getSelectedAcademicYear,
  getSelectedProgramId,
  objProps,
  removeOnboardingMobile,
  removeOnboardingURLData,
  setSelectedAcademicYear,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import moment from "moment";
import {
  Alert,
  CheckIcon,
  CloseIcon,
  HStack,
  Image,
  Modal,
  Select,
  Stack,
  VStack,
} from "native-base";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SyncOfflineData } from "v2/utils/OfflineHelper/OfflineHelper";
import {
  checkPrerakOfflineTimeInterval,
  getIpUserInfo,
  getUserInfoNull,
  setIpUserInfo,
  setPrerakOfflineInfo,
} from "v2/utils/SyncHelper/SyncHelper";
import {
  getIndexedDBItem,
  setIndexedDBItem,
} from "../../../src/v2/utils/Helper/JSHelper";

const styles = {
  inforBox: {
    style: {
      background:
        "linear-gradient(75.39deg, rgba(255, 255, 255, 0) -7.58%, rgba(255, 255, 255, 0) -7.57%, rgba(255, 255, 255, 0.352337) -7.4%, #CAE9FF 13.31%, #CAE9FF 35.47%, #CAE9FF 79.94%, rgba(255, 255, 255, 0.580654) 103.6%, rgba(255, 255, 255, 0) 108.42%)",
    },
  },
  AddAnAgShadowBox: {
    style: {
      boxShadow: "2px 3px 0px #790000",
      border: "1px solid #790000",
      borderRadius: "10px",
      padding: "50px",
    },
  },
};

export default function Dashboard({ userTokenInfo, footerLinks }) {
  const { t } = useTranslation();
  const [facilitator, setFacilitator] = useState({ notLoaded: true });
  const [certificateData, setCertificateData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const fa_id = localStorage.getItem("id");
  const [isEventActive, setIsEventActive] = useState();
  const { id } = userTokenInfo?.authUser || {};
  const [examButtonText, setExamButtonText] = useState("");
  const [events, setEvents] = useState();
  let score = process.env.REACT_APP_SCORE || 79.5;
  let floatValue = parseFloat(score);

  //fetch URL data and store fix for 2 times render useEffect call
  const [countLoad, setCountLoad] = useState(0);
  const [cohortData, setCohortData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [isUserRegisterExist, setIsUserRegisterExist] = useState(false);
  const [selectedCohortData, setSelectedCohortData] = useState(null);
  const [selectedProgramData, setSelectedProgramData] = useState(null);
  const [selectCohortForm, setSelectCohortForm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [academicYear, setAcademicYear] = useState(null);
  const [academicData, setAcademicData] = useState([]);
  const [isTodayAttendace, setIsTodayAttendace] = useState();

  const [env_name] = useState(process.env.NODE_ENV);

  //store common api indexed db based on internet connection - start
  const [isOnline, setIsOnline] = useState(
    window ? window.navigator.onLine : false
  );

  const saveDataToIndexedDB = async () => {
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    try {
      const [ListOfEnum, qualification, editRequest] = await Promise.all([
        enumRegistryService.listOfEnum(),
        enumRegistryService.getQualificationAll(),
        facilitatorRegistryService.getEditRequests(obj),
        // enumRegistryService.userInfo(),
      ]);
      const currentTime = moment().toString();
      await Promise.all([
        setIndexedDBItem("enums", ListOfEnum.data),
        setIndexedDBItem("qualification", qualification),
        setIndexedDBItem("lastFetchTime", currentTime),
        setIndexedDBItem("editRequest", editRequest),
      ]);
    } catch (error) {
      console.error("Error saving data to IndexedDB:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const lastFetchTime = await getIndexedDBItem("lastFetchTime");
      const FetchTime = moment(lastFetchTime, "ddd MMM DD YYYY HH:mm:ss GMTZZ");
      const currentTime = moment();

      const diffInHours = currentTime.diff(FetchTime, "hours");
      if (diffInHours >= 48) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await checkUserToIndex();
    };

    fetchData();
  }, [isOnline]);

  const checkUserToIndex = async () => {
    const GetSyncTime = await getIndexedDBItem("GetSyncTime");
    const offlinePrerakData = await getUserInfoNull(fa_id);
    const IpUserInfo = await getIpUserInfo(fa_id);
    const timeExpired = await checkPrerakOfflineTimeInterval();
    let academic_Id = await getSelectedAcademicYear();
    if (
      isOnline &&
      academic_Id &&
      (!GetSyncTime || !offlinePrerakData || timeExpired || !IpUserInfo)
    ) {
      await setIpUserInfo(fa_id);
      await setPrerakOfflineInfo(fa_id);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkUserToIndex();
    };

    if (academicYear) {
      fetchData();
    }
  }, [academicYear]);

  useEffect(() => {
    const fetchData = async () => {
      await checkDataToIndex();
    };

    fetchData();
  }, [isOnline]);

  const checkDataToIndex = async () => {
    // Online Data Fetch Time Interval
    const timeInterval = 30;
    const enums = await getIndexedDBItem("enums");
    const qualification = await getIndexedDBItem("qualification");
    const lastFetchTime = await getIndexedDBItem("lastFetchTime");
    const editRequest = await getIndexedDBItem("editRequest");
    let timeExpired = false;
    if (lastFetchTime) {
      const timeDiff = moment
        .duration(moment().diff(lastFetchTime))
        .asMinutes();
      if (timeDiff >= timeInterval) {
        timeExpired = true;
      }
    }
    if (
      isOnline &&
      (!enums ||
        !qualification ||
        !editRequest ||
        timeExpired ||
        !lastFetchTime ||
        editRequest?.status === 400)
    ) {
      await saveDataToIndexedDB();
    }
  };

  //end

  useEffect(() => {
    async function fetchData() {
      // ...async operation
      if (countLoad == 0) {
        setCountLoad(1);
      }
      if (countLoad == 1) {
        //do page load first operation
        //get user info
        if (userTokenInfo) {
          const IpUserInfo = await getIpUserInfo(fa_id);
          let ipUserData = IpUserInfo;
          if (isOnline && !IpUserInfo) {
            ipUserData = await setIpUserInfo(fa_id);
          }

          setFacilitator(ipUserData);
        }
        setLoading(false);
        //end do page load first operation
        setCountLoad(2);
      } else if (countLoad == 2) {
        setCountLoad(3);
      }
    }
    fetchData();
  }, [countLoad]);

  useEffect(() => {
    const fetchdata = async () => {
      const programId = await getSelectedProgramId();
      if (programId) {
        try {
          const c_data =
            await facilitatorRegistryService.getPrerakCertificateDetails({
              id: fa_id,
            });
          const data = c_data?.data?.filter(
            (eventItem) => eventItem?.params?.do_id?.length
          );
          setEvents(data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchdata();
  }, [selectedCohortData]);

  const setExamEvent = (data) => {
    if (data) {
      setIsEventActive(data);
      const doIdArray = data?.params?.do_id;
      if (doIdArray == null || doIdArray.length === 0) {
        setExamButtonText("EVENT_ASSESSMENT_NOT_AVAILABLE_MESSAGE");
      } else {
        setExamButtonText("TAKE_TEST");
      }
      // setIsTodayAttendace(
      //   data?.attendances?.filter(
      //     (attendance) =>
      //       attendance.user_id == fa_id &&
      //       attendance.status == "present" &&
      //       data.end_date == moment(attendance.date_time).format("YYYY-MM-DD")
      //   )
      // );

      // if (data?.lms_test_tracking?.length > 0) {
      //   setCertificateData(data?.lms_test_tracking?.[0]);
      // }
      // const dataDay = moment.utc(data?.end_date).isSame(moment(), "day");
      // const format = "HH:mm:ss";
      // const time = moment(moment().format(format), format);
      // const beforeTime = moment.utc(data?.start_time, format).local();
      // const afterTime = moment.utc(data?.end_time, format).local();
      // if (time?.isBetween(beforeTime, afterTime) && dataDay) {
      //   setIsEventActive(data);
      // }
    }
  };

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (academicYear != null) {
        //get cohort id and store in localstorage
        const user_cohort_id = academicYear;
        const cohort_data = await facilitatorRegistryService.getCohort({
          cohortId: user_cohort_id,
        });
        setSelectedCohortData(cohort_data);
        await setSelectedAcademicYear(cohort_data);
      }
    }
    fetchData();
  }, [academicYear]);

  // useEffect(() => {
  //   async function fetchData() {
  //     // ...async operations
  //     const getCertificate = await testRegistryService.getCertificate({
  //       id,
  //     });
  //     if (getCertificate?.data?.length > 0) {
  //       setCertificateData(getCertificate?.data?.[0]);
  //     }
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchData() {
      if (!facilitator?.notLoaded === true) {
        // ...async operations
        const res = objProps(facilitator);
        setProgress(
          arrList(
            {
              ...res,
              qua_name: facilitator?.qualifications?.qualification_master?.name,
            },
            [
              "device_ownership",
              "mobile",
              "device_type",
              "gender",
              "marital_status",
              "social_category",
              "name",
              "contact_number",
              "availability",
              "aadhar_no",
              "aadhaar_verification_mode",
              "aadhar_verified",
              "qualification_ids",
              "qua_name",
            ]
          )
        );
        //check exist user registered
        try {
          let onboardingURLData = await getOnboardingURLData();
          setCohortData(onboardingURLData?.cohortData);
          setProgramData(onboardingURLData?.programData);
          //get program id and store in localstorage

          const user_program_id = facilitator?.program_faciltators?.program_id;
          const program_data = await facilitatorRegistryService.getProgram({
            programId: user_program_id,
          });
          setSelectedProgramData(program_data[0]);
          await setSelectedProgramId(program_data[0]);
          //check mobile number with localstorage mobile no
          let mobile_no = facilitator?.mobile;
          let mobile_no_onboarding = await getOnboardingMobile();
          if (
            mobile_no != null &&
            mobile_no_onboarding != null &&
            mobile_no == mobile_no_onboarding &&
            onboardingURLData?.cohortData
          ) {
            //get cohort id and store in localstorage
            const user_cohort_id =
              onboardingURLData?.cohortData?.academic_year_id;
            const cohort_data = await facilitatorRegistryService.getCohort({
              cohortId: user_cohort_id,
            });
            setSelectedCohortData(cohort_data);
            await setSelectedAcademicYear(cohort_data);
            localStorage.setItem("loadCohort", "yes");
            setIsUserRegisterExist(true);
          } else {
            setIsUserRegisterExist(false);
            await showSelectCohort();
          }
        } catch (e) {}
      }
    }
    fetchData();
  }, [facilitator]);

  const handleRandomise = async () => {
    const doIdArray = modalVisible?.params?.do_id;
    if (typeof doIdArray === "string") {
      return doIdArray;
    }

    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomizedDoId = doIdArray[array[0] % doIdArray.length];
    return randomizedDoId;
  };

  const startTest = async () => {
    try {
      const randomizedDoId = await handleRandomise();
      navigate(`/assessment/events/${modalVisible?.id}/${randomizedDoId}`);
      navigate(0);
    } catch (error) {
      console.error("Error handling randomization:", error);
    }
  };

  const isDocumentUpload = (key = "") => {
    let isAllow = 0;
    if (key === "" || key === "experience") {
      const expData = Array.isArray(facilitator?.experience)
        ? facilitator?.experience.filter((e) => e?.reference?.document_id)
        : [];
      if (expData?.length > 0) {
        isAllow++;
      }
      if (key === "experience") {
        return expData?.length <= 0;
      }
    }

    if (key === "" || key === "vo_experience") {
      const expData = facilitator?.vo_experience?.filter(
        (e) => e?.reference?.document_id
      );
      if (expData?.length > 0) {
        isAllow++;
      }
      if (key === "vo_experience") {
        return expData?.length <= 0;
      }
    }

    if (key === "" || key === "qualifications") {
      const expData =
        facilitator?.qualifications?.qualification_reference_document_id;
      if (expData) {
        isAllow++;
      }
      if (key === "qualifications") {
        return !expData;
      }
    }
    return isAllow < 3;
  };

  //multi cohort

  const selectAcademicYear = async () => {
    setSelectCohortForm(false);
    await checkDataToIndex();
    await checkUserToIndex();
  };

  const removeRegisterExist = async () => {
    try {
      try {
        localStorage.removeItem("loadCohort");
      } catch (e) {}
      await removeOnboardingURLData();
      await removeOnboardingMobile();
      setIsUserRegisterExist(false);
      await showSelectCohort();
    } catch (error) {
      console.error("Failed to remove registration existence:", error);
    }
  };

  const userExistRegisterClick = async () => {
    let onboardingURLData = await getOnboardingURLData();
    const register_exist_user =
      await facilitatorRegistryService.RegisterUserExist({
        program_id: parseInt(onboardingURLData?.programId),
        academic_year_id: parseInt(onboardingURLData?.cohortId),
        parent_ip: onboardingURLData?.id,
      });
    if (register_exist_user?.success == true) {
      try {
        await removeOnboardingURLData();
        await removeOnboardingMobile();
        setIsUserRegisterExist(false);
        window.location.reload();
      } catch (e) {}
    } else {
      alert(register_exist_user?.message);
    }
  };

  const showSelectCohort = async () => {
    let loadCohort = null;
    try {
      loadCohort = localStorage.getItem("loadCohort");
    } catch (e) {}
    if (loadCohort == null || loadCohort == "no") {
      const user_cohort_list =
        await facilitatorRegistryService.GetFacilatorCohortList();
      let stored_response = await setSelectedAcademicYear(
        user_cohort_list?.data[0]
      );
      setAcademicData(user_cohort_list?.data);
      setAcademicYear(user_cohort_list?.data[0]?.academic_year_id);
      localStorage.setItem("loadCohort", "yes");
      if (user_cohort_list?.data.length == 1) {
        setSelectCohortForm(false);
        await checkDataToIndex();
        await checkUserToIndex();
      } else {
        setSelectCohortForm(true);
      }
    }
  };

  const handleAcademicYear = async (item) => {
    setAcademicYear(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      await SyncOfflineData(fa_id, isOnline);
    };

    fetchData();
  }, [isOnline]);

  return (
    <Layout
      loading={loading}
      _appBar={{
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="primary.50" pb="5" style={{ zIndex: -1 }}>
        <VStack space="5">
          {facilitator?.status === "applied" && (
            <InfoBox status={facilitator?.status} progress={progress} />
          )}
          <Stack>
            {facilitator?.program_faciltators?.status ===
              "selected_for_onboarding" &&
              progress !== 100 && (
                <Alert status="success" alignItems={"start"}>
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium>
                      {t("SELECTED_FOR_ONBOARDING_CONGRATULATIONS_MESSAGE")}
                    </BodyMedium>
                  </HStack>
                </Alert>
              )}
            <HStack py="4" flex="1" px="4">
              <Image
                source={{
                  uri: "/hello.svg",
                }}
                alt="Add AG"
                size={"30px"}
                resizeMode="contain"
              />
              <FrontEndTypo.H1 color="textMaroonColor.400" pl="1">
                {t("WELCOME")} {facilitator?.first_name},
              </FrontEndTypo.H1>
            </HStack>
            {events?.length ? (
              <HStack py="2" flex="1" px="4">
                <FrontEndTypo.Primarybutton
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  {t("PRERAK_CERTIFICATION_PROGRAM")}
                </FrontEndTypo.Primarybutton>
              </HStack>
            ) : (
              certificateData?.id && (
                <HStack py="2" flex="1" px="4">
                  <FrontEndTypo.Primarybutton
                    fontSize
                    onPress={() => {
                      setModalVisible(events);
                    }}
                  >
                    {t("PRERAK_CERTIFICATION")}
                  </FrontEndTypo.Primarybutton>
                </HStack>
              )
            )}
            <Modal
              isOpen={modalVisible}
              onClose={() => setModalVisible()}
              avoidKeyboard
              size="full"
            >
              <Modal.Content>
                <Modal.Header alignItems={"center"}>
                  <HStack alignItems={"center"}>
                    <AdminTypo.H4 color="textGreyColor.500">
                      {t("PRERAK_CERTIFICATION_PROGRAM")}
                    </AdminTypo.H4>
                  </HStack>
                </Modal.Header>
                <Modal.Body alignItems="center">
                  <VStack width={"100%"}>
                    {isEventActive ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t(
                          isTodayAttendace?.length > 0
                            ? examButtonText
                            : "TODAYS_ATTENDANCE_MISSING"
                        )}
                      </AdminTypo.H3>
                    ) : certificateData?.certificate_status === null ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t("CERTIFICATION_IS_PENDING")}
                      </AdminTypo.H3>
                    ) : certificateData?.certificate_status === false &&
                      certificateData?.score >= floatValue ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t(`TRAINING_INCOMPLETE`)}
                        {certificateData?.score?.toFixed(2) + "%"}
                      </AdminTypo.H3>
                    ) : certificateData?.certificate_status === true ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t(`TRAINING_TEST_DOWNLOAD_CERTIFICATE`)}
                        {certificateData.score?.toFixed(2) + "%"}
                      </AdminTypo.H3>
                    ) : certificateData?.certificate_status === false ? (
                      <AdminTypo.H3 color="textGreyColor.500">
                        {t("TRAINING_NOT_PASSED")}
                      </AdminTypo.H3>
                    ) : events ? (
                      <TableCard
                        setExamEvent={setExamEvent}
                        pagination
                        data={events}
                        columns={[
                          {
                            name: t("EVENT_ID"),
                            selector: (row) => row?.id,
                          },
                          {
                            name: t("EVENT"),
                            selector: (row) => row?.name,
                          },
                          {
                            name: t("ATTENDANCE"),
                            selector: (row) =>
                              row?.attendance?.length > 0 ? "yes" : "no",
                          },
                          {
                            name: t("EXAM_START_STATUS"),
                            selector: (row) =>
                              row?.attendance?.length > 0 ? "yes" : "no",
                          },
                        ]}
                      />
                    ) : (
                      <></>
                    )}
                  </VStack>
                </Modal.Body>
                <Modal.Footer alignSelf={"center"}>
                  <HStack space={"6"}>
                    {certificateData === undefined ||
                      (certificateData?.certificate_status === true && (
                        <FrontEndTypo.DefaultButton
                          textColor={"black"}
                          onPress={() => {
                            setModalVisible();
                          }}
                        >
                          {t("GO_BACK")}
                        </FrontEndTypo.DefaultButton>
                      ))}
                    {certificateData?.certificate_status === false && (
                      <FrontEndTypo.DefaultButton
                        background={"textRed.400"}
                        onPress={() => {
                          setModalVisible();
                        }}
                      >
                        {t("OK")}
                      </FrontEndTypo.DefaultButton>
                    )}
                    {events && isTodayAttendace?.length > 0 && (
                      <FrontEndTypo.DefaultButton
                        background={"textRed.400"}
                        onPress={startTest}
                      >
                        {t("START_TEST")}
                      </FrontEndTypo.DefaultButton>
                    )}
                    {certificateData?.certificate_status === true && (
                      <FrontEndTypo.DefaultButton
                        background={"textRed.400"}
                        onPress={() => {
                          navigate(`/results`);
                        }}
                      >
                        {t("VIEW_RESULTS")}
                      </FrontEndTypo.DefaultButton>
                    )}
                    {isEventActive && (
                      <FrontEndTypo.DefaultButton
                        background={"textRed.400"}
                        onPress={(e) => setIsEventActive()}
                      >
                        {t("GO_BACK")}
                      </FrontEndTypo.DefaultButton>
                    )}
                  </HStack>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Stack>
          {[
            "pragati_mobilizer",
            "selected_prerak",
            "selected_for_training",
            "selected_for_onboarding",
          ].includes(facilitator.status) && (
            <Stack>
              <RedOutlineButton
                background="bgYellowColor.400"
                mx="5"
                p="10"
                width="40%"
                shadow="RedBlackShadow"
                onPress={(e) => navigate("/beneficiary")}
              >
                <Image
                  source={{
                    uri: "/images/learner/add_learner.png",
                  }}
                  alt="Add AG"
                  size={"sm"}
                  resizeMode="contain"
                />
                <FrontEndTypo.H4 mt="2" color="textBlack.500" bold>
                  {t("ADD_AN_AG")}
                </FrontEndTypo.H4>
              </RedOutlineButton>
              <Stack px="3">
                {facilitator?.program_faciltators?.status ===
                  "pragati_mobilizer" && (
                  <FrontEndTypo.H2 bold mx="8" pb="5px" pt="10">
                    {t("ITS_TIME_TO_START_MOBILIZING")}
                  </FrontEndTypo.H2>
                )}
              </Stack>
            </Stack>
          )}
          {["applied", ""]?.includes(facilitator.status) &&
            progress !== 100 && (
              <Stack>
                <VStack p="5" pt={1}>
                  <FrontEndTypo.Primarybutton
                    //old route for complete profile
                    //onPress={(e) => navigate("/profile/edit/basic_details")}
                    //old route for complete profile
                    onPress={(e) => navigate("/profile/edit/basic_details")}
                    bold
                    flex="1"
                  >
                    {t("COMPLETE_FORM")}
                  </FrontEndTypo.Primarybutton>
                </VStack>
              </Stack>
            )}
          {!["yes"].includes(facilitator?.aadhar_verified) && (
            <Stack p="5" space={4}>
              {[undefined].includes(facilitator?.aadhar_no) && (
                <Stack space="3">
                  <Alert status="warning" alignItems={"start"}>
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>
                        {t("ADD_AADHAAR_NUMBER_ERROR_MESSAGE")}
                      </BodyMedium>
                    </HStack>
                  </Alert>
                  <FrontEndTypo.Primarybutton
                    onPress={(e) => navigate(`/profile/edit/aadhaar_details`)}
                  >
                    {t("ADD_AADHAAR_NUMBER")}
                  </FrontEndTypo.Primarybutton>
                </Stack>
              )}
              {["upload", ""].includes(
                facilitator?.aadhaar_verification_mode
              ) && (
                <Stack space="3">
                  <Alert status="warning" alignItems={"start"}>
                    <HStack alignItems="center" space="2" color>
                      <Alert.Icon />
                      <BodyMedium>
                        {t("COMPLETE_YOUR_AADHAR_VERIFICATION_NOW")}
                      </BodyMedium>
                    </HStack>
                  </Alert>
                  <FrontEndTypo.Primarybutton
                    onPress={(e) =>
                      navigate(`/aadhaar-kyc/${facilitator?.id}/okyc2`, {
                        state: "/",
                      })
                    }
                  >
                    {t("AADHAR_NUMBER_KYC")}
                  </FrontEndTypo.Primarybutton>
                </Stack>
              )}
            </Stack>
          )}
          {isDocumentUpload() && (
            <Stack bg="bgYellowColor.400" space="6" p={4}>
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {t("UPLOAD_YOUR_DOCUMENTS")}
              </FrontEndTypo.H2>
              <FrontEndTypo.H3>
                {t("YOU_NEED_TO_UPLOAD_THESE_DOCUMENTS")}
              </FrontEndTypo.H3>
              {isDocumentUpload("qualifications") && (
                <HStack space="2">
                  <IconByName
                    isDisabled
                    name="CheckboxCircleLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <VStack width="99%">
                    <FrontEndTypo.H3 bold>
                      {t("QUALIFICATION_PROOF")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H4>
                      {t("THIS_CAN_BE_YOUR_HIGHEST_GRADE")}
                    </FrontEndTypo.H4>
                  </VStack>
                </HStack>
              )}
              {isDocumentUpload("experience") && (
                <HStack space="2">
                  <IconByName
                    isDisabled
                    name="CheckboxCircleLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <VStack width="99%">
                    <FrontEndTypo.H3 bold>
                      {t("WORK_EXPERIENCE_PROOF")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H4>
                      {t("THIS_CAN_BE_LETTER_OF")}
                    </FrontEndTypo.H4>
                  </VStack>
                </HStack>
              )}
              {/* {isDocumentUpload("vo_experience") && (
                <HStack space="2">
                  <IconByName
                    isDisabled
                    name="CheckboxCircleLineIcon"
                    _icon={{ size: "20px" }}
                  />
                  <VStack width="99%">
                    <FrontEndTypo.H3 bold>
                      {t("VOLUNTEER_EXPERIENCE_PROOF")}
                    </FrontEndTypo.H3>
                    <FrontEndTypo.H4>
                      {t("THIS_CAN_BE_REFERENCE_OR_LETTER_OF")}
                    </FrontEndTypo.H4>
                  </VStack>
                </HStack>
              )} */}
              <HStack>
                <FrontEndTypo.Secondarybutton
                  width="100%"
                  endIcon={
                    <IconByName
                      isDisabled
                      name="Upload2FillIcon"
                      _icon={{ size: "25px" }}
                      color="gray.800"
                    />
                  }
                  onPress={(e) => navigate("/profile")}
                >
                  {t("UPLOAD_NOW")}
                </FrontEndTypo.Secondarybutton>
              </HStack>
            </Stack>
          )}
        </VStack>
      </VStack>
      <Modal
        isOpen={selectCohortForm}
        safeAreaTop={true}
        size="xl"
        _backdrop={{ opacity: "0.7" }}
      >
        <Modal.Content>
          <Modal.Header p="5" borderBottomWidth="0">
            <FrontEndTypo.H1 textAlign="center">
              {t("SELECT_COHORT_INFO")}
            </FrontEndTypo.H1>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <Select
                selectedValue={academicYear}
                accessibilityLabel="Choose Service"
                placeholder={t("SELECT")}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) => handleAcademicYear(itemValue)}
              >
                {academicData?.map((item, index) => {
                  return (
                    <Select.Item
                      key={item.id}
                      label={item?.academic_year_name}
                      value={item?.academic_year_id}
                    />
                  );
                })}
              </Select>
              <HStack space="5" pt="5">
                <FrontEndTypo.Primarybutton
                  flex={1}
                  onPress={async (e) => {
                    selectAcademicYear();
                  }}
                >
                  {t("SELECT_COHORT_NEXT")}
                </FrontEndTypo.Primarybutton>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={isUserRegisterExist}
        safeAreaTop={true}
        size="xl"
        _backdrop={{ opacity: "0.7" }}
      >
        <Modal.Content>
          <Modal.Header p="5" borderBottomWidth="0">
            <FrontEndTypo.H1 textAlign="center">
              {t("REGISTER_EXIST_CONFIRM")}
            </FrontEndTypo.H1>
            <CloseIcon
              onClick={async () => await removeRegisterExist()}
              style={{ cursor: "pointer" }}
            />
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <FrontEndTypo.H2 textAlign="center">
                {t("REGISTER_EXIST_CONFIRM_INFO")
                  .replace("{{state}}", programData?.program_name)
                  .replace("{{year}}", cohortData?.academic_year_name)}
              </FrontEndTypo.H2>
              <HStack space="5" pt="5">
                <FrontEndTypo.Primarybutton
                  flex={1}
                  onPress={async (e) => {
                    userExistRegisterClick();
                  }}
                >
                  {t("REGISTER_EXIST_INFO")}
                </FrontEndTypo.Primarybutton>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={showWarning}
        safeAreaTop={true}
        size="xl"
        _backdrop={{ opacity: "0.7" }}
      >
        <Modal.Content>
          <Modal.Body p="5">
            <VStack space="5">
              <Alert status="warning" alignItems={"start"}>
                <HStack alignItems="center" space="2" color>
                  <Alert.Icon />
                  <BodyMedium>{t("PLEASE_TURN_ON_YOUR_INTERNET")}</BodyMedium>
                </HStack>
              </Alert>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

const InfoBox = ({ status, progress }) => {
  let infoBox;
  const { t } = useTranslation();

  switch (status) {
    case "application_screened":
    case "screened":
      infoBox = (
        <HStack
          {...styles.inforBox}
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold>
              {t("SELECTED_FOR_INTERVIEW")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4>
              {t("CONGRATULATIONS_YOU_ARE_SELECTED_FOR_THE_INTERVIEW")}
            </FrontEndTypo.H4>
          </VStack>
        </HStack>
      );
      break;
    case "shortlisted_for_orientation":
      infoBox = (
        <HStack
          {...styles.inforBox}
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold>
              {t("SHORTLISTED_FOR_ORIENTATION")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4>
              {t("CONGRATULATIONS_YOURE_SHORTLISTED_FOR_THE_ORIENTATION")}
            </FrontEndTypo.H4>
          </VStack>
        </HStack>
      );
      break;
    case "pragati_mobilizer":
      infoBox = (
        <HStack
          {...styles.inforBox}
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold>
              {t("YOU_ARE_NOW_A_PRAGATI_MOBILIZER")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4>
              {t("YOU_ARE_NOW_A_PRAGATI_MOBILIZER")}
            </FrontEndTypo.H4>
          </VStack>
        </HStack>
      );
      break;
    case "rusticate":
    case "quit":
    case "rejected":
    case "on_hold":
      infoBox = (
        <HStack
          // {...styles.inforBox}
          bg="red.600"
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="Forbid2LineIcon"
            color="white"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold color="white">
              {t(status?.toUpperCase())}
            </FrontEndTypo.H3>
          </VStack>
        </HStack>
      );
      break;
    default:
      infoBox = (
        <HStack
          {...styles.inforBox}
          p="5"
          borderBottomWidth="1"
          borderBottomColor={"gray.300"}
          shadows="BlueOutlineShadow"
        >
          <IconByName
            flex="0.1"
            isDisabled
            name="UserLineIcon"
            _icon={{ size: "25px" }}
          />
          <VStack flex="0.9">
            <FrontEndTypo.H3 bold>
              {t("YOUR_APPLICATION_IS_UNDER_REVIEW")}
            </FrontEndTypo.H3>
            {progress === 100 ? (
              <FrontEndTypo.H4>{t("PROFILE_COMPLETED")}</FrontEndTypo.H4>
            ) : (
              <FrontEndTypo.H4>{t("MEANWHILE_PROFILE")}</FrontEndTypo.H4>
            )}
          </VStack>
        </HStack>
      );
      break;
  }

  return infoBox;
};

const TableCard = ({ data, columns, setExamEvent }) => {
  const { t } = useTranslation();

  const setData = (item) => {
    let jsonData = {};
    columns.forEach((e, key) => {
      jsonData = { ...jsonData, [key]: e?.selector(item) || "" };
    });
    return jsonData;
  };
  return (
    <VStack alignItems={"center"} space="5">
      {data?.map((item) => (
        <CardComponent
          footerComponent={
            <VStack px="4" p="2">
              <FrontEndTypo.Primarybutton
                p="0"
                onPress={(e) => setExamEvent(data)}
              >
                {t("SELECT")}
              </FrontEndTypo.Primarybutton>
            </VStack>
          }
          key={item}
          grid={2}
          _body={{ bg: "light.100", roundedBottom: 0, p: 4 }}
          _subHstack={{ flex: 1, space: 2 }}
          _hstack={{ space: 2 }}
          _vstack={{
            width: "100%",
            space: 0,
          }}
          item={setData(item)}
          arr={columns?.map((e, key) => key) || []}
          label={columns?.map((e) => e?.name) || []}
          isHideProgressBar
        />
      ))}
    </VStack>
  );
};
Dashboard.propTypes = {
  userTokenInfo: PropTypes.any,
  footerLinks: PropTypes.any,
};
