import { VStack, HStack, Box, Modal, Alert, Text } from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FrontEndTypo,
  getOnboardingURLData,
  IconByName,
  facilitatorRegistryService,
  setOnboardingMobile,
  authRegistryService,
  removeOnboardingURLData,
  removeOnboardingMobile,
  login,
  CustomAlert,
  Loading,
  getOptions,
  enumRegistryService,
  validation,
  BodyMedium,
} from "@shiksha/common-lib";
import { useScreenshot } from "use-screenshot-hook";
import Clipboard from "../Clipboard/Clipboard.js";
//rjsf forms
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  address_details,
  basicRegister,
  contact_details,
  verifyOTP,
  qualification_details,
} from "./PrerakRegister.Forms.Schema.js";
import {
  widgets,
  templates,
  transformErrors,
} from "../../Static/FormBaseInput/FormBaseInput.js";
import { getLanguage } from "v2/utils/Helper/JSHelper.js";
import PageLayout from "v2/components/Static/PageLayout/PageLayout.js";
import Loader from "v2/components/Static/Loader/Loader.js";
import SetConsentLang from "v2/components/Static/Consent/SetConsentLang.js";
import moment from "moment";
import PropTypes from "prop-types";
import { setDistrict, setBlock, setVillage } from "utils/localHelper.js";

