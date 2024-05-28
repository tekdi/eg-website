import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  AgRegistryService,
  BodyMedium,
  FrontEndTypo,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
  facilitatorRegistryService,
  getOnboardingMobile,
  getSelectedProgramId,
  objProps,
  setSelectedAcademicYear,
  setSelectedProgramId,
  arrList,
} from "@shiksha/common-lib";
import { Alert, Box, HStack } from "native-base";
import accessControl from "pages/front-end/facilitator/edit/AccessControl.js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";
import {
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  TitleFieldTemplate,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import schema1 from "./schema.js";

// App
export default function FamilyDetails({ ip, userTokenInfo }) {
  const { t } = useTranslation();
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const userId = id;
  const navigate = useNavigate();
  const [fields, setFields] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(false);

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

  // Profile Code
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

  // Profile Code End

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/basicdetails`);
  };

  //getting data
  React.useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(id);
    setFormData(qData?.result);

    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    const result = await facilitatorRegistryService.getEditRequests(obj);
    let field;
    const parseField = result?.data?.[0]?.fields;
    if (parseField && typeof parseField === "string") {
      field = JSON.parse(parseField);
    }
    setFields(field || []);
  }, []);

  React.useEffect(async () => {
    let father_first_name = formData?.core_beneficiaries?.father_first_name
      ? formData?.core_beneficiaries?.father_first_name
      : "";
    let father_middle_name = formData?.core_beneficiaries?.father_middle_name
      ? formData?.core_beneficiaries?.father_middle_name
      : "";
    let father_last_name = formData?.core_beneficiaries?.father_last_name
      ? formData?.core_beneficiaries?.father_last_name
      : "";

    let mother_first_name = formData?.core_beneficiaries?.mother_first_name
      ? formData?.core_beneficiaries?.mother_first_name
      : "";
    let mother_last_name = formData?.core_beneficiaries?.mother_last_name
      ? formData?.core_beneficiaries?.mother_last_name
      : "";
    let mother_middle_name = formData?.core_beneficiaries?.mother_middle_name
      ? formData?.core_beneficiaries?.mother_middle_name
      : "";

    setFormData({
      ...formData,
      father_details: {
        father_first_name: father_first_name,
        father_middle_name:
          father_middle_name == "null" ? "" : father_middle_name,
        father_last_name: father_last_name == "null" ? "" : father_last_name,
      },
      mother_details: {
        mother_first_name: mother_first_name,
        mother_middle_name:
          mother_middle_name == "null" ? "" : mother_middle_name,
        mother_last_name: mother_last_name == "null" ? "" : mother_last_name,
      },
      edit_page_type: "edit_family",
    });
  }, [formData?.id]);

  const nextPreviewStep = async (pageStape = "n") => {
    setIsDisable(true);
    setAlert();
    const index = pages.indexOf(page);
    const properties = schema1.properties;
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (nextIndex !== undefined) {
        setPage(nextIndex);
        setSchemaData(properties[nextIndex]);
      } else if (pageStape.toLowerCase() === "n") {
        await formSubmitUpdate({ ...formData, form_step_number: "6" });
        setPage("SAVE");
      } else {
        return true;
      }
    }
    setIsDisable(false);
  };
  const setStep = async (pageNumber = "") => {
    setIsDisable(true);
    if (schema1.type === "step") {
      const properties = schema1.properties;
      if (pageNumber !== "") {
        if (page !== pageNumber) {
          setPage(pageNumber);
          setSchemaData(properties[pageNumber]);
        }
      } else {
        nextPreviewStep();
      }
    }
    setIsDisable(false);
  };

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchemaData(properties[newSteps[0]]);
      setPages(newSteps);

      setSubmitBtn(t("NEXT"));
    }
  }, []);

  const formSubmitUpdate = async (formData) => {
    if (id) {
      await enumRegistryService.editProfileById({
        ...formData,
        id: id,
      });
    }
  };

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        const data = schema1["properties"]?.[e]["properties"]?.[key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const customValidate = (data, errors, c) => {
    ["father_first_name", "mother_first_name"].forEach((key) => {
      if (
        key === "father_first_name" &&
        data?.father_details?.father_first_name?.replace(/\s/g, "") === ""
      ) {
        errors?.father_details?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (
        data?.father_details?.[key] &&
        !data?.father_details?.[key]?.match(/^[a-zA-Z ]*$/g)
      ) {
        errors?.father_details?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (
        key === "mother_first_name" &&
        data?.mother_details?.mother_first_name?.replaceAll(" ", "") === ""
      ) {
        errors?.mother_details?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (
        data?.mother_details?.[key] &&
        !data?.mother_details?.[key]?.match(/^[a-zA-Z ]*$/g)
      ) {
        errors?.mother_details?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }
    });

    return errors;
  };

  const transformErrors = (errors) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t("REQUIRED_MESSAGE")}`;
        }
      } else if (error.name === "enum") {
        error.message = `${t("SELECT_MESSAGE")}`;
      }
      return error;
    });
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_mobile") {
      if (data?.mobile?.toString()?.length === 10) {
        const result = await userExist({ mobile: data?.mobile });
        if (result.isUserExist) {
          const newErrors = {
            mobile: {
              __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        }
      }
    }

    if (id === "root_father_details_father_middle_name") {
      if (data?.father_details?.father_middle_name === undefined) {
        setFormData({
          ...formData,
          father_details: {
            ...formData.father_details, // Spread the existing properties of father_details
            father_middle_name: "", // Add the father_middle_name field with an empty string
          },
        });
      }
    }
    if (id === "root_father_details_father_last_name") {
      if (data?.father_details?.father_last_name === undefined) {
        setFormData({
          ...formData,
          father_details: {
            ...formData.father_details,
            father_last_name: "",
          },
        });
      }
    }

    if (id === "root_mother_details_mother_middle_name") {
      if (data?.mother_details?.mother_middle_name === undefined) {
        setFormData({
          ...formData,
          mother_details: {
            ...formData.mother_details,
            mother_middle_name: "",
          },
        });
      }
    }
    if (id === "root_mother_details_mother_last_name") {
      if (data?.mother_details?.mother_last_name === undefined) {
        setFormData({
          ...formData,
          mother_details: {
            ...formData.mother_details,
            mother_last_name: "",
          },
        });
      }
    }
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    setIsDisable(true);
    await AgRegistryService.updateAg(formData, userId);
    navigate(`/beneficiary/${userId}/basicdetails`);
  };

  const setSchemaData = (newSchema) => {
    setSchema(accessControl(newSchema, fields));
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("FAMILY_DETAILS"),
        lang,
        setLang,
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "white" } }}
    >
      {formData?.program_beneficiaries?.status === "enrolled_ip_verified" &&
      fields.length <= 0 ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <Box py={6} px={4} mb={5}>
          {/* Box */}
          {alert ? (
            <Alert status="warning" alignItems={"start"} mb="3">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{alert}</BodyMedium>
              </HStack>
            </Alert>
          ) : (
            <React.Fragment />
          )}
          {page && page !== "" ? (
            <Form
              key={lang}
              ref={formRef}
              templates={{
                FieldTemplate,
                ArrayFieldTitleTemplate,
                ObjectFieldTemplate,
                TitleFieldTemplate,
                DescriptionFieldTemplate,
                BaseInputTemplate,
              }}
              extraErrors={errors}
              showErrorList={false}
              noHtml5Validate={true}
              {...{
                validator,
                schema: schema || {},

                formData,
                customValidate,
                onChange,
                onError,
                onSubmit,
                transformErrors,
              }}
            >
              <Box display={"flex"} alignItems={"center"}>
                <FrontEndTypo.Primarybutton
                  isDisabled={isDisable}
                  minW="60%"
                  mt="5"
                  type="submit"
                  onPress={() => formRef?.current?.submit()}
                >
                  {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
                </FrontEndTypo.Primarybutton>
              </Box>
            </Form>
          ) : (
            <React.Fragment />
          )}
        </Box>
      )}
    </Layout>
  );
}
