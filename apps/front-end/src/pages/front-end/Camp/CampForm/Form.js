import React, { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";
import PropTypes from "prop-types";
import {
  geolocationRegistryService,
  Layout,
  BodyMedium,
  filterObject,
  FrontEndTypo,
  enumRegistryService,
  getOptions,
  validation,
  campService,
  jsonParse,
  setSelectedProgramId,
  getOnboardingMobile,
  setSelectedAcademicYear,
  getSelectedProgramId,
  facilitatorRegistryService,
  objProps,
  arrList,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";
import ConsentForm from "./ConsentForm.js";
import CampSelectedLearners from "../CampSelectedLearners.js";
import CampKitMaterialDetails from "../CampKitMaterialDetails.js";

import { getIpUserInfo, setIpUserInfo } from "v2/utils/SyncHelper/SyncHelper";

// App
export default function App({ footerLinks, userTokenInfo }) {
  const { step } = useParams();
  const { id } = useParams();
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEdit] = useState(true);
  const [campDetails, setCampDetails] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const programSelected = jsonParse(localStorage.getItem("program"));

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

  useEffect(async () => {
    setLoading(true);
    const result = await campService.getCampDetails({ id });
    setCampDetails(result?.data);
    setLoading(false);
  }, [id, page]);

  const getLocation = async () => {
    setLoading(true);
    const { lat, long } = campDetails?.properties || {};
    setFormData({
      ...formData,
      location: { lat, long },
      property_type: campDetails?.properties?.property_type || undefined,
      state: campDetails?.properties?.state || undefined,
      district: campDetails?.properties?.district || undefined,
      block: campDetails?.properties?.block || undefined,
      village: campDetails?.properties?.village || undefined,
      grampanchayat: campDetails?.properties?.grampanchayat || undefined,
      street: campDetails?.properties?.street || undefined,
    });
    setLoading(false);
  };

  useEffect(async () => {
    setLoading(true);
    if (step === "edit_camp_location") {
      getLocation();
    } else if (step === "edit_photo_details") {
      const camp_venue_photos = campDetails?.properties;
      setFormData({
        ...formData,
        property_photo_building:
          camp_venue_photos?.property_photo_building || undefined,
        property_photo_classroom:
          camp_venue_photos?.property_photo_classroom || undefined,
        property_photo_other:
          camp_venue_photos?.property_photo_other || undefined,
      });
    } else if (step === "edit_kit_details") {
      const kit = campDetails;
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      let schemaData = properties[newStep];
      if (campDetails?.kit_received === null) {
        const { kit_received } = schemaData.properties;
        const required = schemaData?.required.filter((item) =>
          ["kit_received"].includes(item)
        );
        const newSchema = {
          ...schemaData,
          properties: { kit_received },
          required: required,
        };
        setSchema(newSchema);
      } else {
        setFormData({
          ...formData,
          kit_was_sufficient: kit?.kit_was_sufficient || undefined,
          kit_received: kit?.kit_received || undefined,
          kit_ratings: kit?.kit_ratings || undefined,
          kit_feedback: kit?.kit_feedback || undefined,
        });
      }
    }
    setLoading(false);
  }, [campDetails, step]);

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    if (data && onClick) {
      onClick("SplashScreen");
    }
  };

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (pageStape === "p") {
        navigate(`/camps/${id}`);
      } else if (nextIndex !== undefined) {
        if (step === "edit_kit_details") {
          navigate(`/camps/${id}/edit_family_consent`);
        } else {
          navigate(`/camps/${id}/${nextIndex}`);
        }
      }
    }
  };

  const fetchData = async () => {
    try {
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data : {});
    } catch (error) {
      // Handle errors appropriately
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(async () => {
    const facilitiesData = enumOptions?.CAMP_PROPERTY_FACILITIES;
    if (step === "edit_property_facilities") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      const newSchema = properties[newStep];
      newSchema.properties.property_facilities.required = [];
      facilitiesData?.map((element) => {
        const propertyName = element?.value;
        newSchema.properties.property_facilities.required.push(propertyName);
        newSchema.properties.property_facilities.properties[propertyName] = {
          label: element?.title,
          type: "string",
          format: "CheckUncheck",
        };
      });

      const facilities = {
        property_facilities: jsonParse(
          campDetails?.properties?.property_facilities || "{}"
        ),
      };
      setFormData(facilities);
    }
  }, [step, campDetails]);

  // update schema
  useEffect(async () => {
    let newSchema = schema;
    if (schema?.["properties"]?.["property_type"]) {
      newSchema = getOptions(newSchema, {
        key: "property_type",
        arr: enumOptions?.CAMP_PROPERTY_TYPE,
        title: "title",
        value: "value",
      });
    }
    if (schema?.properties?.district) {
      await setDistric({
        schemaData: newSchema,
        state: programSelected?.state_name,
        district: formData?.district,
        block: formData?.block,
        gramp: formData?.grampanchayat,
      });
    }
  }, [enumOptions, page, formData]);

  useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      let schemaData = properties[newStep];
      setPage(newStep);
      setSchema(schemaData);
      setPages(newSteps);

      if (step === "edit_kit_details") {
        if (formData?.kit_received == "yes") {
          setSchema(schemaData);
        } else if (formData?.kit_received === "no") {
          const { kit_received } = schemaData.properties;
          const required = schemaData?.required.filter((item) =>
            ["kit_received"].includes(item)
          );
          const newSchema = {
            ...schemaData,
            properties: { kit_received },
            required: required,
          };
          setSchema(newSchema);
        }
      } else {
        setSchema(schemaData);
      }
    }
  }, [step, formData]);

  const formSubmitUpdate = async (data, overide) => {
    setLoading(true);
    if (id) {
      let result;
      if (step === "edit_camp_location") {
        result = await campService.updateCampDetails({
          ...data,
          state: programSelected?.state_name,
          edit_page_type: step,
          ...(overide || {}),
          id: id,
          lat: formData?.location.lat,
          long: formData?.location.long,
        });
      } else {
        result = await campService.updateCampDetails({
          ...data,
          edit_page_type: step,
          ...(overide || {}),
          id: id,
        });
      }
      return result;
    }
    setLoading(false);
  };

  const customValidate = (data, errors, c, asd) => {
    if (step === "property_details") {
      if (data?.OWNER_OF_THE_PROPERTY?.mobile) {
        validation({
          data: data?.OWNER_OF_THE_PROPERTY?.mobile,
          key: "OWNER_OF_THE_PROPERTY",
          errors,
          message: `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`,
          type: "mobile",
        });
      }
    }
    return errors;
  };

  const setDistric = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    if (schema?.properties?.district && state) {
      const qData = await geolocationRegistryService.getDistricts({
        name: state,
      });
      if (schema?.["properties"]?.["district"]) {
        newSchema = getOptions(newSchema, {
          key: "district",
          arr: qData?.districts,
          title: "district_name",
          value: "district_name",
        });
      }
      if (schema?.["properties"]?.["block"]) {
        newSchema = await setBlock({
          gramp,
          state,
          district,
          block,
          schemaData: newSchema,
        });
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "district", arr: [] });
      if (schema?.["properties"]?.["block"]) {
        newSchema = getOptions(newSchema, { key: "block", arr: [] });
      }
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    return newSchema;
  };

  const setBlock = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    if (schema?.properties?.block && district) {
      const qData = await geolocationRegistryService.getBlocks({
        name: district,
        state: state,
      });

      if (schema?.["properties"]?.["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData?.blocks,
          title: "block_name",
          value: "block_name",
        });
      }
      if (
        schema?.["properties"]?.["grampanchayat"] &&
        ["BIHAR"].includes(state)
      ) {
        newSchema = await setGramp({
          state,
          district,
          block,
          gramp,
          schemaData: newSchema,
        });
        setSchema(newSchema);
      } else {
        newSchema = await setVilage({
          state,
          district,
          block,
          gramp: "null",
          schemaData: newSchema,
        });
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    return newSchema;
  };

  const setGramp = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.village && block) {
      const qData = await geolocationRegistryService.getGrampanchyat({
        block: block,
        state: state,
        district: district,
      });
      if (schema?.["properties"]?.["grampanchayat"]) {
        newSchema = getOptions(newSchema, {
          key: "grampanchayat",
          arr: qData?.gramPanchayat,
          title: "grampanchayat_name",
          value: "grampanchayat_name",
          format: "select",
        });
      }
      setSchema(newSchema);

      if (schema?.["properties"]?.["village"] && gramp) {
        newSchema = await setVilage({
          state,
          district,
          block,
          gramp,
          schemaData: newSchema,
        });
      }
    } else {
      newSchema = getOptions(newSchema, { key: "grampanchayat", arr: [] });
      setSchema(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  const setVilage = async ({ state, district, gramp, block, schemaData }) => {
    let newSchema = schemaData;
    if (schema?.properties?.village && block) {
      const qData = await geolocationRegistryService.getVillages({
        name: block,
        state: state,
        district: district,
        gramp: gramp || "null",
      });
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, {
          key: "village",
          arr: qData?.villages,
          title: "village_ward_name",
          value: "village_ward_name",
        });
      }
      setSchema(newSchema);
    } else {
      newSchema = getOptions(newSchema, { key: "village", arr: [] });
      setSchema(newSchema);
    }
    return newSchema;
  };
  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData({ ...newData, state: programSelected?.state_name });
    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
      });
    }

    if (id === "root_block") {
      await setVilage({ block: data?.block, schemaData: schema });
    }

    if (id === "root_kit_received") {
      if (data?.kit_received === "yes") {
        const properties = schema1.properties;
        const newSteps = Object.keys(properties);
        const newStep = step || newSteps[0];
        let schemaData = properties[newStep];
        setSchema(schemaData);
      } else if (data?.kit_received === "no") {
        setFormData({
          ...formData,
          kit_ratings: undefined,
          kit_received: data?.kit_received,
          kit_was_sufficient: undefined,
          kit_feedback: undefined,
        });
        const properties = schema1.properties;
        const newSteps = Object.keys(properties);
        const newStep = step || newSteps[0];
        let schemaData = properties[newStep];
        const { kit_received } = schemaData.properties;
        const required = schemaData?.required.filter((item) =>
          ["kit_received"].includes(item)
        );
        const newSchema = {
          ...schemaData,
          properties: { kit_received },
          required: required,
        };
        setSchema(newSchema);
      }
    }

    if (id === "root_kit_feedback") {
      if (data?.kit_feedback === "") {
        setFormData({ ...formData, kit_feedback: undefined });
      }
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;

    if (_.isEmpty(errors)) {
      let newdata = filterObject(
        newFormData,
        Object.keys(schema?.properties),
        {},
        step === "edit_photo_details" ? null : ""
      );
      await formSubmitUpdate(newdata);
      if (localStorage.getItem("backToProfile") === "false") {
        nextPreviewStep();
      } else {
        navigate(`/camps/${id}`);
      }
    }
  };

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  if (page === "edit_family_consent") {
    return <ConsentForm />;
  } else if (page === "edit_camp_selected_learners") {
    return <CampSelectedLearners isEdit={isEdit} />;
  }
  if (page === "edit_kit_material_details") {
    return <CampKitMaterialDetails schema={schema} />;
  }

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t(schema?.step_name)}</FrontEndTypo.H2>,
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
      loading={loading || !campDetails?.group?.status}
    >
      {["camp_ip_verified", "inactive"].includes(campDetails?.group?.status) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <FrontEndTypo.H3>{t("PAGE_NOT_ACCESSABLE")}</FrontEndTypo.H3>
          </HStack>
        </Alert>
      ) : (
        <Box py={6} px={4} mb={5}>
          {alert && (
            <Alert status="warning" alignItems={"start"} mb="3">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <FrontEndTypo.H2>{alert}</FrontEndTypo.H2>
              </HStack>
            </Alert>
          )}
          {page && page !== "" && (
            <Form
              key={schema}
              ref={formRef}
              extraErrors={errors}
              showErrorList={false}
              noHtml5Validate={true}
              {...{
                widgets,
                templates,
                validator,
                schema: schema || {},
                formData,
                customValidate,
                onChange,
                onSubmit,
                onError,
                transformErrors: (errors) => transformErrors(errors, schema, t),
              }}
            >
              <Box>
                <FrontEndTypo.Primarybutton
                  isLoading={loading}
                  p="4"
                  mt="4"
                  onPress={() => onClickSubmit(false)}
                >
                  {t("SAVE_AND_NEXT")}
                </FrontEndTypo.Primarybutton>
                <FrontEndTypo.Secondarybutton
                  isLoading={loading}
                  p="4"
                  mt="4"
                  onPress={() => onClickSubmit(true)}
                >
                  {t("SAVE_AND_CAMP_PROFILE")}
                </FrontEndTypo.Secondarybutton>
              </Box>
            </Form>
          )}
        </Box>
      )}
    </Layout>
  );
}
Form.PropTypes = {
  footerLinks: PropTypes.any,
};
