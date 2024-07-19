import React, { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";
import {
  Layout,
  BodyMedium,
  benificiaryRegistoryService,
  AgRegistryService,
  enumRegistryService,
  FrontEndTypo,
  getOptions,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import {
  widgets,
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  onError,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import accessControl from "pages/front-end/facilitator/edit/AccessControl.js";
import moment from "moment";
import { useTranslation } from "react-i18next";

// App
export default function App({ onClick, id }) {
  const userId = id;
  const [page, setPage] = useState();
  const [schema, setSchema] = useState({});
  const [fixedSchema, setFixedSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [yearsRange, setYearsRange] = useState([]);
  const { t } = useTranslation();

  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const navigate = useNavigate();
  const { form_step_number } = {};
  if (form_step_number && parseInt(form_step_number) >= 13) {
    navigate("/dashboard");
  }
  const [fields, setFields] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const uiSchema = {
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
  useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(userId);
    setYearsRange([moment(qData?.result?.dob).year(), moment().year()]);
    let last_standard_of_education =
      qData?.result?.core_beneficiaries?.last_standard_of_education;
    let last_standard_of_education_year =
      qData?.result?.core_beneficiaries?.last_standard_of_education_year;
    let reason_of_leaving_education =
      qData?.result?.core_beneficiaries?.reason_of_leaving_education;
    let type_of_learner = qData?.result?.core_beneficiaries?.type_of_learner;
    let previous_school_type =
      qData?.result?.core_beneficiaries?.previous_school_type;
    let learning_level = qData?.result?.program_beneficiaries?.learning_level;

    setFormData({
      ...formData,
      type_of_learner: type_of_learner,
      reason_of_leaving_education: reason_of_leaving_education,
      last_standard_of_education_year: last_standard_of_education_year,
      last_standard_of_education: last_standard_of_education,
      previous_school_type: previous_school_type,
      learning_level: learning_level,
      education_10th_date:
        qData?.result?.core_beneficiaries?.education_10th_date,
      education_10th_exam_year:
        qData?.result?.core_beneficiaries?.education_10th_exam_year,
    });
    const result = await facilitatorRegistryService.getEditRequests({
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    });

    let field;
    const parseField = result?.data[0]?.fields;
    if (parseField && typeof parseField === "string") {
      field = JSON.parse(parseField);
    }
    setFields(field || []);

    const ListOfEnum = await enumRegistryService.listOfEnum();
    const lastYear = await benificiaryRegistoryService.lastYear({
      dob: qData?.result?.dob,
    });
    const propertiesNew = schema1.properties;
    const newSteps = Object.keys(propertiesNew);
    setPage(newSteps[0]);
    let newSchema = propertiesNew[newSteps[0]];
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
      key: "education_10th_exam_year",
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
      key: "reason_of_leaving_education",
      arr: ListOfEnum?.data?.REASON_OF_LEAVING_EDUCATION,
      title: t("title"),
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
    setFixedSchema(newSchema);
    const {
      alreadyOpenLabel,
      education_10th_date,
      education_10th_exam_year,
      ...properties
    } = newSchema?.properties || {};
    setSchemaData({ ...newSchema, properties });
  }, []);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/educationdetails`);
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
      }
      return error;
    });
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors({});
    let newData = { ...formData, ...data };
    if (id === "root_type_of_learner") {
      newData = {
        ...newData,
        last_standard_of_education: null,
        last_standard_of_education_year: null,
        education_10th_date: null,
        education_10th_exam_year: null,
        previous_school_type: null,
        reason_of_leaving_education: null,
      };
    }
    setFormData(newData);

    if (newData?.type_of_learner === "school_dropout") {
      const {
        alreadyOpenLabel,
        education_10th_date,
        education_10th_exam_year,
        ...properties
      } = fixedSchema?.properties || {};
      // Filter required fields for "school_dropout" to ensure form relevance
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
      setSchemaData({ ...fixedSchema, properties, required });
    } else if (newData?.type_of_learner === "never_enrolled") {
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
      setSchemaData({ ...fixedSchema, properties, required });
    } else if (newData?.type_of_learner === "already_enrolled_in_open_school") {
      const { education_10th_date, education_10th_exam_year, ...properties } =
        fixedSchema?.properties || {};
      // Adjust required fields for learners already enrolled in open school

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
      setSchemaData({ ...fixedSchema, properties, required });
    } else if (newData?.type_of_learner === "already_open_school_syc") {
      const {
        alreadyOpenLabel,
        last_standard_of_education,
        last_standard_of_education_year,
        education_10th_exam_year,
        ...properties
      } = fixedSchema?.properties || {};
      // Set required fields for "already_open_school_syc" to match specific needs

      const required = fixedSchema?.required?.filter((item) =>
        [
          "type_of_learner",
          "previous_school_type",
          "reason_of_leaving_education",
          "education_10th_date",
          "learning_level",
        ].includes(item)
      );
      setSchemaData({ ...fixedSchema, properties, required });
    } else if (newData?.type_of_learner === "stream_2_mainstream_syc") {
      const {
        last_standard_of_education,
        last_standard_of_education_year,
        previous_school_type,
        alreadyOpenLabel,
        education_10th_date,
        ...properties
      } = fixedSchema?.properties || {};
      // Customize required fields for "stream_2_mainstream_syc" learners

      const required = fixedSchema?.required?.filter((item) =>
        [
          "type_of_learner",
          "reason_of_leaving_education",
          "education_10th_exam_year",
          "learning_level",
        ].includes(item)
      );
      setSchemaData({ ...fixedSchema, properties, required });
    } else {
      const newErrors = {};
      setErrors(newErrors);
    }
  };

  const onSubmit = async (data) => {
    setIsDisable(true);
    if (!Object.keys(errors).length) {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      if (updateDetails) {
        navigate(`/beneficiary/${userId}/educationdetails`);
      }
    }
  };

  const setSchemaData = (newSchema) => {
    setSchema(accessControl(newSchema, fields));
  };
  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
        name: t("EDUCATION_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
      analyticsPageTitle={"BENEFICIARY_EDUCATION_FORM"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("EDUCATION")}
    >
      <Box py={6} px={4} mb={5}>
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
              widgets,
              uiSchema,
              onChange,
              onError,
              transformErrors,
              onSubmit,
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              variant={"primary"}
              type="submit"
              onPress={() => formRef?.current?.submit()}
              isDisabled={isDisable}
            >
              {t("SAVE")}
            </FrontEndTypo.Primarybutton>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
