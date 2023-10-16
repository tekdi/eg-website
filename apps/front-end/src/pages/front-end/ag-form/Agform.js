import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../ag-form/parts/Schema.js";
import { Alert, Box, HStack } from "native-base";
import {
  AgRegistryService,
  Layout,
  BodyMedium,
  sendAndVerifyOtp,
  CustomOTPBox,
  FrontEndTypo,
} from "@shiksha/common-lib";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  RadioBtn,
  CustomR,
  MobileNumber,
} from "../../../component/BaseInput";
import { useTranslation } from "react-i18next";

// App

export default function Agform({ userTokenInfo, footerLinks }) {
  const { authUser } = userTokenInfo;
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  const [verifyOtpData, setverifyOtpData] = useState();
  const [otpbtn, setotpbtn] = React.useState(false);

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
        setPage("upload");
      } else {
        return true;
      }
    }
  };

  const createAg = async () => {
    let url = await AgRegistryService.createAg(formData);

    if (url?.data) {
      navigate(`/beneficiary/${url?.data?.user?.id}/2`);
    }
  };

  const validateMobile = async ({
    formData,
    setErrors,
    t,
    formSubmitCreate,
  }) => {
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
    } else if (
      !(formData?.mobile > 6000000000 && formData?.mobile < 9999999999)
    ) {
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
  };

  const validateOtp = async ({
    formData,
    schema,
    setErrors,
    setSchema,
    setotpbtn,
    setverifyOtpData,
    t,
    formSubmitCreate,
    createAg,
    sendAndVerifyOtp,
  }) => {
    const { status, otpData, newSchema } = await sendAndVerifyOtp(schema, {
      ...formData,
      hash: localStorage.getItem("hash"),
    });

    setverifyOtpData(otpData);
    if (status === true) {
      const data = await formSubmitCreate(formData);

      if (data?.error) {
        const newErrors = {
          mobile: {
            __errors:
              data?.error?.constructor?.name === "String"
                ? [data?.error]
                : data?.error?.constructor?.name === "Array"
                ? data?.error
                : [t("MOBILE_NUMBER_ALREADY_EXISTS")],
          },
        };
        setErrors(newErrors);
      } else {
        createAg();
      }
    } else if (status === false) {
      const newErrors = {
        otp: {
          __errors: [t("USER_ENTER_VALID_OTP")],
        },
      };
      setErrors(newErrors);
    } else {
      setSchema(newSchema);
      setotpbtn(true);
    }
  };

  const otpfunction = async () => {
    await validateMobile({ formData, setErrors, t, formSubmitCreate });
    await validateOtp({
      formData,
      schema,
      setErrors,
      setSchema,
      setotpbtn,
      setverifyOtpData,
      t,
      formSubmitCreate,
      createAg,
      sendAndVerifyOtp,
    });
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
      let maxYear = moment().subtract("years", 12);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }

    setFormData({
      ...formData,
      role_fields: {
        facilitator_id: localStorage.getItem("id"),
      },
    });
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

  const validateMobileNumber = (mobile, t, errors) => {
    if (!mobile) return errors;

    const mobileString = mobile.toString();
    if (mobileString.length !== 10) {
      errors.mobile.addError(t("MINIMUM_LENGTH_IS_10"));
    }
    if (!(mobile > 6000000000 && mobile < 9999999999)) {
      errors.mobile.addError(t("PLEASE_ENTER_VALID_NUMBER"));
    }
    return errors;
  };

  const validateDOB = (dob, t, errors) => {
    if (!dob) return errors;

    const years = moment().diff(dob, "years");
    if (years < 12) {
      errors.dob.addError(t("MINIMUM_AGE_12_YEAR_OLD"));
    }
    if (years > 30) {
      errors.dob.addError(t("MAXIMUM_AGE_30_YEAR_OLD"));
    }
    return errors;
  };

  const validateName = (data, key, t, schema, errors) => {
    if (key === "first_name" || key === "last_name") {
      const name = data[key]?.replace(/ /g, "");
      if (!name) {
        errors[key].addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }
    }
    return errors;
  };

  const validateStringPattern = (data, key, t, schema, errors) => {
    if (data[key] && !data[key].match(/^[a-zA-Z ]*$/g)) {
      errors[key].addError(
        `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
      );
    }
    return errors;
  };

  const customValidate = (data, errors, t, schema) => {
    if (data) {
      errors = validateMobileNumber(data.mobile, t, errors);
      errors = validateDOB(data.dob, t, errors);

      ["grampanchayat", "first_name", "middle_name", "last_name"].forEach(
        (key) => {
          errors = validateName(data, key, t, schema, errors);
          errors = validateStringPattern(data, key, t, schema, errors);
        }
      );
    }

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
    if (id === "root_mobile") {
      if (data?.mobile?.toString()?.length > 10) {
        const newErrors = {
          mobile: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
      }

      if (schema?.properties?.otp) {
        const { otp, ...properties } = schema?.properties || {};
        const required = schema?.required.filter((item) => item !== "otp");
        setSchema({ ...schema, properties, required });
        setFormData((e) => {
          const { otp, ...fData } = e;
          return fData;
        });
        setotpbtn(false);
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
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const sanitizeNameFields = (data, schema) => {
    let newData = { ...data };
    if (schema?.properties?.first_name) {
      newData = {
        ...newData,
        first_name: newData.first_name.replace(/ /g, ""),
      };
    }
    if (schema?.properties?.last_name && newData.last_name) {
      newData = {
        ...newData,
        last_name: newData.last_name.replace(/ /g, ""),
      };
    }
    return newData;
  };

  const shouldSkipSubmission = (authUser, page) => {
    return authUser.id || page <= 1;
  };

  const handleFormSubmission = async (newData, formSubmitCreate, t) => {
    const data = await formSubmitCreate(newData);
    if (data?.error) {
      return {
        mobileError: data?.error
          ? data?.error
          : [t("MOBILE_NUMBER_ALREADY_EXISTS")],
      };
    }
    return {};
  };

  const handleSubmission = async ({
    newData,
    page,
    errors,
    t,
    authUser,
    formSubmitCreate,
    setErrors,
    setStep,
    goErrorPage,
  }) => {
    if (_.isEmpty(errors)) {
      if (shouldSkipSubmission(authUser, page)) {
        setStep();
      } else if (page === "2") {
        const submissionResult = await handleFormSubmission(
          newData,
          formSubmitCreate,
          t
        );
        if (submissionResult.mobileError) {
          setErrors({ mobile: { __errors: submissionResult.mobileError } });
        } else {
          setStep();
        }
      }
    } else {
      const key = Object.keys(errors);
      if (key[0]) {
        goErrorPage(key[0]);
      }
    }
  };

  const onSubmit = async (data) => {
    const sanitizedData = sanitizeNameFields(data.formData, schema);
    const newData = {
      ...formData,
      ...sanitizedData,
      form_step_number: parseInt(page) + 1,
    };

    setFormData(newData);
    await handleSubmission({
      newData,
      page,
      errors,
      t,
      authUser,
      formSubmitCreate,
      setErrors,
      setStep,
      goErrorPage,
    });
  };
  

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        //onlyIconsShow: ["backBtn", "userInfo"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
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
            widgets={{ RadioBtn, CustomR, CustomOTPBox, MobileNumber }}
            templates={{
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              BaseInputTemplate,
              DescriptionFieldTemplate,
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
            {page === "2" ? (
              <FrontEndTypo.Primarybutton
                mt="3"
                variant={"primary"}
                type="submit"
                onPress={otpfunction}
              >
                {otpbtn ? t("VERIFY_OTP") : t("SEND_OTP")}
              </FrontEndTypo.Primarybutton>
            ) : (
              <FrontEndTypo.Primarybutton
                mt="0"
                variant={"primary"}
                type="submit"
                onPress={() => formRef?.current?.submit()}
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
