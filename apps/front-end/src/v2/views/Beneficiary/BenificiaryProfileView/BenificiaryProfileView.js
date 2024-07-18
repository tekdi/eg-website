import {
  BodyMedium,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  ImageView,
  Layout,
  arrList,
  benificiaryRegistoryService,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getSelectedProgramId,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
  t,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import Clipboard from "component/Clipboard";
import {
  Actionsheet,
  Alert,
  Box,
  Divider,
  HStack,
  Progress,
  ScrollView,
  Stack,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

export default function BenificiaryProfileView(props, userTokenInfo) {
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);
  const [isOpenReactive, setIsOpenReactive] = React.useState(false);
  const [isOpenReject, setIsOpenReject] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { id } = useParams();
  const [benificiary, setBenificiary] = React.useState({});
  const [benificiaryDropoutReasons, setBenificiaryDropoutReasons] =
    React.useState();
  const [benificiaryRejectReasons, setBenificiaryRejectReasons] =
    React.useState();
  const [benificiaryReactivateReasons, setBenificiaryReactivateReasons] =
    React.useState();
  const [reasonValue, setReasonValue] = React.useState("");
  const [reactivateReasonValue, setReactivateReasonValue] = React.useState("");
  const [alert, setAlert] = React.useState();
  const [isDisable, setIsDisable] = React.useState(false);
  const navigate = useNavigate();

  // PROFILE DATA IMPORTS conflicts
  const [facilitator, setFacilitator] = useState({ notLoaded: true });
  const fa_id = localStorage.getItem("id");
  const [countLoad, setCountLoad] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cohortData, setCohortData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [isUserRegisterExist, setIsUserRegisterExist] = useState(false);
  const [selectedCohortData, setSelectedCohortData] = useState(null);
  const [selectedProgramData, setSelectedProgramData] = useState(null);
  const [selectCohortForm, setSelectCohortForm] = useState(false);
  const [academicYear, setAcademicYear] = useState(null);
  const [academicData, setAcademicData] = useState([]);
  const [isTodayAttendace, setIsTodayAttendace] = useState();
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
          const data =
            c_data?.data?.filter(
              (eventItem) =>
                eventItem?.params?.do_id?.length &&
                eventItem?.lms_test_tracking?.length < 1
            )?.[0] || {};
          if (data) {
            setIsTodayAttendace(
              data?.attendances.filter(
                (attendance) =>
                  attendance.user_id == fa_id &&
                  attendance.status == "present" &&
                  data.end_date ==
                    moment(attendance.date_time).format("YYYY-MM-DD")
              )
            );

            setCertificateData(data);
            if (data?.lms_test_tracking?.length > 0) {
              setLmsDetails(data?.lms_test_tracking?.[0]);
            }
            const dataDay = moment.utc(data?.end_date).isSame(moment(), "day");
            const format = "HH:mm:ss";
            const time = moment(moment().format(format), format);
            const beforeTime = moment.utc(data?.start_time, format).local();
            const afterTime = moment.utc(data?.end_time, format).local();
            if (time?.isBetween(beforeTime, afterTime) && dataDay) {
              setIsEventActive(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchdata();
  }, [selectedCohortData]);

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

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBenificiaryDropoutReasons(
      result?.data?.BENEFICIARY_REASONS_FOR_DROPOUT_REASONS
    );
    setBenificiaryReactivateReasons(result?.data?.REACTIVATE_REASONS);
    setBenificiaryRejectReasons(
      result?.data?.BENEFICIARY_REASONS_FOR_REJECTING_LEARNER
    );
  }, []);

  // React.useEffect(() => {
  //   if (benificiary?.aadhar_no === null) {
  //     setAlert(t("AADHAAR_REQUIRED_MESSAGE"));
  //   } else {
  //     setAlert();
  //   }
  // }, [benificiary]);

  const res = objProps(benificiary);

  const dropoutApiCall = async () => {
    setIsDisable(true);
    let bodyData = {
      user_id: benificiary?.id?.toString(),
      status: "dropout",
      reason_for_status_update: reasonValue,
    };
    const result = await benificiaryRegistoryService.statusUpdate(bodyData);
    if (result) {
      setIsDisable(false);
      setReasonValue("");
      setIsOpenDropOut(false);
    }
  };

  const reactivateApiCall = async () => {
    setIsDisable(true);
    let bodyData = {
      user_id: benificiary?.id?.toString(),
      status: "identified",
      reason_for_status_update: reactivateReasonValue,
    };
    const result = await benificiaryRegistoryService.statusUpdate(bodyData);
    if (result) {
      setIsDisable(false);
      setReactivateReasonValue("");
      setIsOpenReactive(false);
    }
  };

  const RejectApiCall = async () => {
    let bodyData = {
      user_id: benificiary?.id?.toString(),
      status: "rejected",
      reason_for_status_update: reasonValue,
    };

    const result = await benificiaryRegistoryService.statusUpdate(bodyData);

    if (result) {
      setReasonValue("");
      setIsOpenReject(false);
    }
  };
  React.useEffect(async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
    setLoading(false);
  }, [reactivateReasonValue, reasonValue]);

  function renderDropoutButton() {
    const status = benificiary?.program_beneficiaries?.status;
    switch (status) {
      case "identified":
      case "ready_to_enroll":
      // case "enrolled":
      // case "approved_ip":
      // case "registered_in_camp":
      // case "pragati_syc":
      // case "activate":
      // case "enrolled_ip_verified":
      case null:
        return (
          <Box
            bg="boxBackgroundColour.100"
            borderBottomColor={"garyTitleCardBorder"}
            borderBottomWidth={"1px"}
            borderBottomStyle={"solid"}
          >
            <VStack>
              <VStack space="2">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack space="md" alignItems="Center">
                    <FrontEndTypo.H3
                      onPress={(e) => setIsOpenDropOut(true)}
                      fontWeight={"600"}
                      color="textRed.350"
                    >
                      {t("MARK_AS_DROPOUT")}
                    </FrontEndTypo.H3>
                  </HStack>

                  {benificiary?.program_beneficiaries?.status !== "dropout" &&
                    benificiary?.program_beneficiaries?.status !==
                      "rejected" && (
                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={(e) => setIsOpenDropOut(true)}
                        _icon={{ size: "20", color: "#D53546" }}
                      />
                    )}
                </HStack>
              </VStack>
            </VStack>
          </Box>
        );
      default:
        return <React.Fragment></React.Fragment>;
    }
  }
  function renderReactivateButton() {
    const status = benificiary?.program_beneficiaries?.status;
    switch (status) {
      case "rejected":
      case "dropout":
        return (
          <FrontEndTypo.Secondarybutton
            onPress={(e) => setIsOpenReactive(true)}
          >
            {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
          </FrontEndTypo.Secondarybutton>
        );
      default:
        return <React.Fragment></React.Fragment>;
    }
  }

  function renderRejectButton() {
    const status = benificiary?.program_beneficiaries?.status;
    switch (status) {
      case "identified":
      case "ready_to_enroll":
      // case "enrolled":
      // case "approved_ip":
      // case "registered_in_camp":
      // case "pragati_syc":
      // case "activate":
      // case "enrolled_ip_verified":
      case null:
        return (
          <Box bg="white">
            <VStack>
              <VStack space="2">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack space="md" alignItems="Center">
                    {/* <IconByName name="UserLineIcon" _icon={{ size: "20" }} /> */}
                    <FrontEndTypo.H3
                      onPress={(e) => setIsOpenReject(true)}
                      fontWeight={"600"}
                      color="textRed.350"
                    >
                      {t("REJECT")}
                    </FrontEndTypo.H3>
                  </HStack>

                  {benificiary?.program_beneficiaries?.status !== "dropout" &&
                    benificiary?.program_beneficiaries?.status !==
                      "rejected" && (
                      <IconByName
                        name="ArrowRightSLineIcon"
                        onPress={(e) => setIsOpenReject(true)}
                        _icon={{ size: "20", color: "#D53546" }}
                      />
                    )}
                </HStack>
              </VStack>
              {/* <Divider
                orientation="horizontal"
                bg="btnGray.100"
                thickness="1"
              /> */}
            </VStack>
          </Box>
        );
      default:
        return <React.Fragment></React.Fragment>;
    }
  }

  return (
    <Layout
      _appBar={{
        name: t("BENEFICIARY_PROFILE"),
        onPressBackButton: (e) => {
          navigate("/beneficiary/list");
        },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      loading={loading}
      analyticsPageTitle={"BENEFICIARY_PROFILE"}
      pageTitle={t("BENEFICIARY_PROFILE")}
    >
      {benificiary?.is_deactivated ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("DEACTIVATED_PAGE_MSG")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <VStack paddingBottom="64px">
          <VStack paddingLeft="16px" paddingRight="16px" space="24px">
            <VStack alignItems="Center" pt="20px">
              <FrontEndTypo.H1 mb="4" fontWeight="600">
                {t("LEARNER_PROFILE")}
              </FrontEndTypo.H1>
              <HStack alignItems={"center"} space={4} mb={6}>
                {benificiary?.profile_photo_1?.id ? (
                  <ImageView
                    source={{
                      document_id: benificiary?.profile_photo_1?.id,
                    }}
                    // alt="Alternate Text"
                    width={"190px"}
                    height={"190px"}
                  />
                ) : (
                  <IconByName
                    isDisabled
                    name="AccountCircleLineIcon"
                    color="gray.300"
                    _icon={{ size: "190px" }}
                  />
                )}
              </HStack>
              {![
                "enrolled_ip_verified",
                "registered_in_camp",
                "ineligible_for_pragati_camp",
                "10th_passed",
                "pragati_syc",
              ].includes(benificiary?.program_beneficiaries?.status) ? (
                <FrontEndTypo.H2 bold color="textMaroonColor.400">
                  {benificiary?.first_name}
                  {benificiary?.middle_name &&
                    benificiary?.middle_name !== "null" &&
                    ` ${benificiary.middle_name}`}
                  {benificiary?.last_name &&
                    benificiary?.last_name !== "null" &&
                    ` ${benificiary?.last_name}`}
                </FrontEndTypo.H2>
              ) : (
                <FrontEndTypo.H2 bold color="textMaroonColor.400">
                  {benificiary?.program_beneficiaries?.enrollment_first_name}
                  {benificiary?.program_beneficiaries?.enrollment_middle_name &&
                    benificiary?.program_beneficiaries
                      ?.enrollment_middle_name !== "null" &&
                    ` ${benificiary.program_beneficiaries.enrollment_middle_name}`}
                  {benificiary?.program_beneficiaries?.enrollment_last_name &&
                    benificiary?.program_beneficiaries?.enrollment_last_name !==
                      "null" &&
                    ` ${benificiary?.program_beneficiaries?.enrollment_last_name}`}
                </FrontEndTypo.H2>
              )}
              <Clipboard text={benificiary?.id}>
                <FrontEndTypo.H1 bold>{benificiary?.id}</FrontEndTypo.H1>
              </Clipboard>
              <ChipStatus
                width="fit-content"
                status={benificiary?.program_beneficiaries?.status}
                is_duplicate={benificiary?.is_duplicate}
                is_deactivated={benificiary?.is_deactivated}
                rounded={"sm"}
              />
            </VStack>
            {(benificiary?.program_beneficiaries?.status == "dropout" ||
              benificiary?.program_beneficiaries?.status == "rejected") && (
              <Alert status="warning" alignItems={"start"} mb="3" mt="4">
                <HStack alignItems="center" space="2" color>
                  <Alert.Icon />
                  <BodyMedium>
                    {t(
                      "PLEASE_REACTIVATE_THE_LEARNER_TO_ACCESS_THE_DETAILS_TAB"
                    )}
                  </BodyMedium>
                </HStack>
              </Alert>
            )}
            <Box>
              <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
                {t("PROFILE_PROGRESS")}
              </FrontEndTypo.H3>
              <Box mt={3}>
                <Progress
                  value={arrList(
                    {
                      ...res,
                      ...(res?.references?.[0] ? res?.references?.[0] : {}),
                    },
                    [
                      "email_id",
                      "mobile",
                      "alternative_mobile_number",
                      "device_type",
                      "device_ownership",
                      "mark_as_whatsapp_number",
                      "father_first_name",
                      "father_middle_name",
                      "father_last_name",
                      "mother_first_name",
                      "mother_middle_name",
                      "mother_last_name",
                      "social_category",
                      "marital_status",
                      "first_name",
                      "middle_name",
                      "last_name",
                      "relation",
                      "contact_number",
                      "district",
                      "state",
                      "block",
                      "village",
                      "aadhar_no",
                      "aadhaar_verification_mode",
                      "aadhar_verified",
                    ]
                  )}
                  size="xs"
                  colorScheme="danger"
                />
              </Box>
            </Box>
            <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
              {t("PROFILE_DETAILS")}
            </FrontEndTypo.H3>
            <Box
              bg="boxBackgroundColour.100"
              borderColor="garyTitleCardBorder"
              borderRadius="5px"
              borderWidth="1px"
              shadow={"LearnerProfileViewShadow"}
              pb="4"
            >
              <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
                <VStack space="2">
                  <HStack alignItems="Center" justifyContent="space-between">
                    <HStack space="md" alignItems="Center">
                      <FrontEndTypo.H3
                        fontWeight={"600"}
                        color="floatingLabelColor.500"
                      >
                        {t("BASIC_DETAILS")}
                      </FrontEndTypo.H3>
                    </HStack>

                    {benificiary?.program_beneficiaries?.status !== "dropout" &&
                      benificiary?.program_beneficiaries?.status !==
                        "rejected" && (
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={(e) => {
                            navigate(`/beneficiary/${id}/basicdetails`);
                          }}
                          _icon={{ size: "20", color: "#1F1D76" }}
                        />
                      )}
                  </HStack>
                  <Divider
                    orientation="horizontal"
                    bg="btnGray.100"
                    thickness="1"
                  />
                  <HStack alignItems="Center" justifyContent="space-between">
                    <HStack alignItems="Center" space="md">
                      {/* <IconByName
                        name="MapPinLineIcon"
                        _icon={{ size: "20" }}
                      /> */}

                      <FrontEndTypo.H3
                        fontWeight={"600"}
                        color="floatingLabelColor.500"
                      >
                        {t("ADD_YOUR_ADDRESS")}
                      </FrontEndTypo.H3>
                    </HStack>
                    {benificiary?.program_beneficiaries?.status !== "dropout" &&
                      benificiary?.program_beneficiaries?.status !==
                        "rejected" && (
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={(e) => {
                            navigate(`/beneficiary/${id}/addressdetails`);
                          }}
                          _icon={{ size: "20", color: "#1F1D76" }}
                        />
                      )}
                  </HStack>
                  {/*
                  <Divider
                    orientation="horizontal"
                    bg="btnGray.100"
                    thickness="1"
                  />
                   <HStack alignItems="Center" justifyContent="space-between">
                    <HStack alignItems="Center" space="md">
                      <IconByName name="AddLineIcon" _icon={{ size: "20" }} />

                      <FrontEndTypo.H3 color="textGreyColor.800">
                        {t("AADHAAR_DETAILS")}
                      </FrontEndTypo.H3>
                    </HStack>
                    {benificiary?.program_beneficiaries?.status !== "dropout" &&
                      benificiary?.program_beneficiaries?.status !==
                        "rejected" && (
                        <IconByName
                          name="ArrowRightSLineIcon"
                          onPress={(e) => {
                            navigate(`/beneficiary/${id}/aadhaardetails`);
                          }}
                          color="textMaroonColor.400"
                        />
                      )}
                  </HStack> */}
                </VStack>
              </VStack>
            </Box>

            <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
              {t("OTHER_DETAILS")}
            </FrontEndTypo.H3>
            <VStack
              shadow={"LearnerProfileViewShadow"}
              bg="boxBackgroundColour.100"
              borderColor="garyTitleCardBorder"
              borderRadius="5px"
              borderWidth="1px"
              px="4"
              p="2"
              pb="3"
              divider={
                <Divider
                  orientation="horizontal"
                  bg="btnGray.100"
                  thickness="1"
                />
              }
            >
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                p="3"
                pr="0"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("DOCUMENT_CHECKLIST")}
                </FrontEndTypo.H3>
                {![
                  "enrolled",
                  "dropout",
                  "rejected",
                  "ready_to_enroll",
                  "enrolled_ip_verified",
                ].includes(benificiary?.program_beneficiaries?.status) && (
                  <IconByName
                    name="ArrowRightSLineIcon"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/docschecklist`);
                    }}
                    _icon={{ size: "20", color: "#1F1D76" }}
                  />
                )}
              </HStack>
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                pr="0"
                p="3"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("EDUCATION_DETAILS")}
                </FrontEndTypo.H3>
                {benificiary?.program_beneficiaries?.status !== "dropout" &&
                  benificiary?.program_beneficiaries?.status !== "rejected" && (
                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={(e) => {
                        navigate(`/beneficiary/${id}/educationdetails`);
                      }}
                      _icon={{ size: "20", color: "#1F1D76" }}
                    />
                  )}
              </HStack>
              {alert && (
                <Alert status="warning" alignItems={"start"} mb="3" mt="4">
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium>{alert}</BodyMedium>
                  </HStack>
                </Alert>
              )}

              <HStack
                justifyContent="space-between"
                alignItems="Center"
                p="3"
                pr="0"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("ENROLLMENT_DETAILS")}
                </FrontEndTypo.H3>

                {benificiary?.program_beneficiaries?.status !== "dropout" &&
                  benificiary?.program_beneficiaries?.status !== "rejected" && (
                    <IconByName
                      name="ArrowRightSLineIcon"
                      onPress={(e) => {
                        navigate(`/beneficiary/${id}/enrollmentdetails`);
                      }}
                      _icon={{ size: "20", color: "#1F1D76" }}
                    />
                  )}
              </HStack>

              {benificiary?.program_beneficiaries?.status ===
                "registered_in_camp" && (
                <HStack
                  justifyContent="space-between"
                  alignItems="Center"
                  p="3"
                  pr="1"
                >
                  <FrontEndTypo.H3
                    color="floatingLabelColor.500"
                    fontWeight={"600"}
                  >
                    {t("PCR_DETAILS")}
                  </FrontEndTypo.H3>
                  <IconByName
                    name="ArrowRightSLineIcon"
                    color="#790000"
                    size="sm"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/pcrview`);
                    }}
                    _icon={{ size: "20", color: "#1F1D76" }}
                  />
                </HStack>
              )}
              <HStack
                justifyContent="space-between"
                alignItems="Center"
                p="3"
                pr="1"
              >
                <FrontEndTypo.H3
                  color="floatingLabelColor.500"
                  fontWeight={"600"}
                >
                  {t("JOURNEY_IN_PROJECT_PRAGATI")}
                </FrontEndTypo.H3>
                <IconByName
                  name="ArrowRightSLineIcon"
                  color="#790000"
                  size="sm"
                  onPress={(e) => {
                    navigate(`/beneficiary/${id}/benificiaryJourney`);
                  }}
                  _icon={{ size: "20", color: "#1F1D76" }}
                />
              </HStack>
            </VStack>

            <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.750">
              {t("LEARNER_ACTIONS")}
            </FrontEndTypo.H3>
            <VStack
              borderColor="garyTitleCardBorder"
              borderRadius="5px"
              borderWidth="1px"
              shadow={"LearnerProfileViewShadow"}
              px={3}
              py={4}
              backgroundColor={"white"}
            >
              {renderDropoutButton()}
              {renderReactivateButton()}
              {renderRejectButton()}
            </VStack>
          </VStack>
        </VStack>
      )}

      <Actionsheet
        isOpen={isOpenDropOut}
        onClose={(e) => setIsOpenDropOut(false)}
      >
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <VStack alignItems="end" width="100%">
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setIsOpenDropOut(false)}
              />
            </VStack>

            <FrontEndTypo.H1 fontWeight={"600"} color="textGreyColor.450">
              {t("AG_PROFILE_ARE_YOU_SURE")}
            </FrontEndTypo.H1>
            <FrontEndTypo.H2 color="textGreyColor.450">
              {t("AG_PROFILE_DROPOUT_MESSAGE")}{" "}
            </FrontEndTypo.H2>
            <FrontEndTypo.H2 color="textGreyColor.200" pb="4" pl="2">
              {t("AG_PROFILE_REASON_MEASSGAE")}{" "}
            </FrontEndTypo.H2>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="5">
              <VStack space="2" p="1" rounded="lg" w="100%">
                <VStack alignItems="center" space="1" flex="1">
                  <React.Suspense fallback={<HStack>Loading...</HStack>}>
                    <CustomRadio
                      options={{
                        enumOptions: benificiaryDropoutReasons?.map((e) => ({
                          ...e,
                          label: e?.title,
                          value: e?.value,
                        })),
                      }}
                      schema={{ grid: 2 }}
                      value={reasonValue}
                      onChange={(e) => {
                        setReasonValue(e);
                      }}
                    />
                  </React.Suspense>
                </VStack>
              </VStack>
              <VStack space="5" pt="5">
                <FrontEndTypo.Primarybutton
                  isDisabled={isDisable}
                  flex={1}
                  onPress={() => {
                    dropoutApiCall();
                  }}
                >
                  {t("MARK_AS_DROPOUT")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>

      <Actionsheet
        isOpen={isOpenReactive}
        onClose={(e) => setIsOpenReactive(false)}
      >
        <Stack width={"100%"} maxH={"100%"}>
          <Actionsheet.Content>
            <VStack alignItems="end" width="100%">
              <IconByName
                name="CloseCircleLineIcon"
                onPress={(e) => setIsOpenReactive(false)}
              />
            </VStack>
            <FrontEndTypo.H1 fontWeight={"600"} color="textGreyColor.450">
              {t("AG_PROFILE_ARE_YOU_SURE")}
            </FrontEndTypo.H1>
            <FrontEndTypo.H2 color="textGreyColor.450">
              {t("AG_PROFILE_REACTIVAYE_MESSAGE")}
            </FrontEndTypo.H2>
            <FrontEndTypo.H2 color="textGreyColor.200" pb="4" pl="2">
              {t("AG_PROFILE_REACTIVATE_REASON_MEASSGAE")}
            </FrontEndTypo.H2>
          </Actionsheet.Content>
          <ScrollView width={"100%"} space="1" bg={"gray.100"} p="5">
            <VStack space="5">
              <VStack space="2" p="1" rounded="lg">
                <VStack alignItems="center" bg={"gray.100"} space="1" flex="1">
                  <React.Suspense fallback={<HStack>Loading...</HStack>}>
                    <CustomRadio
                      options={{
                        enumOptions: benificiaryReactivateReasons?.map((e) => ({
                          ...e,
                          label: e?.title,
                          value: e?.value,
                        })),
                      }}
                      schema={{ grid: 2 }}
                      value={reactivateReasonValue}
                      onChange={(e) => {
                        setReactivateReasonValue(e);
                      }}
                    />
                  </React.Suspense>
                </VStack>
              </VStack>
              <VStack space="5" pt="5">
                <FrontEndTypo.Primarybutton
                  isDisabled={isDisable}
                  flex={1}
                  onPress={() => {
                    reactivateApiCall();
                  }}
                >
                  {t("AG_PROFILE_REACTIVATE_AG_LEARNER")}
                </FrontEndTypo.Primarybutton>
              </VStack>
            </VStack>
          </ScrollView>
        </Stack>
      </Actionsheet>

      {/* Reject Action  Sheet */}
      <Actionsheet
        isOpen={isOpenReject}
        onClose={(e) => setIsOpenReject(false)}
      >
        <Actionsheet.Content>
          <VStack alignItems="end" width="100%">
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setIsOpenReject(false)}
            />
          </VStack>

          <FrontEndTypo.H1 fontWeight={"600"} color="textGreyColor.450">
            {t("AG_PROFILE_ARE_YOU_SURE")}
          </FrontEndTypo.H1>

          <FrontEndTypo.H2 color="textGreyColor.200" pb="4" pl="2">
            {t("PLEASE_MENTION_YOUR_REASON_FOR_REJECTING_THE_CANDIDATE")}
          </FrontEndTypo.H2>
          <VStack space="5">
            <VStack space="2" bg="gray.100" p="1" rounded="lg" w="100%">
              <VStack alignItems="center" space="1" flex="1">
                <React.Suspense fallback={<HStack>{t("LOADING")}</HStack>}>
                  <CustomRadio
                    options={{
                      enumOptions: benificiaryRejectReasons?.map((e) => ({
                        ...e,
                        label: e?.title,
                        value: e?.value,
                      })),
                    }}
                    schema={{ grid: 2 }}
                    value={reasonValue}
                    onChange={(e) => {
                      setReasonValue(e);
                    }}
                  />
                </React.Suspense>
              </VStack>
            </VStack>
            <VStack space="5" pt="5">
              <FrontEndTypo.Primarybutton
                flex={1}
                onPress={() => {
                  RejectApiCall();
                }}
              >
                {t("REJECT")}
              </FrontEndTypo.Primarybutton>
            </VStack>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </Layout>
  );
}
