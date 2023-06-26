import React, { useEffect } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { ImageView, dateOfBirth } from "@shiksha/common-lib";
import enrollmentSchema from "./EnrollmentSchema.js";
import { Alert, Box, Button, HStack, Modal, VStack } from "native-base";

import {
  facilitatorRegistryService,
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
  enumRegistryService,
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
  const [credentials, setCredentials] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [userId, setuserId] = React.useState(id);
  const [uploadPayment, setUploadPayment] = React.useState(true);
  const [source, setSource] = React.useState();
  const [age, setAge] = React.useState("");

  const navigate = useNavigate();

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

  const updateData = (data, deleteData = false) => {
    if (deleteData) {
      localStorage.removeItem(`id_data_${facilitator?.id}`);
    } else {
      localStorage.setItem(`id_data_${facilitator?.id}`, JSON.stringify(data));
    }
  };

  let uiSchema = {
    enrollment_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
      },
    },
    enrollment_dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
      },
    },
  };

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    const properties = enrollmentSchema.properties;
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
        setPage("upload");
      } else {
        return true;
      }
    }
  };
  const setStep = async (pageNumber = "") => {
    if (enrollmentSchema.type === "step") {
      const properties = enrollmentSchema.properties;
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
    if (enrollmentSchema.type === "step") {
      const properties = enrollmentSchema.properties;
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

    setFormData({
      ...formData,
      // enrollment_date: enrollment_date ? enrollment_date : "",
      // enrollment_first_name: enrollment_first_name ? enrollment_first_name : "",
      // enrollment_middle_name: enrollment_middle_name
      //   ? enrollment_middle_name
      //   : "",
      // enrollment_last_name: enrollment_last_name ? enrollment_last_name : "",
      // enrollment_dob: enrollment_dob ? enrollment_dob : "",
      // enrollment_aadhaar_no: enrollment_aadhaar_no ? enrollment_aadhaar_no : "",
    });
  }, []);

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
        const data = enrollmentSchema["properties"][e]["properties"][key];
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
    if (moment.utc(data?.enrollment_date) > moment()) {
      const newErrors = {
        enrollment_date: {
          __errors: [t("Future dates not allowed")],
        },
      };
      setErrors(newErrors);
    }

    if (
      data?.enrollment_aadhaar_no &&
      !`${data?.enrollment_aadhaar_no}`?.match(
        /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/
      )
    ) {
      const newErrors = {
        enrollment_aadhaar_no: {
          __errors: [t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER")],
        },
      };
      setErrors(newErrors);
    }

    if (
      data?.enrollment_first_name &&
      !`${data?.enrollment_first_name}`?.match(/^[a-zA-Z ]*$/g)
    ) {
      const newErrors = {
        enrollment_first_name: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    }

    if (
      data?.enrollment_middle_name &&
      !`${data?.enrollment_middle_name}`?.match(/^[a-zA-Z ]*$/g)
    ) {
      const newErrors = {
        enrollment_middle_name: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    }

    if (
      data?.enrollment_last_name &&
      !`${data?.enrollment_last_name}`?.match(/^[a-zA-Z ]*$/g)
    ) {
      const newErrors = {
        enrollment_last_name: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    }

    if (data?.enrollment_dob) {
      const dob = moment.utc(data?.enrollment_dob).format("DD-MM-YYYY");

      const age = await dateOfBirth(dob);
      uiSchema = {
        ...uiSchema,
        enrollment_dob: { ...uiSchema?.enrollment_dob, "ui:help": age },
      };
    }
    age;
    console.log(uiSchema, "uiSchema");
    const newData = { ...formData, ...data };
    setFormData(newData);
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const validation = () => {
    const newErrors = {};
    if (formData?.edit_page_type) {
      if (!formData?.enrollment_number) {
        newErrors.enrollment_number = {
          __errors: [t("REQUIRED_MESSAGE_ENROLLMENT_NUMBER")],
        };
      }
    }
    setErrors(newErrors);
  };

  //
  const editSubmit = async () => {
    console.log("edit");
    // if (formData?.enrollment_status === "enrolled") {
    //   if (
    //     formData?.enrollment_status &&
    //     formData?.enrolled_for_board &&
    //     formData?.enrollment_number &&
    //     formData?.payment_receipt_document_id &&
    //     formData?.subjects.length < 8 &&
    //     formData?.subjects.length > 0
    //   ) {
    //     const updateDetails = await AgRegistryService.updateAg(
    //       formData,
    //       userId
    //     );
    //     // navigate(`/beneficiary/profile/${userId}`);
    //     console.log("hi");
    //   } else {
    //     validation();
    //   }
    // } else if (
    //   formData?.enrollment_status === "applied_but_pending" ||
    //   formData?.enrollment_status === "rejected"
    // ) {
    //   if (formData?.enrollment_status && formData?.enrolled_for_board) {
    //     const updateDetails = await AgRegistryService.updateAg(
    //       formData,
    //       userId
    //     );
    //     navigate(`/beneficiary/profile/${userId}`);
    //   } else {
    //     validation();
    //   }
    // } else if (formData?.enrollment_status === "not_enrolled") {
    //   if (formData?.enrollment_status) {
    //     const updateDetails = await AgRegistryService.updateAg(
    //       formData,
    //       userId
    //     );
    //     navigate(`/beneficiary/profile/${userId}`);
    //   } else {
    //     validation();
    //   }
    // } else {
    //   const updateDetails = await AgRegistryService.updateAg(formData, userId);
    //   navigate(`/beneficiary/profile/${userId}`);
    // }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo"],
        name: t("ENROLLMENT_RECEIPT"),
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
            key={lang + schema + uiSchema}
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
            <Button
              mt="3"
              variant={"primary"}
              type="submit"
              onPress={() => editSubmit()}
            >
              {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
            </Button>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
