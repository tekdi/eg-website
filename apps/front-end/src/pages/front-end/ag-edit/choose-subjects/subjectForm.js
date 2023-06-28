import React, { useEffect } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  ImageView,
  dateOfBirth,
  enrollmentDateOfBirth,
} from "@shiksha/common-lib";
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
  Checkbox,
  Pressable,
  Text,
  FormControl,
} from "native-base";
import CustomRadio from "../../../../component/CustomRadio.js";
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
  enumRegistryService,
  updateSchemaEnum,
  uploadRegistryService,
  AgRegistryService,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";

//updateSchemaEnum
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
  select,
} from "../../../../component/BaseInput.js";
import { useScreenshot } from "use-screenshot-hook";
import { useId } from "react";

// App
export default function App({ facilitator, id, ip, onClick }) {
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [cameraModal, setCameraModal] = React.useState(false);
  const [credentials, setCredentials] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const uplodInputRef = React.useRef();
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [userId, setuserId] = React.useState(id);
  const [uploadPayment, setUploadPayment] = React.useState(true);
  const [source, setSource] = React.useState();
  const [benificiary, setBenificiary] = React.useState();
  const buttonStyle = {
    borderWidth: "2px",
    borderStyle: "dotted",
    borderRadius: "12px",
    borderColor: "gray",
  };
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  if (form_step_number && parseInt(form_step_number) >= 13) {
    navigate("/dashboard");
  }

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/enrollmentdetails`);
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

  React.useEffect(() => {
    benificiaryDetails();
  }, []);

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
  };

  const updateData = (data, deleteData = false) => {
    if (deleteData) {
      localStorage.removeItem(`id_data_${facilitator?.id}`);
    } else {
      localStorage.setItem(`id_data_${facilitator?.id}`, JSON.stringify(data));
    }
  };

  const [uiSchema, setUiSchema] = React.useState({
    subjects: {
      "ui:widget": "checkboxes",
    },
    enrollment_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [
          moment().subtract("years", 30).format("YYYY"),
          moment().format("YYYY"),
        ],
      },
    },
  });

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
    const newProperties = schema?.["properties"]?.[key];
    let properties = {};
    if (newProperties) {
      if (newProperties.enum) delete newProperties.enum;
      let { enumNames, ...remainData } = newProperties;
      properties = remainData;
    }
    if (newProperties?.type === "array") {
      return {
        ...schema,
        ["properties"]: {
          ...schema["properties"],
          [key]: {
            ...properties,
            items: {
              ...(properties?.items ? properties?.items : {}),
              ...(_.isEmpty(arr) ? {} : enumObj),
            },
          },
        },
      };
    } else {
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
    }
  };
  React.useEffect(async () => {
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
    if (facilitator?.id) {
      const data = localStorage.getItem(`id_data_${facilitator?.id}`);
      const newData = JSON.parse(data);
      setFormData({ ...newData, ...facilitator });
    }

    const qData = await benificiaryRegistoryService.getOne(userId);
    if (
      qData?.result?.program_beneficiaries?.enrollment_status === "not_enrolled"
    ) {
      const propertiesMain = schema1.properties;
      setUploadPayment(false);
      const constantSchema = propertiesMain[1];
      const {
        enrolled_for_board,
        enrollment_number,
        enrollment_date,
        subjects,
        ...properties
      } = constantSchema?.properties;
      const required = constantSchema?.required.filter(
        (item) =>
          ![
            "enrolled_for_board",
            "enrollment_number",
            "enrollment_date",
            "subjects",
          ].includes(item)
      );

      setSchema({ ...constantSchema, properties, required });
    } else if (
      qData?.result?.program_beneficiaries?.enrollment_status ===
        "applied_but_pending" ||
      qData?.result?.program_beneficiaries?.enrollment_status === "rejected"
    ) {
      setUploadPayment(false);
      const propertiesMain = schema1.properties;
      const constantSchema = propertiesMain[1];
      const { enrollment_number, subjects, enrollment_date, ...properties } =
        constantSchema?.properties;
      const required = constantSchema?.required.filter(
        (item) =>
          !["enrollment_number", "enrollment_date", "subjects"].includes(item)
      );

      setSchema({ ...constantSchema, properties, required });
    } else if (
      qData?.result?.program_beneficiaries?.enrollment_status === "other"
    ) {
      const propertiesMain = schema1.properties;
      setUploadPayment(true);
      const constantSchema = propertiesMain[1];
      const { ...properties } = constantSchema?.properties;
      const required = ["enrollment_status"];

      setSchema({ ...constantSchema, properties, required });
    }

    let enrolled_for_board = qData?.result?.program_beneficiaries
      ?.enrolled_for_board
      ? qData?.result?.program_beneficiaries?.enrolled_for_board
      : "";
    let enrollment_status =
      qData?.result?.program_beneficiaries?.enrollment_status;
    let enrollment_number =
      qData?.result?.program_beneficiaries?.enrollment_number;
    let subjects = qData?.result?.program_beneficiaries?.subjects;
    let enrollment_date = qData?.result?.program_beneficiaries?.enrollment_date;
    let subjectData = subjects ? JSON.parse(subjects) : [];
    let payment_receipt_document_id =
      qData?.result?.program_beneficiaries?.payment_receipt_document_id;
    setSource({
      document_id:
        qData?.result?.program_beneficiaries?.payment_receipt_document_id,
    });
    const stringsArray = subjectData?.map((number) => number?.toString());

    setFormData({
      ...formData,
      enrollment_status: enrollment_status ? enrollment_status : "",
      enrolled_for_board:
        enrollment_status === "other"
          ? ""
          : enrolled_for_board
          ? enrolled_for_board
          : "",
      enrollment_number:
        enrollment_status === "other"
          ? ""
          : enrollment_number
          ? enrollment_number
          : "",
      enrollment_date: enrollment_date ? enrollment_date : "",
      subjects:
        enrollment_status === "other" ? [] : stringsArray ? stringsArray : [],
      facilitator_id: localStorage.getItem("id"),
      payment_receipt_document_id: payment_receipt_document_id,
    });
  }, []);

  React.useEffect(() => {
    if (formData?.enrollment_date) {
      const dob = moment.utc(benificiary?.dob).format("DD-MM-YYYY");
      enrollmentDateOfBirth(formData?.enrollment_date, dob)
        .then((age) => {
          setUiSchema((prevUiSchema) => ({
            ...prevUiSchema,
            enrollment_date: {
              ...prevUiSchema?.enrollment_date,
            },
          }));
        })
        .catch((error) => {
          console.log(error);
          // Handle any errors that occur during the enrollment date of birth calculation
        });
    }
  }, [formData]);

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

  const transformErrors = (errors, uiSchema) => {
    return errors?.map((error) => {
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
    setErrors();

    const data = e.formData;
    if (moment.utc(data?.enrollment_date) > moment.utc()) {
      const newErrors = {
        enrollment_date: {
          __errors: [t("FUTUTRE_DATES_NOT_ALLOWED")],
        },
      };
      setErrors(newErrors);
    }
    if (id === "root_enrollment_status") {
      const properties = schema1.properties;
      const constantSchema = properties[1];
      if (data?.enrollment_status === "not_enrolled") {
        const {
          enrolled_for_board,
          enrollment_number,
          enrollment_date,
          subjects,
          ...properties
        } = constantSchema?.properties;
        const required = constantSchema?.required.filter(
          (item) =>
            ![
              "enrolled_for_board",
              "enrollment_number",
              "enrollment_date",
              "subjects",
            ].includes(item)
        );
        const newData = {
          enrollment_status: formData?.enrollment_status,
          subjects: [],
          facilitator_id: localStorage.getItem("id"),
        };
        setFormData(newData);
        setSchema({ ...constantSchema, properties, required });
        setUploadPayment(false);
      } else if (
        data?.enrollment_status === "applied_but_pending" ||
        data?.enrollment_status === "rejected"
      ) {
        const { enrollment_number, subjects, enrollment_date, ...properties } =
          constantSchema?.properties;
        const required = constantSchema?.required.filter(
          (item) =>
            !["enrollment_number", "enrollment_date", "subjects"].includes(item)
        );
        const newData = {
          enrollment_status: e.formData?.enrollment_status,
          enrolled_for_board: e.formData?.enrolled_for_board,
          subjects: [],
          facilitator_id: localStorage.getItem("id"),
        };
        setSchema({ ...constantSchema, properties, required });
        setFormData(newData);
        setUploadPayment(false);
      } else if (data?.enrollment_status === "other") {
        setUploadPayment(true);
        const { ...properties } = constantSchema?.properties;
        const required = ["enrollment_status"];

        setSchema({ ...constantSchema, properties, required });
        const newData = { ...formData, ...data };
        setFormData(newData);
        setUploadPayment(true);
      } else {
        setSchema(constantSchema);
        setUploadPayment(true);
      }
    }

    const newData = { ...formData, ...data };
    setFormData(newData);
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };
  React.useEffect(async () => {
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.ENROLLEMENT_STATUS;
    let newSchema = schema;
    if (formData?.enrolled_for_board) {
      let boardData = formData?.enrolled_for_board;
      let filters = {
        board: boardData,
      };
      if (
        formData?.enrollment_status === "enrolled" ||
        formData?.enrollment_status === "other"
      ) {
        let subjects = await enumRegistryService.getSubjects(filters);
        newSchema = getOptions(newSchema, {
          key: "subjects",
          arr: subjects ? subjects?.data : [],
          title: "name",
          value: "id",
        });
      }

      newSchema = getOptions(newSchema, {
        key: "enrollment_status",
        arr: list,
        title: "title",
        value: "value",
      });
    } else if (!formData?.enrolled_for_board) {
      newSchema = getOptions(newSchema, {
        key: "enrollment_status",
        arr: list,
        title: "title",
        value: "value",
      });
    }
    setSchema(newSchema);
  }, [formData]);
  const validation = () => {
    const newErrors = {};
    if (formData?.edit_page_type) {
      if (!formData?.enrollment_status) {
        newErrors.enrollment_status = {
          __errors: [t("REQUIRED_MESSAGE_ENROLLMENT_STATUS")],
        };
      } else if (formData?.enrolled_for_board === "null") {
        newErrors.enrolled_for_board = {
          __errors: [t("REQUIRED_MESSAGE_ENROLLED_FOR_BOARD")],
        };
      } else if (!formData?.enrollment_number) {
        newErrors.enrollment_number = {
          __errors: [t("REQUIRED_MESSAGE_ENROLLMENT_NUMBER")],
        };
      } else if (!formData?.enrollment_date) {
        newErrors.enrollment_date = {
          __errors: [t("REQUIRED_MESSAGE_ENROLLMENT_DATE")],
        };
      } else if (formData?.subjects.length < 1) {
        newErrors.subjects = {
          __errors: [t("REQUIRED_MESSAGE_SUBJECTS")],
        };
      } else if (formData?.subjects.length >= 8) {
        newErrors.subjects = {
          __errors: [t("REQUIRED_MESSAGE_SUBJECTS_SELECTTION")],
        };
      } else if (!formData?.payment_receipt_document_id) {
        newErrors.payment_receipt_document_id = {
          __errors: [t("REQUIRED_MESSAGE_PAYMENT_RECEIPT")],
        };
      }
    }
    setErrors(newErrors);
  };
  const handleFileInputChange = async (e) => {
    let file = e.target.files[0];
    if (file.size <= 1048576 * 2) {
      const form_data = new FormData();
      const item = {
        file: file,
        document_type: "payment_receipt",
        document_sub_type: "payment_receipt",

        user_id: userId,
      };
      for (let key in item) {
        form_data.append(key, item[key]);
      }
      const uploadDoc = await uploadRegistryService.uploadFile(form_data);
      const id = uploadDoc?.data?.insert_documents?.returning[0]?.id;
      setFormData({ ...formData, ["payment_receipt_document_id"]: id });
      // uri: uploadDoc?.fileUrl,  using this is giving a grey screen as image hence I restored it back
      setSource({
        document_id: uploadDoc?.data?.insert_documents?.returning?.[0].id,
      });
    } else {
      setErrors({ fileSize: t("FILE_SIZE") });
    }
  };
  const editSubmit = async () => {
    if (formData?.enrollment_status === "enrolled") {
      if (
        formData?.enrollment_status &&
        formData?.enrolled_for_board !== "null" &&
        formData?.enrollment_number &&
        formData?.enrollment_date &&
        formData?.payment_receipt_document_id &&
        formData?.subjects.length < 8 &&
        formData?.subjects.length > 1
      ) {
        const updateDetails = await AgRegistryService.updateAg(
          formData,
          userId
        );
        navigate(`/beneficiary/edit/${userId}/enrollment-receipt`, {
          state: {
            enrollment_date: formData?.enrollment_date,
          },
        });
        // navigate(`/beneficiary/profile/${userId}`);
        // console("hi");
      } else {
        validation();
      }
    } else if (
      formData?.enrollment_status === "applied_but_pending" ||
      formData?.enrollment_status === "rejected"
    ) {
      if (formData?.enrollment_status && formData?.enrolled_for_board) {
        const updateDetails = await AgRegistryService.updateAg(
          formData,
          userId
        );
        navigate(`/beneficiary/profile/${userId}`);
      } else {
        validation();
      }
    } else if (formData?.enrollment_status === "not_enrolled") {
      if (formData?.enrollment_status) {
        const updateDetails = await AgRegistryService.updateAg(
          formData,
          userId
        );
        navigate(`/beneficiary/profile/${userId}`);
      } else {
        validation();
      }
    } else {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      navigate(`/beneficiary/profile/${userId}`);
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo"],
        name: t("ENROLLMENT_DETAILS"),
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
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
            key={lang + schema}
            ref={formRef}
            widgets={{ select }}
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
              uiSchema,
              formData,
              onChange,
              onError,
              onSubmit: { editSubmit },
              transformErrors,
            }}
          >
            {uploadPayment ? (
              <VStack>
                <H1 color={"rgb(121, 0, 0)"} fontSize={"15px"}>
                  {t("PAYMENT_RECEIPT")}
                </H1>

                <HStack justifyContent="space-between" alignItems="Center">
                  <Button
                    padding={"9vh"}
                    marginLeft={"9vh"}
                    style={buttonStyle}
                    variant={"secondary"}
                    leftIcon={<IconByName name="Upload2FillIcon" isDisabled />}
                    onPress={(e) => {
                      uplodInputRef?.current?.click();
                    }}
                  >
                    {t("UPLOAD_THE_PAYMENT_RECEIPT_FOR_ENROLLMENT")}
                  </Button>
                  <input
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    ref={uplodInputRef}
                    onChange={handleFileInputChange}
                  />
                </HStack>

                <VStack
                  px="5"
                  pb="3"
                  pt="2"
                  borderRadius="10px"
                  borderWidth="1px"
                  bg="white"
                  borderColor="appliedColor"
                >
                  <VStack space="5">
                    <ImageView
                      source={source}
                      width="full"
                      height="172px"
                      borderRadius="5px"
                      borderWidth="1px"
                      borderColor="worksheetBoxText.100"
                      alignSelf="Center"
                    />
                  </VStack>
                </VStack>
              </VStack>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            {errors?.payment_receipt_document_id ? (
              <span
                style={{
                  fontSize: "xs",
                  color: "#a94442",
                  fontWeight: 400,
                  paddingLeft: "8%",
                }}
              >
                {errors?.payment_receipt_document_id?.__errors[0]}{" "}
              </span>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            <Button
              mt="3"
              variant={"primary"}
              type="submit"
              onPress={() => {
                editSubmit();
              }}
            >
              {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
            </Button>
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
