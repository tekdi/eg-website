import React, { useState } from "react";
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
  sendAndVerifyOtp,
  FrontEndTypo,
  CustomOTPBox,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

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
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const userId = id;
  const [verifyOtpData, setverifyOtpData] = useState();
  const [otpButton, setOtpButton] = React.useState(false);
  const [mobileConditon, setMobileConditon] = React.useState(false);
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
            item
          )
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
  const otpfunction = async () => {
    if (formData?.mobile?.length < 10) {
      const data = await formSubmitCreate(formData);

      const newErrors = {
        mobile: {
          __errors:
            data?.error?.constructor?.name === "String"
              ? [data?.error]
              : data?.error?.constructor?.name === "Array"
              ? data?.error
              : [t("MINIMUM_LENGTH_IS_10")],
        },
      };
      setErrors(newErrors);
    }

    if (!(formData?.mobile > 6000000000 && formData?.mobile < 9999999999)) {
      const data = await formSubmitCreate(formData);
      const newErrors = {
        mobile: {
          __errors:
            data?.error?.constructor?.name === "String"
              ? [data?.error]
              : data?.error?.constructor?.name === "Array"
              ? data?.error
              : [t("PLEASE_ENTER_VALID_NUMBER")],
        },
      };
      setErrors(newErrors);
    }

    const { status, otpData, newSchema } = await sendAndVerifyOtp(schema, {
      ...formData,
      hash: localStorage.getItem("hash"),
    });
    setverifyOtpData(otpData);
    if (status === true) {
      submit();
    } else if (status === false) {
      const newErrors = {
        otp: {
          __errors: [t("USER_ENTER_VALID_OTP")],
        },
      };
      setErrors(newErrors);
    } else {
      setSchema(newSchema);
      setOtpButton(true);
    }
  };

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
    const regex = /^([+]\d{2})?\d{10}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (id === "root_mobile") {
      if (data?.mobile && !data?.mobile?.toString()?.match(regex)) {
        const newErrors = {
          mobile: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
        setMobileConditon(false);
      } else {
        setMobileConditon(true);
      }
      if (schema?.properties?.otp) {
        const { otp, ...properties } = schema?.properties || {};
        const required = schema?.required.filter((item) => item !== "otp");
        setSchema({ ...schema, properties, required });
        setFormData((e) => {
          const { otp, ...fData } = e;
          return fData;
        });
        setOtpButton(false);
      }
    }
    if (id === "root_alternative_mobile_number") {
      if (
        data?.alternative_mobile_number &&
        !data?.alternative_mobile_number?.toString()?.match(regex)
      ) {
        const newErrors = {
          alternative_mobile_number: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
      }

      if (!data?.alternative_mobile_number?.toString()?.match(regex)) {
        const propertiesMain = schema1.properties;
        const constantSchema = propertiesMain[1];
        const {
          alternative_device_type,
          alternative_device_ownership,
          ...properties
        } = constantSchema?.properties || {};
        const required = constantSchema?.required.filter((item) =>
          ["alternative_device_type", "alternative_device_ownership"].includes(
            item
          )
        );

        setSchema({ ...constantSchema, properties, required });
      }

      if (
        data?.alternative_mobile_number &&
        data?.alternative_mobile_number?.toString()?.match(regex)
      ) {
        const propertiesMain = schema1.properties;
        const constantSchema = propertiesMain[1];
        setSchema(constantSchema);
      }
    }

    if (id === "root_email_id") {
      if (data?.email_id && !data?.email_id?.toString()?.match(regexEmail)) {
        const newErrors = {
          email_id: {
            __errors: [t("PLEASE_ENTER_VALID_EMAIL")],
          },
        };
        setErrors(newErrors);
      }
    }

    setFormData(newData);

    if (data?.alternative_mobile_number == null) {
      setFormData({
        ...newData,
        alternative_device_ownership: null,
        alternative_device_type: null,
        alternative_mobile_number: null,
      });
    }
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const submit = async (data) => {
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
      !errors
    ) {
      await AgRegistryService.updateAg(formData, userId);
      navigate(`/beneficiary/${userId}/basicdetails`);
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
            widgets={{ RadioBtn, CustomR, CustomOTPBox }}
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
              transformErrors,
            }}
          >
            {mobileConditon ? (
              <FrontEndTypo.Primarybutton
                mt="3"
                variant={"primary"}
                type="submit"
                onPress={otpfunction}
              >
                {otpButton ? t("VERIFY_OTP") : t("SEND_OTP")}
              </FrontEndTypo.Primarybutton>
            ) : (
              <FrontEndTypo.Primarybutton
                mt="3"
                variant={"primary"}
                type="submit"
                onPress={() => submit()}
              >
                {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
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
