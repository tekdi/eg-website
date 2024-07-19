import {
  CardComponent,
  FrontEndTypo,
  GetEnumValue,
  Layout,
  arrList,
  benificiaryRegistoryService,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getSelectedProgramId,
  getUniqueArray,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import { Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

const GetOptions = ({ array, enumType, enumApiData }) => {
  const { t } = useTranslation();
  return (
    <VStack>
      {getUniqueArray(array)?.map((item, index) => (
        <Text
          fontSize="14px"
          fontWeight="400"
          lineHeight="24px"
          color={"inputValueColor"}
        >
          <GetEnumValue
            fontSize="14px"
            key={index}
            t={t}
            enumOptionValue={item}
            {...{ enumType, enumApiData }}
          />
        </Text>
      ))}
    </VStack>
  );
};

export default function BenificiaryEducation(userTokenInfo) {
  const params = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [userId, setUserId] = React.useState(params?.id);
  const [enumOptions, setEnumOptions] = React.useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [requestData, setRequestData] = React.useState([]);

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
    benificiaryDetails();
  }, []);

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(userId);

    setbenificiary(result?.result);
  };

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: userId,
    };
    const result = await benificiaryRegistoryService.getEditRequest(obj);
    if (result?.data.length > 0) {
      const fieldData = JSON.parse(result?.data[0]?.fields);
      setRequestData(fieldData);
    }
  }, [benificiary]);

  const isEducationalDetailsEdit = () => {
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" ||
      (benificiary?.program_beneficiaries?.status === "enrolled_ip_verified" &&
        requestData.includes("educational_details")) ||
      requestData.includes("type_of_learner") ||
      requestData.includes("last_standard_of_education") ||
      requestData.includes("last_standard_of_education_year") ||
      requestData.includes("previous_school_type") ||
      requestData.includes("reason_of_leaving_education") ||
      requestData.includes("learning_level")
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
        name: t("EDUCATION_DETAILS"),
        onlyIconsShow: ["langBtn", "backBtn"],
        onPressBackButton: (e) => {
          navigate(`/beneficiary/profile/${userId}`);
        },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      analyticsPageTitle={"BENEFICIARY_EDUCATION_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("EDUCATION_DETAILS")}
    >
      <VStack bg="white" px="5" py="3">
        <FrontEndTypo.H1 fontWeight="600" mb="3" mt="3">
          {t("EDUCATION_DETAILS")}
        </FrontEndTypo.H1>
        <CardComponent
          _vstack={{ space: 0 }}
          _hstack={{ borderBottomWidth: 0 }}
          title={t("EDUCATION_DETAILS")}
          label={[
            "TYPE_OF_LEARNER",
            "REASON_FOR_LEAVING",
            benificiary?.core_beneficiaries?.type_of_learner &&
              ["stream_2_mainstream_syc"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) &&
              "IN_WHICH_YEAR_DID_I_GIVE_THE_MAINS_EXAM",

            benificiary?.core_beneficiaries?.type_of_learner &&
              [
                "school_dropout",
                // "already_open_school_syc",
                "already_enrolled_in_open_school",
              ].includes(benificiary?.core_beneficiaries?.type_of_learner) &&
              "LAST_STANDARD_OF_EDUCATION",
            benificiary?.core_beneficiaries?.type_of_learner &&
              [
                "school_dropout",
                "already_open_school_syc",
                "already_enrolled_in_open_school",
              ].includes(benificiary?.core_beneficiaries?.type_of_learner) &&
              "LAST_YEAR_OF_EDUCATION",
            "PREVIOUS_SCHOOL_TYPE",
            "REASON_OF_LEAVING_EDUCATION",
            benificiary?.core_beneficiaries?.type_of_learner &&
              ["already_open_school_syc"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) &&
              "REGISTERED_IN_TENTH_DATE",
            benificiary?.core_beneficiaries?.type_of_learner &&
              ["already_open_school_syc"].includes(
                benificiary?.core_beneficiaries?.type_of_learner
              ) &&
              "IN_WHICH_YEAR_DID_I_GIVE_THE_MAINS_EXAM",
          ].filter(Boolean)}
          item={{
            type_of_learner: benificiary?.core_beneficiaries
              ?.type_of_learner ? (
              <GetEnumValue
                t={t}
                enumType={"TYPE_OF_LEARNER"}
                enumOptionValue={benificiary.core_beneficiaries.type_of_learner}
                enumApiData={enumOptions}
              />
            ) : (
              "-"
            ),

            reason_of_leaving_education: benificiary?.core_beneficiaries
              ?.reason_of_leaving_education ? (
              <GetEnumValue
                t={t}
                enumType={"REASON_OF_LEAVING_EDUCATION"}
                enumOptionValue={
                  benificiary.core_beneficiaries.reason_of_leaving_education
                }
                enumApiData={enumOptions}
              />
            ) : (
              "-"
            ),

            education_year_of_10th_exam:
              benificiary?.core_beneficiaries?.type_of_learner ===
              "stream_2_mainstream_syc"
                ? benificiary?.core_beneficiaries?.education_10th_exam_year
                : "-",

            ...(benificiary?.core_beneficiaries?.type_of_learner &&
              [
                "school_dropout",
                "already_open_school_syc",
                "already_enrolled_in_open_school",
              ].includes(benificiary?.core_beneficiaries?.type_of_learner) && {
                last_standard_of_education: benificiary?.core_beneficiaries
                  ?.last_standard_of_education ? (
                  <GetEnumValue
                    t={t}
                    enumType={"LAST_STANDARD_OF_EDUCATION"}
                    enumOptionValue={
                      benificiary.core_beneficiaries.last_standard_of_education
                    }
                    enumApiData={enumOptions}
                  />
                ) : (
                  "-"
                ),

                last_standard_of_education_year: benificiary?.core_beneficiaries
                  ?.last_standard_of_education_year
                  ? benificiary?.core_beneficiaries
                      ?.last_standard_of_education_year
                  : "-",

                previous_school_type: benificiary?.core_beneficiaries
                  ?.previous_school_type ? (
                  <GetEnumValue
                    t={t}
                    enumType={"PREVIOUS_SCHOOL_TYPE"}
                    enumOptionValue={
                      benificiary.core_beneficiaries.previous_school_type
                    }
                    enumApiData={enumOptions}
                  />
                ) : (
                  "-"
                ),

                education_10th_date:
                  benificiary?.core_beneficiaries?.type_of_learner ===
                  "already_open_school_syc" ? (
                    <GetEnumValue
                      t={t}
                      enumType={"REASON_OF_LEAVING_EDUCATION"}
                      enumOptionValue={
                        benificiary?.core_beneficiaries
                          ?.reason_of_leaving_education
                      }
                      enumApiData={enumOptions}
                    />
                  ) : (
                    "-"
                  ),
                education_10th_exam_year:
                  benificiary?.core_beneficiaries?.type_of_learner ===
                  "already_open_school_syc"
                    ? benificiary?.core_beneficiaries?.education_10th_date ||
                      "-"
                    : undefined,
              }),
          }}
          arr={(() => {
            let arr = [];
            if (
              benificiary?.core_beneficiaries?.type_of_learner ||
              benificiary?.core_beneficiaries?.reason_of_leaving_education
            ) {
              arr = [...arr, "type_of_learner", "reason_of_leaving_education"];
              if (
                ["school_dropout", "already_enrolled_in_open_school"].includes(
                  benificiary?.core_beneficiaries?.type_of_learner
                )
              ) {
                arr = [
                  ...arr,
                  "last_standard_of_education",
                  "last_standard_of_education_year",
                  "previous_school_type",
                ];
              }
              if (
                benificiary?.core_beneficiaries?.type_of_learner ===
                "already_open_school_syc"
              ) {
                arr = [
                  ...arr,
                  // "education_10th_date",
                  "education_10th_exam_year",
                ];
              }
              if (
                benificiary?.core_beneficiaries?.type_of_learner ===
                "stream_2_mainstream_syc"
              ) {
                arr = [...arr, "education_year_of_10th_exam"];
              }
              if (
                benificiary?.core_beneficiaries?.type_of_learner ===
                "already_open_school_syc"
              ) {
                arr = [...arr, "previous_school_type"];
              }
            }
            return arr;
          })()}
          onEdit={(e) => {
            navigate(`/beneficiary/edit/${userId}/education`);
          }}
        />

        <VStack mt={6} mb={2}>
          <CardComponent
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0 }}
            title={t("LEARNER_ASPIRATION")}
            label={[
              "MOTIVATION_TO_PASS_10TH",
              "SUPPORT_FROM_PRAGATI",
              "WILL_YOUR_PARENTS_SUPPORT_YOUR_STUDIES",
              "CAREER_ASPIRATION",
              "REMARKS",
            ]}
            item={{
              learning_motivation:
                benificiary?.program_beneficiaries?.learning_motivation &&
                benificiary.program_beneficiaries.learning_motivation.length >
                  0 ? (
                  <GetOptions
                    array={
                      benificiary.program_beneficiaries.learning_motivation
                    }
                    enumApiData={enumOptions}
                    enumType={"LEARNING_MOTIVATION"}
                  />
                ) : (
                  "-"
                ),

              type_of_support_needed:
                benificiary?.program_beneficiaries?.type_of_support_needed &&
                benificiary.program_beneficiaries.type_of_support_needed
                  .length > 0 ? (
                  <GetOptions
                    array={
                      benificiary.program_beneficiaries.type_of_support_needed
                    }
                    enumApiData={enumOptions}
                    enumType={"TYPE_OF_SUPPORT_NEEDED"}
                  />
                ) : (
                  "-"
                ),

              parent_support:
                benificiary?.core_beneficiaries?.parent_support ?? "-",

              career_aspiration: benificiary?.core_beneficiaries
                ?.career_aspiration ? (
                <GetEnumValue
                  t={t}
                  enumOptionValue={
                    benificiary.core_beneficiaries.career_aspiration
                  }
                  enumApiData={enumOptions}
                  enumType={"CAREER_ASPERATION"}
                />
              ) : (
                "-"
              ),

              career_aspiration_details:
                benificiary?.core_beneficiaries?.career_aspiration_details ||
                "-",
            }}
            arr={[
              "learning_motivation",
              "type_of_support_needed",
              "parent_support",
              "career_aspiration",
              "education_10th_exam_year",
            ]}
            onEdit={(e) => {
              navigate(`/beneficiary/edit/${userId}/future-education`);
            }}
          />
        </VStack>
      </VStack>
    </Layout>
  );
}
