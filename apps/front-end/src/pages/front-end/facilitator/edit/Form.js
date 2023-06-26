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
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { templates, widgets, validator } from "component/BaseInput";
import { useTranslation } from "react-i18next";
import PhotoUpload from "./PhotoUpload.js";

// App
export default function App({ userTokenInfo, footerLinks }) {
  const { step } = useParams();
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
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

  React.useEffect(() => {
    const getData = async () => {
      const { id } = userTokenInfo?.authUser;
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
            qualification_ids: arrData,
            qualification_master_id: `${
              dataF?.qualification_master_id
                ? dataF?.qualification_master_id
                : ""
            }`,
            type_of_document: dataF?.document_reference?.doument_type,
          };
          setFormData(newData);
        } else if (step === "reference_details") {
          const newData = result?.references;
          setFormData(newData);
        } else {
          setFormData(result);
        }
      }
    };
    getData();
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
        } else {
          navigate("/facilitatorbasicdetail");
        }
        // if (nextIndex === "work_availability_details") {
        //   navigate(`/profile/edit/array-form/experience`);
        // } else if (nextIndex !== undefined) {
        //   navigate(`/profile/edit/${nextIndex}`);
        // } else {
        //   navigate(`/facilitatorbasicdetail`);
        // }
      } else if (nextIndex === "qualification_details") {
        navigate(`/profile/edit/array-form/vo_experience`);
      } else if (nextIndex !== undefined) {
        navigate(`/profile/edit/${nextIndex}`);
      } else if (pageStape.toLowerCase() === "n") {
        navigate(`/profile/edit/upload`);
      } else {
        navigate(`/profile`);
      }
    }
  };

  React.useEffect(async () => {
    const qData = await facilitatorRegistryService.getQualificationAll();
    setQualifications(qData);
  }, [page]);

  // update schema
  React.useEffect(async () => {
    let newSchema = schema;

    if (schema?.properties?.qualification_master_id) {
      setLoading(true);
      if (schema["properties"]?.["qualification_master_id"]) {
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
      if (schema["properties"]?.["qualification_reference_document_id"]) {
        const { id } = userTokenInfo?.authUser;
        newSchema = getOptions(newSchema, {
          key: "qualification_reference_document_id",
          extra: {
            userId: id,
            document_type: formData?.type_of_document,
          },
        });
      }

      if (schema["properties"]?.["qualification_ids"]) {
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
      if (schema["properties"]["state"]) {
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
    if (schema["properties"]?.["marital_status"]) {
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

    if (schema["properties"]?.["device_type"]) {
      newSchema = getOptions(newSchema, {
        key: "device_type",
        arr: enumObj?.MOBILE_TYPE,
        title: "title",
        value: "value",
      });
    }

    if (schema["properties"]?.["document_id"]) {
      const { id } = userTokenInfo?.authUser;
      newSchema = getOptions(newSchema, {
        key: "document_id",
        extra: { userId: id },
      });
    }
    setLoading(false);
    setSchema(newSchema);
  }, [page, formData]);

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step ? step : newSteps[0];
      setPage(newStep);
      setSchema(properties[newStep]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
    }
  }, [step]);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmitUpdate = async (data, overide) => {
    const { id } = userTokenInfo?.authUser;
    if (id) {
      setLoading(true);
      const result = await facilitatorRegistryService.profileStapeUpdate({
        ...data,
        page_type: step,
        ...(overide ? overide : {}),
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
      ["first_name"].forEach((key) => {
        validation({
          data: data?.[key]?.replaceAll(" ", ""),
          key,
          errors,
          message: `${t("REQUIRED_MESSAGE")} ${t(
            schema?.properties?.[key]?.title
          )}`,
        });
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
      } else if (error.name === "format") {
        const { format } = error?.params ? error?.params : {};
        let message = "REQUIRED_MESSAGE";
        if (format === "email") {
          message = "PLEASE_ENTER_VALID_EMAIL";
        }
        if (format === "string") {
          message = "PLEASE_ENTER_VALID_STREING";
        } else if (format === "number") {
          message = "PLEASE_ENTER_VALID_NUMBER";
        }

        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t(message)} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t(message)}`;
        }
      }
      return error;
    });
  };

  const setDistric = async ({ state, district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schema?.properties?.district && state) {
      const qData = await geolocationRegistryService.getDistricts({
        name: state,
      });
      if (schema["properties"]["district"]) {
        newSchema = getOptions(newSchema, {
          key: "district",
          arr: qData?.districts,
          title: "district_name",
          value: "district_name",
        });
      }
      if (schema["properties"]["block"]) {
        newSchema = await setBlock({ district, block, schemaData: newSchema });
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "district", arr: [] });
      if (schema["properties"]["block"]) {
        newSchema = getOptions(newSchema, { key: "block", arr: [] });
      }
      if (schema["properties"]["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
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
      if (schema["properties"]["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData?.blocks,
          title: "block_name",
          value: "block_name",
        });
      }
      if (schema["properties"]["village"]) {
        newSchema = await setVilage({ block, schemaData: newSchema });
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schema["properties"]["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
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
      if (schema["properties"]["village"]) {
        newSchema = getOptions(newSchema, {
          key: "village",
          arr: qData?.villages,
          title: "village_ward_name",
          value: "village_ward_name",
        });
      }
      setSchema(newSchema);
    } else {
      newSchema = getOptions(newSchema, { key: "village", arr: [] });
      setSchema(newSchema);
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
        if (result.isUserExist) {
          const newErrors = {
            mobile: {
              __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
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
    if (id === "root_aadhar_token") {
      if (data?.aadhar_token?.toString()?.length === 12) {
        const result = await userExist({
          aadhar_token: data?.aadhar_token,
        });
        if (result.isUserExist) {
          const newErrors = {
            aadhar_token: {
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
      if (schema["properties"]["qualification_reference_document_id"]) {
        setLoading(true);
        newSchema = getOptions(schema, {
          key: "qualification_reference_document_id",
          extra: {
            userId: user?.id,
            document_type: data.type_of_document,
          },
        });
        setSchema(newSchema);
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

    // if (schema?.properties?.last_name && newFormData?.last_name) {
    //   newFormData = {
    //     ...newFormData,
    //     ["last_name"]: newFormData?.last_name.replaceAll(" ", ""),
    //   };
    // }
    if (_.isEmpty(errors)) {
      // if (["reference_details"].includes(step)) {
      //   const result = await Promise.all(
      //     newFormData.reference.map((item) => {
      //       const newdata = filterObject(
      //         item,
      //         Object.keys(schema?.properties?.reference?.items?.properties)
      //       );
      //       return formSubmitUpdate(newdata);
      //     })
      //   );
      // } else {
      const newdata = filterObject(
        newFormData,
        Object.keys(schema?.properties)
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
    return <PhotoUpload {...{ formData, cameraFile, setCameraFile }} />;
  }

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
        onlyIconsShow: ["backBtn"],
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
        {page && page !== "" && (
          <Form
            key={lang}
            ref={formRef}
            widgets={widgets}
            templates={templates}
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
              onSubmit,
              transformErrors,
            }}
          >
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
          </Form>
        )}
      </Box>
    </Layout>
  );
}