export default function PrerakRegisterDetail({
  t,
  currentForm,
  setCurrentForm,
  registerFormData,
  setRegisterFormData,
  ip,
  showIntroductionOfProject,
}) {
  const navigate = useNavigate();
  //screen variable
  const [isLoading, setIsLoading] = useState(false);
  //register user variables
  const { image, takeScreenshot } = useScreenshot();
  const [credentials, setCredentials] = useState();
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (credentials) {
      setTimeout(() => {
        takeScreenshot("jpg", { backgroundColor: "white" });
        setImageLoading(false);
      }, 1000);
    }
  }, [credentials]);

  const downloadImage = () => {
    const FileSaver = require("file-saver");
    FileSaver.saveAs(`${image}`, "image.jpg");
  };

  //fetch URL data and store fix for 2 times render useEffect call
  const [countLoad, setCountLoad] = useState(0);
  const [cohortData, setCohortData] = useState(null);
  const [programData, setProgramData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (countLoad == 0) {
        setCountLoad(1);
      }
      if (countLoad == 1) {
        //do page load first operation
        let onboardingURLData = await getOnboardingURLData();
        setCohortData(onboardingURLData?.cohortData);
        setProgramData(onboardingURLData?.programData);
        //end do page load first operation
        setCountLoad(2);
      } else if (countLoad == 2) {
        setCountLoad(3);
      }
    }
    fetchData();
  }, [countLoad]);

  //already registred modals
  const [isUserExistModal, setIsUserExistModal] = useState(false);
  const [isUserExistResponse, setIsUserExistResponse] = useState(null);
  const [isLoginShow, setIsLoginShow] = useState(false);
  const [isUserExistModalText, setIsUserExistModalText] = useState("");
  const [isUserExistStatus, setIsUserExistStatus] = useState("");
  const [yearsRange, setYearsRange] = useState([1980, 2030]);

  // Consent modals
  const [isConsentModal, setIsConsentModal] = useState();
  const [consentCompleted, setConsentCompleted] = useState(true);
  const [yesChecked, setYesChecked] = useState(false);
  const [noChecked, setNoChecked] = useState(false);

  //form variable
  const [lang] = useState(getLanguage());
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});
  const [alert, setAlert] = useState();
  const [allQualifications, setAllQualifications] = useState([]);

  // Toggle consent state based on user agreement

  useEffect(() => {
    const getAllQualifications = async () => {
      try {
        setLoading(true);
        const qualificationsList =
          await enumRegistryService.getQualificationAll();
        setAllQualifications(qualificationsList);
      } catch (error) {
        console.error("Error fetching qualifications:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllQualifications();
  }, []);

  const findIdByName = (data, targetName) => {
    const element = data.find((item) => item.name === targetName);
    return element ? `${element.id}` : null;
  };

  useEffect(() => {
    if (currentForm == 0) {
      setSchema(basicRegister);
      setFormData(registerFormData);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
    } else if (currentForm === 1) {
      let newSchema = contact_details;
      try {
        if (contact_details?.properties?.marital_status) {
          let fetchData = async () => {
            const ListOfEnum = await enumRegistryService.listOfEnum();
            newSchema = getOptions(newSchema, {
              key: "device_type",
              arr: ListOfEnum?.data?.MOBILE_TYPE,
              title: "title",
              value: "value",
            });
            newSchema = getOptions(newSchema, {
              key: "social_category",
              arr: ListOfEnum?.data?.FACILITATOR_SOCIAL_STATUS,
              title: "title",
              value: "value",
            });
            newSchema = getOptions(newSchema, {
              key: "marital_status",
              arr: ListOfEnum?.data?.MARITAL_STATUS,
              title: "title",
              value: "value",
            });
            setLoading(false);
            setSchema(newSchema);
            setFormData(registerFormData);
          };
          fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    } else if (currentForm == 2) {
      const fetchData = async () => {
        let newSchema = await updateSchemaBasedOnDiploma(false);
        setLoading(false);
        setSchema(newSchema);
        setFormData(registerFormData);
      };
      fetchData();
    } else if (currentForm == 3) {
      const fetchData = async () => {
        let newSchema = address_details;
        try {
          if (address_details?.properties?.district) {
            let programSelected = null;
            try {
              programSelected = programData;
            } catch (error) {}
            //add user specific state
            if (programSelected != null) {
              newSchema = await setDistrict({
                schemaData: address_details,
                state: programSelected?.state_name,
                district: registerFormData?.district,
                block: registerFormData?.block,
                setSchema,
              });
            }
          }
          setLoading(false);
          setSchema(newSchema);
          setFormData(registerFormData);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    } else {
      const verifySchema = {
        ...verifyOTP,
        required: ["verify_mobile", "otp"],
        properties: {
          ...verifyOTP["properties"],
          otp: {
            description: "USER_ENTER_FOUR_DIGIT_OTP",
            type: "number",
            title: "OTP",
            format: "CustomOTPBox",
            onClickResendOtp: sendOtpData,
            mobile: registerFormData?.mobile,
          },
        },
      };
      setSchema(verifySchema);
      setFormData({
        ...registerFormData,
        verify_mobile: registerFormData?.mobile,
      });
    }
  }, [currentForm]);

  const uiSchema = {
    labelName: {
      "ui:widget": "LabelNameWidget",
    },
    labelMobile: {
      "ui:widget": "LabelMobileWidget",
    },
    labelVerifyName: {
      "ui:widget": "LabelVerifyNameWidget",
    },
    verify_mobile: {
      "ui:readOnly": true,
    },
    labelAddress: {
      "ui:widget": "LabelAddressWidget",
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
    qualification_ids: {
      "ui:widget": "MultiCheck",
    },
    has_diploma: {
      "ui:widget": "RadioBtn",
    },
  };
  const validate = (data, key) => {
    let error = {};
    if (key === "mobile") {
      if (
        data?.mobile?.toString()?.length !== 10 &&
        data?.mobile !== undefined
      ) {
        error = { mobile: t("MINIMUM_LENGTH_IS_10") };
      }
      if (
        !(data?.mobile > 6000000000 && data?.mobile < 9999999999) &&
        data?.mobile !== undefined
      ) {
        error = { mobile: t("PLEASE_ENTER_VALID_NUMBER") };
      }
    }
    return error;
  };
  const customValidate = (data, err) => {
    const arr = Object.keys(err);
    arr.forEach((key) => {
      const isValid = validate(data, key);
      if (isValid?.[key]) {
        if (!errors?.[key]?.__errors.includes(isValid[key]))
          err?.[key]?.addError(isValid[key]);
      }
    });
    if (data?.dob) {
      validation({
        data: data?.dob,
        key: "dob",
        errors: err,
        message: `${t("MINIMUM_AGE_18_YEAR_OLD")}`,
        type: "age-18",
      });
    }
    return err;
  };

  const handleCheckboxChange = (isAgree) => {
    setYesChecked(isAgree);
    setNoChecked(!isAgree);
    if (isAgree) {
      setConsentCompleted(false);
      //sent otp to mobile number
      const fetchData = async () => {
        // await sendAndVerifyOtp(schema, {
        //   mobile: isConsentModal?.mobile,
        // });
        setIsConsentModal();
        setCurrentForm(1);
        setYesChecked(!isAgree);
      };
      fetchData();
    } else {
      setConsentCompleted(true);
      showIntroductionOfProject();
    }
  };

  const onSubmit = async (data) => {
    if (
      Object.keys(errors || {}).length > 0 &&
      Object.keys(errors || {}).filter((e) =>
        Object.keys(schema.properties).includes(e),
      ).length > 0
    ) {
      return false;
    }
    let newFormData = data.formData;
    if (currentForm == 0) {
      setIsLoading(true);
      let isExist = await checkMobileExist(newFormData?.mobile);
      if (!isExist) {
        setIsConsentModal(newFormData);
      }

      setIsLoading(false);
    } else if (currentForm == 1) {
      setCurrentForm(2);
    } else if (currentForm == 2) {
      setCurrentForm(3);
    } else if (currentForm == 3) {
      const fetchData = async () => {
        await sendAndVerifyOtp(schema, {
          mobile: isConsentModal?.mobile,
        });
        setCurrentForm(4);
      };
      fetchData();
    } else if (currentForm == 4) {
      setIsLoading(true);
      let isExist = await checkMobileExist(newFormData?.verify_mobile);
      if (!isExist) {
        //verify otp
        let verify_otp = await sendAndVerifyOtp(schema, {
          mobile: newFormData?.verify_mobile,
          otp: newFormData?.otp,
          hash: localStorage.getItem("hash"),
        });
        if (verify_otp?.status === true) {
          //register user
          const createData = await formSubmitCreate();
          if (createData?.success === false) {
            const newErrors = {
              verify_mobile: {
                __errors:
                  data?.error?.constructor?.name === "String"
                    ? [data?.error]
                    : data?.error?.constructor?.name === "Array"
                      ? data?.error
                      : [t("MOBILE_NUMBER_ALREADY_EXISTS")],
              },
            };
            setErrors(newErrors);
          } else if (createData?.validate_result?.status === false) {
            const newErrors = {
              verify_mobile: {
                __errors: [createData?.validate_result?.message],
              },
            };
            setErrors(newErrors);
          } else {
            let createDataNew = createData?.data;
            if (createDataNew?.username && createDataNew?.password) {
              await removeOnboardingURLData();
              await removeOnboardingMobile();
              setCredentials(createDataNew);
            }
          }
        } else {
          const newErrors = {
            otp: {
              __errors: [t("USER_ENTER_VALID_OTP")],
            },
          };
          setErrors(newErrors);
        }
      }
      setIsLoading(false);
    }
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (currentForm < 4) {
      setRegisterFormData(newData);
    }
    if (id === "root_mobile") {
      let { mobile, otp, ...otherError } = errors || {};
      setErrors(otherError);
    }
    if (id === "root_verify_mobile") {
      let { verify_mobile, otp, ...otherError } = errors || {};
      setErrors(otherError);
    }

    if (id === "root_state") {
      await setDistrict({
        schemaData: schema,
        state: data?.state,
        district: data?.district,
        block: data?.block,
        setSchema,
      });
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
        state: programData?.state_name,
        setSchema,
      });
    }

    if (id === "root_block") {
      await setVillage({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
        state: programData?.state_name,
        setSchema,
      });
    }

    if (id === "root_pincode") {
      const regex = /^[0-9]{6}$/;
      if (data?.pincode && !regex.test(data.pincode)) {
        const newErrors = {
          pincode: {
            __errors: [t("PINCODE_ERROR")],
          },
        };
        setErrors(newErrors);
      } else {
        setErrors();
      }
    }
    if (id === "root_qualification_master_id") {
      const twelthId = findIdByName(allQualifications, "12th grade");
      if (data?.qualification_master_id === twelthId) {
        setAlert(t("YOU_NOT_ELIGIBLE"));
      } else {
        setAlert();
      }
    }
    if (id === "root_qualification_ids") {
      const noneId = findIdByName(
        allQualifications,
        "TEACHING_QUALIFICATION_NONE",
      );
      if (
        formData?.qualification_ids.includes(noneId) &&
        data?.qualification_ids?.length <= 1
      ) {
        setFormData({ ...formData, qualification_ids: [noneId] });
      } else if (
        data?.qualification_ids.includes(noneId) &&
        !formData?.qualification_ids.includes(noneId)
      ) {
        setFormData({ ...formData, qualification_ids: [noneId] });
      } else {
        setFormData({
          ...formData,
          qualification_ids: data?.qualification_ids?.filter(
            (e) => e !== noneId,
          ),
        });
      }
    }
    if (id === "root_has_diploma") {
      let newSchema = await updateSchemaBasedOnDiploma(
        data?.has_diploma === "yes",
      );
      setSchema(newSchema);
    }
  };
  const checkMobileExist = async (mobile) => {
    let isExist = false;
    const result = await facilitatorRegistryService.isUserExist({ mobile });
    if (result?.data) {
      let response_isUserExist = result?.data;
      if (
        (response_isUserExist?.program_faciltators &&
          response_isUserExist?.program_faciltators.length > 0) ||
        (response_isUserExist?.program_users &&
          response_isUserExist?.program_users.length > 0)
        //check learners duplicate entry for mobile number of prerak
        /*||
        (response_isUserExist?.program_beneficiaries &&
          response_isUserExist?.program_beneficiaries.length > 0)*/
      ) {
        const newErrors = {
          mobile: {
            __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
          },
        };
        setErrors(newErrors);
        setIsUserExistModal(true);
        isExist = true;
        setIsUserExistResponse(response_isUserExist);
        if (response_isUserExist?.program_faciltators?.length > 0) {
          for (
            let i = 0;
            i < response_isUserExist?.program_faciltators?.length;
            i++
          ) {
            let facilator_data = response_isUserExist?.program_faciltators[i];
            if (facilator_data?.program_id == programData?.program_id) {
              if (
                facilator_data?.academic_year_id == cohortData?.academic_year_id
              ) {
                setIsUserExistStatus("EXIST_LOGIN");
                setIsUserExistModalText(
                  t("EXIST_LOGIN")
                    .replace("{{state}}", programData?.program_name)
                    .replace("{{year}}", cohortData?.academic_year_name),
                );
                setIsLoginShow(true);
                break;
              } else if (
                facilator_data?.academic_year_id != cohortData?.academic_year_id
              ) {
                const academic_year =
                  await facilitatorRegistryService.getCohort({
                    cohortId: facilator_data?.academic_year_id,
                  });
                const program_data =
                  await facilitatorRegistryService.getProgram({
                    programId: facilator_data?.program_id,
                  });
                setIsUserExistStatus("REGISTER_EXIST");
                setIsUserExistModalText(
                  t("REGISTER_EXIST")
                    .replace("{{state}}", programData?.program_name)
                    .replace("{{year}}", cohortData?.academic_year_name)
                    .replace("{{old_state}}", program_data[0]?.program_name)
                    .replace("{{old_year}}", academic_year?.academic_year_name),
                );
                setOnboardingMobile(mobile);
                setIsLoginShow(true);
              }
            } else {
              const academic_year = await facilitatorRegistryService.getCohort({
                cohortId: facilator_data?.academic_year_id,
              });
              const program_data = await facilitatorRegistryService.getProgram({
                programId: facilator_data?.program_id,
              });
              setIsUserExistStatus("DONT_ALLOW");
              setIsUserExistModalText(
                t("DONT_ALLOW")
                  .replace("{{state}}", programData?.program_name)
                  .replace("{{year}}", cohortData?.academic_year_name)
                  .replace("{{old_state}}", program_data[0]?.program_name)
                  .replace("{{old_year}}", academic_year?.academic_year_name),
              );
              setIsLoginShow(false);
              break;
            }
          }
        }

        if (response_isUserExist?.program_users?.length > 0) {
          for (
            let i = 0;
            i < response_isUserExist?.program_users.length.length;
            i++
          ) {
            let program_users = response_isUserExist?.program_users.length[i];
            if (program_users?.program_id == programData?.program_id) {
              if (
                program_users?.academic_year_id == cohortData?.academic_year_id
              ) {
                setIsUserExistStatus("EXIST_LOGIN");
                setIsUserExistModalText(
                  t("EXIST_LOGIN")
                    .replace("{{state}}", programData?.program_name)
                    .replace("{{year}}", cohortData?.academic_year_name),
                );
                setIsLoginShow(true);
                break;
              } else if (
                program_users?.academic_year_id != cohortData?.academic_year_id
              ) {
                const academic_year =
                  await facilitatorRegistryService.getCohort({
                    cohortId: program_users?.academic_year_id,
                  });
                const program_data =
                  await facilitatorRegistryService.getProgram({
                    programId: program_users?.program_id,
                  });
                setIsUserExistStatus("REGISTER_EXIST");
                setIsUserExistModalText(
                  t("REGISTER_EXIST")
                    .replace("{{state}}", programData?.program_name)
                    .replace("{{year}}", cohortData?.academic_year_name)
                    .replace("{{old_state}}", program_data[0]?.program_name)
                    .replace("{{old_year}}", academic_year?.academic_year_name),
                );
                setOnboardingMobile(mobile);
                setIsLoginShow(true);
              }
            } else {
              const academic_year = await facilitatorRegistryService.getCohort({
                cohortId: program_users?.academic_year_id,
              });
              const program_data = await facilitatorRegistryService.getProgram({
                programId: program_users?.program_id,
              });
              setIsUserExistStatus("DONT_ALLOW");
              setIsUserExistModalText(
                t("DONT_ALLOW")
                  .replace("{{state}}", programData?.program_name)
                  .replace("{{year}}", cohortData?.academic_year_name)
                  .replace("{{old_state}}", program_data[0]?.program_name)
                  .replace("{{old_year}}", academic_year?.academic_year_name),
              );
              setIsLoginShow(false);
              break;
            }
          }
        }

        //check learners duplicate entry for mobile number of prerak
        /*else if (response_isUserExist?.program_beneficiaries.length > 0) {
          setIsUserExistStatus("DONT_ALLOW_MOBILE");
          setIsUserExistModalText(t("DONT_ALLOW_MOBILE"));
          setIsLoginShow(false);
        }*/
        return isExist;
      } else {
        setIsUserExistModal(false);
        isExist = false;
        setIsUserExistResponse(null);
      }
    }
    return isExist;
  };

  const updateSchemaBasedOnDiploma = async (hasDiploma) => {
    let newSchema = {};
    if (!hasDiploma) {
      const constantSchema = qualification_details;
      const { diploma_details, ...properties } =
        constantSchema?.properties || {};
      const required = constantSchema?.required.filter((item) =>
        [
          "has_diploma",
          "qualification_ids",
          "qualification_master_id",
          // "qualification_reference_document_id",
        ].includes(item),
      );
      newSchema = { ...constantSchema, properties, required };
    } else if (hasDiploma) {
      newSchema = qualification_details;
    }
    try {
      const ListOfEnum = await enumRegistryService.listOfEnum();
      newSchema = getOptions(newSchema, {
        key: "qualification_master_id",
        arr: allQualifications,
        title: "name",
        value: "id",
        filters: { type: "qualification" },
      });
      newSchema = getOptions(newSchema, {
        key: "qualification_ids",
        arr: allQualifications,
        title: "name",
        value: "id",
        filters: { type: "teaching" },
      });

      newSchema = getOptions(newSchema, {
        key: "has_diploma",
        arr: ListOfEnum?.data?.TEACHING_DEGREE,
        title: "title",
        value: "value",
      });
    } catch (error) {
      console.log(error);
    }
    return newSchema;
  };

  const userExistClick = () => {
    if (
      isUserExistStatus == "EXIST_LOGIN" ||
      isUserExistStatus == "REGISTER_EXIST"
    ) {
      navigate("/");
    } else {
      setIsUserExistModal(false);
    }
  };
  const sendAndVerifyOtp = async (schema, { mobile, otp, hash }) => {
    if (otp) {
      const bodyData = {
        mobile: mobile?.toString(),
        reason: "verify_mobile",
        otp: otp?.toString(),
        hash: hash,
      };
      const verifyotp = await authRegistryService.verifyOtp(bodyData);
      if (verifyotp.success) {
        return { status: true };
      } else {
        return { status: false };
      }
    } else {
      let otpData = {};

      if (!schema?.properties?.otp) {
        otpData = await sendOtpData();
      }

      return { otpData };
    }
  };
  const sendOtpData = async () => {
    let otpData = {};
    const sendotpBody = {
      mobile: registerFormData?.mobile?.toString(),
      reason: "verify_mobile",
    };
    let reset = true;
    otpData = await authRegistryService.sendOtp(sendotpBody);
    const result = otpData?.data;
    localStorage.setItem("hash", otpData?.data?.hash);
    // console.log(otpData)
    return otpData;
  };

  const formSubmitCreate = async () => {
    let first_name = registerFormData?.first_name
      ? typeof registerFormData.first_name === "string"
        ? registerFormData.first_name.replaceAll(" ", "")
        : ""
      : "";

    let middle_name = registerFormData?.middle_name
      ? typeof registerFormData.middle_name === "string"
        ? registerFormData.middle_name.replaceAll(" ", "")
        : ""
      : "";

    let last_name = registerFormData?.last_name
      ? typeof registerFormData.last_name === "string"
        ? registerFormData.last_name.replaceAll(" ", "")
        : ""
      : "";

    let lang = localStorage.getItem("lang");
    let state = programData?.state_name;
    let district = registerFormData?.district;
    let block = registerFormData?.block;
    let village = registerFormData?.village;
    let grampanchayat = registerFormData?.grampanchayat || "";
    let pincode = registerFormData?.pincode || "";
    let dob = registerFormData?.dob;
    let gender = registerFormData?.gender;
    let device_type = registerFormData?.device_type;
    let device_ownership = registerFormData?.device_ownership;
    let marital_status = registerFormData?.marital_status;
    let social_category = registerFormData?.social_category;
    const {
      qualification_master_id,
      qualification_ids,
      has_diploma,
      // qualification_reference_document_id,
      diploma_details,
    } = registerFormData;

    const result = await facilitatorRegistryService.registerV2(
      {
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        mobile: registerFormData?.mobile?.toString(),
        lang: lang,
        state: state,
        district: district,
        block: block,
        village: village,
        grampanchayat: grampanchayat,
        pincode: pincode,
        dob: dob,
        gender: gender,
        device_type: device_type,
        device_ownership: device_ownership,
        marital_status: marital_status,
        social_category: social_category,
        qualification_master_id,
        qualification_reference_document_id: null,
        qualification_ids,
        has_diploma: has_diploma === "yes",
        ...(has_diploma === "yes" ? { diploma_details } : {}),
      },
      ip?.id?.toString(),
      programData?.program_id,
      cohortData?.academic_year_id,
    );
    return result;
  };

  return (
    <>
      {isLoading ? (
        <PageLayout
          t={t}
          isPageMiddle={true}
          customComponent={<Loader />}
          analyticsPageTitle={"FACILITATOR_ONBOADING"}
          pageTitle={t("FACILITATOR")}
          stepTitle={t("ONBOARDING")}
        />
      ) : (
        <VStack flex={3} space={5}>
          <Box py={6} px={4} mb={5}>
            <Text
              color={"textGreyColor.900"}
              fontSize={"20px"}
              lineHeight={"24px"}
              fontWeight={"600"}
              mb={4}
            >
              {t("HELLO")}
            </Text>
            <FrontEndTypo.H3
              fontWeight={"600"}
              style={{ fontWeight: "600" }}
              color="textGreyColor.750"
            >
              {t("SIGN_UP_IN_TWO_STEPS")}
            </FrontEndTypo.H3>
            {/* <Alert
              status="info"
              shadow="AlertShadow"
              alignItems={"start"}
              mb="3"
              colorScheme={"infoAlert"}
              mt="4"
            >
              <HStack alignItems="center" space="2" color>
                <IconByName name="InformationLineIcon" />
                <FrontEndTypo.H3>
                  {programData?.program_name
                    ? t("REGISTER_MESSAGE")
                        .replace("{{state}}", programData?.program_name)
                        .replace("{{year}}", cohortData?.academic_year_name)
                    : ""}
                </FrontEndTypo.H3>
              </HStack>
            </Alert> */}
            <CustomAlert
              status={""}
              title={
                programData?.program_name
                  ? t("REGISTER_MESSAGE")
                      .replace("{{state}}", programData?.program_name)
                      .replace("{{year}}", cohortData?.academic_year_name)
                  : ""
              }
            />

            {alert && (
              <Alert status="warning" alignItems={"start"} mb="3">
                <HStack alignItems="center" space="2" color>
                  <Alert.Icon />
                  <BodyMedium>{alert}</BodyMedium>
                </HStack>
              </Alert>
            )}

            <Form
              key={lang}
              ref={formRef}
              extraErrors={errors}
              showErrorList={false}
              noHtml5Validate={true}
              {...{
                widgets,
                templates,
                validator,
                schema: schema,
                uiSchema,
                formData,
                customValidate,
                onChange,
                // onError,
                onSubmit,
                transformErrors: (errors) => transformErrors(errors, schema, t),
              }}
            >
              {currentForm === 4 ? (
                <FrontEndTypo.Primarybutton
                  width="60%"
                  mx="auto"
                  mt="3"
                  variant={"primary"}
                  type="submit"
                  onPress={(e) => {
                    formRef?.current?.submit();
                  }}
                >
                  {t("VERIFY_OTP")}
                </FrontEndTypo.Primarybutton>
              ) : (
                <VStack>
                  <FrontEndTypo.Primarybutton
                    width="90%"
                    mx="auto"
                    isLoading={loading}
                    type="submit"
                    p="4"
                    mt="10"
                    onPress={(e) => {
                      formRef?.current?.submit();
                    }}
                  >
                    {currentForm == 0
                      ? t("CONSENT_TO_SHARE_INFORMATION")
                      : currentForm < 3
                        ? t("NEXT")
                        : t("SEND_OTP")}
                  </FrontEndTypo.Primarybutton>
                </VStack>
              )}
            </Form>
          </Box>
          <HStack>
            <Modal
              isOpen={isUserExistModal}
              safeAreaTop={true}
              size="xl"
              _backdrop={{ opacity: "0.7" }}
            >
              <Modal.Content>
                <Modal.Body p="5" pb="10">
                  <VStack space="5">
                    <FrontEndTypo.H1 textAlign="center">
                      <Alert.Icon />
                    </FrontEndTypo.H1>
                    <FrontEndTypo.H2 textAlign="center">
                      {isUserExistModalText}
                    </FrontEndTypo.H2>
                    <HStack space="5" pt="5">
                      <FrontEndTypo.Primarybutton
                        flex={1}
                        onPress={async (e) => {
                          userExistClick();
                        }}
                      >
                        {isLoginShow ? t("LOGIN") : t("OK")}
                      </FrontEndTypo.Primarybutton>
                    </HStack>
                  </VStack>
                </Modal.Body>
              </Modal.Content>
            </Modal>
            <Modal
              isOpen={credentials}
              safeAreaTop={true}
              size="xl"
              _backdrop={{ opacity: "0.7" }}
            >
              <Modal.Content>
                <Modal.Header p="5" borderBottomWidth="0">
                  <FrontEndTypo.H1 textAlign="center">
                    {t("STORE_YOUR_CREDENTIALS")}
                  </FrontEndTypo.H1>
                </Modal.Header>
                <Modal.Body pt="0" p="5" pb="10">
                  {imageLoading && <Loading height="100%" width="100%" />}
                  {!imageLoading && (
                    <VStack space="5">
                      <VStack
                        space="2"
                        bg="gray.100"
                        p="1"
                        rounded="lg"
                        borderWidth={1}
                        borderColor="gray.300"
                        w="100%"
                      >
                        <HStack alignItems="center" space="1" flex="1">
                          <FrontEndTypo.H3 flex="0.3">
                            {t("USERNAME")}
                          </FrontEndTypo.H3>
                          <FrontEndTypo.H4
                            py="1"
                            px="2"
                            flex="0.7"
                            wordWrap="break-word"
                            whiteSpace="break-spaces"
                            overflow="hidden"
                            bg="success.100"
                            borderWidth="1"
                            borderColor="success.500"
                          >
                            {credentials?.username}
                          </FrontEndTypo.H4>
                        </HStack>
                        <HStack alignItems="center" space="1" flex="1">
                          <FrontEndTypo.H3 flex="0.3">
                            {t("PASSWORD")}
                          </FrontEndTypo.H3>
                          <FrontEndTypo.H4
                            py="1"
                            px="2"
                            flex="0.7"
                            wordWrap="break-word"
                            whiteSpace="break-spaces"
                            overflow="hidden"
                            bg="success.100"
                            borderWidth="1"
                            borderColor="success.500"
                          >
                            {credentials?.password}
                          </FrontEndTypo.H4>
                        </HStack>
                      </VStack>
                      <VStack alignItems="center">
                        <Clipboard
                          text={`username: ${credentials?.username}, password: ${credentials?.password}`}
                          onPress={(e) => {
                            setCredentials({ ...credentials, copy: true });
                            downloadImage();
                          }}
                        >
                          <HStack space="3">
                            <IconByName
                              name="FileCopyLineIcon"
                              isDisabled
                              rounded="full"
                              color="blue.300"
                            />
                            <FrontEndTypo.H3 color="blue.300">
                              {t("CLICK_HERE_TO_COPY_AND_LOGIN")}
                            </FrontEndTypo.H3>
                          </HStack>
                        </Clipboard>
                      </VStack>
                      <HStack space="5" pt="5">
                        <FrontEndTypo.Primarybutton
                          flex={1}
                          isDisabled={!credentials?.copy}
                          onPress={async (e) => {
                            const { copy, ...cData } = credentials;
                            await login(cData);
                            navigate("/");
                            navigate(0);
                          }}
                        >
                          {t("LOGIN")}
                        </FrontEndTypo.Primarybutton>
                      </HStack>
                    </VStack>
                  )}
                </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal
              size={"xl"}
              isOpen={isConsentModal}
              _backdrop={{ opacity: "0.7" }}
            >
              <Modal.Content borderRadius={"5px"}>
                <Modal.Body
                  p="5"
                  pb="10"
                  style={{
                    overflowY: "auto",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                    "::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  <SetConsentLang />
                  <VStack space="5">
                    <HStack space={5} justifyContent={"center"}>
                      <FrontEndTypo.Secondarybutton
                        onPress={() => {
                          handleCheckboxChange(false);
                        }}
                      >
                        {t("NO_GO_BACK")}
                      </FrontEndTypo.Secondarybutton>
                      <FrontEndTypo.Primarybutton
                        onPress={() => {
                          handleCheckboxChange(true);
                        }}
                      >
                        {t("YES_GO_FORWARD")}
                      </FrontEndTypo.Primarybutton>
                    </HStack>
                  </VStack>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </HStack>
        </VStack>
      )}
    </>
  );
}

PrerakRegisterDetail.propTypes = {
  t: PropTypes.any,
  currentForm: PropTypes.any,
  setCurrentForm: PropTypes.any,
  registerFormData: PropTypes.any,
  setRegisterFormData: PropTypes.any,
  ip: PropTypes.any,
  showIntroductionOfProject: PropTypes.any,
};
