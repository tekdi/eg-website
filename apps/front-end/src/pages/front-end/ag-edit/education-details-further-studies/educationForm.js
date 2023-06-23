import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
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
import Steper from "../../../../component/Steper.js";
import {
  facilitatorRegistryService,
  geolocationRegistryService,
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
  benificiaryRegistoryService,
  StudentEnumService,
  AgRegistryService,
  enumRegistryService,
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
  select,
  readOnly,
} from "../../../../component/BaseInput.js";
import { useScreenshot } from "use-screenshot-hook";

// App
export default function App({ facilitator, ip, onClick, id }) {
  const [userId, setuserId] = React.useState(id);
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
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  if (form_step_number && parseInt(form_step_number) >= 13) {
    navigate("/dashboard");
  }

  React.useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(userId);
    let last_standard_of_education =
      qData?.result?.core_beneficiaries?.last_standard_of_education;
    let last_standard_of_education_year =
      qData?.result?.core_beneficiaries?.last_standard_of_education_year;
    let reason_of_leaving_education =
      qData?.result?.core_beneficiaries?.reason_of_leaving_education;
    let type_of_learner = qData?.result?.core_beneficiaries?.type_of_learner;
    let previous_school_type =
      qData?.result?.core_beneficiaries?.previous_school_type;
    let learning_level = qData?.result?.program_beneficiaries?.learning_level;

    setFormData({
      ...formData,
      type_of_learner: type_of_learner,
      reason_of_leaving_education: reason_of_leaving_education,
      last_standard_of_education_year: last_standard_of_education_year,
      last_standard_of_education: last_standard_of_education,
      previous_school_type: previous_school_type,
      learning_level: learning_level,
    });
  }, []);

  React.useEffect(async () => {
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
        key: "reason_of_leaving_education",
        arr: ListOfEnum?.data?.REASON_OF_LEAVING_EDUCATION,
        title: t("title"),
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
    }
    setSchema(newSchema);
  }, [formData]);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/educationdetails`);
  };

  const ref = React.createRef(null);
  const { image, takeScreenshot } = useScreenshot();
  const getImage = () => takeScreenshot({ ref });
  const downloadImage = () => {
    var FileSaver = require("file-saver");
    FileSaver.saveAs(`${image}`, "image.png");
  };

  React.useEffect(() => {
    getImage();
  }, [page, credentials]);

  const updateData = (data, deleteData = false) => {
    if (deleteData) {
      localStorage.removeItem(`id_data_${facilitator?.id}`);
    } else {
      localStorage.setItem(`id_data_${facilitator?.id}`, JSON.stringify(data));
    }
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

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      setSubmitBtn(t("NEXT"));
    }
    if (facilitator?.id) {
      const data = localStorage.getItem(`id_data_${facilitator?.id}`);
      const newData = JSON.parse(data);
      setFormData({ ...newData, ...facilitator });
    }
  }, []);

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
  };

  const formSubmitUpdate = async (formData) => {
    const { id } = facilitator;
    if (id) {
      updateData({}, true);
      return await facilitatorRegistryService.stepUpdate({
        ...formData,
        parent_ip: ip?.id,
        id: id,
      });
    }
  };
  const formSubmitCreate = async (formData) => {
    console.log(formData);
    /* await facilitatorRegistryService.create({
            ...formData,
            parent_ip: ip?.id,
        }); */
  };

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

  // const customValidate = (data, errors, c) => {
  //   if (data?.mobile) {
  //     if (data?.mobile?.toString()?.length !== 10) {
  //       errors.mobile.addError(t("MINIMUM_LENGTH_IS_10"));
  //     }
  //     if (!(data?.mobile > 6666666666 && data?.mobile < 9999999999)) {
  //       errors.mobile.addError(t("PLEASE_ENTER_VALID_NUMBER"));
  //     }
  //   }
  //   if (data?.aadhar_token) {
  //     if (
  //       data?.aadhar_token &&
  //       !data?.aadhar_token?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
  //     ) {
  //       errors?.aadhar_token?.addError(
  //         `${t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER")}`
  //       );
  //     }
  //   }
  //   if (data?.dob) {
  //     const years = moment().diff(data?.dob, "years");
  //     if (years < 18) {
  //       errors?.dob?.addError(t("MINIMUM_AGE_18_YEAR_OLD"));
  //     }
  //   }
  //   ["grampanchayat", "first_name", "last_name"].forEach((key) => {
  //     if (
  //       key === "first_name" &&
  //       data?.first_name?.replaceAll(" ", "") === ""
  //     ) {
  //       errors?.[key]?.addError(
  //         `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
  //       );
  //     }

  //     if (data?.[key] && !data?.[key]?.match(/^[a-zA-Z ]*$/g)) {
  //       errors?.[key]?.addError(
  //         `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
  //       );
  //     }
  //   });
  //   ["vo_experience", "experience"].forEach((keyex) => {
  //     data?.[keyex]?.map((item, index) => {
  //       ["role_title", "organization", "description"].forEach((key) => {
  //         if (item?.[key] && !item?.[key]?.match(/^[a-zA-Z ]*$/g)) {
  //           errors[keyex][index]?.[key]?.addError(
  //             `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
  //           );
  //         }
  //       });
  //     });
  //   });

  //   return errors;
  // };

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
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    updateData(newData);

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
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    const updateDetails = await AgRegistryService.updateAg(formData, userId);
    if (updateDetails) {
      navigate(`/beneficiary/${userId}/educationdetails`);
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo"],
        name: t("EDUCATION_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      <Box py={6} px={4} mb={5}>
        {/* Box */}
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
            widgets={{ select, CustomR }}
            templates={{
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              DescriptionFieldTemplate,
              BaseInputTemplate,
            }}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              validator,
              schema: schema ? schema : {},
              formData,
              onChange,
              onError,
              transformErrors,
              onSubmit,
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              variant={"primary"}
              type="submit"
              onPress={() => formRef?.current?.submit()}
            >
              {t("SAVE")}
            </FrontEndTypo.Primarybutton>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
      <Modal
        isOpen={credentials}
        onClose={() => setCredentials(false)}
        safeAreaTop={true}
        size="xl"
      >
        <Modal.Content>
          {/* <Modal.CloseButton /> */}
          <Modal.Header p="5" borderBottomWidth="0">
            <H1 textAlign="center">{t("STORE_YOUR_CREDENTIALS")}</H1>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <VStack alignItems="center">
                <Box
                  bg="gray.100"
                  p="1"
                  rounded="lg"
                  borderWidth={1}
                  borderColor="gray.300"
                >
                  <HStack alignItems="center" space="5">
                    <H3>{t("USERNAME")}</H3>
                    <BodySmall
                      wordWrap="break-word"
                      width="130px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {credentials?.username}
                    </BodySmall>
                  </HStack>
                  <HStack alignItems="center" space="5">
                    <H3>{t("PASSWORD")}</H3>
                    <BodySmall
                      wordWrap="break-word"
                      width="130px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {credentials?.password}
                    </BodySmall>
                  </HStack>
                </Box>
              </VStack>
              <VStack alignItems="center">
                <Clipboard
                  text={`username:${credentials?.username}, password:${credentials?.password}`}
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
                <Button
                  flex={1}
                  variant="primary"
                  isDisabled={!credentials?.copy}
                  onPress={async (e) => {
                    const { copy, ...cData } = credentials;
                    const loginData = await login(cData);
                    navigate("/");
                    navigate(0);
                  }}
                >
                  {t("LOGIN")}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
