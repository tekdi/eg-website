import {
  BodyMedium,
  CardComponent,
  FrontEndTypo,
  IconByName,
  Layout,
  arrList,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getSelectedProgramId,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
  t,
} from "@shiksha/common-lib";
import moment from "moment";
import { Alert, HStack, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIndexedDBItem } from "v2/utils/Helper/JSHelper.js";
import { getOnboardingData } from "v2/utils/OfflineHelper/OfflineHelper.js";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";
import ProfilePhoto from "../../../v2/components/Functional/ProfilePhoto/ProfilePhoto.js";
import FilePreview from "v2/components/Static/FilePreview/FilePreview.js";

export default function FacilitatorBasicDetails({ userTokenInfo }) {
  const navigate = useNavigate();
  const [fields, setFields] = React.useState([]);

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

  React.useEffect(() => {
    facilitatorDetails();
    getEditRequestFields();
  }, []);

  const facilitatorDetails = async () => {
    const { id } = userTokenInfo?.authUser || {};
    const result = await getOnboardingData(id);
    setFacilitator(result);
  };

  const getEditRequestFields = async () => {
    const { id } = userTokenInfo?.authUser || {};
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    const result = await getIndexedDBItem(`editRequest`);
    let field;
    const parseField = result?.data?.[0]?.fields;
    if (parseField && typeof parseField === "string") {
      field = JSON.parse(parseField);
    }
    setFields(field || []);
  };

  const isProfileEdit = () => {
    return !!(
      facilitator?.program_faciltators?.status !== "enrolled_ip_verified" ||
      (facilitator?.program_faciltators?.status === "enrolled_ip_verified" &&
        (fields.includes("profile_photo_1") ||
          fields.includes("profile_photo_2") ||
          fields.includes("profile_photo_3")))
    );
  };

  const isNameEdit = () => {
    return !!(
      facilitator?.program_faciltators?.status !== "enrolled_ip_verified" ||
      (facilitator?.program_faciltators?.status === "enrolled_ip_verified" &&
        (fields.includes("first_name") ||
          fields.includes("middle_name") ||
          fields.includes("last_name") ||
          fields.includes("dob")))
    );
  };

  const isContactEdit = () => {
    return !!(
      facilitator?.program_faciltators?.status !== "enrolled_ip_verified" ||
      (facilitator?.program_faciltators?.status === "enrolled_ip_verified" &&
        (fields.includes("device_ownership") || fields.includes("device_type")))
    );
  };
  const isAddressEdit = () => {
    return !!(
      facilitator?.program_faciltators?.status !== "enrolled_ip_verified" ||
      (facilitator?.program_faciltators?.status === "enrolled_ip_verified" &&
        (fields.includes("district") || fields.includes("block")))
    );
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
        name: t("BASIC_DETAILS"),
        onPressBackButton: (e) => navigate(`/profile`),
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      analyticsPageTitle={"FACILITATOR_BASIC_DETAILS"}
      pageTitle={t("FACILITATOR")}
      stepTitle={t("BASIC_DETAILS")}
    >
      {["quit"].includes(facilitator?.program_faciltators?.status) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <VStack paddingBottom="64px">
          <VStack p="4" space="24px">
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              space={4}
            >
              <HStack space={4} alignItems={"center"}>
                <VStack>
                  <ProfilePhoto
                    profile_photo_1={facilitator?.profile_photo_1}
                    profile_photo_2={facilitator?.profile_photo_2}
                    profile_photo_3={facilitator?.profile_photo_3}
                  />
                </VStack>
                <VStack>
                  <HStack justifyContent="space-between" alignItems="Center">
                    <FrontEndTypo.H3 color="textGreyColor.200" fontWeight="700">
                      {`${
                        facilitator?.first_name ? facilitator?.first_name : ""
                      } ${
                        facilitator?.middle_name ? facilitator?.middle_name : ""
                      } ${
                        facilitator?.last_name ? facilitator?.last_name : ""
                      }`}
                    </FrontEndTypo.H3>

                    {/* {isNameEdit() && (
                      <IconByName
                        name="PencilLineIcon"
                        color="iconColor.200"
                        _icon={{ size: "20" }}
                        onPress={(e) => {
                          navigate(`/profile/edit/basic_details`);
                        }}
                      />
                    )} */}
                  </HStack>
                  <HStack alignItems="Center">
                    {/* <IconByName name="Cake2LineIcon" color="iconColor.300" /> */}
                    <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                      {facilitator?.dob &&
                      moment(facilitator?.dob, "YYYY-MM-DD", true).isValid()
                        ? moment(facilitator?.dob).format("DD/MM/YYYY")
                        : "-"}
                    </FrontEndTypo.H3>
                  </HStack>
                </VStack>
              </HStack>
              <HStack>
                {isNameEdit() && (
                  <IconByName
                    name="PencilLineIcon"
                    color="iconColor.200"
                    _icon={{ size: "20" }}
                    onPress={(e) => {
                      navigate(`/profile/edit/basic_details`);
                    }}
                  />
                )}
              </HStack>
            </HStack>
            {facilitator?.profile_photo_1?.base64 && (
              <HStack justifyContent="space-between">
                <HStack alignItems="center" space="6">
                  {[
                    facilitator?.profile_photo_1,
                    facilitator?.profile_photo_2,
                    facilitator?.profile_photo_3,
                  ].map(
                    (photo) =>
                      photo?.base64 && (
                        <FilePreview
                          key={photo?.id}
                          base64={photo?.base64}
                          width={"36px"}
                          height={"36px"}
                          borderRadius="50%"
                        />
                      )
                  )}
                </HStack>
                <HStack>
                  {isProfileEdit && (
                    <IconByName
                      name="PencilLineIcon"
                      color="iconColor.200"
                      _icon={{ size: "20" }}
                      onPress={() => navigate(`/profile/edit/upload/1`)}
                    />
                  )}
                </HStack>
              </HStack>
            )}
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("CONTACT_DETAILS")}
              label={["SELF", "ALTERNATIVE_NUMBER", "EMAIL"]}
              // icon={[
              //   { name: "CellphoneLineIcon", color: "iconColor.100" },
              //   { name: "SmartphoneLineIcon", color: "iconColor.100" },
              //   { name: "MailLineIcon", color: "iconColor.100" },
              // ]}
              item={facilitator}
              arr={["mobile", "alternative_mobile_number", "email_id"]}
              onEdit={
                isContactEdit()
                  ? (e) => navigate(`/profile/edit/contact_details`)
                  : false
              }
            />
            <CardComponent
              isHideProgressBar={true}
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("ADDRESS_DETAILS")}
              label={[
                "STATE",
                "DISTRICT",
                "BLOCKS",
                "VILLAGE_WARD",
                "GRAMPANCHAYAT",
                "PINCODE",
              ]}
              item={facilitator}
              arr={[
                "state",
                "district",
                "block",
                "village",
                "grampanchayat",
                "pincode",
              ]}
              onEdit={
                isAddressEdit()
                  ? (e) => navigate(`/profile/edit/address_details`)
                  : false
              }
            />
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("PERSONAL_DETAILS")}
              label={["Gender", "Social Category", "Martial Status"]}
              item={facilitator}
              arr={["gender", "social_category", "marital_status"]}
              onEdit={(e) => navigate(`/profile/edit/personal_details`)}
            />
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("REFERENCE_DETAILS")}
              label={["Name", "Designation", "Contact"]}
              item={{
                name: [facilitator?.references?.name],
                designation: [facilitator?.references?.designation],
                contact_number: [facilitator?.references?.contact_number],
              }}
              arr={["name", "designation", "contact_number"]}
              onEdit={(e) => navigate(`/profile/edit/reference_details`)}
            />
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("OTHER_DETAILS")}
              label={["Availability", "Designation", "Contact"]}
              item={{
                availability: [facilitator?.program_faciltators?.availability],
              }}
              arr={["availability"]}
              onEdit={(e) =>
                navigate(`/profile/edit/work_availability_details`)
              }
            />
          </VStack>
        </VStack>
      )}
    </Layout>
  );
}
