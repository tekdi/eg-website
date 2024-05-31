import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./Schema/SchemaUpdate.js";
import { Alert, Box, Button, Center, HStack, Image, VStack } from "native-base";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  uploadRegistryService,
  AgRegistryService,
  Camera,
  Layout,
  H1,
  IconByName,
  H2,
  H3,
  BodyMedium,
  benificiaryRegistoryService,
  enumRegistryService,
  FrontEndTypo,
  getOptions,
  Loading,
  getUniqueArray,
  jsonParse,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  templates,
  widgets,
} from "../../Static/FormBaseInput/FormBaseInput.js";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// App

export default function LearnerFormUpdate({ userTokenInfo, footerLinks }) {
  const { authUser } = userTokenInfo;
  const { t } = useTranslation();
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [fixedSchema, setFixedSchema] = React.useState({});
  const [cameraModal, setCameraModal] = React.useState(false);
  const [credentials, setCredentials] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const [addBtn, setAddBtn] = React.useState(t("YES"));
  const formRef = React.useRef();
  const uplodInputRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [userId, setuserId] = React.useState();
  const location = useLocation();
  const [agroute, setagroute] = React.useState(location?.state?.route);
  const [loading, setLoading] = React.useState(true);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const id = useParams();

  const navigate = useNavigate();

  React.useEffect(async () => {
    setuserId(id?.id);
    const { result } = await benificiaryRegistoryService.getOne(id?.id);
    let programSelected = jsonParse(localStorage.getItem("program"));

    if (result) {
      setFormData({
        ...formData,
        device_ownership:
          result?.core_beneficiaries?.device_ownership || undefined,
        device_type: result?.core_beneficiaries?.device_type || undefined,
        state: programSelected?.state_name || undefined,
        district: result?.district || undefined,
        address: result?.address || undefined,
        block: result?.block || undefined,
        village: result?.village || undefined,
        grampanchayat: result?.grampanchayat || undefined,
        pincode: result?.pincode || undefined,
        marital_status: result?.extended_users?.marital_status || undefined,
        social_category: result?.extended_users?.social_category || undefined,
        type_of_learner:
          result?.core_beneficiaries?.type_of_learner || undefined,
        last_standard_of_education_year:
          result?.core_beneficiaries?.last_standard_of_education_year ||
          undefined,
        last_standard_of_education:
          result?.core_beneficiaries?.last_standard_of_education || undefined,
        previous_school_type:
          result?.core_beneficiaries?.previous_school_type || undefined,
        reason_of_leaving_education:
          result?.core_beneficiaries?.reason_of_leaving_education || undefined,
        learning_level:
          result?.program_beneficiaries?.learning_level || undefined,
        learning_motivation:
          getUniqueArray(result?.program_beneficiaries?.learning_motivation) ||
          undefined,
        type_of_support_needed:
          getUniqueArray(
            result?.program_beneficiaries?.type_of_support_needed
          ) || undefined,
      });
    }
  }, []);

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
  };

  const updateData = (data, deleteData = false) => {};

  const uiSchema = {
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
      } else if (page == "1") {
        navigate("/beneficiary", { state: { id: userId } });
      } else {
        nextIndex = pages[index - 1];
      }
      if (nextIndex !== undefined) {
        setPage(nextIndex);
        setSchema(properties[nextIndex]);
      } else if (pageStape.toLowerCase() === "n") {
        await formSubmitUpdate({ ...formData, form_step_number: "13" });
        setPage("upload");
      } else {
        return true;
      }
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

  React.useEffect(async () => {
    setLoading(true);
    setFormData({ ...formData, edit_page_type: "add_contact" });
    if (page === "2") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      getLocation();
    } else if (page === "3") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "personal" });
    } else if (page === "4") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "add_education" });
    } else if (page === "5") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "add_other_details" });
    } else if (page === "upload") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
    }
    setLoading(false);
  }, [page]);

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

  React.useEffect(async () => {
    const ListOfEnum = await enumRegistryService.listOfEnum();
    const lastYear = await benificiaryRegistoryService.lastYear();

    let newSchema = schema;
    if (schema?.["properties"]?.["type_of_learner"]) {
      newSchema = getOptions(newSchema, {
        key: "type_of_learner",
        arr: ListOfEnum?.data?.TYPE_OF_LEARNER,
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
        key: "last_standard_of_education",
        arr: ListOfEnum?.data?.LAST_STANDARD_OF_EDUCATION,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "previous_school_type",
        arr: ListOfEnum?.data?.PREVIOUS_SCHOOL_TYPE,
        title: t("title"),
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "learning_level",
        arr: ListOfEnum?.data?.BENEFICIARY_LEARNING_LEVEL,
        title: t("title"),
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "reason_of_leaving_education",
        arr: ListOfEnum?.data?.REASON_OF_LEAVING_EDUCATION,
        title: "title",
        value: "value",
      });
      newSchema = getOptions(newSchema, {
        key: "education_10th_exam_year",
        arr: lastYear,
        title: "value",
        value: "value",
      });
      setFixedSchema(newSchema);

      if (formData?.type_of_learner === "never_enrolled") {
        const {
          last_standard_of_education,
          last_standard_of_education_year,
          previous_school_type,
          alreadyOpenLabel,
          education_10th_date,
          education_10th_exam_year,
          ...properties
        } = newSchema?.properties || {};
        const required = newSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "learning_level",
            "reason_of_leaving_education",
          ].includes(item)
        );

        setSchema({ ...newSchema, properties, required });
      } else if (
        formData?.type_of_learner === "already_enrolled_in_open_school"
      ) {
        const { education_10th_date, education_10th_exam_year, ...properties } =
          newSchema?.properties || {};
        const required = newSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "last_standard_of_education",
            "last_standard_of_education_year",
            "previous_school_type",
            "reason_of_leaving_education",
            "learning_level",
          ].includes(item)
        );
        setSchema({ ...newSchema, properties, required });
      } else if (
        page === "4" &&
        formData?.type_of_learner === "already_open_school_syc"
      ) {
        const {
          alreadyOpenLabel,
          last_standard_of_education,
          last_standard_of_education_year,
          education_10th_exam_year,
          ...properties
        } = newSchema?.properties || {};
        const required = newSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "previous_school_type",
            "reason_of_leaving_education",
            "education_10th_date",
            "learning_level",
          ].includes(item)
        );
        setSchema({ ...newSchema, properties, required });
      } else if (formData?.type_of_learner === "stream_2_mainstream_syc") {
        const {
          last_standard_of_education,
          last_standard_of_education_year,
          previous_school_type,
          alreadyOpenLabel,
          education_10th_date,
          ...properties
        } = newSchema?.properties || {};
        const required = newSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "reason_of_leaving_education",
            "education_10th_exam_year",
            "learning_level",
          ].includes(item)
        );
        setSchema({ ...newSchema, properties, required });
      } else {
        const {
          alreadyOpenLabel,
          education_10th_date,
          education_10th_exam_year,
          ...properties
        } = newSchema?.properties || {};
        const required = newSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "last_standard_of_education",
            "last_standard_of_education_year",
            "previous_school_type",
            "reason_of_leaving_education",
            "learning_level",
          ].includes(item)
        );
        setSchema({ ...newSchema, properties, required });
      }
    }
    if (schema?.["properties"]?.["marital_status"]) {
      newSchema = getOptions(newSchema, {
        key: "social_category",
        arr: ListOfEnum?.data?.BENEFICIARY_SOCIAL_STATUS,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "marital_status",
        arr: ListOfEnum?.data?.MARITAL_STATUS,
        title: "title",
        value: "value",
      });
      setSchema(newSchema);
    }

    if (schema["properties"]?.["learning_motivation"]) {
      newSchema = getOptions(newSchema, {
        key: "learning_motivation",
        arr: ListOfEnum?.data?.LEARNING_MOTIVATION,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "type_of_support_needed",
        arr: ListOfEnum?.data?.TYPE_OF_SUPPORT_NEEDED,
        title: "title",
        value: "value",
      });
      setSchema(newSchema);
    }
    setLoading(false);
  }, [page]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (schema?.properties?.district) {
        let programSelected = jsonParse(localStorage.getItem("program"));
        const qData = await geolocationRegistryService.getStates();

        let newSchema = schema;
        if (schema["properties"]["state"]) {
          newSchema = getOptions(newSchema, {
            key: "state",
            arr: qData?.states,
            title: "state_name",
            value: "state_name",
          });
        }
        newSchema = await setDistric({
          schemaData: newSchema,
          state: programSelected?.state_name,
          district: formData?.district,
          block: formData?.block,
          // gramp: formData?.grampanchayat,
        });
        setSchema(newSchema);
      }
    };
    fetchData();
  }, [formData]);

  // Type Of Student

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(agroute ? "upload" : newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
  }, []);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmitUpdate = async (formData) => {
    const { id } = authUser;

    if (id) {
      updateData({}, true);
    }
  };

  const formSubmitCreate = async (formData) => {};

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
    if (data?.aadhar_token) {
      if (
        data?.aadhar_token &&
        !`${data?.aadhar_token}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
      ) {
        errors?.aadhar_token?.addError(
          `${t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER")}`
        );
      }
    }
    if (data?.dob) {
      const years = moment().diff(data?.dob, "years");
      if (years < 18) {
        errors?.dob?.addError(t("MINIMUM_AGE_18_YEAR_OLD"));
      }
    }
    ["grampanchayat"].forEach((key) => {
      if (
        (key === "grampanchayat" &&
          data?.grampanchayat?.replaceAll(" ", "") === "") ||
        data?.grampanchayat === null
      ) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }
    });

    return errors;
  };

  const transformErrors = (errors, uiSchema) => {
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
      } else if (["minItems", "maxItems"].includes(error.name)) {
        error.message = `${t("SELECT_MIN_MAX_ERROR")}`;
      }

      return error;
    });
  };

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
    if (schema?.properties?.block && district) {
      const qData = await geolocationRegistryService.getBlocks({
        name: district,
        state: state,
      });
      if (schema["properties"]["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData?.blocks,
          title: "block_name",
          value: "block_name",
        });
      }
      // if (
      //   schema?.["properties"]?.["grampanchayat"] &&
      //   ["BIHAR"].includes(state)
      // ) {
      //   newSchema = await setGramp({
      //     state,
      //     district,
      //     block,
      //     gramp,
      //     schemaData: newSchema,
      //   });
      //   setSchema(newSchema);
      // } else {
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

  // const setGramp = async ({ gramp, state, district, block, schemaData }) => {
  //   let newSchema = schemaData;
  //   if (schema?.properties?.village && block) {
  //     const qData = await geolocationRegistryService.getGrampanchyat({
  //       block: block,
  //       state: state,
  //       district: district,
  //     });
  //     if (schema?.["properties"]?.["grampanchayat"]) {
  //       newSchema = getOptions(newSchema, {
  //         key: "grampanchayat",
  //         arr: qData?.gramPanchayat,
  //         title: "grampanchayat_name",
  //         value: "grampanchayat_name",
  //         format: "select",
  //       });
  //     }
  //     setSchema(newSchema);

  //     if (schema?.["properties"]?.["village"] && gramp) {
  //       newSchema = await setVilage({
  //         state,
  //         district,
  //         block,
  //         gramp,
  //         schemaData: newSchema,
  //       });
  //     }
  //   } else {
  //     newSchema = getOptions(newSchema, { key: "grampanchayat", arr: [] });
  //     setSchema(newSchema);
  //   }
  //   setLoading(false);
  //   return newSchema;
  // };

  const setVilage = async ({ state, district, gramp, block, schemaData }) => {
    let newSchema = schemaData;
    if (schema?.properties?.village && block) {
      const qData = await geolocationRegistryService.getVillages({
        name: block,
        state: state,
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

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    updateData(newData);
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

    if (id === "root_state") {
      await setDistric({
        schemaData: schema,
        state: data?.state,
        district: data?.district,
        block: data?.block,
      });
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: null,
        schemaData: schema,
      });
    }

    if (id === "root_block") {
      await setVilage({ block: data?.block, schemaData: schema });
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
          /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?/\s]*$/
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
      const regex = /^[0-9]{6}$/;
      if (data?.pincode && !regex.test(data.pincode)) {
        const newErrors = {
          pincode: {
            __errors: [t("PINCODE_ERROR")],
          },
        };
        setErrors(newErrors);
      }
    }

    if (id === "root_type_of_learner") {
      if (data?.type_of_learner === "school_dropout") {
        const {
          alreadyOpenLabel,
          education_10th_date,
          education_10th_exam_year,
          ...properties
        } = fixedSchema?.properties || {};
        const required = fixedSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "last_standard_of_education",
            "last_standard_of_education_year",
            "previous_school_type",
            "reason_of_leaving_education",
            "learning_level",
          ].includes(item)
        );
        setSchema({ ...fixedSchema, properties, required });
      } else if (data?.type_of_learner === "never_enrolled") {
        const {
          last_standard_of_education,
          last_standard_of_education_year,
          previous_school_type,
          alreadyOpenLabel,
          education_10th_date,
          education_10th_exam_year,
          ...properties
        } = fixedSchema?.properties || {};
        const required = fixedSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "learning_level",
            "reason_of_leaving_education",
          ].includes(item)
        );

        setSchema({ ...fixedSchema, properties, required });
      } else if (data?.type_of_learner === "already_enrolled_in_open_school") {
        const { education_10th_date, education_10th_exam_year, ...properties } =
          fixedSchema?.properties || {};
        const required = fixedSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "last_standard_of_education",
            "last_standard_of_education_year",
            "previous_school_type",
            "reason_of_leaving_education",
            "learning_level",
          ].includes(item)
        );
        setSchema({ ...fixedSchema, properties, required });
      } else if (
        page === "4" &&
        data?.type_of_learner === "already_open_school_syc"
      ) {
        const {
          alreadyOpenLabel,
          last_standard_of_education,
          last_standard_of_education_year,
          education_10th_exam_year,
          ...properties
        } = fixedSchema?.properties || {};
        const required = fixedSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "previous_school_type",
            "reason_of_leaving_education",
            "education_10th_date",
            "learning_level",
          ].includes(item)
        );
        setSchema({ ...fixedSchema, properties, required });
      } else if (data?.type_of_learner === "stream_2_mainstream_syc") {
        const {
          last_standard_of_education,
          last_standard_of_education_year,
          previous_school_type,
          alreadyOpenLabel,
          education_10th_date,
          ...properties
        } = fixedSchema?.properties || {};
        const required = fixedSchema?.required?.filter((item) =>
          [
            "type_of_learner",
            "reason_of_leaving_education",
            "education_10th_exam_year",
            "learning_level",
          ].includes(item)
        );
        setSchema({ ...fixedSchema, properties, required });
      }
      if (
        newData?.last_standard_of_education ||
        newData?.last_standard_of_education_year ||
        newData?.previous_school_type ||
        newData?.reason_of_leaving_education ||
        newData?.education_10th_exam_year ||
        newData?.education_10th_date
      ) {
        setFormData({
          ...newData,
          last_standard_of_education: undefined,
          last_standard_of_education_year: undefined,
          previous_school_type: undefined,
          reason_of_leaving_education: undefined,
          education_10th_exam_year: undefined,
          education_10th_date: undefined,
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
    if (addBtn !== t("YES")) setAddBtn(t("YES"));
    let newFormData = data.formData;
    if (schema?.properties?.first_name) {
      newFormData = {
        ...newFormData,
        ["first_name"]: newFormData?.first_name.replaceAll(" ", ""),
      };
    }

    if (schema?.properties?.last_name && newFormData?.last_name) {
      newFormData = {
        ...newFormData,
        ["last_name"]: newFormData?.last_name.replaceAll(" ", ""),
      };
    }

    const newData = {
      ...formData,
      ...newFormData,
      ["form_step_number"]: parseInt(page) + 1,
    };
    setFormData(newData);
    updateData(newData);
    if (_.isEmpty(errors)) {
      const { id } = authUser;
      let success = false;
      if (id) {
        // const data = await formSubmitUpdate(newData);
        // if (!_.isEmpty(data)) {
        success = true;
        // }
      } else if (page === "2") {
        const data = await formSubmitCreate(newFormData);
        if (data?.error) {
          const newErrors = {
            mobile: {
              __errors: data?.error
                ? data?.error
                : [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        } else {
          if (data?.username && data?.password) {
            setCredentials(data);
          }
        }
      } else if (page <= 1) {
        success = true;
      }
      if (success) {
        setStep();
      }
    } else {
      const key = Object.keys(errors);
      if (key[0]) {
        goErrorPage(key[0]);
      }
    }
  };

  const [cameraFile, setcameraFile] = useState();

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    let data = await benificiaryRegistoryService.validateFileMaxSize(file);
    if (data) {
      setCameraUrl(data);
      setcameraFile(file);
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
    }
  };

  const uploadProfile = async () => {
    const { id } = authUser;
    if (id) {
      setIsButtonLoading(false);
      const form_data = new FormData();
      const item = {
        file: cameraFile,
        document_type: "profile_photo",
        document_sub_type: "profile_photo_1",
        user_id: userId,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }

      try {
        const uploadDoc = await uploadRegistryService.uploadFile(form_data);
        if (uploadDoc) {
          setIsButtonLoading(false);
          navigate(`/`);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (cameraUrl) {
    return (
      <Layout
        _appBar={{
          lang,
          setLang,
          onPressBackButton: (e) => {
            setCameraUrl();
            setCameraModal(false);
          },
          onlyIconsShow: ["backBtn", "userInfo"],
        }}
        _page={{ _scollView: { bg: "white" } }}
        _footer={{ menues: footerLinks }}
        analyticsPageTitle={"BENEFICIARY"}
        pageTitle={t("BENEFICIARY")}
      >
        <VStack py={6} px={4} mb={5} space="6">
          <Center>
            <Image
              source={{
                uri: cameraUrl,
              }}
              alt=""
              size="324px"
            />
          </Center>
          <Button
            variant={"primary"}
            onPress={uploadProfile}
            isDisabled={isButtonLoading}
          >
            {t("SUBMIT")}
          </Button>
          <Button
            variant={"secondary"}
            leftIcon={<IconByName name="CameraLineIcon" isDisabled />}
            onPress={(e) => {
              setCameraUrl();
              setCameraModal(true);
            }}
          >
            {t("TAKE_ANOTHER_PHOTO")}
          </Button>

          <Button
            variant={"secondary"}
            leftIcon={<IconByName name="CameraLineIcon" isDisabled />}
            onPress={(e) => {
              navigate(`/`);
            }}
          >
            {t("SKIP")}
          </Button>
        </VStack>
      </Layout>
    );
  }
  if (cameraModal) {
    return (
      <Camera
        {...{
          cameraModal,
          setCameraModal,
          cameraUrl,
          setcameraFile,
          setCameraUrl: async (url) => {
            setCameraUrl(url);
            setFormData({ ...formData, ["profile_url"]: url });
          },
        }}
      />
    );
  }

  if (page === "upload") {
    const properties = schema1.properties;
    const newSteps = Object.keys(properties);
    const onPressBackButton = async () => {
      setagroute(false);
      setPage(newSteps[4]);
      setSchema(properties[newSteps[4]]);
    };
    return (
      <Layout
        _appBar={{
          onPressBackButton,
          lang,
          setLang,
          onlyIconsShow: ["backBtn", "userInfo"],
        }}
        _page={{ _scollView: { bg: "white" } }}
        _footer={{ menues: footerLinks }}
        analyticsPageTitle={"BENEFICIARY"}
        pageTitle={t("BENEFICIARY")}
      >
        <VStack py={6} px={4} mb={5} space="6">
          <H1 color="red.1000">{t("ADD_AG_PROFILE_PHOTO")}</H1>
          <H3 color="red.1000">{t("ADD_AG_PROFILE_PHOTO_INSTRUCTION")}</H3>

          <Button
            variant={"primary"}
            leftIcon={
              <IconByName
                name="CameraLineIcon"
                color="white"
                size={2}
                isDisabled
              />
            }
            onPress={(e) => {
              setCameraUrl();
              setCameraModal(true);
            }}
          >
            {t("TAKE_PHOTO")}
          </Button>
          <VStack space={2}>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              ref={uplodInputRef}
              onChange={handleFileInputChange}
            />
            <Button
              leftIcon={<IconByName name="Download2LineIcon" isDisabled />}
              variant={"secondary"}
              onPress={(e) => {
                uplodInputRef?.current?.click();
              }}
            >
              {t("UPLOAD_PHOTO")}
            </Button>
            <Button
              variant={"secondary"}
              leftIcon={<IconByName name="CameraLineIcon" isDisabled />}
              onPress={(e) => {
                navigate(`/`);
              }}
            >
              {t("SKIP")}
            </Button>
            {errors?.fileSize ? (
              <H2 color="red.400">{errors?.fileSize}</H2>
            ) : (
              <React.Fragment />
            )}
          </VStack>
        </VStack>
      </Layout>
    );
  }

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
      analyticsPageTitle={"BENEFICIARY"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={() => {
        switch (page) {
          case "1":
            return t("CONTACT_INFORMATION");
          case "2":
            return t("COMPLETE_ADDRESS");
          case "3":
            return t("PERSONAL_DETAILS");
          case "4":
            return t("EDUCATION_DETAILS");
          case "5":
            return t("ASPIRATION_MAPPING");
          default:
            return "";
        }
      }}
    >
      <Box py={6} px={4} mb={5}>
        {/* <Steper
          type={"circle"}
          steps={[{ value: "3", label: t("IDENTIFY_THE_AG_LEARNER") }]}
          progress={page === "upload" ? 10 : page}
        /> */}
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
            key={lang + addBtn}
            ref={formRef}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              templates,
              widgets,
              uiSchema,
              validator,
              schema: schema ? schema : {},
              formData,
              customValidate,
              onChange,
              onError,
              onSubmit,
              transformErrors,
            }}
          >
            {page == 2 ? (
              <FrontEndTypo.Primarybutton
                mt="3"
                type="submit"
                isLoading={isButtonLoading}
                onPress={() => {
                  if (formRef.current.validateForm()) {
                    formRef?.current?.submit();
                  } else {
                    if (formRef.current.validateForm()) {
                      formRef?.current?.submit();
                    }
                  }
                }}
              >
                {pages[pages?.length - 1] === page ? t("NEXT") : submitBtn}
              </FrontEndTypo.Primarybutton>
            ) : (
              <FrontEndTypo.Primarybutton
                mt="3"
                type="submit"
                isLoading={isButtonLoading}
                onPress={() => {
                  formRef?.current?.submit();
                }}
              >
                {pages[pages?.length - 1] === page ? t("NEXT") : submitBtn}
              </FrontEndTypo.Primarybutton>
            )}
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
