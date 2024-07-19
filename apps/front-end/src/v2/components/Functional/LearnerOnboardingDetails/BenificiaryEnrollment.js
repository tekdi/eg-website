import {
  CardComponent,
  FrontEndTypo,
  GetEnumValue,
  ItemComponent,
  Layout,
  arrList,
  benificiaryRegistoryService,
  enumRegistryService,
  facilitatorRegistryService,
  getEnrollmentIds,
  getOnboardingMobile,
  getOnboardingURLData,
  getSelectedProgramId,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import EnrollmentMessage from "component/EnrollmentMessage";
import moment from "moment";
import { HStack, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

export default function BenificiaryEnrollment(userTokenInfo) {
  const { id } = useParams();
  const [benificiary, setbenificiary] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const [boardName, setBoardName] = useState({});
  const [stateName, setStateName] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  useEffect(() => {
    agDetails();
  }, [id]);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    const value = result?.result?.program_beneficiaries?.enrolled_for_board;
    if (value) {
      const boardName = await enumRegistryService.boardName(value);
      setBoardName(boardName?.name);
    }
    setbenificiary(result?.result);
    setLoading(false);
  };
  useEffect(async () => {
    let { state_name } = await getSelectedProgramId();
    setStateName(state_name);
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, [id, facilitator]);

  const onEditFunc = () => {
    return !!(
      benificiary?.program_beneficiaries?.status !== "enrolled_ip_verified" &&
      benificiary?.program_beneficiaries?.status !== "registered_in_camp"
    );
  };

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("ENROLLMENT_DETAILS"),
        onPressBackButton,
        _box: { bg: "white" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      analyticsPageTitle={"BENEFICIARY_ENROLLMENT_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ENROLLMENT_DETAILS")}
    >
      <VStack p="5" pt="0" space={4}>
        <EnrollmentMessage
          status={benificiary?.program_beneficiaries?.status}
          enrollment_status={
            benificiary?.program_beneficiaries?.enrollment_status
          }
        />

        {[
          "identified",
          "ready_to_enroll",
          "enrolled",
          "not_enrolled",
          "enrollment_awaited",
          "enrollment_rejected",
        ].includes(
          benificiary?.program_beneficiaries?.enrollment_status ||
            benificiary?.program_beneficiaries?.status
        ) && (
          <VStack>
            <FrontEndTypo.H1 fontWeight="600" mb="3">
              {t("ENROLLMENT_DETAILS")}
            </FrontEndTypo.H1>
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("ENROLLMENT_DETAILS")}
              format={{
                payment_receipt_document_id: "file",
                application_form: "file",
                application_login_id: "file",
              }}
              label={[
                "ENROLLMENT_STATUS",
                "BOARD_OF_ENROLLMENT",
                stateName != "RAJASTHAN" ? "APPLICATION_ID" : "ENROLLMENT_NO",
                "MOBILE_NUMBER",
                stateName != "RAJASTHAN" ? "FEES_PAID_DATE" : "ENROLLMENT_DATE",
                "ENROLLMENT_RECIEPT",
                ...(stateName !== "RAJASTHAN"
                  ? ["APPLICATION_FORM", "APPLICATION_LOGIN_ID_SCREENSHOT"]
                  : []),
                "SUBJECTS",
              ]}
              item={{
                ...benificiary?.program_beneficiaries,
                ...getEnrollmentIds(
                  benificiary?.program_beneficiaries
                    ?.payment_receipt_document_id,
                  stateName
                ),
                enrollment_date: benificiary?.program_beneficiaries
                  ?.enrollment_date
                  ? moment(
                      benificiary?.program_beneficiaries?.enrollment_date
                    ).format("DD-MM-YYYY")
                  : "-",
                enrollment_status: benificiary?.program_beneficiaries
                  ?.enrollment_status ? (
                  <GetEnumValue
                    enumType="ENROLLEMENT_STATUS"
                    enumOptionValue={
                      benificiary?.program_beneficiaries?.enrollment_status
                    }
                    enumApiData={enumOptions}
                    t={t}
                  />
                ) : (
                  "-"
                ),
                enrolled_for_board: benificiary?.program_beneficiaries
                  ?.enrolled_for_board ? (
                  <GetEnumValue
                    t={t}
                    enumType={"ENROLLED_FOR_BOARD"}
                    enumOptionValue={boardName}
                    enumApiData={enumOptions}
                  />
                ) : (
                  "-"
                ),
                subjects:
                  benificiary?.program_beneficiaries?.subjects &&
                  benificiary.program_beneficiaries.subjects.length > 0 ? (
                    <SubjectsList
                      boardId={
                        benificiary?.program_beneficiaries?.enrolled_for_board
                      }
                      subjectIds={JSON.parse(
                        benificiary?.program_beneficiaries?.subjects
                      )}
                    />
                  ) : (
                    "-"
                  ),
              }}
              {...(["not_enrolled"].includes(
                benificiary?.program_beneficiaries?.enrollment_status
              )
                ? {
                    onlyField: ["enrollment_status"],
                  }
                : [
                    "identified",
                    "applied_but_pending",
                    "enrollment_rejected",
                    "enrollment_awaited",
                  ].includes(
                    benificiary?.program_beneficiaries?.enrollment_status
                  )
                ? {
                    onlyField: ["enrollment_status", "enrolled_for_board"],
                  }
                : {
                    onlyField: [
                      "enrollment_status",
                      "enrolled_for_board",
                      "enrollment_number",
                      "enrollment_mobile_no",
                      "enrollment_date",
                      "payment_receipt_document_id",
                      ...(stateName !== "RAJASTHAN"
                        ? ["application_form", "application_login_id"]
                        : []),
                    ],
                  })}
              arr={[
                "enrollment_status",
                "enrolled_for_board",
                "enrollment_number",
                "enrollment_mobile_no",
                "enrollment_date",
                "payment_receipt_document_id",
                ...(stateName !== "RAJASTHAN"
                  ? ["application_form", "application_login_id"]
                  : []),
                "subjects",
              ]}
              onEdit={
                onEditFunc()
                  ? (e) =>
                      navigate(`/beneficiary/edit/${id}/enrollment-details`)
                  : false
              }
            />
          </VStack>
        )}
        {![
          "not_enrolled",
          "applied_but_pending",
          "enrollment_rejected",
          "enrollment_awaited",
        ].includes(benificiary?.program_beneficiaries?.enrollment_status) && (
          <VStack mt={4}>
            <CardComponent
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0 }}
              title={t("ENROLLMENT_RECEIPT")}
              label={[
                "DATE_OF_BIRTH_AS_PER_ENROLLMENT",
                "FIRST_NAME",
                "MIDDLE_NAME",
                "LAST_NAME",
              ]}
              item={{
                ...benificiary?.program_beneficiaries,
                enrollment_dob: benificiary?.program_beneficiaries
                  ?.enrollment_dob
                  ? moment(
                      benificiary?.program_beneficiaries?.enrollment_dob
                    ).format("DD-MM-YYYY")
                  : "-",
                enrollment_status: (
                  <GetEnumValue
                    enumType="BENEFICIARY_STATUS"
                    enumOptionValue={
                      benificiary?.program_beneficiaries?.enrollment_status
                    }
                    enumApiData={enumOptions}
                    t={t}
                  />
                ),
              }}
              arr={[
                "enrollment_dob",
                "enrollment_first_name",
                "enrollment_middle_name",
                "enrollment_last_name",
              ]}
            />
          </VStack>
        )}
      </VStack>
    </Layout>
  );
}

const SubjectsList = ({ boardId, subjectIds }) => {
  const [subjectList, setSubjectList] = useState([]);
  useEffect(() => {
    if (boardId) {
      const getSubjects = async () => {
        let data = await enumRegistryService.subjectsList(boardId);
        setSubjectList(data.subjects || []);
      };
      getSubjects();
    }
  }, [boardId]);
  // return subjectNames.length ? subjectNames.join(", ") : "-";
  return (
    <VStack pl="2">
      {subjectList
        .filter((subject) => subjectIds.includes(subject.subject_id.toString()))
        .map((subject, i) => (
          <HStack space={1} key={subject?.name}>
            <FrontEndTypo.H3>{i + 1}.</FrontEndTypo.H3>
            <FrontEndTypo.H3>{subject?.name}</FrontEndTypo.H3>
          </HStack>
        ))}
    </VStack>
  );
};
