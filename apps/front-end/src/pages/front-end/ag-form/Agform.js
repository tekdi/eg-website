import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../ag-form/parts/Schema.js";
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
  Text,
} from "native-base";
import CustomRadio from "../../../component/CustomRadio";
import Steper from "../../../component/Steper";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
  uploadRegistryService,
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
  ArrayFieldTemplate,
  CustomR,
  RadioBtn,
} from "../../../component/BaseInput";
import { useScreenshot } from "use-screenshot-hook";

// App
export default function Agform({ userTokenInfo }) {
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
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
  };
  const ref = React.createRef(null);

  const updateData = (data, deleteData = false) => {};

  const uiSchema = {
    type_mobile: {
      "ui:widget": CustomR,
    },
    marital_status: {
      "ui:widget": CustomR,
    },
    social_category: {
      "ui:widget": CustomR,
    },
    ownership: {
      "ui:widget": RadioBtn,
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

  console.log("nextIndex", page);

  if (page == "3") {
    console.log("FormData");
    getLocation();
  } else {
  }

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
          arr: qData,
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
    const studentLastData = await StudentEnumService.lastYear();
    const lastStandard = await StudentEnumService.lastStandard();
    const ReasonOfLeaving = await StudentEnumService.ReasonOfLeaving();
    let newSchema = schema;
    if (schema["properties"]["type_of_student"]) {
      newSchema = getOptions(newSchema, {
        key: "type_of_student",
        arr: studentTypeData,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "last_year_of_education",
        arr: studentLastData,
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
          arr: qData,
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
          arr: qData,
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
          arr: qData,
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
        user_id: 1,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }
      return await uploadRegistryService.uploadFile(form_data);
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
          <Box>
            <FrontEndTypo.H1 color="textMaroonColor.400" alignItems="center">
              {t("IDENTIFY_THE_AG_LEARNER")}
            </FrontEndTypo.H1>
          </Box>
          <Center>
            <Image
              source={{
                uri: cameraUrl,
              }}
              alt=""
              size="324px"
            />
          </Center>
          <FrontEndTypo.Primarybutton
            // onPress={async (e) => {
            //   await formSubmitUpdate({ ...formData, form_step_number: "13" });
            //   if (onClick) onClick("success");
            // }}
            onPress={uploadProfile}
          >
            {t("SUBMIT")}
          </FrontEndTypo.Primarybutton>
          <FrontEndTypo.Secondarybutton
            leftIcon={<IconByName name="CameraLineIcon" isDisabled />}
            onPress={(e) => {
              setCameraUrl();
              setCameraModal(true);
            }}
          >
            {t("TAKE_ANOTHER_PHOTO")}
          </FrontEndTypo.Secondarybutton>
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
          setCameraUrl: async (url) => {
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
          onPressBackButton: (e) => setPage("5"),
          lang,
          setLang,
          onlyIconsShow: ["backBtn", "userInfo"],
        }}
        _page={{ _scollView: { bg: "white" } }}
      >
        <VStack py={6} px={4} mb={5} space="6">
          <FrontEndTypo.H1
            color="textMaroonColor.400"
            bold
            textAlign="center"
          >
            {t("IDENTIFY_THE_AG_LEARNER")}
          </FrontEndTypo.H1>
          <FrontEndTypo.H3 color="textMaroonColor.400" bold>
            {t("ADD_AG_PROFILE_PHOTO")}
          </FrontEndTypo.H3>
          <FrontEndTypo.H3 color="textMaroonColor.400" bold>
             {t("DO")}          
          </FrontEndTypo.H3>
          <HStack space="2">
            <Box background="primary.100" width="150" height="150"></Box>
            <Box background="primary.100" width="150" height="150"></Box>
          </HStack>

          <FrontEndTypo.H3 color="textMaroonColor.400"  bold>
            {t("DONTS")}
          </FrontEndTypo.H3>
          <HStack space="2">
            <Box background="primary.100" width="150" height="150"></Box>
            <Box background="primary.100" width="150" height="150"></Box>
          </HStack>
          <FrontEndTypo.Secondarybutton
            leftIcon={<IconByName name="CameraLineIcon" size={2} isDisabled />}
            onPress={(e) => {
              setCameraUrl();
              setCameraModal(true);
            }}
          >
            {t("TAKE_PHOTO")}
          </FrontEndTypo.Secondarybutton>
          <VStack space={2}>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              ref={uplodInputRef}
              onChange={handleFileInputChange}
            />
            <FrontEndTypo.Secondarybutton
              leftIcon={<IconByName name="Upload2FillIcon" isDisabled />}
              onPress={(e) => {
                uplodInputRef?.current?.click();
              }}
            >
              {t("UPLOAD_PHOTO")}
            </FrontEndTypo.Secondarybutton>
            {errors?.fileSize ? (
              <FrontEndTypo.H2 color="red.400">{errors?.fileSize}</FrontEndTypo.H2>
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
      }}
      _page={{ _scollView: { bg: "white" } }}
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
            widgets={{ RadioBtn, CustomR }}
            templates={{
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              DescriptionFieldTemplate,
              BaseInputTemplate,
              ArrayFieldTemplate,
            }}
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
              onError,
              onSubmit,
              transformErrors,
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="5"
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
