import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, Button, HStack } from "native-base";
import {
  Layout,
  BodyMedium,
  enumRegistryService,
  benificiaryRegistoryService,
  AgRegistryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";

// App
export default function ReferenceDetails({ ip }) {
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
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/basicdetails`);
  };

  React.useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(id);
    setFormData(qData.result);
  }, []);

  React.useEffect(async () => {
    let rfirst_name = formData?.references?.[0]?.first_name;
    let rmiddle_name = formData?.references?.[0]?.middle_name;
    let rlast_name = formData?.references?.[0]?.last_name;
    let rrelation = formData?.references?.[0]?.relation;
    let rcontact_number = formData?.references?.[0]?.contact_number;

    setFormData({
      ...formData,
      referencefullname: {
        first_name: rfirst_name,
        middle_name: rmiddle_name == "null" ? "" : rmiddle_name,
        last_name: rlast_name == "null" ? "" : rlast_name,
        relation: rrelation,
        contact_number: rcontact_number,
      },
    });
  }, [formData?.id]);

  const uiSchema = {};

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
    if (data?.referencefullname?.contact_number) {
      if (data?.referencefullname?.contact_number.toString()?.length !== 10) {
        errors.referencefullname.contact_number.addError(
          t("MINIMUM_LENGTH_IS_10")
        );
      }
      if (
        !(
          data?.referencefullname?.contact_number > 6000000000 &&
          data?.referencefullname?.contact_number < 9999999999
        )
      ) {
        errors.referencefullname.contact_number.addError(
          t("PLEASE_ENTER_VALID_NUMBER")
        );
      }
    }

    ["relation", "first_name"].forEach((key) => {
      if (
        key === "first_name" &&
        data?.referencefullname?.first_name?.replaceAll(" ", "") === ""
      ) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (
        data?.referencefullname?.[key] &&
        !data?.referencefullname?.[key]?.match(/^[a-zA-Z ]*$/g)
      ) {
        errors?.[`referencefullname`]?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (key === "relation" && data?.relation?.replaceAll(" ", "") === "") {
        errors?.[`referencefullname`]?.[key]?.addError(
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
      }
      return error;
    });
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_contact_number") {
      if (data?.mobile?.toString()?.length === 10) {
        await userExist({ mobile: data?.mobile });

        const newErrors = {
          mobile: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
      }
    }
    setFormData(newData);
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    setIsButtonLoading(true);
    if (formData?.referencefullname?.contact_number.toString()?.length !== 10) {
      const newErrors = {
        contact_number: {
          __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
        },
      };
      setErrors(newErrors);
    } else {
      await AgRegistryService.updateAg(formData?.referencefullname, userId);
      navigate(`/beneficiary/${userId}/basicdetails`);
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("REFERENCE_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
      analyticsPageTitle={"BENEFICIARY_REFERENCE_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("REFERENCE_DETAILS")}
    >
      <Box py={6} px={4} mb={5}>
        {alert && (
          <Alert status="warning" alignItems={"start"} mb="3">
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <BodyMedium>{alert}</BodyMedium>
            </HStack>
          </Alert>
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
              uiSchema,
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
                isLoading={isButtonLoading}
                minW="60%"
                mt="3"
                variant={"primary"}
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
    </Layout>
  );
}
