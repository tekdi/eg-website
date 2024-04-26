import {
  FrontEndTypo,
  Layout,
  t,
  CardComponent,
  campService,
  setSelectedProgramId,
  getOnboardingMobile,
  setSelectedAcademicYear,
  getSelectedProgramId,
  enumRegistryService,
  facilitatorRegistryService,
  objProps,
  arrList,
} from "@shiksha/common-lib";
import React, { useEffect, useState } from "react";
import { VStack, HStack, Pressable, Stack, Alert } from "native-base";

import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

export default function CampSetting({ footerLinks, userTokenInfo }) {
  const weeks = [
    "WEEK_SUNDAY",
    "WEEK_MONDAY",
    "WEEK_TUESDAY",
    "WEEK_WEDNESDAY",
    "WEEK_THURSDAY",
    "WEEK_FRIDAY",
    "WEEK_SATURDAY",
  ];
  const camp_id = useParams();
  const [selectedDays, setSelectedDays] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState();
  const [selectedEndTime, setSelectedEndTime] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const [error, setError] = useState();

  // PROFILE DATA IMPORTS
  const [facilitator, setFacilitator] = useState({ notLoaded: true });
  const fa_id = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);
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

  const navigate = useNavigate();

  const handleDayClick = (day) => {
    if (selectedDays?.includes(day)) {
      setSelectedDays(selectedDays?.filter((d) => d !== day));
    } else {
      setSelectedDays(day);
    }
  };

  useEffect(async () => {
    const data = await campService.getCampDetails(camp_id);
    const camp = data?.data;
    setSelectedStartTime(camp?.preferred_start_time);
    setSelectedEndTime(camp?.preferred_end_time);
    setSelectedDays(camp?.week_off);
  }, []);

  const handleSubmit = async () => {
    setIsDisable(true);
    const START_TIME = new Date(selectedStartTime);
    const END_TIME = new Date(selectedEndTime);
    const obj = {
      id: JSON.parse(camp_id?.id),
      edit_page_type: "edit_camp_settings",
      preferred_start_time: `${START_TIME}`,
      preferred_end_time: `${END_TIME}`,
      week_off: selectedDays,
    };
    if (!selectedStartTime || !selectedEndTime) {
      setError("REQUIRED_MESSAGE");
      setIsDisable(false);
    } else if (START_TIME >= END_TIME) {
      setError("END_TIME_SHOULD_BE_GREATER_THAN_START_TIME");
      setIsDisable(false);
    } else {
      await campService.updateCampDetails(obj);
      navigate("/camps");
    }
  };

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

  return (
    <Layout
      _appBar={{
        name: t("Settings"),
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _footer={{ menues: footerLinks }}
    >
      <VStack space={4} p={4}>
        <CardComponent _vstack={{ flex: 1 }} _body={{ pt: 4 }}>
          <VStack alignItems="center" space={3}>
            <FrontEndTypo.H2>{t("PREFERRED_TIME")}</FrontEndTypo.H2>
            <FrontEndTypo.H3>
              {t("PLEASE_INDICATE_SUITABLE_TIME_CAMPING")}
            </FrontEndTypo.H3>
          </VStack>
          <Alert status="warning" alignItems={"start"} mt="2">
            <HStack alignItems="center" space="2">
              <Alert.Icon />
              <FrontEndTypo.H3>{t("CAMP_SETTINGS_ALERT")}</FrontEndTypo.H3>
            </HStack>
          </Alert>
          <HStack
            marginTop={10}
            alignItems="center"
            justifyContent={"center"}
            space={4}
          >
            <FrontEndTypo.H4>{t("START_TIME")}:</FrontEndTypo.H4>
            <TimePicker
              placeholder={t("SELECT_TIME")}
              use12Hours
              value={selectedStartTime ? moment(selectedStartTime) : ""}
              showSecond={false}
              focusOnOpen={true}
              format="hh:mm A"
              onChange={(e) => setSelectedStartTime(e?._d)}
            />
            <FrontEndTypo.H4>{t("END_TIME")}:</FrontEndTypo.H4>

            <TimePicker
              placeholder={t("SELECT_TIME")}
              use12Hours
              value={selectedEndTime ? moment(selectedEndTime) : ""}
              showSecond={false}
              focusOnOpen={true}
              format="hh:mm A"
              onChange={(e) => setSelectedEndTime(e?._d)}
            />
          </HStack>
          {error && (
            <Alert mt={4} status="warning">
              <HStack space={2}>
                <Alert.Icon />
                <FrontEndTypo.H3>{t(error)}</FrontEndTypo.H3>
              </HStack>
            </Alert>
          )}
          <Stack marginTop={10} alignItems="center" space={3}>
            <FrontEndTypo.H2>
              {t("PLEASE_ENTER_THE_DAYS_YOU_WANT_TO_TAKE_THE_WEEKLY_OFF")}
            </FrontEndTypo.H2>
          </Stack>

          <HStack justifyContent="center" space={4} flexWrap={"wrap"}>
            {weeks.map((day, index) => (
              <Pressable
                key={day}
                borderWidth="2"
                onPress={() => handleDayClick(day)}
                _pressed={{
                  bg: "textMaroonColor.500",
                  borderWidth: 2,
                  borderColor: "textMaroonColor.500",
                }}
                bg={
                  selectedDays?.includes(day) ? "textMaroonColor.500" : "white"
                }
                borderColor={
                  selectedDays?.includes(day)
                    ? "textMaroonColor.500"
                    : "textGreyColor.50"
                }
                color={selectedDays?.includes(day) ? "white" : "black"}
                style={{
                  width: 100,
                  height: 50,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {t(day)}
              </Pressable>
            ))}
          </HStack>
        </CardComponent>
        <FrontEndTypo.Primarybutton
          onPress={handleSubmit}
          isDisabled={isDisable}
        >
          {t("SAVE")}
        </FrontEndTypo.Primarybutton>
      </VStack>
    </Layout>
  );
}

CampSetting.propTypes = {
  footerLinks: PropTypes.any,
};
