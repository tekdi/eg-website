import React from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  Layout,
  BodyMedium,
  filterObject,
  FrontEndTypo,
  enumRegistryService,
  getOptions,
  validation,
  sendAndVerifyOtp,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";
import PhotoUpload from "./PhotoUpload.js";
import accessControl from "./AccessControl.js";

// App
export default function App({ userTokenInfo, footerLinks }) {
  const { step } = useParams();
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState();
  const [cameraFile, setCameraFile] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState();
  const [facilitator, setFacilitator] = React.useState();
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [qualifications, setQualifications] = React.useState([]);
  const [enumObj, setEnumObj] = React.useState();
  const [otpButton, setOtpButton] = React.useState(false);
  const [mobileConditon, setMobileConditon] = React.useState(false);
  const [fields, setFields] = React.useState([]);

  const getEditAccess = async () => {
    const { id } = userTokenInfo?.authUser || {};
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    const result = await facilitatorRegistryService.getEditRequests(obj);
    let field;
    const parseField = result?.data[0]?.fields;
    if (parseField && typeof parseField === "string") {
      field = JSON.parse(parseField);
    }
    setFields(field || []);
  };

  React.useEffect(async () => {
    const { id } = userTokenInfo?.authUser || {};
    if (id) {
      const result = await facilitatorRegistryService.getOne({ id });
      setFacilitator(result);
      const ListOfEnum = await enumRegistryService.listOfEnum();
      if (!ListOfEnum?.error) {
        setEnumObj(ListOfEnum?.data);
      }
      if (step === "qualification_details") {
        const dataF = result?.qualifications;
        const arr = result?.program_faciltators?.qualification_ids;
        let arrData = arr
          ? JSON.parse(arr)
              ?.filter((e) =>
                qualifications.find(
                  (item) => item.id == e && item.type === "teaching"
                )
              )
              ?.map((e) => `${e}`)
          : [];
        const newData = {
          ...dataF,
          qualification_reference_document_id:
            dataF?.qualification_reference_document_id || "",
          qualification_ids: arrData,
          qualification_master_id: `${
            dataF?.qualification_master_id ? dataF?.qualification_master_id : ""
          }`,
          type_of_document: dataF?.document_reference?.doument_type,
        };
        setFormData(newData);
      } else if (step === "reference_details") {
        if (result?.references?.designation === "") {
          const newData = {
            ...result?.references,
            designation: undefined,
          };
          setFormData(newData);
        } else {
          const newData = result?.references;
          setFormData(newData);
        }
      } else if (step === "basic_details") {
        const formDataObject = {
          first_name: result?.first_name,
          middle_name:
            result?.middle_name !== "" ? result?.middle_name : undefined,
          last_name: result?.last_name !== "" ? result?.last_name : undefined,
          dob: result?.dob,
        };
        setFormData(formDataObject);
      } else {
        setFormData(result);
      }
    }
    getEditAccess();
  }, [qualifications]);

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    if (data && onClick) {
      onClick("SplashScreen");
    }
  };

  const uiSchema = {
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
      },
    },
    qualification_ids: {
      "ui:widget": "checkboxes",
    },
  };

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (pageStape === "p") {
        if (nextIndex === "qualification_details") {
          navigate("/profile");
        } else if (nextIndex === "work_availability_details") {
          navigate("/facilitatorqualification");
        } else {
          navigate("/facilitatorbasicdetail");
        }
      } else if (nextIndex === "qualification_details") {
        navigate(`/profile/edit/array-form/vo_experience`);
      } else if (nextIndex === "aadhaar_details") {
        navigate(`/profile/edit/upload`);
      } else if (nextIndex !== undefined) {
        navigate(`/profile/edit/${nextIndex}`);
      } else {
        navigate(`/aadhaar-kyc/${facilitator?.id}`, {
          state: "/profile",
        });
      }
    }
  };

  React.useEffect(async () => {
    const qData = await facilitatorRegistryService.getQualificationAll();
    setQualifications(qData);
  }, [page]);

  const setSchemaData = (newSchema) => {
    setSchema(accessControl(newSchema, fields));
  };

  // update schema
  React.useEffect(async () => {
    let newSchema = schema;

    if (schema?.properties?.qualification_master_id) {
      setLoading(true);
      if (schema?.["properties"]?.["qualification_master_id"]) {
        newSchema = getOptions(newSchema, {
          key: "qualification_master_id",
          arr: qualifications,
          title: "name",
          value: "id",
          filters: { type: "qualification" },
        });
        if (newSchema?.properties?.qualification_master_id) {
          let valueIndex = "";
          newSchema?.properties?.qualification_master_id?.enumNames?.forEach(
            (e, index) => {
              if (e.match("12")) {
                valueIndex =
                  newSchema?.properties?.qualification_master_id?.enum[index];
              }
            }
          );
          if (
            valueIndex !== "" &&
            formData?.qualification_master_id == valueIndex
          ) {
            setAlert(t("YOU_NOT_ELIGIBLE"));
          } else {
            setAlert();
          }
        }
      }
      if (schema?.["properties"]?.["qualification_reference_document_id"]) {
        const { id } = userTokenInfo?.authUser;
        newSchema = getOptions(newSchema, {
          key: "qualification_reference_document_id",
          extra: {
            userId: id,
            document_type: formData?.type_of_document,
          },
        });
      }

      if (schema?.["properties"]?.["qualification_ids"]) {
        newSchema = getOptions(newSchema, {
          key: "qualification_ids",
          arr: qualifications,
          title: "name",
          value: "id",
          filters: { type: "teaching" },
        });
      }
    }

    if (schema?.properties?.state) {
      const qData = await geolocationRegistryService.getStates();
      if (schema?.["properties"]?.["state"]) {
        newSchema = getOptions(newSchema, {
          key: "state",
          arr: qData?.states,
          title: "state_name",
          value: "state_name",
        });
      }
      newSchema = await setDistric({
        schemaData: newSchema,
        state: formData?.state,
        district: formData?.district,
        block: formData?.block,
      });
    }
    if (schema?.properties?.device_ownership) {
      if (formData?.device_ownership == "no") {
        setAlert(t("YOU_NOT_ELIGIBLE"));
      } else {
        setAlert();
      }
    }
    if (schema?.properties?.designation) {
      newSchema = getOptions(newSchema, {
        key: "designation",
        arr: enumObj?.FACILITATOR_REFERENCE_DESIGNATION,
        title: "title",
        value: "value",
      });
    }
    if (schema?.["properties"]?.["marital_status"]) {
      newSchema = getOptions(newSchema, {
        key: "social_category",
        arr: enumObj?.FACILITATOR_SOCIAL_STATUS,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "marital_status",
        arr: enumObj?.MARITAL_STATUS,
        title: "title",
        value: "value",
      });
    }

    if (schema?.["properties"]?.["device_type"]) {
      newSchema = getOptions(newSchema, {
        key: "device_type",
        arr: enumObj?.MOBILE_TYPE,
        title: "title",
        value: "value",
      });
    }

    if (schema?.["properties"]?.["document_id"]) {
      const { id } = userTokenInfo?.authUser;
      newSchema = getOptions(newSchema, {
        key: "document_id",
        extra: { userId: id },
      });
    }
    setLoading(false);
    setSchemaData(newSchema);
  }, [page, formData]);

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      setPage(newStep);
      setSchemaData(properties[newStep]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
    }
  }, [step]);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const otpfunction = async () => {
    if (formData?.mobile.length < 10) {
      const newErrors = {
        mobile: {
          __errors: t("MINIMUM_LENGTH_IS_10"),
        },
      };
      setErrors(newErrors);
    }

    if (!(formData?.mobile > 6000000000 && formData?.mobile < 9999999999)) {
      const newErrors = {
        mobile: {
          __errors: t("PLEASE_ENTER_VALID_NUMBER"),
        },
      };
      setErrors(newErrors);
    }

    const { status, newSchema } = await sendAndVerifyOtp(schema, {
      ...formData,
      hash: localStorage.getItem("hash"),
    });

    if (status === true) {
      if (errors) {
        const newErrors = {
          mobile: {
            __errors: t("MOBILE_NUMBER_ALREADY_EXISTS"),
          },
        };
        setErrors(newErrors);
      } else {
        onClickSubmit(false);
      }
    } else if (status === false) {
      const newErrors = {
        otp: {
          __errors: [t("USER_ENTER_VALID_OTP")],
        },
      };
      setErrors(newErrors);
    } else {
      setSchemaData(newSchema);
      setOtpButton(true);
    }
  };

  const formSubmitUpdate = async (data, overide) => {
    const { id } = userTokenInfo?.authUser;
    if (id) {
      setLoading(true);
      const result = await facilitatorRegistryService.profileStapeUpdate({
        ...data,
        page_type: step,
        ...(overide || {}),
        id: id,
      });
      setLoading(false);
      return result;
    }
  };

  const customValidate = (data, errors, c, asd) => {
    if (step === "contact_details") {
      if (data?.mobile) {
        validation({
          data: data?.mobile,
          key: "mobile",
          errors,
          message: `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`,
          type: "mobile",
        });
      }
      if (data?.alternative_mobile_number) {
        validation({
          data: data?.alternative_mobile_number,
          key: "alternative_mobile_number",
          errors,
          message: `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`,
          type: "mobile",
        });
      }
    }

    if (step === "reference_details") {
      if (data?.contact_number) {
        validation({
          data: data?.contact_number,
          key: "contact_number",
          errors,
          message: `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`,
          type: "mobile",
        });
      }
    }

    if (step === "basic_details") {
      ["first_name", "middle_name", "last_name"].forEach((key) => {
        validation({
          data:
            typeof data?.[key] === "string"
              ? data?.[key]?.replaceAll(" ", "")
              : data?.[key],
          key,
          errors,
          message: `${t("REQUIRED_MESSAGE")} ${t(
            schema?.properties?.[key]?.title
          )}`,
        });
        if (data?.[key] && !data?.[key]?.match(/^[a-zA-Z ]*$/g)) {
          errors?.[key]?.addError(
            `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
          );
        }
      });
      if (data?.dob) {
        validation({
          data: data?.dob,
          key: "dob",
          errors,
          message: `${t("MINIMUM_AGE_18_YEAR_OLD")}`,
          type: "age-18",
        });
      }
    }
    if (step === "aadhaar_details") {
      if (data?.aadhar_no) {
        if (
          data?.aadhar_no &&
          !`${data?.aadhar_no}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
        ) {
          errors?.aadhar_no?.addError(
            `${t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER")}`
          );
        }
      }
    }
    return errors;
  };

  const setDistric = async ({ state, district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.district && state) {
      const qData = await geolocationRegistryService.getDistricts({
        name: state,
      });
      if (schema?.["properties"]?.["district"]) {
        newSchema = getOptions(newSchema, {
          key: "district",
          arr: qData?.districts,
          title: "district_name",
          value: "district_name",
        });
      }
      if (schema?.["properties"]?.["block"]) {
        newSchema = await setBlock({ district, block, schemaData: newSchema });
        setSchemaData(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "district", arr: [] });
      if (schema?.["properties"]?.["block"]) {
        newSchema = getOptions(newSchema, { key: "block", arr: [] });
      }
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchemaData(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  const setBlock = async ({ district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.block && district) {
      const qData = await geolocationRegistryService.getBlocks({
        name: district,
      });
      if (schema?.["properties"]?.["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData?.blocks,
          title: "block_name",
          value: "block_name",
        });
      }
      if (schema?.["properties"]?.["village"]) {
        newSchema = await setVilage({ block, schemaData: newSchema });
        setSchemaData(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchemaData(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  const setVilage = async ({ block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.village && block) {
      const qData = await geolocationRegistryService.getVillages({
        name: block,
      });
      if (schema?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, {
          key: "village",
          arr: qData?.villages,
          title: "village_ward_name",
          value: "village_ward_name",
        });
      }
      setSchemaData(newSchema);
    } else {
      newSchema = getOptions(newSchema, { key: "village", arr: [] });
      setSchemaData(newSchema);
    }
    setLoading(false);
    return newSchema;
  };
  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_mobile") {
      if (
        data?.mobile?.toString()?.length === 10 &&
        facilitator?.mobile !== data?.mobile
      ) {
        const result = await userExist({ mobile: data?.mobile });
        if (result.registeredAsFacilitator) {
          const newErrors = {
            mobile: {
              __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
          setMobileConditon(false);
        } else {
          setMobileConditon(true);
        }
        if (schema?.properties?.otp) {
          const { otp, ...properties } = schema?.properties;
          const required = schema?.required.filter((item) => item !== "otp");
          setSchemaData({ ...schema, properties, required });
          setFormData((e) => {
            const { otp, ...fData } = e;
            return fData;
          });
          setOtpButton(false);
        }
      }
    }
    setFormData(newData);
    if (id === "root_contact_number") {
      if (data?.contact_number?.toString()?.length < 10) {
        const newErrors = {
          contact_number: {
            __errors: [t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")],
          },
        };
        setErrors(newErrors);
      }
      if (userTokenInfo?.authUser?.mobile === data?.contact_number) {
        const newErrors = {
          contact_number: {
            __errors: [t("REFERENCE_NUMBER_SHOULD_NOT_BE_SAME")],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_name") {
      if (!data?.name?.length) {
        const newErrors = {
          name: {
            __errors: [t("NAME_CANNOT_BE_EMPTY")],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_alternative_mobile_number") {
      if (data?.alternative_mobile_number === data?.mobile) {
        const newErrors = {
          alternative_mobile_number: {
            __errors: [
              t(
                "ALTERNATIVE_MOBILE_NUMBER_SHOULD_NOT_BE_SAME_AS_MOBILE_NUMBER"
              ),
            ],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_aadhar_no") {
      if (data?.aadhar_no?.toString()?.length === 12) {
        const result = await userExist({
          aadhar_no: data?.aadhar_no,
        });

        if (result?.success) {
          const newErrors = {
            aadhar_no: {
              __errors: [t("AADHAAR_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        }
      }
    }

    if (id === "root_qualification") {
      if (schema?.properties?.qualification) {
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

    if (id === "root_device_ownership") {
      if (schema?.properties?.device_ownership) {
        if (data?.device_ownership == "no") {
          setAlert(t("YOU_NOT_ELIGIBLE"));
        } else {
          setAlert();
        }
      }
    }

    if (id === "root_state") {
      await setDistric({
        schemaData: schema,
        state: data?.state,
        district: data?.district,
        block: data?.block,
      });
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
      });
    }

    if (id === "root_block") {
      await setVilage({ block: data?.block, schemaData: schema });
    }

    if (id === "root_type_of_document") {
      let newSchema = schema;
      const user = userTokenInfo?.authUser;
      if (schema?.["properties"]?.["qualification_reference_document_id"]) {
        setLoading(true);
        newSchema = getOptions(schema, {
          key: "qualification_reference_document_id",
          extra: {
            userId: user?.id,
            document_type: data.type_of_document,
          },
        });
        setSchemaData(newSchema);
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (schema?.properties?.first_name) {
      newFormData = {
        ...newFormData,
        ["first_name"]: newFormData?.first_name.replaceAll(" ", ""),
      };
    }
    if (_.isEmpty(errors)) {
      const newdata = filterObject(
        newFormData,
        Object.keys(schema?.properties),
        {},
        ""
      );
      const data = await formSubmitUpdate(newdata);
      // }
      if (localStorage.getItem("backToProfile") === "false") {
        nextPreviewStep();
      } else {
        navigate("/profile");
      }
    }
  };

  if (page === "upload") {
    return (
      <PhotoUpload
        {...{
          formData,
          cameraFile,
          setCameraFile,
          aadhar_no: facilitator?.aadhar_no,
        }}
      />
    );
  }

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    } else {
      if (formRef.current.validateForm()) {
        formRef?.current?.submit();
      }
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t(schema?.step_name)}</FrontEndTypo.H2>,
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
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
        {page && page !== "" && schema && (
          <Form
            key={lang + schema}
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
              onSubmit,
              onError,
              transformErrors: (errors) => transformErrors(errors, schema, t),
            }}
          >
            {mobileConditon && step === "contact_details" ? (
              <FrontEndTypo.Primarybutton
                mt="3"
                variant={"primary"}
                type="submit"
                onPress={otpfunction}
              >
                {otpButton ? t("VERIFY_OTP") : t("SEND_OTP")}
              </FrontEndTypo.Primarybutton>
            ) : (
              <Box>
                <FrontEndTypo.Primarybutton
                  isLoading={loading}
                  p="4"
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
        )}
      </Box>
    </Layout>
  );
}
