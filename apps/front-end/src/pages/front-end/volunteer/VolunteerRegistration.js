import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  BodySmall,
  FrontEndTypo,
  H1,
  H3,
  IconByName,
  Layout,
  facilitatorRegistryService,
  getOnboardingURLData,
  getOptions,
  login,
  removeOnboardingMobile,
  removeOnboardingURLData,
  sendAndVerifyOtp,
  setOnboardingMobile,
  volunteerRegistryService,
} from "@shiksha/common-lib";
import Clipboard from "component/Clipboard.js";
import moment from "moment";
import { Alert, Box, HStack, Modal, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useScreenshot } from "use-screenshot-hook";
import ChooseLanguage from "v2/components/Functional/ChooseLanguage/ChooseLanguage";
import LogoScreen from "v2/components/Static/LogoScreen/LogoScreen";
import PageLayout from "v2/components/Static/PageLayout/PageLayout";
import { templates, widgets } from "../../../component/BaseInput";
import schema1 from "./registration/schema";

// App
export default function App({ facilitator, ip, onClick }) {
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
  const [isUserExistStatus, setIsUserExistStatus] = useState("");

  const [page, setPage] = React.useState("logoScreen");
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [credentials, setCredentials] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  //   const { form_step_number } = facilitator;
  const { t } = useTranslation();
  //   if (form_step_number && parseInt(form_step_number) >= 10) {
  //     navigate("/dashboard");
  //   }

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    if (data && onClick) {
      onClick("SplashScreen");
    }
  };
  const ref = React.createRef(null);
  const { image, takeScreenshot } = useScreenshot();
  const getImage = () => takeScreenshot({ ref });
  const downloadImage = () => {
    var FileSaver = require("file-saver");
    FileSaver.saveAs(`${image}`, "image.png");
  };

  useEffect(() => {
    const init = () => {
      if (page && credentials) {
        getImage();
      }
    };
    init();
  }, [page, credentials]);

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
        // await formSubmitUpdate({ ...formData, form_step_number: "10" });
        // setPage("upload");
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

  useEffect(() => {
    const init = async () => {
      if (schema?.properties?.qualification) {
        setLoading(true);
        const qData = await facilitatorRegistryService.getQualificationAll();
        let newSchema = schema;
        if (schema["properties"]["qualification"]) {
          newSchema = getOptions(newSchema, {
            key: "qualification",
            arr: qData,
            title: "name",
            value: "name",
            filters: { type: "qualification" },
          });
          if (newSchema?.properties?.qualification) {
            let valueIndex = "";
            newSchema?.properties?.qualification?.enumNames?.forEach(
              (e, index) => {
                if (e.match("12")) {
                  valueIndex =
                    newSchema?.properties?.qualification?.enum[index];
                }
              }
            );
            if (valueIndex !== "" && formData.qualification == valueIndex) {
              setAlert(t("YOU_NOT_ELIGIBLE"));
            } else {
              setAlert();
            }
          }
        }
        setSchema(newSchema);
        setLoading(false);
      }
    };
    init();
  }, [page]);

  const setFormInfo = () => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const arr = ["1", "2"];
      const { id } = {};
      let newPage = [];
      if (id) {
        newPage = newSteps.filter((e) => !arr.includes(e));
        //  const pageSet = form_step_number ? form_step_number : 3;
        const pageSet = "3";
        setPage(pageSet);
        setSchema(properties[pageSet]);
      } else {
        newPage = newSteps.filter((e) => arr.includes(e));
        setPage(newPage[0]);
        setSchema(properties[newPage[0]]);
      }
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
    setFormData({});
  };

  useEffect(() => {
    const init = () => {
      if (page == "logoScreen") {
        //wait for 1 second
        const delay = 750; // 1 second in milliseconds
        setTimeout(async () => {
          setPage("chooseLangauge");
        }, delay);
      }
    };
    init();
  }, [page]);

  // const userExist = async (filters) => {
  //   return await facilitatorRegistryService.isExist(filters);
  // };

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
      case "aadhar_no":
        if (
          data?.aadhar_no &&
          !`${data?.aadhar_no}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
        ) {
          error = { aadhar_no: t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER") };
        }
        break;
      case "dob":
        const years = moment().diff(data?.dob, "years");
        if (years < 18) {
          error = { dob: t("MINIMUM_AGE_18_YEAR_OLD") };
        }
        break;
      case "grampanchayat":
      case "first_name":
      case "last_name":
      case "middle_name":
        // do some thing
        break;
      case "vo_experience":
      case "experience":
        ["vo_experience", "experience"].forEach((keyex) => {
          data?.[keyex]?.map((item, index) => {
            ["role_title", "organization", "description"].forEach((key) => {
              if (item?.[key]) {
                if (
                  !item?.[key]?.match(/^[a-zA-Z ]*$/g) ||
                  item?.[key]?.replaceAll(" ", "") === ""
                ) {
                  errors[keyex][index]?.[key]?.addError(
                    `${t("REQUIRED_MESSAGE")} ${t(
                      schema?.properties?.[key]?.title
                    )}`
                  );
                } else if (key === "description" && item?.[key].length > 200) {
                  errors[keyex][index]?.[key]?.addError(
                    `${t("MAX_LENGHT_200")} ${t(
                      schema?.properties?.[key]?.title
                    )}`
                  );
                }
              }
            });
          });
        });
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

  const checkMobileExist = async (mobile) => {
    const result = await volunteerRegistryService.isUserExist({ mobile });
    if (result?.data) {
      let response_isUserExist = result?.data;
      if (
        (response_isUserExist?.program_faciltators &&
          response_isUserExist?.program_faciltators.length > 0) ||
        (response_isUserExist?.program_beneficiaries &&
          response_isUserExist?.program_beneficiaries.length > 0)
      ) {
        const newErrors = {
          mobile: {
            __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
          },
        };
        setErrors(newErrors);
        setIsUserExistResponse(response_isUserExist);
        if (response_isUserExist?.program_beneficiaries.length > 0) {
          setIsUserExistStatus("DONT_ALLOW_MOBILE");
          setIsUserExistModal(t("DONT_ALLOW_MOBILE"));
          setIsLoginShow(false);
        } else if (response_isUserExist?.program_faciltators.length > 0) {
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
                setIsUserExistModal(
                  t("EXIST_LOGIN")
                    .replace("{{state}}", programData?.program_name)
                    .replace("{{year}}", cohortData?.academic_year_name)
                );
                setIsLoginShow(true);
                break;
              } else if (
                facilator_data?.academic_year_id != cohortData?.academic_year_id
              ) {
                // const academic_year =
                //   await facilitatorRegistryService.getCohort({
                //     cohortId: facilator_data?.academic_year_id,
                //   });
                // const program_data =
                //   await facilitatorRegistryService.getProgram({
                //     programId: facilator_data?.program_id,
                //   });
                setIsUserExistStatus("REGISTER_EXIST");
                setIsUserExistModal(
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
              // const academic_year = await facilitatorRegistryService.getCohort({
              //   cohortId: facilator_data?.academic_year_id,
              // });
              // const program_data = await facilitatorRegistryService.getProgram({
              //   programId: facilator_data?.program_id,
              // });
              setIsUserExistStatus("DONT_ALLOW");
              setIsUserExistModal(
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
        return true;
      } else {
        setIsUserExistModal();
        setIsUserExistResponse(null);
      }
    }
    return false;
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    const newData = { ...formData, ...data };
    if (id === "root_mobile") {
      let { mobile, otp, ...otherError } = errors || {};
      setErrors(otherError);
      // if (data?.mobile?.toString()?.length === 10) {
      //   await checkMobileExist(data?.mobile);
      // }
      if (schema?.properties?.otp) {
        const { otp, ...properties } = schema?.properties || {};
        const required = schema?.required.filter((item) => item !== "otp");
        setSchema({ ...schema, properties, required });
      }
    }

    if (id === "root_qualification") {
      if (schema?.properties?.qualification) {
        console.log(schema?.properties?.qualification);
        let valueIndex = "";
        schema?.properties?.qualification?.enumNames?.forEach((e, index) => {
          if (e.match("12")) {
            valueIndex = schema?.properties?.qualification?.enum[index];
          }
        });
        if (valueIndex !== "" && data.qualification == valueIndex) {
          setAlert(t("YOU_NOT_ELIGIBLE"));
        } else {
          setAlert();
        }
      }
    }

    if (id === "root_otp") {
      if (errors?.otp) {
        const newErrors = {};
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

  const userExistClick = () => {
    if (
      isUserExistStatus == "EXIST_LOGIN" ||
      isUserExistStatus == "REGISTER_EXIST"
    ) {
      navigate("/");
    } else {
      setIsUserExistModal();
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (schema?.properties?.first_name) {
      newFormData = {
        ...newFormData,
        ["first_name"]: newFormData?.first_name?.replaceAll(" ", ""),
      };
    }

    if (schema?.properties?.last_name && newFormData?.last_name) {
      newFormData = {
        ...newFormData,
        ["last_name"]: newFormData?.last_name?.replaceAll(" ", ""),
      };
    }

    const newData = {
      ...formData,
      ...newFormData,
      // ["form_step_number"]: parseInt(page) + 1,
    };
    setFormData(newData);

    if (_.isEmpty(errors) || errors?.otp) {
      const { id } = {};
      let success = false;
      if (id) {
        // const data = await formSubmitUpdate(newData);
        // if (!_.isEmpty(data)) {
        success = true;
        // }
      } else if (page === "4") {
        const resultCheck = await checkMobileExist(newFormData?.mobile);
        if (!resultCheck) {
          if (!schema?.properties?.otp) {
            const { otp: data, ...allData } = newFormData || {};
            setFormData(allData);
            newFormData = allData;
            let { mobile, otp, ...otherError } = errors || {};
            setErrors(otherError);
          }
          const { status, newSchema } = await sendAndVerifyOtp(schema, {
            ...newFormData,
            hash: localStorage.getItem("hash"),
          });
          if (status === true) {
            const data = await formSubmitCreate(newFormData);
            if (!data?.success) {
              const newErrors = {
                mobile: {
                  __errors:
                    data?.message?.constructor?.name === "String"
                      ? [data?.message]
                      : data?.error?.constructor?.name === "Array"
                      ? data?.error
                      : [t("MOBILE_NUMBER_ALREADY_EXISTS")],
                },
              };
              setErrors(newErrors);
            } else {
              if (data?.username && data?.password) {
                await removeOnboardingURLData();
                await removeOnboardingMobile();
                setCredentials(data);
              }
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
          }
        }
      } else if (page <= 1) {
        success = true;
      } else {
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

  console.log(formData);
  const formSubmitCreate = async () => {
    const result = await volunteerRegistryService.create(formData);
    return result;
  };

  const changeLanguage = () => {
    setFormInfo();
  };

  if (page == "logoScreen") {
    return (
      <PageLayout t={t} isPageMiddle={true} customComponent={<LogoScreen />} />
    );
  } else if (page == "chooseLangauge") {
    return <ChooseLanguage t={t} languageChanged={changeLanguage} />;
  }
  console.log("1", page);
  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: `${ip?.name}`.trim(),
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        onlyIconsShow: ["langBtn"],
        funLangChange: () => {
          setPage("chooseLangauge");
        },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
        {page && page !== "" && (
          <Form
            key={lang + page}
            ref={formRef}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              widgets,
              templates,
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
            {page === "4" ? (
              <FrontEndTypo.Primarybutton
                mt="3"
                variant={"primary"}
                type="submit"
                onPress={(e) => {
                  formRef?.current?.submit();
                  console.log("1", page);
                }}
              >
                {schema?.properties?.otp ? t("VERIFY_OTP") : t("SEND_OTP")}
              </FrontEndTypo.Primarybutton>
            ) : (
              <FrontEndTypo.Primarybutton
                isLoading={loading}
                type="submit"
                p="4"
                mt="10"
                onPress={(e) => {
                  formRef?.current?.submit();
                }}
              >
                {pages[pages?.length - 1] === page ? t("SUBMIT") : submitBtn}
              </FrontEndTypo.Primarybutton>
            )}
          </Form>
        )}
      </Box>
      <Modal
        isOpen={isUserExistModal}
        safeAreaTop={true}
        size="xl"
        _backdrop={{ opacity: "0.7" }}
      >
        <Modal.Content>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <H1 textAlign="center">
                <Alert.Icon />
              </H1>
              <FrontEndTypo.H2 textAlign="center">
                {isUserExistModal}
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
            <H1 textAlign="center">{t("STORE_YOUR_CREDENTIALS")}</H1>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
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
                  <H3 flex="0.3">{t("USERNAME")}</H3>
                  <BodySmall
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
                  </BodySmall>
                </HStack>
                <HStack alignItems="center" space="1" flex="1">
                  <H3 flex="0.3">{t("PASSWORD")}</H3>
                  <BodySmall
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
                  </BodySmall>
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
                    <H3 color="blue.300">
                      {t("CLICK_HERE_TO_COPY_AND_LOGIN")}
                    </H3>
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
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
