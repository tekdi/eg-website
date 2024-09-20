import React, { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./BeneficiaryRegister.Schema.js";
import { Alert, Box, HStack, Modal, VStack } from "native-base";
import {
  AgRegistryService,
  Layout,
  BodyMedium,
  FrontEndTypo,
  getSelectedProgramId,
  getSelectedAcademicYear,
  benificiaryRegistoryService,
  IconByName,
  getOptions,
  enumRegistryService,
  jsonParse,
  geolocationRegistryService,
} from "@shiksha/common-lib";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  widgets,
  templates,
  transformErrors,
} from "../../../components/Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";
import { payload } from "./Payload.js";
import PropTypes from "prop-types";

// App

export default function BeneficiaryRegister({ userTokenInfo, footerLinks }) {
  const { authUser } = userTokenInfo;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [yearsRange, setYearsRange] = useState([1980, 2030]);
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [isExistModal, setIsExistModal] = useState(false);
  const [enumData, setEnumData] = useState({});
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const prerakStatus = localStorage.getItem("status");
  const [fixedSchema, setFixedSchema] = useState();

  const onPressBackButton = async (e) => {
    const data = await nextPreviewStep("p");
    if (data) {
      navigate(-1);
    }
  };

  const uiSchema = {
    facilitator_id: {
      "ui:widget": "hidden",
    },
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
        format: "DMY",
      },
    },
    career_aspiration: {
      "ui:widget": "RadioBtn",
    },
    learning_motivation: {
      "ui:widget": "MultiCheck",
    },
    type_of_support_needed: {
      "ui:widget": "MultiCheck",
    },
    alreadyOpenLabel: {
      "ui:widget": "AlreadyOpenLabelWidget",
    },
    education_10th_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
        format: "DMY",
      },
    },
  };

  const nextPreviewStep = async (pageStape = "n") => {
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
        setSchema(properties[nextIndex]);
        setFixedSchema(properties[nextIndex]);
      } else if (pageStape.toLowerCase() === "n") {
        setPage("upload");
      } else {
        return true;
      }
    }
  };

  const createBeneficiary = async () => {
    let program = await getSelectedProgramId();
    let acadamic = await getSelectedAcademicYear();
    let org_id = authUser?.program_faciltators?.parent_ip;

    const mainPayload = await payload({ formData, org_id, acadamic, program });
    let url = await AgRegistryService.createBeneficiary(mainPayload);
    if (url?.data) {
      navigate(`/beneficiary/${url?.data?.user?.id}/upload/1`);
    }
  };

  const setStep = async (pageNumber = "") => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      if (pageNumber !== "") {
        if (page !== pageNumber) {
          setPage(pageNumber);
          setSchema(properties[pageNumber]);
        }
      } else {
        nextPreviewStep();
      }
    }
  };

  useEffect(() => {
    if (page === "3") {
      getLocation();
    }
  }, [page]);

  React.useEffect(() => {
    const fetchData = async () => {
      let newSchema = schema;
      if (schema?.properties?.district) {
        let programSelected = jsonParse(localStorage.getItem("program"));
        newSchema = await setDistric({
          schemaData: newSchema,
          state: programSelected?.state_name,
          district: formData?.district,
          block: formData?.block,
          // gramp: formData?.grampanchayat,
        });
        setSchema(newSchema);
      }

      if (schema?.properties?.marital_status) {
        newSchema = getOptions(newSchema, {
          key: "marital_status",
          arr: enumData?.data?.MARITAL_STATUS,
          title: "title",
          value: "value",
        });
        newSchema = getOptions(newSchema, {
          key: "social_category",
          arr: enumData?.data?.BENEFICIARY_SOCIAL_STATUS,
          title: "title",
          value: "value",
        });
        setSchema(newSchema);
      }
      if (page == "5") {
        setYearsRange([moment(formData?.dob).year(), moment().year()]);
      } else if (page == "1") {
        let minYear = moment().subtract("years", 30);
        let maxYear = moment().subtract("years", 12);
        setYearsRange([minYear.year(), maxYear.year()]);
      }
      if (schema?.properties?.type_of_learner) {
        const lastYear = await benificiaryRegistoryService.lastYear({
          dob: formData?.dob,
        });

        newSchema = getOptions(newSchema, {
          key: "type_of_learner",
          arr: enumData?.data?.TYPE_OF_LEARNER,
          title: "title",
          value: "value",
        });
        newSchema = getOptions(newSchema, {
          key: "last_standard_of_education",
          arr: enumData?.data?.LAST_STANDARD_OF_EDUCATION,
          title: "title",
          value: "value",
        });
        newSchema = getOptions(newSchema, {
          key: "last_standard_of_education_year",
          arr: lastYear,
          title: "value",
          value: "value",
        });
        newSchema = getOptions(newSchema, {
          key: "education_10th_exam_year",
          arr: lastYear,
          title: "value",
          value: "value",
        });
        newSchema = getOptions(newSchema, {
          key: "reason_of_leaving_education",
          arr: enumData?.data?.REASON_OF_LEAVING_EDUCATION,
          title: t("title"),
          value: "value",
        });

        newSchema = getOptions(newSchema, {
          key: "previous_school_type",
          arr: enumData?.data?.PREVIOUS_SCHOOL_TYPE,
          title: t("title"),
          value: "value",
        });

        newSchema = getOptions(newSchema, {
          key: "learning_level",
          arr: enumData?.data?.BENEFICIARY_LEARNING_LEVEL,
          title: t("title"),
          value: "value",
        });
        const {
          alreadyOpenLabel,
          education_10th_date,
          education_10th_exam_year,
          ...properties
        } = newSchema?.properties || {};
        // setSchema({ ...newSchema, properties });
        const resultData = updateTypeOfLearnerDependancy(formData, {
          ...newSchema,
          properties,
        });
        setSchema(resultData?.schema);
        setFixedSchema(newSchema);
      }

      if (schema?.properties?.parent_support) {
        newSchema = getOptions(newSchema, {
          key: "parent_support",
          arr: enumData?.data?.PARENT_SUPPORT,
          title: "title",
          value: "value",
        });
        newSchema = getOptions(newSchema, {
          key: "learning_motivation",
          arr: enumData.data?.LEARNING_MOTIVATION,
          title: "title",
          value: "value",
        });

        newSchema = getOptions(newSchema, {
          key: "type_of_support_needed",
          arr: enumData.data?.TYPE_OF_SUPPORT_NEEDED,
          title: "title",
          value: "value",
        });
        setSchema(newSchema);
      }
    };
    fetchData();
  }, [page]);

  const setDistric = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    if (schema?.properties?.district && state) {
      const qData = await geolocationRegistryService.getDistricts({
        name: state,
      });
      if (schema["properties"]["district"]) {
        newSchema = getOptions(newSchema, {
          key: "district",
          arr: qData?.districts,
          title: "district_name",
          value: "district_name",
        });
      }
      if (schema["properties"]["block"]) {
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
      if (schema["properties"]["block"]) {
        newSchema = getOptions(newSchema, { key: "block", arr: [] });
      }
      if (schema["properties"]["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    return newSchema;
  };

  const setBlock = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    let programSelected = jsonParse(localStorage.getItem("program"));

    if (schema?.properties?.block && district) {
      const qData = await geolocationRegistryService.getBlocks({
        name: district,
        state: programSelected?.state_name,
      });
      if (schema["properties"]["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData?.blocks,
          title: "block_name",
          value: "block_name",
        });
      }

      newSchema = await setVilage({
        state,
        district,
        block,
        gramp: "null",
        schemaData: newSchema,
      });
      setSchema(newSchema);
      // }
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schema["properties"]["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    return newSchema;
  };

  const setVilage = async ({ state, district, gramp, block, schemaData }) => {
    let newSchema = schemaData;
    let programSelected = jsonParse(localStorage.getItem("program"));
    if (schema?.properties?.village && block) {
      const qData = await geolocationRegistryService.getVillages({
        name: block,
        state: programSelected?.state_name,
        district: district,
        gramp: gramp || "null",
      });
      if (schema["properties"]["village"]) {
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

  useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 30);
      let maxYear = moment().subtract("years", 12);
      setYearsRange([minYear.year(), maxYear.year()]);
    }

    setFormData({
      ...formData,
      role_fields: {
        facilitator_id: localStorage.getItem("id"),
      },
    });

    const fetchData = async () => {
      const career_aspiration = await enumRegistryService.listOfEnum();
      setEnumData(career_aspiration);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (schema?.properties?.first_name) {
        const properties = schema1.properties;
        const newSteps = Object.keys(properties);
        let newSchema = properties[newSteps[0]];
        newSchema = getOptions(newSchema, {
          key: "career_aspiration",
          arr: enumData?.data?.CAREER_ASPIRATION,
          title: "title",
          value: "value",
        });

        setSchema(newSchema);
      }
    };

    fetchData();
  }, [page, enumData]);

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        const data = schema1["properties"][e]["properties"][key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const customValidate = (data, errors, c) => {
    if (data?.mobile) {
      if (data?.mobile?.toString()?.length !== 10) {
        errors.mobile.addError(t("MINIMUM_LENGTH_IS_10"));
      }
      if (!(data?.mobile > 6000000000 && data?.mobile < 9999999999)) {
        errors.mobile.addError(t("PLEASE_ENTER_VALID_NUMBER"));
      }
    }

    if (data?.dob) {
      const years = moment().diff(data?.dob, "years");
      if (years < 12) {
        errors?.dob?.addError(t("MINIMUM_AGE_12_YEAR_OLD"));
      }
      if (years > 30) {
        errors?.dob?.addError(t("MAXIMUM_AGE_30_YEAR_OLD"));
      }
    }
    ["first_name", "middle_name", "last_name"].forEach((key) => {
      if (key === "first_name" && data?.first_name?.replace(/ /g, "") === "") {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`,
        );
      }

      if (key === "last_name" && data?.last_name?.replace(/ /g, "") === "") {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`,
        );
      }

      if (data?.[key] && !data?.[key]?.match(/^[a-zA-Z ]*$/g)) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`,
        );
      }
    });

    return errors;
  };

  function cleanData(data) {
    const newData = { ...data };

    if (Array.isArray(newData.learning_motivation)) {
      newData.learning_motivation = newData.learning_motivation.filter(
        (item) => item !== undefined,
      );
    }

    if (Array.isArray(newData.type_of_support_needed)) {
      newData.type_of_support_needed = newData.type_of_support_needed.filter(
        (item) => item !== undefined,
      );
    }

    return newData;
  }

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    const cleanerData = cleanData(data);
    setFormData(cleanerData);
    if (id === "root_mobile") {
      if (
        newData?.mobile?.length !== 10 &&
        newData?.mobile < 6000000000 &&
        newData?.mobile > 9999999999
      ) {
        const newErrors = {
          mobile: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
      } else if (newData?.mobile?.length === 10) {
        const Payload = {
          mobile: newData?.mobile,
          first_name: newData?.first_name,
          middle_name: newData?.middle_name,
          last_name: newData?.last_name,
          dob: newData?.dob,
        };
        const data = await benificiaryRegistoryService.isUserExists(Payload);
        if (data?.is_data_found) {
          setIsExistModal(true);
        }
      }
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: null,
        schemaData: schema,
      });
    }

    if (id === "root_block") {
      await setVilage({
        block: data?.block,
        district: data?.district,
        schemaData: schema,
      });
    }

    if (id === "root_grampanchayat") {
      if (!data?.grampanchayat?.match(/^[a-zA-Z ]*$/g)) {
        const newErrors = {
          grampanchayat: {
            __errors: [t("REQUIRED_MESSAGE")],
          },
        };
        setErrors(newErrors);
      }
    }

    if (id === "root_address") {
      if (
        !data?.address?.match(
          /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?/\s]*$/,
        ) &&
        data?.address !== null
      ) {
        const newErrors = {
          address: {
            __errors: [t("REQUIRED_MESSAGE")],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_pincode") {
      const regex = /^\d{6}$/;
      if (data?.pincode && !regex.test(data.pincode)) {
        const newErrors = {
          pincode: {
            __errors: [t("PINCODE_ERROR")],
          },
        };
        setErrors(newErrors);
      }
    }

    if (id === "root_dob") {
      if (data?.dob) {
        const age_in_years = moment().diff(data?.dob, "years", true);
        if (!(age_in_years >= 12 && age_in_years <= 30)) {
          const newErrors = {
            dob: {
              __errors: [t("BENEFICIARY_DATE_OF_BIRTH_VALIDATION")],
            },
          };
          setErrors(newErrors);
        }
      }
    }
    if (id === "root_type_of_learner") {
      const data2 = {
        ...newData,
        last_standard_of_education: null,
        last_standard_of_education_year: null,
        education_10th_date: null,
        education_10th_exam_year: null,
        previous_school_type: null,
        reason_of_leaving_education: null,
      };
      const resultData = updateTypeOfLearnerDependancy(data2, fixedSchema);
      setSchema(resultData?.schema);
      setFormData(resultData?.newData);
    }
  };

  const updateTypeOfLearnerDependancy = (newData, scehmaNew) => {
    let schema = scehmaNew;
    if (newData?.type_of_learner === "school_dropout") {
      const {
        alreadyOpenLabel,
        education_10th_date,
        education_10th_exam_year,
        ...properties
      } = scehmaNew?.properties || {};
      // Filter required fields for "school_dropout" to ensure form relevance
      const required = scehmaNew?.required?.filter((item) =>
        [
          "type_of_learner",
          "last_standard_of_education",
          "last_standard_of_education_year",
          "previous_school_type",
          "reason_of_leaving_education",
          "learning_level",
        ].includes(item),
      );
      schema = { ...scehmaNew, properties, required };
    } else if (newData?.type_of_learner === "never_enrolled") {
      const {
        last_standard_of_education,
        last_standard_of_education_year,
        previous_school_type,
        alreadyOpenLabel,
        education_10th_date,
        education_10th_exam_year,
        ...properties
      } = scehmaNew?.properties || {};
      const required = scehmaNew?.required.filter((item) =>
        [
          "type_of_learner",
          "learning_level",
          "reason_of_leaving_education",
        ].includes(item),
      );

      schema = { ...scehmaNew, properties, required };
    } else if (newData?.type_of_learner === "already_enrolled_in_open_school") {
      const { education_10th_date, education_10th_exam_year, ...properties } =
        scehmaNew?.properties || {};
      // Adjust required fields for learners already enrolled in open school

      const required = scehmaNew?.required?.filter((item) =>
        [
          "type_of_learner",
          "last_standard_of_education",
          "last_standard_of_education_year",
          "previous_school_type",
          "reason_of_leaving_education",
          "learning_level",
        ].includes(item),
      );
      schema = { ...scehmaNew, properties, required };
    } else if (newData?.type_of_learner === "already_open_school_syc") {
      const {
        alreadyOpenLabel,
        last_standard_of_education,
        last_standard_of_education_year,
        education_10th_exam_year,
        ...properties
      } = scehmaNew?.properties || {};
      // Set required fields for "already_open_school_syc" to match specific needs

      const required = scehmaNew?.required?.filter((item) =>
        [
          "type_of_learner",
          "previous_school_type",
          "reason_of_leaving_education",
          "education_10th_date",
          "learning_level",
        ].includes(item),
      );
      schema = { ...scehmaNew, properties, required };
    } else if (newData?.type_of_learner === "stream_2_mainstream_syc") {
      const {
        last_standard_of_education,
        last_standard_of_education_year,
        previous_school_type,
        alreadyOpenLabel,
        education_10th_date,
        ...properties
      } = scehmaNew?.properties || {};
      // Customize required fields for "stream_2_mainstream_syc" learners

      const required = scehmaNew?.required?.filter((item) =>
        [
          "type_of_learner",
          "reason_of_leaving_education",
          "education_10th_exam_year",
          "learning_level",
        ].includes(item),
      );
      schema = { ...scehmaNew, properties, required };
    }

    const updatedData = { ...newData };
    if (!newData?.last_standard_of_education) {
      updatedData.last_standard_of_education = null;
    }
    if (!newData?.last_standard_of_education_year) {
      updatedData.last_standard_of_education_year = null;
    }
    if (!newData?.previous_school_type) {
      updatedData.previous_school_type = null;
    }
    if (!newData?.reason_of_leaving_education) {
      updatedData.reason_of_leaving_education = null;
    }
    if (!newData?.education_10th_exam_year) {
      updatedData.education_10th_exam_year = null;
    }
    if (!newData?.education_10th_date) {
      updatedData.education_10th_date = null;
    }
    return { schema, newData: updatedData };
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const getLocation = () => {
    const location = navigator.geolocation;
    if (location) {
      location.getCurrentPosition(showPosition, showError);
    } else {
      setAlert(t("GEO_GEOLOCATION_IS_NOT_SUPPORTED_BY_THIS_BROWSER"));
    }
  };

  const showPosition = (position) => {
    let lati = position.coords.latitude;
    let longi = position.coords.longitude;

    setFormData({
      ...formData,
      edit_page_type: "add_address",
      lat: lati?.toString(),
      long: longi?.toString(),
    });
  };

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setAlert(t("GEO_USER_DENIED_THE_REQUEST_FOR_GEOLOCATION"));

        break;
      case error.POSITION_UNAVAILABLE:
        setAlert(t("GEO_LOCATION_INFORMATION_IS_UNAVAILABLE"));

        break;
      case error.TIMEOUT:
        setAlert(t("GEO_THE_REQUEST_TO_GET_USER_LOCATION_TIMED_OUT"));

        break;
      case error.UNKNOWN_ERROR:
        setAlert(t("GEO_AN_UNKNOWN_ERROR_OCCURRED"));

        break;
    }
  }

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    // Parse the last_standard_of_education as an integer
    const lastStandard = newFormData?.last_standard_of_education
      ? parseInt(newFormData.last_standard_of_education, 10)
      : null;
    const hasWarning = lastStandard === null || lastStandard < 5;
    // Set setOpenWarningModal to true if lastStandard is null or less than 5
    if (page === "5" && hasWarning && !openWarningModal) {
      setOpenWarningModal(true);
    } else {
      setOpenWarningModal(false);
      if (schema?.properties?.first_name) {
        newFormData = {
          ...newFormData,
          ["first_name"]: newFormData?.first_name?.replace(/ /g, ""),
        };
      }

      if (schema?.properties?.last_name && newFormData?.last_name) {
        newFormData = {
          ...newFormData,
          ["last_name"]: newFormData?.last_name.replace(/ /g, ""),
        };
      }

      const newData = {
        ...formData,
        ...newFormData,
        ["form_step_number"]: parseInt(page) + 1,
      };
      setFormData(newData);
      if (_.isEmpty(errors)) {
        const { id } = authUser;
        if (id || page <= 1) {
          setStep();
        }

        if (page === "7") {
          createBeneficiary();
        }
      } else {
        const key = Object.keys(errors);
        if (key[0]) {
          goErrorPage(key[0]);
        }
      }
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={authUser || {}}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"BENEFICIARY_ONBOADING"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ONBOARDING")}
    >
      {![
        "pragati_mobilizer",
        "selected_prerak",
        "selected_for_training",
        "selected_for_onboarding",
      ].includes(prerakStatus) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <FrontEndTypo.H1>{t("PAGE_NOT_ACCESSABLE")}</FrontEndTypo.H1>
          </HStack>
        </Alert>
      ) : (
        <Box py={6} px={4} mb={5}>
          {alert && (
            <Alert status="warning" alignItems={"start"} mb="3">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{alert}</BodyMedium>
              </HStack>
            </Alert>
          )}
          {page && page !== "" && (
            <Form
              key={lang}
              ref={formRef}
              extraErrors={errors}
              showErrorList={false}
              noHtml5Validate={true}
              {...{
                templates,
                widgets,
                uiSchema,
                validator,
                schema: schema || {},
                formData,
                customValidate,
                onChange,
                onError,
                onSubmit,
                transformErrors: (errors) => transformErrors(errors, schema, t),
              }}
            >
              <FrontEndTypo.Primarybutton
                mt="5"
                p="4"
                variant={"primary"}
                type="submit"
                onPress={() => {
                  if (formRef.current.validateForm()) {
                    formRef?.current?.submit();
                  }
                }}
              >
                {t("NEXT")}
              </FrontEndTypo.Primarybutton>
            </Form>
          )}

          <Modal isOpen={isExistModal} size="lg">
            <Modal.Content>
              <Modal.Body alignItems={"center"} textAlign={"center"} p="5">
                <IconByName
                  name="ErrorWarningLineIcon"
                  isDisabled
                  color="textMaroonColor.300"
                />
                <FrontEndTypo.H3>{t("PROFILE_EXIST")}</FrontEndTypo.H3>
              </Modal.Body>
              <Modal.Footer justifyContent={"space-between"}>
                <FrontEndTypo.Secondarybutton
                  onPress={() => setIsExistModal(false)}
                >
                  {t("GO_BACK")}
                </FrontEndTypo.Secondarybutton>
                <FrontEndTypo.Primarybutton
                  onPress={async () => {
                    setIsExistModal(false);
                  }}
                >
                  {t("CONTINUE")}
                </FrontEndTypo.Primarybutton>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          <Modal
            isOpen={openWarningModal}
            onClose={() => setOpenWarningModal(false)}
          >
            <Modal.Content>
              <Modal.Header textAlign={"Center"}>
                <FrontEndTypo.H2 color="textGreyColor.500">
                  {t("EXPIRY_CONTENT.HEADING")}
                </FrontEndTypo.H2>
              </Modal.Header>
              <Modal.Body>
                <VStack space={4}>{t("EDUCATION_STANDARD_WARNING")}</VStack>
              </Modal.Body>
              <Modal.Footer justifyContent={"space-between"}>
                <FrontEndTypo.Secondarybutton onPress={() => navigate("/")}>
                  {t("CANCEL")}
                </FrontEndTypo.Secondarybutton>
                <FrontEndTypo.Primarybutton onPress={onSubmit}>
                  {t("PRERAK_PROCEED_BTN")}
                </FrontEndTypo.Primarybutton>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Box>
      )}
    </Layout>
  );
}

BeneficiaryRegister.propTypes = {
  userTokenInfo: PropTypes.object,
  footerLinks: PropTypes.object,
};
