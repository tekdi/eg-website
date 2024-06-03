import {
  Layout,
  t,
  benificiaryRegistoryService,
  FrontEndTypo,
  BodyMedium,
  getBeneficaryDocumentationStatus,
  SelectStyle,
  enumRegistryService,
  IconByName,
  getSelectedProgramId,
  setSelectedProgramId,
  getOnboardingMobile,
  setSelectedAcademicYear,
  facilitatorRegistryService,
  objProps,
  arrList,
} from "@shiksha/common-lib";
import React, { Fragment, useEffect, useState } from "react";
import {
  VStack,
  HStack,
  Select,
  CheckIcon,
  Alert,
  FormControl,
  Text,
  Box,
} from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

const LearnerDocsChecklist = ({ footerLinks, userTokenInfo }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const [selectData, setselectData] = useState([]);
  const [status, setStatus] = useState({});
  const [checkList, setCheckList] = useState(false);
  const [buttonPress, setButtonPress] = useState(false);
  const [benificiary, setBenificiary] = useState({});
  const [msgshow, setmsgshow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const [reqEnumData, setReqEnumData] = useState();
  const [optEnumData, setOptEnumData] = useState();
  const [alert, setAlert] = useState();

  // PROFILE DATA IMPORTS
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

  useEffect(async () => {
    let data = await benificiaryRegistoryService.getOne(id);
    let docStatus = data?.result?.program_beneficiaries?.documents_status;
    setBenificiary(data?.result);
    setLoading(false);
    setmsgshow(getBeneficaryDocumentationStatus(docStatus));
    if (data.result?.program_beneficiaries?.documents_status) {
      setStatus(
        JSON.parse(data.result?.program_beneficiaries?.documents_status)
      );
    }
  }, []);
  useEffect(async () => {
    let data = await benificiaryRegistoryService.getDocumentStatus();
    setselectData(data);
  }, []);
  const navigate = useNavigate();

  useEffect(async () => {
    const keysLength = Object.keys(status).length;
    if (benificiary?.program_beneficiaries?.status === "ready_to_enroll") {
      setButtonPress(true);
    } else {
      setButtonPress(false);
    }
    const allValuesMatch = Object.values(status).every(
      (value) => value === "not_applicable" || value === "complete"
    );
    if (keysLength === 13 && allValuesMatch) {
      setCheckList(true);
    } else {
      setCheckList(false);
      setButtonPress(false);
    }
    let data = {
      edit_page_type: "document_status",
      documents_status: status,
    };
    if (Object.keys(status).length > 0) {
      let dataOutput = await benificiaryRegistoryService.getStatusUpdate(
        id,
        data
      );
    }
  }, [status]);

  const readyToEnrollApiCall = async () => {
    setIsDisable(true);
    if (
      !benificiary?.program_beneficiaries?.enrollment_status ||
      benificiary?.program_beneficiaries?.enrollment_status === "identified"
    ) {
      let bodyData = {
        user_id: benificiary?.id?.toString(),
        status: "ready_to_enroll",
        reason_for_status_update: "documents_completed",
      };
      const result = await benificiaryRegistoryService.statusUpdate(bodyData);
      if (result) {
        setAlert({ type: "success", title: t("DOCUMENT_COMPLETED") });
        navigate(`/beneficiary/profile/${id}`);
      }
    }
    setButtonPress(true);
  };

  useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    const data = qData?.data?.DOCUMENT_LIST;
    const reqFilteredDocuments = data.filter(
      (document) => document.type === "required"
    );
    setReqEnumData(reqFilteredDocuments);

    const optionalFilteredDocuments = data?.filter(
      (document) => document.type === "optional"
    );
    setOptEnumData(optionalFilteredDocuments);
  }, []);

  const saveDataToIndexedDB = async () => {
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    try {
      const [ListOfEnum, qualification, editRequest] = await Promise.allSettled(
        [
          enumRegistryService.listOfEnum(),
          enumRegistryService.getQualificationAll(),
          facilitatorRegistryService.getEditRequests(obj),
          // enumRegistryService.userInfo(),
        ]
      );
      const currentTime = moment().toString();
      await Promise.all([
        setIndexedDBItem("enums", ListOfEnum.data),
        setIndexedDBItem("qualification", qualification),
        setIndexedDBItem("lastFetchTime", currentTime),
        setIndexedDBItem("editRequest", editRequest),
      ]);
    } catch (error) {
      console.error("Error in Promise.all fetching data:", error);
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
      try {
        if (!facilitator?.notLoaded === true) {
          const res = objProps(facilitator);
          setProgress(
            arrList(
              {
                ...res,
                qua_name:
                  facilitator?.qualifications?.qualification_master?.name,
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
          let onboardingURLData = await getOnboardingURLData();
          setCohortData(onboardingURLData?.cohortData);
          setProgramData(onboardingURLData?.programData);
          const user_program_id = facilitator?.program_faciltators?.program_id;
          const program_data = await facilitatorRegistryService.getProgram({
            programId: user_program_id,
          });
          setSelectedProgramData(program_data[0]);
          await setSelectedProgramId(program_data[0]);
          let mobile_no = facilitator?.mobile;
          let mobile_no_onboarding = await getOnboardingMobile();
          if (
            mobile_no != null &&
            mobile_no_onboarding != null &&
            mobile_no == mobile_no_onboarding &&
            onboardingURLData?.cohortData
          ) {
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
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
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

  return (
    <Layout
      loading={loading}
      _appBar={{
        name: t("DOCUMENTS_CHECKLIST"),
        lang,
        setLang,
        onPressBackButton: (e) => {
          navigate(`/beneficiary/profile/${id}`);
        },
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"BENEFICIARY_DOCUMENT_CHECKLIST"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("DOCUMENTS_CHECKLIST")}
    >
      {[
        "dropout",
        "rejected",
        "ready_to_enroll",
        "enrolled_ip_verified",
      ].includes(benificiary?.program_beneficiaries?.status) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <VStack width={"90%"} margin={"auto"} mt={3}>
          <FrontEndTypo.H3 fontWeight={"600"} color="textGreyColor.900" mt="3">
            {t("MANDATORY")}
          </FrontEndTypo.H3>

          {reqEnumData?.map((item, index) => (
            <VStack
              key={index}
              mt={5}
              space="2"
              alignItems="start"
              justifyContent="space-between"
            >
              <FormControl gap="4">
                <FormControl.Label
                  rounded="sm"
                  position="absolute"
                  left="1rem"
                  bg="white"
                  px="1"
                  m="0"
                  height={"1px"}
                  alignItems="center"
                  style={{
                    top: "3px",
                    opacity: 1,
                    zIndex: 5,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Text
                    bg={"white"}
                    zIndex={99999999}
                    color={"floatingLabelColor.500"}
                    fontSize="12"
                    fontWeight="400"
                  >
                    {t(item?.title)}
                  </Text>
                </FormControl.Label>

                <Select
                  selectedValue={status[item.value] ? status[item.value] : ""}
                  accessibilityLabel="Select"
                  placeholder={"Select"}
                  mt={1}
                  onValueChange={(itemValue) =>
                    setStatus({ ...status, [item.value]: itemValue })
                  }
                  minH={"56px"}
                  // key={value + items}
                  dropdownIcon={
                    <IconByName
                      color="grayTitleCard"
                      name="ArrowDownSFillIcon"
                    />
                  }
                  borderColor={
                    status[item.value]
                      ? "floatingLabelColor.500"
                      : "inputBorderColor.500"
                  }
                  bg="#FFFFFF"
                  borderWidth={status[item.value] ? "2px" : "1px"}
                  borderRadius={"4px"}
                  fontSize={"16px"}
                  letterSpacing={"0.5px"}
                  fontWeight={400}
                  lineHeight={"24px"}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                >
                  {selectData?.map((selectItem, i) => (
                    <Select.Item
                      key={i}
                      label={t(selectItem.title)}
                      value={selectItem.value}
                    />
                  ))}
                </Select>
              </FormControl>
            </VStack>
          ))}

          <FrontEndTypo.H3
            pt="6"
            pb="0"
            fontWeight={"600"}
            color="textMaroonColor.900"
          >
            {t("MAY_BE_REQUIRED")}
          </FrontEndTypo.H3>

          {optEnumData?.map((item, index) => (
            <VStack
              key={index}
              mt={5}
              space="2"
              alignItems="start"
              justifyContent="space-between"
            >
              <FormControl gap="4">
                <FormControl.Label
                  rounded="sm"
                  position="absolute"
                  left="1rem"
                  bg="white"
                  px="1"
                  m="0"
                  height={"1px"}
                  alignItems="center"
                  style={{
                    top: "3px",
                    opacity: 1,
                    zIndex: 5,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Text
                    bg={"white"}
                    zIndex={99999999}
                    color={"floatingLabelColor.500"}
                    fontSize="12"
                    fontWeight="400"
                  >
                    {t(item?.title)}
                  </Text>
                </FormControl.Label>

                <Select
                  selectedValue={status[item.value] ? status[item.value] : ""}
                  accessibilityLabel="Select"
                  placeholder={"Select"}
                  mt={1}
                  onValueChange={(itemValue) =>
                    setStatus({ ...status, [item.value]: itemValue })
                  }
                  minH={"56px"}
                  // key={value + items}
                  dropdownIcon={
                    <IconByName
                      color="grayTitleCard"
                      name="ArrowDownSFillIcon"
                    />
                  }
                  borderColor={
                    status[item.value]
                      ? "floatingLabelColor.500"
                      : "inputBorderColor.500"
                  }
                  bg="#FFFFFF"
                  borderWidth={status[item.value] ? "2px" : "1px"}
                  borderRadius={"4px"}
                  fontSize={"16px"}
                  letterSpacing={"0.5px"}
                  fontWeight={400}
                  lineHeight={"24px"}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                >
                  {selectData?.map((selectItem, i) => (
                    <Select.Item
                      key={i}
                      label={t(selectItem.title)}
                      value={selectItem.value}
                    />
                  ))}
                </Select>
              </FormControl>
            </VStack>
          ))}
          {checkList &&
            (buttonPress ? (
              <Box display={"flex"} alignItems={"center"}>
                <FrontEndTypo.ColourPrimaryButton
                  isDisabled={isDisable}
                  mb={1}
                  minW="60%"
                  type="submit"
                >
                  {t("MARK_AS_COMPLETE")}
                </FrontEndTypo.ColourPrimaryButton>
              </Box>
            ) : (
              <VStack>
                <Alert status="warning" alignItems={"start"} mb="3">
                  <HStack alignItems="center" space="2" color>
                    <Alert.Icon />
                    <BodyMedium justifyContent="Center">
                      {t("DOCUMENT_INSTRUCTION_MESSAGE")}
                    </BodyMedium>
                  </HStack>
                </Alert>

                <Box display={"flex"} alignItems={"center"}>
                  <FrontEndTypo.Primarybutton
                    isDisabled={isDisable}
                    mb={1}
                    type="submit"
                    minW="60%"
                    onPress={() => {
                      readyToEnrollApiCall();
                    }}
                  >
                    {t("MARK_AS_COMPLETE")}
                  </FrontEndTypo.Primarybutton>
                </Box>
              </VStack>
            ))}
          <Box display={"flex"} alignItems={"center"}>
            <FrontEndTypo.Primarybutton
              isDisabled={isDisable}
              mt="4"
              mb={8}
              minW="60%"
              type="submit"
              onPress={() => {
                navigate(-1);
              }}
            >
              {t("SAVE")}
            </FrontEndTypo.Primarybutton>
          </Box>
        </VStack>
      )}
    </Layout>
  );
};

export default LearnerDocsChecklist;
