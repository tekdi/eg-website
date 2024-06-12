import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  FrontEndTypo,
  IconByName,
  facilitatorRegistryService,
  getOptions,
  login,
  removeOnboardingMobile,
  removeOnboardingURLData,
  sendAndVerifyOtp,
  volunteerRegistryService,
} from "@shiksha/common-lib";
import Clipboard from "component/Clipboard.js";
import moment from "moment";
import { Box, HStack, Modal, VStack } from "native-base";
import Layout from "onest/Layout";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { templates, widgets } from "../../../component/BaseInput";
import schema1 from "./registration/schema";
import NotFound from "pages/NotFound";

const uiSchema = {
  dob: {
    "ui:widget": "alt-date",
    "ui:options": {
      hideNowButton: true,
      hideClearButton: true,
      format: "DMY",
    },
  },
};

// App
export default function App({ userTokenInfo: { authUser } }) {
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const [credentials, setCredentials] = useState();
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { page } = useParams();
  const [mobileConditon, setMobileConditon] = useState(false);

  const onPressBackButton = async () => {
    await nextPreviewStep("p");
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
        navigate(`/profile/${nextIndex}/edit`);
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
          setSchema(properties[page]);
        }
      } else {
        nextPreviewStep();
      }
    }
  };

  useEffect(() => {
    const setFormInfo = async () => {
      if (schema1.type === "step") {
        const properties = schema1.properties;
        const newSteps = Object.keys(properties);
        setPages(newSteps);
        if (["1", "2", "4"].includes(page)) {
          setSchema(properties[page]);
          setFormData(authUser);
        } else if (page == 3) {
          setFormData({
            qualification: authUser?.qualifications?.qualification_master?.name,
          });
          await setQualificationsData(properties[page]);
        }
      }
    };
    setFormInfo();
  }, [page]);

  const setQualificationsData = async (newSchema) => {
    if (newSchema?.properties?.qualification) {
      setLoading(true);
      const qData = await facilitatorRegistryService.getQualificationAll();
      if (newSchema["properties"]["qualification"]) {
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
                valueIndex = newSchema?.properties?.qualification?.enum[index];
              }
            }
          );
          if (valueIndex !== "" && formData?.qualification === valueIndex) {
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

  const goErrorPage = (key) => {
    if (key) {
      for (const e of pages) {
        const data = schema1["properties"][e]["properties"][key];
        if (data) {
          setStep(e);
        }
      }
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
      // case "state":
      //   if (isNaN(data?.mobile)) {
      //     error = { mobile: t("PLEASE_ENTER_VALID_STATE") };
      //   }
      //   break;
      case "dob":
        const years = moment().diff(data?.dob, "years");
        if (years < 18) {
          error = { dob: t("MINIMUM_AGE_18_YEAR_OLD") };
        }
        break;
      default:
        break;
    }
    return error;
  };

  const customValidate = (data, err) => {
    const arr = Object.keys(err);
    for (const key of arr) {
      const isValid = validate(data, key);
      if (isValid?.[key]) {
        if (!errors?.[key]?.__errors.includes(isValid[key]))
          err?.[key]?.addError(isValid[key]);
      }
    }

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
      let response_isUserExist = result?.data?.user_roles || [];
      if (response_isUserExist?.length > 0) {
        const newErrors = {
          mobile: {
            __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
          },
        };
        setErrors(newErrors);
        setMobileConditon(false);
        return true;
      }
    }
    return false;
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    // const newData = { ...formData, ...data };
    if (id === "root_mobile") {
      let { mobile, otp, ...otherError } = errors || {};
      setErrors(otherError);
      if (data?.mobile?.toString()?.length === 10) {
        const result = await checkMobileExist(data?.mobile);
        if (!result) {
          setMobileConditon(true);
        }
      }
      if (schema?.properties?.otp) {
        const { otp, ...properties } = schema?.properties || {};
        const required = schema?.required.filter((item) => item !== "otp");
        setSchema({ ...schema, properties, required });
      }
      const newData = { ...formData, ...data };
      setFormData(newData);
    }

    if (id === "root_qualification") {
      if (schema?.properties?.qualification) {
        let valueIndex = "";
        schema?.properties?.qualification?.enumNames?.forEach((e, index) => {
          if (e.match("12")) {
            valueIndex = schema?.properties?.qualification?.enum[index];
          }
        });
        if (valueIndex !== "" && data.qualification === valueIndex) {
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

  const onSubmit = async (data) => {
    setLoading(true);
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
      const { id } = authUser;
      let success = false;
      if (id) {
        switch (page) {
          case 1:
            break;
          case 4:
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
                const { data, success } = await formSubmitUpdate(newFormData);
                if (!success) {
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
                  console.log(data);
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
            break;

          default:
            break;
        }
        success = true;
      } else if (page <= 1) {
        success = true;
      } else {
        success = true;
      }
      if (success) {
        if (localStorage.getItem("backToProfile") === "false") {
          nextPreviewStep();
        } else {
          navigate(`/profile`);
        }
      }
    } else {
      const key = Object.keys(errors);
      if (key[0]) {
        goErrorPage(key[0]);
      }
    }
    setLoading(false);
  };

  const formSubmitUpdate = async () => {
    console.log(formData);
    // const result = await volunteerRegistryService.selfUpdate(formData);
    // return result;
  };

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        // onlyIconsShow: ["langAppBtn"],
        // funLangChange: () => {
        //   setPage("chooseLangauge");
        // },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
        {page && page >= "1" && page <= "4" ? (
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
            {mobileConditon && page === "4" ? (
              <FrontEndTypo.Primarybutton
                mt="3"
                variant={"primary"}
                type="submit"
                onPress={(e) => {
                  formRef?.current?.submit();
                }}
              >
                {schema?.properties?.otp ? t("VERIFY_OTP") : t("SEND_OTP")}
              </FrontEndTypo.Primarybutton>
            ) : (
              <Box alignItems={"center"}>
                <FrontEndTypo.Primarybutton
                  isLoading={loading}
                  p="4"
                  minWidth="60%"
                  mt="4"
                  onPress={() => onClickSubmit(false)}
                >
                  {t("SAVE_AND_NEXT")}
                </FrontEndTypo.Primarybutton>

                <FrontEndTypo.Secondarybutton
                  isLoading={loading}
                  p="4"
                  mt="4"
                  onPress={() => onClickSubmit(true)}
                >
                  {t("SAVE_AND_PROFILE")}
                </FrontEndTypo.Secondarybutton>
              </Box>
            )}
          </Form>
        ) : (
          <NotFound goBack={(e) => navigate(-1)} />
        )}
      </Box>
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
                  <FrontEndTypo.H3 flex="0.3">{t("USERNAME")}</FrontEndTypo.H3>
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
                  <FrontEndTypo.H3 flex="0.3">{t("PASSWORD")}</FrontEndTypo.H3>
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
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
