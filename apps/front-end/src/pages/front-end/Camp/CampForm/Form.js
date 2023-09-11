import React from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import { Alert, Box, HStack, TextArea } from "native-base";
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
  AdminTypo,
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
import ConsentForm from "./ConsentForm.js";

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
  const [verifyOtpData, setverifyOtpData] = React.useState();
  const [otpButton, setOtpButton] = React.useState(false);
  const [mobileConditon, setMobileConditon] = React.useState(false);

  const getLocation = () => {
    if (navigator?.geolocation) {
      navigator?.geolocation?.getCurrentPosition(showPosition, showError);
    } else {
      setAlert(t("GEO_GEOLOCATION_IS_NOT_SUPPORTED_BY_THIS_BROWSER"));
    }
  };

  const showPosition = async (position) => {
    let lati = position?.coords?.latitude;
    let longi = position?.coords?.longitude;

    setFormData({
      ...formData,
      lat: lati.toString(),
      long: longi.toString(),
    });
  };

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setAlert(t("GEO_USER_DENIED_THE_REQUEST_FOR_GEOLOCATION"));

        break;
      case error.POSITION_UNAVAILABLE:
        setAlert(t("GEO_LOCATION_INFORMATION_IS_UNAVAILABLE"));

        break;
      case error.TIMEOUT:
        setAlert(t("GEO_THE_REQUEST_TO_GET_USER_LOCATION_TIMED_OUT"));

        break;
      case error.UNKNOWN_ERROR:
        setAlert(t("GEO_AN_UNKNOWN_ERROR_OCCURRED"));

        break;
    }
  }

  React.useEffect(async () => {
    const facilitatorId = localStorage.getItem("id");
    const data = await facilitatorRegistryService.getOne({ id: facilitatorId });
    setFacilitator(data);
    getLocation();
  }, []);

  React.useEffect(async () => {
    setFormData({
      ...formData,
      lat: formData?.lat,
      long: formData?.long,
      state: facilitator?.state,
      district: facilitator?.district,
    });
  }, [formData?.lat]);

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    if (data && onClick) {
      onClick("SplashScreen");
    }
  };

  const uiSchema = {
    facilities: {
      "ui:widget": "MultiCheck",
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
        navigate("/camp/campRegistration");
      } else if (nextIndex !== undefined) {
        navigate(`/camp/campRegistration/edit/${nextIndex}`);
      }
    }
  };

  React.useEffect(async () => {
    const qData = await facilitatorRegistryService.getQualificationAll();
    setQualifications(qData);
  }, []);

  // update schema
  React.useEffect(async () => {
    let newSchema = schema;
    if (schema?.properties) {
      setLoading(true);
      if (schema?.["properties"]?.["property_type"]) {
        newSchema = getOptions(newSchema, {
          key: "property_type",
          arr: qualifications,
          title: "name",
          value: "id",
          filters: { type: "qualification" },
        });
      }
      setSchema(newSchema);
    }

    if (schema?.["properties"]?.["facilities"]) {
      setLoading(true);
      newSchema = getOptions(newSchema, {
        key: "facilities",
        arr: qualifications,
        title: "name",
        value: "id",
      });
      setLoading(false);
      setSchema(newSchema);
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
    setLoading(false);
  }, [page, formData, qualifications]);

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      let schemaData = properties[newStep];
      setPage(newStep);
      setSchema(schemaData);
      setPages(newSteps);

      if (step === "kit") {
        const { kit_received } = schemaData.properties;
        const required = schemaData?.required.filter((item) =>
          ["kit_received"].includes(item)
        );
        const newSchema = {
          ...schemaData,
          properties: { kit_received },
          required: required,
        };
        setSchema(newSchema);
      }
    }
  }, [step]);

  const formSubmitUpdate = async (data, overide) => {
    const { id } = userTokenInfo?.authUser || "";
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
    if (step === "property_details") {
      if (data?.OWNER_OF_THE_PROPERTY?.mobile) {
        validation({
          data: data?.OWNER_OF_THE_PROPERTY?.mobile,
          key: "OWNER_OF_THE_PROPERTY",
          errors,
          message: `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`,
          type: "mobile",
        });
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
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "district", arr: [] });
      if (schema?.["properties"]?.["block"]) {
        newSchema = getOptions(newSchema, { key: "block", arr: [] });
      }
      if (schema?.["properties"]?.["village"]) {
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
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schema?.["properties"]?.["village"]) {
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
      if (schema?.["properties"]?.["village"]) {
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

    if (id === "root_kit_received") {
      if (data?.kit_received === "yes") {
        const newSchema = schema1?.properties?.kit;
        setSchema(newSchema);
      } else if (data?.kit_received === "no") {
        setFormData({
          ...formData,
          kit_rating: "",
          kit_received: "no",
          kit_sufficient: "",
          kit_suggestion: "",
        });
        const properties = schema1.properties;
        const newSteps = Object.keys(properties);
        const newStep = step || newSteps[0];
        let schemaData = properties[newStep];
        const { kit_received } = schemaData.properties;
        const required = schemaData?.required.filter((item) =>
          ["kit_received"].includes(item)
        );
        const newSchema = {
          ...schemaData,
          properties: { kit_received },
          required: required,
        };
        setSchema(newSchema);
      }
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;

    if (_.isEmpty(errors)) {
      let newdata = filterObject(
        newFormData,
        Object.keys(schema?.properties),
        {},
        ""
      );
      if (step === "property_details") {
        newdata = {
          ...newdata,
          OWNER_OF_THE_PROPERTY: filterObject(
            newFormData?.OWNER_OF_THE_PROPERTY,
            Object.keys(schema?.properties?.OWNER_OF_THE_PROPERTY?.properties),
            {},
            ""
          ),
        };
      }
      const data = await formSubmitUpdate(newdata);

      if (localStorage.getItem("backToProfile") === "false") {
        nextPreviewStep();
      } else {
        navigate("/camp/CampRegistration");
      }
    }
  };

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  if (page === "parents_and_learners_consent") {
    return <ConsentForm />;
  }

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
          </Form>
        )}
      </Box>
    </Layout>
  );
}
