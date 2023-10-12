import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";
import {
  Layout,
  t,
  BodyMedium,
  benificiaryRegistoryService,
  AgRegistryService,
  enumRegistryService,
  FrontEndTypo,
  getOptions,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  CustomR,
  select,
} from "../../../../component/BaseInput.js";

// App
export default function App({ onClick, id }) {
  const userId = id;
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState();
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const navigate = useNavigate();
  const { form_step_number } = {};
  if (form_step_number && parseInt(form_step_number) >= 13) {
    navigate("/dashboard");
  }

  React.useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(userId);
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
    });
  }, []);

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
    }
    setSchema(newSchema);
  }, [formData]);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/educationdetails`);
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
      } else if (pageStape.toLowerCase() === "n") {
        await formSubmitUpdate({ ...formData, form_step_number: "13" });
        setPage("upload");
      } else {
        return true;
      }
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

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
    }
  }, []);

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
    const newData = { ...formData, ...data };
    setFormData(newData);

    if (newData?.type_of_learner === "never_enrolled") {
      setErrors({});
      if (newData?.last_standard_of_education !== "na") {
        const newErrors = {
          last_standard_of_education: {
            __errors: [t("SELECT_MESSAGE_NEVER_ENROLLED")],
          },
        };

        setErrors(newErrors);
      } else if (newData?.last_standard_of_education_year !== "NA") {
        const newErrors = {
          last_standard_of_education_year: {
            __errors: [t("SELECT_MESSAGE_NEVER_ENROLLED")],
          },
        };
        setErrors(newErrors);
      } else if (newData?.previous_school_type !== "na") {
        const newErrors = {
          previous_school_type: {
            __errors: [t("SELECT_MESSAGE_NEVER_ENROLLED")],
          },
        };
        setErrors(newErrors);
      } else {
        const newErrors = {};
        setErrors(newErrors);
      }
    } else if (newData?.type_of_learner === "dropout") {
      setErrors({});
      if (newData?.previous_school_type === "never_studied") {
        const newErrors = {
          previous_school_type: {
            __errors: [t("SELECT_MESSAGE_DROPOUT")],
          },
        };
        setErrors(newErrors);
      } else {
        const newErrors = {};
        setErrors(newErrors);
      }
    } else {
      const newErrors = {};
      setErrors(newErrors);
    }
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };
  const onSubmit = async (data) => {
    if (!Object.keys(errors).length) {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      if (updateDetails) {
        navigate(`/beneficiary/${userId}/educationdetails`);
      }
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo"],
        name: t("EDUCATION_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
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
            widgets={{ select, CustomR }}
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
