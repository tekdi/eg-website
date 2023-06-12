import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../ag-form/parts/Schema.js";
import {
  Alert,
  Box,
  Button,
  Center,
  HStack,
  Image,
  Modal,
  Radio,
  Stack,
  VStack,
  Text,
} from "native-base";
import CustomRadio from "../../../component/CustomRadio";
import Steper from "../../../component/Steper";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  uploadRegistryService,
  AgRegistryService,
  Camera,
  Layout,
  H1,
  t,
  login,
  H3,
  IconByName,
  BodySmall,
  filtersByObject,
  H2,
  getBase64,
  BodyMedium,
  changeLanguage,
  sendAndVerifyOtp,
  CustomOTPBox,
  FrontEndTypo,
} from "@shiksha/common-lib";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import Clipboard from "component/Clipboard.js";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  RadioBtn,
  CustomR,
} from "../../../component/BaseInput";
import { useScreenshot } from "use-screenshot-hook";
import Success from "../Success.js";

// App

export default function Agform({ userTokenInfo }) {
  const { authUser } = userTokenInfo;
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
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
  const [keycloakId, setkeycloakId] = React.useState();
  const [username, setusername] = React.useState();
  const [verifyOtpData, setverifyOtpData] = useState();
  const [otpbtn, setotpbtn] = React.useState(false);

  const navigate = useNavigate();

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    navigate('/')
  };
  const ref = React.createRef(null);

  const updateData = (data, deleteData = false) => { };

  const uiSchema = {
    facilitator_id: {
      "ui:widget": "hidden",
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
        await formSubmitUpdate({ ...formData, form_step_number: "13" });
        setPage("upload");
      } else {
        return true;
      }
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const showPosition = (position) => {
    console.log(
      "Latitude: " +
      position.coords.latitude +
      "/n Longitude: " +
      position.coords.longitude
    );
  };

  const createAg = async () => {
    let url = await AgRegistryService.createAg(formData);

    if (url?.data) {
      navigate("/beneficiary/2", { state: { id: url?.data?.user?.id } });
    }
  };

  const otpfunction = async () => {
    if (formData?.mobile.length < 10) {
      errors?.mobile?.addError(t("MINIMUM_LENGTH_IS_10"));
    }

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

  const getOptions = (schema, { key, arr, title, value, filters } = {}) => {
    let enumObj = {};
    let arrData = arr;
    if (!_.isEmpty(filters)) {
      arrData = filtersByObject(arr, filters);
    }
    enumObj = {
      ...enumObj,
      ["enumNames"]: arrData.map((e) => `${e?.[title]}`),
    };
    enumObj = { ...enumObj, ["enum"]: arrData.map((e) => `${e?.[value]}`) };
    const newProperties = schema["properties"][key];
    let properties = {};
    if (newProperties) {
      if (newProperties.enum) delete newProperties.enum;
      let { enumNames, ...remainData } = newProperties;
      properties = remainData;
    }
    return {
      ...schema,
      ["properties"]: {
        ...schema["properties"],
        [key]: {
          ...properties,
          ...(_.isEmpty(arr) ? {} : enumObj),
        },
      },
    };
  };

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
  }, []);

  // const userExist = async (filters) => {
  //   return await facilitatorRegistryService.isExist(filters);
  // };

  const formSubmitUpdate = async (formData) => {
    const { id } = authUser;

    if (id) {
      updateData({}, true);
    }
  };

  const formSubmitCreate = async (formData) => { };

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
      if (!(data?.mobile > 6666666666 && data?.mobile < 9999999999)) {
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
    ["grampanchayat", "first_name", "last_name"].forEach((key) => {
      if (
        key === "first_name" &&
        data?.first_name?.replaceAll(" ", "") === ""
      ) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (key === "last_name" && data?.last_name?.replaceAll(" ", "") === "") {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (data?.[key] && !data?.[key]?.match(/^[a-zA-Z ]*$/g)) {
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
      }
      return error;
    });
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    updateData(newData);
    if (id === "root_mobile") {
      if (data?.mobile?.toString()?.length > 10) {
        const newErrors = {
          mobile: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
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
        //onlyIconsShow: ["backBtn", "userInfo"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
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
            widgets={{ RadioBtn, CustomR, CustomOTPBox }}
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
                mt="-10"
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
