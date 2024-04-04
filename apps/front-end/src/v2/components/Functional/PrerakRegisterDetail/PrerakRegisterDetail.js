import {
  VStack,
  HStack,
  Box,
  Modal,
  Checkbox,
  Button,
  Text,
} from "native-base";
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
  useWindowSize,
  CustomAlert,
  Loading,
} from "@shiksha/common-lib";
import { useScreenshot } from "use-screenshot-hook";
import Clipboard from "../Clipboard/Clipboard.js";
//rjsf forms
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { basicRegister, verifyOTP } from "./PrerakRegister.Forms.Schema.js";
import {
  widgets,
  templates,
} from "../../Static/FormBaseInput/FormBaseInput.js";
import { getLanguage } from "v2/utils/Helper/JSHelper.js";
import PageLayout from "v2/components/Static/PageLayout/PageLayout.js";
import Loader from "v2/components/Static/Loader/Loader.js";
import SetConsentLang from "v2/components/Static/Consent/SetConsentLang.js";

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
  const [width, height] = useWindowSize();

  // Consent modals
  const [isConsentModal, setIsConsentModal] = useState();
  const [consentCompleted, setConsentCompleted] = useState(true);
  const [yesChecked, setYesChecked] = useState(false);
  const [noChecked, setNoChecked] = useState(false);

  //form variable
  const [lang, setLang] = useState(getLanguage());
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});

  // Toggle consent state based on user agreement

  useEffect(() => {
    setErrors({});
    if (currentForm == 0) {
      setSchema(basicRegister);
      setFormData(registerFormData);
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
      setFormData({ verify_mobile: registerFormData?.mobile });
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
  };
  const validate = (data, key) => {
    let error = {};
    switch (key) {
      case "mobile":
        if (data?.mobile?.toString()?.length !== 10) {
          error = { mobile: t("MINIMUM_LENGTH_IS_10") };
        }
        if (!(data?.mobile > 6000000000 && data?.mobile < 9999999999)) {
          error = { mobile: t("PLEASE_ENTER_VALID_NUMBER") };
        }
        break;
      default:
        break;
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
    return err;
  };

  const handleCheckboxChange = (isAgree) => {
    setYesChecked(isAgree);
    setNoChecked(!isAgree);
    if (isAgree) {
      setConsentCompleted(false);
      //sent otp to mobile number
      const fetchData = async () => {
        await sendAndVerifyOtp(schema, {
          mobile: isConsentModal?.mobile,
        });
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
    let newFormData = data.formData;
    if (currentForm == 0) {
      setIsLoading(true);
      let isExist = await checkMobileExist(newFormData?.mobile);
      if (!isExist) {
        setIsConsentModal(newFormData);
      }

      setIsLoading(false);
    } else if (currentForm == 1) {
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
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (currentForm == 0) {
      setRegisterFormData(newData);
    }
    if (id === "root_mobile") {
      let { mobile, otp, ...otherError } = errors || {};
      setErrors(otherError);
      //check user exist on mobile type
      /*if (data?.mobile?.toString()?.length === 10) {
        await checkMobileExist(data?.mobile);
      }*/
    }
    if (id === "root_verify_mobile") {
      let { verify_mobile, otp, ...otherError } = errors || {};
      setErrors(otherError);
    }
  };
  const checkMobileExist = async (mobile) => {
    let isExist = false;
    const result = await facilitatorRegistryService.isUserExist({ mobile });
    if (result?.data) {
      let response_isUserExist = result?.data;
      if (
        response_isUserExist?.program_faciltators &&
        response_isUserExist?.program_faciltators.length > 0
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
        if (response_isUserExist?.program_faciltators.length > 0) {
          for (
            let i = 0;
            i < response_isUserExist?.program_faciltators.length;
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
                    .replace("{{year}}", cohortData?.academic_year_name)
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
                    .replace("{{old_year}}", academic_year?.academic_year_name)
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
                  .replace("{{old_year}}", academic_year?.academic_year_name)
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
        mobile: mobile.toString(),
        reason: "verify_mobile",
        otp: otp.toString(),
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
      ? registerFormData.first_name.replaceAll(" ", "")
      : "";
    let middle_name = registerFormData?.middle_name
      ? registerFormData.middle_name.replaceAll(" ", "")
      : "";
    let last_name = registerFormData?.last_name
      ? registerFormData.last_name.replaceAll(" ", "")
      : "";
    let lang = localStorage.getItem("lang");

    const result = await facilitatorRegistryService.registerV2(
      {
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        mobile: registerFormData?.mobile.toString(),
        lang: lang,
      },
      ip?.id.toString(),
      programData?.program_id,
      cohortData?.academic_year_id
    );
    return result;
  };
  return (
    <>
      {isLoading ? (
        <PageLayout t={t} isPageMiddle={true} customComponent={<Loader />} />
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
              {" "}
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

            <Form
              key={lang}
              ref={formRef}
              extraErrors={errors}
              showErrorList={false}
              noHtml5Validate={true}
              widgets={widgets}
              {...{
                //widgets,
                templates,
                validator,
                schema: schema,
                uiSchema,
                formData,
                customValidate,
                onChange,
                //onError,
                onSubmit,
                transformErrors,
              }}
            >
              {currentForm === 1 ? (
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
                    {t("CONSENT_TO_SHARE_INFORMATION")}
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
