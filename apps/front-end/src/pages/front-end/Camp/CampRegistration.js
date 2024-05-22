import {
  BodyMedium,
  ConsentService,
  FrontEndTypo,
  IconByName,
  Layout,
  arrList,
  campService,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getSelectedProgramId,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import {
  HStack,
  Pressable,
  Image,
  Avatar,
  Alert,
  VStack,
  Progress,
  Box,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, Avatar, HStack, Image, Pressable, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

const getColor = (obj, arr) => {
  const result = arrList(obj, arr);
  let color = "gray.300";
  if (result === 100) {
    color = "green.300";
  } else if (result > 20) {
    color = "amber.300";
  }
  return color;
};

export default function CampRegistration({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const camp_id = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [campLocation, setCampLocation] = useState();
  const [campVenue, setCampVenue] = useState();
  const [campStatus, setCampStatus] = useState();
  const [facilities, setFacilities] = useState();
  const [kit, setKit] = useState();
  const [kitarr, setKitarr] = useState([]);
  const [consent, setConsent] = useState("amber.300");
  const [campDetails, setCampDetails] = useState();
  const [isDisable, setIsDisable] = useState(false);

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

  const navdata = [
    {
      Icon: "MapPinLineIcon",
      Name: "CAMP_LOCATION",
      step: "edit_camp_location",
      color: getColor(campLocation, [
        "lat",
        "long",
        "property_type",
        "state",
        "district",
        "block",
        "village",
        "grampanchayat",
      ]),
    },
    {
      Icon: "CameraLineIcon",
      Name: "CAMP_VENUE_PHOTOS",
      step: "edit_photo_details",
      color: getColor(campVenue, [
        "property_photo_building",
        "property_photo_classroom",
      ]),
    },
    {
      Icon: "StarLineIcon",
      Name: "FACILITIES",
      step: "edit_property_facilities",

      color: getColor(facilities, ["property_facilities"]),
    },
    {
      Icon: "MapPinLineIcon",
      Name: "KIT",
      step: "edit_kit_details",
      color: getColor(kit, kitarr),
    },
    {
      Icon: "CheckboxLineIcon",
      Name: "FAMILY_CONSENT",
      step: "edit_family_consent",
      color: consent,
    },
  ];

  useEffect(async () => {
    setLoading(true);
    const result = await campService.getCampDetails(camp_id);
    setCampDetails(result?.data);
    const campStatusNew = result?.data?.group?.status;
    setCampStatus(campStatusNew);
    const campConsent = await ConsentService.getConsent({
      camp_id: camp_id?.id,
    });
    const userLength = result?.data?.group_users?.length;
    const campConsentLength = campConsent?.data?.length;
    if (userLength <= campConsentLength) {
      setConsent("green.300");
    }
    const data = result?.data?.properties;
    setCampLocation({
      lat: data?.lat,
      long: data?.long,
      property_type: data?.property_type,
      state: data?.state,
      district: data?.district,
      block: data?.block,
      village: data?.village,
      grampanchayat: data?.grampanchayat,
    });
    setCampVenue({
      property_photo_building: data?.property_photo_building,
      property_photo_classroom: data?.property_photo_classroom,
      property_photo_other: data?.property_photo_other,
    });
    setFacilities({ property_facilities: data?.property_facilities });
    setKit({
      kit_feedback: result?.data?.kit_feedback,
      kit_ratings: result?.data?.kit_ratings,
      kit_was_sufficient: result?.data?.kit_was_sufficient,
      kit_received: result?.data?.kit_received,
    });
    setKitarr([
      "kit_received",
      "kit_was_sufficient",
      "kit_ratings",
      "kit_feedback",
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (
      ["registered", "inactive", "camp_ip_verified"].includes(campStatus) ||
      !["CAMP_VENUE_PHOTOS", "CAMP_LOCATION", "FACILITIES", "KIT"].every(
        (name) =>
          navdata.some(
            (item) => item.Name === name && item.color === "green.300"
          )
      )
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [campStatus, navdata]);

  const onPressBackButton = async () => {
    navigate("/camps");
  };

  const disableEdit = (extra = []) =>
    ["camp_ip_verified", ...extra].includes(campStatus) ? false : true;

  const SubmitCampRegistration = async () => {
    setIsDisable(true);
    const obj = {
      id: camp_id?.id,
      status: "registered",
      edit_page_type: "edit_camp_status",
    };
    const data = await campService.updateCampDetails(obj);
    if (data) {
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
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("CAMP_REGISTER"),
        onPressBackButton,
        _box: { bg: "white" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
    >
      <VStack p="4" space={4}>
        <FrontEndTypo.H1>{t("CAMP_PROFILE")}</FrontEndTypo.H1>
        <VStack>
          <FrontEndTypo.H3 bold color={"textGreyColor.750"}>{`${t("CAMP_ID")}:${
            campDetails?.id
          }`}</FrontEndTypo.H3>
        </VStack>
        <VStack>
          <Progress
            value={arrList(
              {
                ...campDetails,
                location: [
                  campDetails?.properties?.district,
                  campDetails?.properties?.block,
                  campDetails?.properties?.grampanchayat,
                  campDetails?.properties?.village,
                  campDetails?.properties?.property_type,
                ],
                camp_photo: [
                  campDetails?.properties?.property_photo_building,
                  campDetails?.properties?.property_photo_classroom,
                  campDetails?.properties?.property_photo_other,
                ],
                facilities: [campDetails?.properties?.property_facilities],
              },
              ["location", "camp_photo", "facilities", "kit_received"]
            )}
            size="sm"
            colorScheme="warning"
          />
        </VStack>
        <VStack
          borderColor="btnGray.100"
          borderRadius="10px"
          borderWidth="1px"
          shadow="AlertShadow"
          // space={2}
        >
          <Pressable
            bg="boxBackgroundColour.100"
            // shadow="AlertShadow"
            borderBottomColor={"garyTitleCardBorder"}
            borderBottomStyle={"solid"}
            borderBottomWidth={"2px"}
            onPress={async () => {
              disableEdit() &&
                navigate(`/camps/${camp_id?.id}/edit_camp_selected_learners`);
            }}
          >
            <HStack w={"100%"} py={3} px={2} justifyContent={"space-between"}>
              <HStack alignItems={"center"}>
                <FrontEndTypo.H3 color="floatingLabelColor.500" bold ml={5}>
                  {t("UPDATE_LEARNER")}
                </FrontEndTypo.H3>
              </HStack>
              {disableEdit() && (
                <IconByName
                  isDisabled
                  name="ArrowRightSLineIcon"
                  _icon={{ size: "30px" }}
                  color="textBlack.500"
                />
              )}
            </HStack>
          </Pressable>

          {navdata.map((item) => {
            return (
              <NavigationBox
                key={item}
                camp_id={camp_id}
                // IconName={item?.Icon}
                NavName={item?.Name}
                step={item?.step}
                color={item?.color}
                disableEdit={disableEdit(["inactive"])}
              />
            );
          })}
          {campDetails?.kit_received === "yes" && (
            <Pressable
              bg="boxBackgroundColour.100"
              // shadow="AlertShadow"
              borderRadius="10px"
              onPress={async () => {
                navigate(`/camps/${camp_id?.id}/kit_material_details`);
              }}
            >
              <HStack w={"100%"} py={3} px={2} justifyContent={"space-between"}>
                <HStack alignItems={"center"}>
                  <FrontEndTypo.H3 bold color="floatingLabelColor.500" ml={5}>
                    {["registered", "inactive", "verified"].includes(campStatus)
                      ? t("UPDATE_CAMP_KIT_DETAILS")
                      : t("CAMP_KIT_MATERIAL_DETAILS")}
                  </FrontEndTypo.H3>
                </HStack>

                <IconByName
                  isDisabled
                  name="ArrowRightSLineIcon"
                  _icon={{ size: "30px" }}
                  color="textBlack.500"
                />
              </HStack>
            </Pressable>
          )}
        </VStack>
        {campStatus === "registered" && (
          <Alert
            status="warning"
            alignItems={"start"}
            mb="3"
            mt="4"
            width={"100%"}
          >
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <BodyMedium>{t("CAMP_APPROVAL_MSG")}</BodyMedium>
            </HStack>
          </Alert>
        )}
        <HStack my={3} mx={"auto"} w={"90%"}>
          <FrontEndTypo.Secondarybutton
            isDisabled={isDisable}
            width={"100%"}
            onPress={() => {
              SubmitCampRegistration();
            }}
          >
            {t("SUBMIT_FOR_REGISTRATION")}
          </FrontEndTypo.Secondarybutton>
        </HStack>
      </VStack>
    </Layout>
  );
}

const NavigationBox = ({
  IconName,
  NavName,
  camp_id,
  color,
  step,
  disableEdit,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navToForm = (step) => {
    if (disableEdit) {
      navigate(`/camps/${camp_id?.id}/${step}`);
    }
  };

  return (
    <Pressable
      onPress={async () => {
        navToForm(step);
      }}
      bg="boxBackgroundColour.100"
      shadow="AlertShadow"
      borderLeftWidth={10}
      borderLeftColor={color}
      borderRadius="10px"
      borderBottomColor={"garyTitleCardBorder"}
      borderBottomStyle={"solid"}
      borderBottomWidth={"2px"}
    >
      <HStack w={"100%"} py={3} justifyContent={"space-between"}>
        <HStack alignItems={"center"}>
          <FrontEndTypo.H3 color="floatingLabelColor.500" bold ml={5}>
            {t(NavName)}
            {!["FAMILY_CONSENT"].includes(NavName) && (
              <FrontEndTypo.H3 color={"textMaroonColor.400"}>*</FrontEndTypo.H3>
            )}
          </FrontEndTypo.H3>
        </HStack>
        {disableEdit && (
          <IconByName
            isDisabled
            name="ArrowRightSLineIcon"
            //color="amber.400"
            _icon={{ size: "30px" }}
            color="textBlack.500"
          />
        )}
      </HStack>
    </Pressable>
  );
};
