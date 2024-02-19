import React, { Fragment, useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./BeneficiaryRegister.Schema.js";
import { Alert, Box, HStack } from "native-base";
import {
  AgRegistryService,
  Layout,
  filtersByObject,
  BodyMedium,
  sendAndVerifyOtp,
  CustomOTPBox,
  FrontEndTypo,
  getSelectedProgramId,
  getSelectedAcademicYear,
  getOptions,
  enumRegistryService,
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
} from "../../../components/Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";

// App

export default function BeneficiaryRegister({ userTokenInfo, footerLinks }) {
  const { authUser } = userTokenInfo;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const [credentials, setCredentials] = useState();
  const [submitBtn, setSubmitBtn] = useState();
  const [addBtn, setAddBtn] = useState(t("YES"));
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [yearsRange, setYearsRange] = useState([1980, 2030]);
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [verifyOtpData, setverifyOtpData] = useState();
  const [otpbtn, setotpbtn] = useState(false);

  const onPressBackButton = async (e) => {
    setotpbtn(false);
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

  const createBeneficiary = async () => {
    let program = await getSelectedProgramId();
    let acadamic = await getSelectedAcademicYear();
    const formDataNew = {
      ...formData,
      role_fields: {
        ...formData?.role_fields,
        program_id: parseInt(program?.program_id),
        academic_year_id: acadamic?.academic_year_id,
      },
    };
    let url = await AgRegistryService.createBeneficiary(formDataNew);

    if (url?.data) {
      navigate(`/beneficiary/${url?.data?.user?.id}/2`);
    }
  };

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
    if (formData?.mobile?.length === 10) {
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
          createBeneficiary();
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

    const fetchData = async () => {
      const career_aspiration = await enumRegistryService.listOfEnum();
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      let newSchema = properties[newSteps[0]];
      newSchema = getOptions(newSchema, {
        key: "career_aspiration",
        arr: career_aspiration?.data?.CAREER_ASPIRATION,
        title: "title",
        value: "value",
      });

      setSchema(newSchema);
    };

    fetchData();
  }, []);

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
      if (years < 12) {
        errors?.dob?.addError(t("MINIMUM_AGE_12_YEAR_OLD"));
      }
      if (years > 30) {
        errors?.dob?.addError(t("MAXIMUM_AGE_30_YEAR_OLD"));
      }
    }
    ["grampanchayat", "first_name", "middle_name", "last_name"].forEach(
      (key) => {
        if (
          key === "first_name" &&
          data?.first_name?.replace(/ /g, "") === ""
        ) {
          errors?.[key]?.addError(
            `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
          );
        }

        if (key === "last_name" && data?.last_name?.replace(/ /g, "") === "") {
          errors?.[key]?.addError(
            `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
          );
        }

        if (data?.[key] && !data?.[key]?.match(/^[a-zA-Z ]*$/g)) {
          errors?.[key]?.addError(
            `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
          );
        }
      }
    );

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
      if (data?.mobile?.toString()?.length < 10) {
        const newErrors = {
          mobile: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
      }

      if (schema?.properties?.otp) {
        const { otp, ...properties } = schema?.properties;
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

  const onSubmit = async (data) => {
    if (addBtn !== t("YES")) setAddBtn(t("YES"));
    let newFormData = data.formData;
    if (schema?.properties?.first_name) {
      newFormData = {
        ...newFormData,
        ["first_name"]: newFormData?.first_name.replace(/ /g, ""),
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
      let success = false;
      if (id) {
        success = true;
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

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
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
          <Fragment />
        )}

        {page && page !== "" ? (
          <Form
            key={lang + addBtn}
            ref={formRef}
            widgets={{ RadioBtn, CustomR, CustomOTPBox, MobileNumber }}
            templates={{
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              BaseInputTemplate,
              DescriptionFieldTemplate,
              BaseInputTemplate,
            }}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              validator,
              schema: schema ? schema : {},
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
          <Fragment />
        )}
      </Box>
    </Layout>
  );
}
