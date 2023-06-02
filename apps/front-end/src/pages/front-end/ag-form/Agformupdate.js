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
  StudentEnumService,
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
import { useLocation } from "react-router-dom";

// App

export default function AgformUpdate({ userTokenInfo }) {
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

  const navigate = useNavigate();

  React.useEffect(() => {
    setuserId(location?.state?.id);
    console.log("hello", location?.state?.page);
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
        console.log("reached here");
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

  React.useEffect(async () => {
    getLocation();
  }, []);

  React.useEffect(async () => {
    //console.log("pagecalled");
    setFormData({ ...formData, edit_page_type: "add_contact" });
    if (page === "2") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      console.log("page2", updateDetails);
      setFormData({ ...formData, edit_page_type: "add_address" });
    } else if (page === "3") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      console.log("page3.....", updateDetails);
      setFormData({ ...formData, edit_page_type: "personal" });
    } else if (page === "4") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      console.log("page4.....", updateDetails);
      setFormData({ ...formData, edit_page_type: "add_education" });
    } else if (page === "upload") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      console.log("page5.....", updateDetails);
    }
  }, [page]);

  console.log("page", page);

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
  }, [page]);

  // Type Of Student

  React.useEffect(async () => {
    const studentTypeData = await StudentEnumService.getTypeStudent();
    const last_education_year = await StudentEnumService.lastYear();
    const lastStandard = await StudentEnumService.lastStandard();
    const ReasonOfLeaving = await StudentEnumService.ReasonOfLeaving();
    let newSchema = schema;
    if (schema["properties"]["previous_school_type"]) {
      newSchema = getOptions(newSchema, {
        key: "previous_school_type",
        arr: studentTypeData,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "last_standard_of_education_year",
        arr: last_education_year,
        title: "value",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "last_standard_of_education",
        arr: lastStandard,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "reason_of_leaving_education",
        arr: ReasonOfLeaving,
        title: "title",
        value: "value",
      });
    }

    setSchema(newSchema);
  }, [page]);

  React.useEffect(() => {}, []);

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

      if (data?.[key] && !data?.[key]?.match(/^[a-zA-Z ]*$/g)) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }
    });
    ["vo_experience", "experience"].forEach((keyex) => {
      data?.[keyex]?.map((item, index) => {
        ["role_title", "organization", "description"].forEach((key) => {
          if (item?.[key] && !item?.[key]?.match(/^[a-zA-Z ]*$/g)) {
            errors[keyex][index]?.[key]?.addError(
              `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
            );
          }
        });
      });
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
    if (file.size <= 1048576 * 2) {
      const data = await getBase64(file);
      setCameraUrl(data);
      setcameraFile(file);
      setFormData({ ...formData, ["profile_url"]: data });
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
        document_type: "profile",
        user_id: userId,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }

      const uploadDoc = await uploadRegistryService.uploadFile(form_data);
      console.log("uploadDoc", uploadDoc);
      if (uploadDoc) {
        navigate("/beneficiary/3", { state: { id: userId } });
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
      >
        <VStack py={6} px={4} mb={5} space="6">
          <H1 color="red.1000">{t("IDENTIFY_THE_AG_LEARNER")}</H1>
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
            console.log("url", url);
            setCameraUrl(url);
            setFormData({ ...formData, ["profile_url"]: url });
          },
        }}
      />
    );
  }

  if (page === "upload") {
    return (
      <Layout
        _appBar={{
          onPressBackButton: (e) => setPage("4"),
          lang,
          setLang,
          onlyIconsShow: ["backBtn", "userInfo"],
        }}
        _page={{ _scollView: { bg: "white" } }}
      >
        <VStack py={6} px={4} mb={5} space="6">
          <H1 color="red.1000">{t("IDENTIFY_THE_AG_LEARNER")}</H1>
          <H1 color="red.1000">DO's</H1>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                border: "1px solid red",
                width: 150,
                height: 150,
                marginRight: 10,
              }}
            ></div>
            <div
              style={{ border: "1px solid red", width: 150, height: 150 }}
            ></div>
          </div>
          <H1 color="red.1000">Don’ts</H1>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                border: "1px solid red",
                width: 150,
                height: 150,
                marginRight: 10,
              }}
            ></div>
            <div
              style={{ border: "1px solid red", width: 150, height: 150 }}
            ></div>
          </div>
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
              {pages[pages?.length - 1] === page ? "NEXT" : submitBtn}
            </FrontEndTypo.Primarybutton>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
