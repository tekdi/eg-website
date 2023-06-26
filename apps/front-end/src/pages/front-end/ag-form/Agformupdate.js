import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../ag-form/parts/SchemaUpdate.js";
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
  benificiaryRegistoryService,
  enumRegistryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
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
  select,
  readOnly,
} from "../../../component/BaseInput";
import { useScreenshot } from "use-screenshot-hook";
import Success from "../Success.js";
import { useLocation } from "react-router-dom";

// App

export default function AgformUpdate({ userTokenInfo, footerLinks }) {
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
  const [userId, setuserId] = React.useState();
  const location = useLocation();
  const [agroute, setagroute] = React.useState(location?.state?.route);

  const id = useParams();

  const navigate = useNavigate();

  React.useEffect(async () => {
    setuserId(id?.id);
    const qData = await benificiaryRegistoryService.getOne(id?.id);
    setFormData({
      ...formData,
      device_ownership: qData?.result?.core_beneficiaries?.device_ownership,
      device_type: qData?.result?.core_beneficiaries?.device_type,
      state: qData?.result?.state,
      district: qData?.result?.district,
      address: qData?.result?.address == "null" ? "" : qData?.result?.address,
      block: qData?.result?.block,
      village: qData?.result?.village,
      grampanchayat: qData?.result?.grampanchayat,
      marital_status: qData?.result?.extended_users?.marital_status,
      social_category: qData?.result?.extended_users?.social_category,
      type_of_learner: qData?.result?.core_beneficiaries?.type_of_learner,
      last_standard_of_education_year:
        qData?.result?.core_beneficiaries?.last_standard_of_education_year,
      last_standard_of_education:
        qData?.result?.core_beneficiaries?.last_standard_of_education,
      previous_school_type:
        qData?.result?.core_beneficiaries?.previous_school_type,
      reason_of_leaving_education:
        qData?.result?.core_beneficiaries?.reason_of_leaving_education,
      learning_level: qData?.result?.program_beneficiaries?.learning_level,
      learning_motivation:
        qData?.result?.program_beneficiaries?.learning_motivation,
      type_of_support_needed:
        qData?.result?.program_beneficiaries?.type_of_support_needed,
    });
  }, []);

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
  };
  const ref = React.createRef(null);

  const updateData = (data, deleteData = false) => {};

  // const uiSchema = {
  //   facilitator_id: {
  //     "ui:widget": "hidden",
  //   },
  // };

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    const properties = schema1.properties;
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else if (page == "1") {
        navigate("/beneficiary", { state: { id: userId } });
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
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      setAlert("Geolocation is not supported by this browser.");
    }
  };

  const showPosition = (position) => {
    let lati = position.coords.latitude;
    let longi = position.coords.longitude;

    setFormData({
      ...formData,
      edit_page_type: "add_address",
      lat: lati,
      long: longi,
    });
  };

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setAlert("User denied the request for Geolocation.");

        break;
      case error.POSITION_UNAVAILABLE:
        setAlert("Location information is unavailable.");

        break;
      case error.TIMEOUT:
        setAlert("The request to get user location timed out.");

        break;
      case error.UNKNOWN_ERROR:
        setAlert("An unknown error occurred.");

        break;
    }
  }

  // React.useEffect(async () => {
  //   if (page == "2") {
  //   }
  // }, [page]);

  React.useEffect(async () => {
    setFormData({ ...formData, edit_page_type: "add_contact" });
    if (page === "2") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      getLocation();
    } else if (page === "3") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "personal" });
    } else if (page === "4") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "add_education" });
    } else if (page === "5") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "add_other_details" });
    } else if (page === "upload") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
    }
  }, [page]);

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

  React.useEffect(async () => {
    if (schema?.properties?.state) {
      const qData = await geolocationRegistryService.getStates();
      let newSchema = schema;
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
      setSchema(newSchema);
    }

    const ListOfEnum = await enumRegistryService.listOfEnum();
    const lastYear = await benificiaryRegistoryService.lastYear();

    let newSchema = schema;
    if (schema["properties"]["type_of_learner"]) {
      newSchema = getOptions(newSchema, {
        key: "type_of_learner",
        arr: ListOfEnum?.data?.TYPE_OF_LEARNER,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "last_standard_of_education_year",
        arr: lastYear,
        title: "value",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "last_standard_of_education",
        arr: ListOfEnum?.data?.LAST_STANDARD_OF_EDUCATION,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "previous_school_type",
        arr: ListOfEnum?.data?.PREVIOUS_SCHOOL_TYPE,
        title: t("title"),
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "learning_level",
        arr: ListOfEnum?.data?.BENEFICIARY_LEARNING_LEVEL,
        title: t("title"),
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "reason_of_leaving_education",
        arr: ListOfEnum?.data?.REASON_OF_LEAVING_EDUCATION,
        title: "title",
        value: "value",
      });
      setSchema(newSchema);
    }

    if (schema["properties"]["marital_status"]) {
      newSchema = getOptions(newSchema, {
        key: "social_category",
        arr: ListOfEnum?.data?.BENEFICIARY_SOCIAL_STATUS,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "marital_status",
        arr: ListOfEnum?.data?.MARITAL_STATUS,
        title: "title",
        value: "value",
      });
      setSchema(newSchema);
    }

    if (schema["properties"]["learning_motivation"]) {
      newSchema = getOptions(newSchema, {
        key: "learning_motivation",
        arr: ListOfEnum?.data?.LEARNING_MOTIVATION,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "type_of_support_needed",
        arr: ListOfEnum?.data?.TYPE_OF_SUPPORT_NEEDED,
        title: "title",
        value: "value",
      });
      setSchema(newSchema);
    }
  }, [page]);

  // Type Of Student

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      // setPage(newSteps[0]);
      setPage(agroute ? "upload" : newSteps[0]);

      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
  }, []);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmitUpdate = async (formData) => {
    const { id } = authUser;

    if (id) {
      updateData({}, true);
    }
  };

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
      if (years < 18) {
        errors?.dob?.addError(t("MINIMUM_AGE_18_YEAR_OLD"));
      }
    }
    ["grampanchayat"].forEach((key) => {
      if (
        key === "grampanchayat" &&
        data?.grampanchayat?.replaceAll(" ", "") === ""
      ) {
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

  const setDistric = async ({ state, district, block, schemaData }) => {
    let newSchema = schemaData;
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
    formData;
    return newSchema;
  };

  const setBlock = async ({ district, block, schemaData }) => {
    let newSchema = schemaData;
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
    return newSchema;
  };

  const setVilage = async ({ block, schemaData }) => {
    let newSchema = schemaData;
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
    return newSchema;
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    updateData(newData);
    if (id === "root_mobile") {
      if (data?.mobile?.toString()?.length === 10) {
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
        // const data = await formSubmitUpdate(newData);
        // if (!_.isEmpty(data)) {
        success = true;
        // }
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

  const [cameraFile, setcameraFile] = useState();

  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    let data = await benificiaryRegistoryService.validateFileMaxSize(file);
    if (data) {
      setCameraUrl(data);
      setcameraFile(file);
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
    }
  };

  const uploadProfile = async () => {
    const { id } = authUser;
    if (id) {
      const form_data = new FormData();
      const item = {
        file: cameraFile,
        document_type: "profile_photo",
        document_sub_type: "profile_photo_1",
        user_id: userId,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }

      const uploadDoc = await uploadRegistryService.uploadFile(form_data);
      if (uploadDoc) {
        navigate(`/beneficiary/${userId}/3`, { state: { id: userId } });
      }
    }
  };
  if (cameraUrl) {
    return (
      <Layout
        _appBar={{
          lang,
          setLang,
          onPressBackButton: (e) => {
            setCameraUrl();
            setCameraModal(false);
          },
          onlyIconsShow: ["backBtn", "userInfo"],
        }}
        _page={{ _scollView: { bg: "white" } }}
        _footer={{ menues: footerLinks }}
      >
        <VStack py={6} px={4} mb={5} space="6">
          <Center>
            <Image
              source={{
                uri: cameraUrl,
              }}
              alt=""
              size="324px"
            />
          </Center>
          <Button variant={"primary"} onPress={uploadProfile}>
            {t("SUBMIT")}
          </Button>
          <Button
            variant={"secondary"}
            leftIcon={<IconByName name="CameraLineIcon" isDisabled />}
            onPress={(e) => {
              setCameraUrl();
              setCameraModal(true);
            }}
          >
            {t("TAKE_ANOTHER_PHOTO")}
          </Button>

          <Button
            variant={"secondary"}
            leftIcon={<IconByName name="CameraLineIcon" isDisabled />}
            onPress={(e) => {
              navigate(`/beneficiary/${userId}/3`, { state: { id: userId } });
            }}
          >
            {t("SKIP")}
          </Button>
        </VStack>
      </Layout>
    );
  }
  if (cameraModal) {
    return (
      <Camera
        {...{
          cameraModal,
          setCameraModal,
          cameraUrl,
          setcameraFile,
          setCameraUrl: async (url) => {
            setCameraUrl(url);
            setFormData({ ...formData, ["profile_url"]: url });
          },
        }}
      />
    );
  }

  if (page === "upload") {
    const properties = schema1.properties;
    const newSteps = Object.keys(properties);
    const onPressBackButton = async () => {
      setagroute(false);
      setPage(newSteps[4]);
      setSchema(properties[newSteps[4]]);
    };
    return (
      <Layout
        _appBar={{
          onPressBackButton,
          lang,
          setLang,
          onlyIconsShow: ["backBtn", "userInfo"],
        }}
        _page={{ _scollView: { bg: "white" } }}
        _footer={{ menues: footerLinks }}
      >
        <VStack py={6} px={4} mb={5} space="6">
          <H1 color="red.1000">{t("Add_AGS_PROFILE")}</H1>

          <Button
            variant={"primary"}
            leftIcon={
              <IconByName
                name="CameraLineIcon"
                color="white"
                size={2}
                isDisabled
              />
            }
            onPress={(e) => {
              setCameraUrl();
              setCameraModal(true);
            }}
          >
            {t("TAKE_PHOTO")}
          </Button>
          <VStack space={2}>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              ref={uplodInputRef}
              onChange={handleFileInputChange}
            />
            <Button
              leftIcon={<IconByName name="Download2LineIcon" isDisabled />}
              variant={"secondary"}
              onPress={(e) => {
                uplodInputRef?.current?.click();
              }}
            >
              {t("UPLOAD_PHOTO")}
            </Button>
            <Button
              variant={"secondary"}
              leftIcon={<IconByName name="CameraLineIcon" isDisabled />}
              onPress={(e) => {
                navigate(`/beneficiary/${userId}/3`, { state: { id: userId } });
              }}
            >
              {t("SKIP")}
            </Button>
            {errors?.fileSize ? (
              <H2 color="red.400">{errors?.fileSize}</H2>
            ) : (
              <React.Fragment />
            )}
          </VStack>
        </VStack>
      </Layout>
    );
  }

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
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
          <React.Fragment />
        )}

        {page && page !== "" ? (
          <Form
            key={lang + addBtn}
            ref={formRef}
            widgets={{ RadioBtn, CustomR, CustomOTPBox, select, readOnly }}
            templates={{
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              BaseInputTemplate,
              DescriptionFieldTemplate,
            }}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              validator,
              schema: schema ? schema : {},
              formData,
              customValidate,
              onChange,
              onError,
              onSubmit,
              transformErrors,
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              type="submit"
              onPress={() => formRef?.current?.submit()}
            >
              {pages[pages?.length - 1] === page ? t("NEXT") : submitBtn}
            </FrontEndTypo.Primarybutton>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
