import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  FrontEndTypo,
  facilitatorRegistryService,
  filterObject,
  getOptions,
  sendAndVerifyOtp,
  volunteerRegistryService,
} from "@shiksha/common-lib";
import moment from "moment";
import { Box } from "native-base";
import Layout from "onest/Layout";
import NotFound from "pages/NotFound";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { templates, widgets } from "../../../component/BaseInput";
import schema1 from "./registration/schema";

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
export default function App() {
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { page } = useParams();
  const [mobileConditon, setMobileConditon] = useState(false);
  const [volunteer, setVolunteer] = useState();

  const onPressBackButton = async () => {
    await nextPreviewStep("p");
  };

  const nextPreviewStep = async (pageStape = "n") => {
    const index = pages.indexOf(page);
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (nextIndex !== undefined) {
        navigate(`/profile/${nextIndex}/edit`);
      } else if (pageStape.toLowerCase() === "p") {
        navigate(-1);
      } else if (pageStape.toLowerCase() === "n") {
        navigate(`/profile/photo`);
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
        const user = await facilitatorRegistryService.getInfo();
        setVolunteer(user);
        setLoading(false);
        const properties = schema1.properties;
        const newSteps = Object.keys(properties);
        setPages(newSteps);
        if (["1", "4"].includes(page)) {
          setSchema(properties[page]);
          const userObj = filterObject(
            user,
            Object.keys(properties?.[page]?.properties || {})
          );
          setFormData(userObj);
        } else if (page == 2) {
          setFormData({
            state: user?.state,
            pincode: user?.pincode,
          });
          await setStatesData(properties[page]);
        } else if (page == 3) {
          setFormData({
            qualification: user?.qualifications?.qualification_master?.name,
          });
          await setQualificationsData(properties[page]);
        }
      }
    };
    setFormInfo();
  }, [page]);

  const setStatesData = async (newSchema) => {
    if (newSchema?.properties?.state) {
      setLoading(true);
      const { data } = await volunteerRegistryService.getStatesData();
      if (newSchema["properties"]["state"]) {
        newSchema = getOptions(newSchema, {
          key: "state",
          arr: data,
        });
        setSchema(newSchema);
        setLoading(false);
      }
    }
  };

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
    setErrors();
    // update setFormData onchange
    const newData = { ...formData, ...data };
    setFormData(newData);
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
    }

    if (id === "root_pincode") {
      const regex = /^\d{0,6}$/;
      if (data?.pincode && !regex.test(data.pincode)) {
        const newErrors = {
          pincode: {
            __errors: [t("PINCODE_ERROR")],
          },
        };
        setErrors(newErrors);
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
    };
    setFormData(newData);

    if (_.isEmpty(errors) || errors?.otp) {
      const { id } = volunteer;
      let success = false;
      if (id) {
        switch (page) {
          case "1":
          case "2":
          case "3":
            let filterNewData = filterObject(
              newFormData,
              Object.keys(schema?.properties),
              {},
              ""
            );
            if (page === "3") {
              filterNewData = {
                qualification: {
                  id: volunteer?.qualifications?.id,
                  qualification_name: filterNewData?.qualification,
                },
              };
            } else {
              filterNewData = {
                users: filterNewData,
              };
            }
            const { data, success } = await formSubmitUpdate(filterNewData);
            if (!success) {
              const newErrors = {
                mobile: {
                  __errors:
                    data?.message?.constructor?.name === "String"
                      ? [data?.message]
                      : data?.error?.constructor?.name === "Array"
                      ? data?.error
                      : [t("SERVER_ERROR")],
                },
              };
              setErrors(newErrors);
            } else {
              console.log(data);
            }
            break;
          case "4":
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

  const formSubmitUpdate = async (users) => {
    const result = await volunteerRegistryService.selfUpdate(users);
    return result;
  };

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  return (
    <Layout
      userAccess
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
    </Layout>
  );
}
