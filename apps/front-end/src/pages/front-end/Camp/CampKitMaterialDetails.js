import {
  FrontEndTypo,
  Layout,
  campService,
  enumRegistryService,
  setSelectedProgramId,
  getOnboardingMobile,
  setSelectedAcademicYear,
  getSelectedProgramId,
  facilitatorRegistryService,
  objProps,
  arrList,
} from "@shiksha/common-lib";
import { Alert, Box, HStack, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

const customStyles = {
  header: {
    style: {
      background: "#F4F4F7",
      minHeight: "72px",
      cursor: "pointer",
      justifyContent: "left",
    },
  },
  headRow: {
    style: {
      size: "1px",
      justifyContent: "center",
      fontWeight: "bold",
    },
  },
  headCells: {
    style: {
      background: "#F4F4F7",
      size: "4px",
      justifyContent: "center",
      padding: "0px",
    },
  },
  cells: {
    style: {
      background: "#F4F4F7",
      justifyContent: "center",
      border: "0.1px solid #999",
    },
  },
};

const columns = (handleCheckboxChange, kitFeadback, t) => [
  {
    name: t("KIT_LIST"),
    cell: (row) => t(row?.title),
    wrap: true,
  },
  {
    name: t("QUANTITY"),
    cell: (row) => t(row?.subTitle),
    wrap: true,
  },
  {
    name: t("COMPLETE"),
    selector: "complete",
    minWidth: "50px",
    cell: (row) => (
      <input
        type="radio"
        checked={kitFeadback[row.value] === "complete"}
        onChange={() => handleCheckboxChange(row.value, "complete")}
        name={`status-${row.value}`}
      />
    ),
    width: "65px",
  },
  {
    name: t("PARTIALLY"),
    selector: "partially",
    minWidth: "50px",
    cell: (row) => (
      <input
        type="radio"
        checked={kitFeadback[row.value] === "partially"}
        onChange={() => handleCheckboxChange(row.value, "partially")}
        name={`status-${row.value}`}
      />
    ),
    width: "65px",
  },
  {
    name: t("INCOMPLETE"),
    selector: "incomplete",
    minWidth: "60px",
    cell: (row) => (
      <input
        type="radio"
        checked={kitFeadback[row.value] === "incomplete"}
        onChange={() => handleCheckboxChange(row.value, "incomplete")}
        name={`status-${row.value}`}
      />
    ),
    width: "70px",
  },
];

export default function CampKitMaterialDetails({ footerLinks, userTokenInfo }) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [kitFeadback, setKitFeadback] = useState({});
  const [tableData, setTableData] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

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

  const { id } = useParams();
  const navigate = useNavigate();
  const onPressBackButton = () => {
    navigate(`/camps/${id}`);
  };

  useEffect(async (e) => {
    // enum api all
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.KIT_MATERIALS_CHECKLISTS;
    setTableData(list);
    const result = await campService.campMaterialKit({
      id,
    });
    setKitFeadback(result?.kit?.list_of_materials || {});
  }, []);

  useEffect(async () => {
    const isSaveDisabled = !tableData?.every((row) => kitFeadback[row.value]);
    setIsDisable(isSaveDisabled);
  }, [tableData, kitFeadback]);

  const handleCheckboxChange = (item, columnName) => {
    setKitFeadback({ ...kitFeadback, [item]: columnName });
  };

  const handleSave = async () => {
    setIsDisable(true);
    setIsLoading(true);
    const result = await campService.campMaterialKitUpdate({
      camp_id: id,
      list_of_materials: kitFeadback,
    });
    if (result?.data) {
      setIsDisable(false);
      setIsLoading(false);
      navigate(`/camps/${id}`);
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
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: (
          <FrontEndTypo.H2>{t("CAMP_KIT_MATERIAL_DETAILS")}</FrontEndTypo.H2>
        ),
        lang,
        setLang,
        _box: { bg: "formBg.500", shadow: "appBarShadow" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _footer={{ menues: footerLinks }}
    >
      <VStack space={"2"} p={4}>
        <DataTable
          title={t("CAMP_KIT_MATERIAL_DETAILS")}
          customStyles={customStyles}
          columns={columns(handleCheckboxChange, kitFeadback, t)}
          data={tableData}
          persistTableHead
        />
        <Box>
          <Alert status="warning" alignItems={"start"}>
            <HStack alignItems="center" space="2">
              <Alert.Icon />
              {t("PLEASE_SELECT_ALL_ITEMS_MESSAGE")}
            </HStack>
          </Alert>

          <FrontEndTypo.Primarybutton
            p="4"
            mt="4"
            mb="4"
            m="4"
            onPress={handleSave}
            isDisabled={isDisable}
            isLoading={isLoading}
          >
            {t("SAVE_AND_CAMP_PROFILE")}
          </FrontEndTypo.Primarybutton>
        </Box>
      </VStack>
    </Layout>
  );
}

CampKitMaterialDetails.propTypes = {
  footerLinks: PropTypes.any,
};
