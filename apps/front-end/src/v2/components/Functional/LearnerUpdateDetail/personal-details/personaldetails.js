import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";

import {
  Layout,
  BodyMedium,
  enumRegistryService,
  benificiaryRegistoryService,
  AgRegistryService,
  FrontEndTypo,
  getOptions,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  CustomR,
  select,
  RadioBtn,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";
import accessControl from "pages/front-end/facilitator/edit/AccessControl.js";

// App
export default function PersonalDetails({ ip }) {
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
  const [fields, setFields] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(false);

  const userId = id;
  const navigate = useNavigate();

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
    let marital_status = formData?.extended_users?.marital_status;
    let social_category = formData?.extended_users?.social_category;

    setFormData({
      ...formData,
      edit_page_type: "personal",
      marital_status: marital_status,
      social_category: social_category,
    });
  }, [formData?.id]);

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
        setSchemaData(properties[nextIndex]);
      } else if (pageStape.toLowerCase() === "n") {
        await formSubmitUpdate({ ...formData, form_step_number: "6" });
        setPage("SAVE");
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
          setSchemaData(properties[pageNumber]);
        }
      } else {
        nextPreviewStep();
      }
    }
  };

  React.useEffect(async () => {
    const ListOfEnum = await enumRegistryService.listOfEnum();
    let newSchema = schema;
    if (schema["properties"]?.["marital_status"]) {
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
      setSchemaData(newSchema);
    }
  }, [page]);
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
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const Submit = async (data) => {
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
        name: t("PERSONAL_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
      analyticsPageTitle={"BENEFICIARY_PERSONAL_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("PERSONAL_DETAILS")}
    >
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
            widgets={{ CustomR, RadioBtn }}
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
            }}
          >
            <FrontEndTypo.Primarybutton
              isDisabled={isDisable}
              mt="3"
              variant={"primary"}
              type="submit"
              onPress={() => Submit()}
            >
              {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
            </FrontEndTypo.Primarybutton>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
