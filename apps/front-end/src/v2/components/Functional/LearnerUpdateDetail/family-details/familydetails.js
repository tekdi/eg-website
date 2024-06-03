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
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";
import accessControl from "pages/front-end/facilitator/edit/AccessControl.js";

// App
export default function FamilyDetails({ ip }) {
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
      }}
      _page={{ _scollView: { bg: "white" } }}
      analyticsPageTitle={"BENEFICIARY_FAMILY_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("FAMILY_DETAILS")}
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
