import React, { useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, HStack, VStack } from "native-base";
import {
  Layout,
  BodyMedium,
  enumRegistryService,
  benificiaryRegistoryService,
  AgRegistryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  RadioBtn,
  CustomR,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";

// App
export default function ContactDetailsEdit({ ip }) {
  const { t } = useTranslation();
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const [submitBtn, setSubmitBtn] = useState();
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [yearsRange, setYearsRange] = useState([1980, 2030]);
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const userId = id;

  const [searchParams] = useSearchParams();
  const redirectLink = searchParams.get("redirectLink");
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/basicdetails`);
  };

  //getting data
  React.useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(id);
    setFormData({
      ...formData,
      mobile: qData?.result?.mobile || undefined,
      mark_as_whatsapp_number:
        qData?.result?.core_beneficiaries?.mark_as_whatsapp_number || undefined,
      device_type: qData?.result?.core_beneficiaries?.device_type || undefined,
      device_ownership:
        qData?.result?.core_beneficiaries?.device_ownership || undefined,
      alternative_mobile_number:
        qData?.result?.alternative_mobile_number || undefined,
      alternative_device_type:
        qData?.result?.core_beneficiaries?.alternative_device_type || undefined,
      alternative_device_ownership:
        qData?.result?.core_beneficiaries?.alternative_device_ownership ||
        undefined,
      email_id: qData?.result?.email_id || undefined,
    });
    if (qData?.result?.alternative_mobile_number === null) {
      const propertiesMain = schema1.properties;
      const constantSchema = propertiesMain[1];
      const {
        alternative_device_type,
        alternative_device_ownership,
        ...properties
      } = constantSchema?.properties || {};
      const required = constantSchema?.required.filter(
        (item) =>
          !["alternative_device_type", "alternative_device_ownership"].includes(
            item,
          ),
      );
      setSchema({ ...constantSchema, properties, required });
    }
  }, []);

  React.useEffect(async () => {
    let device_ownership = formData?.core_beneficiaries?.device_ownership;
    let mark_as_whatsapp_number =
      formData?.core_beneficiaries?.mark_as_whatsapp_number;
    let alternative_device_ownership =
      formData?.core_beneficiaries?.alternative_device_ownership;
    let alternative_device_type =
      formData?.core_beneficiaries?.alternative_device_type;
    let device_type = formData?.core_beneficiaries?.device_type;
    let email_id = formData?.email_id == "null" ? "" : formData?.email_id;

    setFormData({
      ...formData,
      edit_page_type: "edit_contact",
      device_ownership: device_ownership,
      device_type: device_type,
      mark_as_whatsapp_number: mark_as_whatsapp_number,
      alternative_device_ownership: alternative_device_ownership,
      alternative_device_type: alternative_device_type,
      email_id: email_id,
    });
  }, [formData?.id]);

  const uiSchema = {
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
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
      let minYear = moment().subtract("years", 30);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
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

  const transformErrors = (errors, uiSchema) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title,
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
    const newData = { ...formData, ...data };
    const regexPhone = /^([+]\d{2})?\d{10}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let newErrors = {};

    const validatePhoneNumber = (number) => regexPhone.test(number?.toString());

    const updateAlternativeSchema = (isValid) => {
      const propertiesMain = schema1.properties;
      const constantSchema = propertiesMain[1];

      if (!isValid) {
        const {
          alternative_device_type,
          alternative_device_ownership,
          ...properties
        } = constantSchema.properties;
        const required = constantSchema.required.filter((item) =>
          ["alternative_device_type", "alternative_device_ownership"].includes(
            item,
          ),
        );
        setSchema({ ...constantSchema, properties, required });
      } else {
        setSchema(constantSchema);
      }
    };

    switch (id) {
      case "root_mobile": {
        if (!validatePhoneNumber(data?.mobile)) {
          newErrors.mobile = { __errors: [t("PLEASE_ENTER_VALID_NUMBER")] };
          setMobileConditon(false);
        } else {
          setMobileConditon(true);
        }
        break;
      }

      case "root_alternative_mobile_number": {
        if (!data?.alternative_mobile_number) {
          updateAlternativeSchema(false);
        } else {
          const isValidAlternativeNumber = validatePhoneNumber(
            data?.alternative_mobile_number,
          );
          if (!isValidAlternativeNumber) {
            newErrors.alternative_mobile_number = {
              __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
            };
            updateAlternativeSchema(false);
          } else {
            updateAlternativeSchema(true);
            setFormData(newData);
          }
        }
        break;
      }

      case "root_email_id": {
        if (!regexEmail.test(data?.email_id?.toString())) {
          newErrors.email_id = { __errors: [t("PLEASE_ENTER_VALID_EMAIL")] };
        }
        break;
      }

      default: {
        break;
      }
    }

    setErrors(newErrors);
    if (data?.alternative_mobile_number == null) {
      setFormData({
        ...newData,
        alternative_device_ownership: null,
        alternative_device_type: null,
        alternative_mobile_number: null,
      });
    } else {
      setFormData(newData);
    }
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    console.log(
      "hello",
      formData?.mobile != formData?.alternative_mobile_number,
      "&&",
      Object.keys(errors || {}).length < 1,
      errors,
    );
    if (formData?.mobile == formData?.alternative_mobile_number) {
      const newErrors = {
        alternative_mobile_number: {
          __errors: [
            t("ALTERNATIVE_MOBILE_NUMBER_SHOULD_NOT_BE_SAME_AS_MOBILE_NUMBER"),
          ],
        },
      };
      setErrors(newErrors);
    } else if (
      formData?.mobile != formData?.alternative_mobile_number &&
      Object.keys(errors || {}).length < 1
    ) {
      await AgRegistryService.updateAg(formData, userId);
      if (redirectLink) {
        navigate(redirectLink);
      } else {
        navigate(`/beneficiary/${userId}/basicdetails`);
      }
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("CONTACT_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
      analyticsPageTitle={"BENEFICIARY_CONTACT_DETAILS"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("CONTACT_DETAILS")}
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
        {page && page !== "" && (
          <Form
            key={lang}
            ref={formRef}
            widgets={{ RadioBtn, CustomR }}
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
              onChange,
              onError,
              onSubmit,
              transformErrors,
            }}
          >
            <VStack space={4}>
              {redirectLink && (
                <FrontEndTypo.Primarybutton
                  p="4"
                  mt="4"
                  onPress={() => formRef.current.submit()}
                >
                  {t("SAVE_AND_ENROLLMENT")}
                </FrontEndTypo.Primarybutton>
              )}
              <FrontEndTypo.Primarybutton
                mt="3"
                variant={"primary"}
                type="submit"
                onPress={() => formRef.current.submit()}
              >
                {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
              </FrontEndTypo.Primarybutton>
            </VStack>
          </Form>
        )}
      </Box>
    </Layout>
  );
}
