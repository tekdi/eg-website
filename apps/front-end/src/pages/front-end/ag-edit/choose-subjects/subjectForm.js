import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, HStack, Modal, VStack } from "native-base";

import {
  Layout,
  BodyMedium,
  enumRegistryService,
  AgRegistryService,
  benificiaryRegistoryService,
  enrollmentDateOfBirth,
  FrontEndTypo,
  getOptions,
  debounce,
} from "@shiksha/common-lib";

//updateSchemaEnum
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  widgets,
  templates,
  focusToField,
} from "../../../../component/BaseInput.js";
import { useTranslation } from "react-i18next";

// App
export default function App({ facilitator, id, ip, onClick }) {
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [userId, setuserId] = React.useState(id);
  const [benificiary, setBenificiary] = React.useState();
  const [notMatched, setNotMatched] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const buttonStyle = {
    borderWidth: "2px",
    borderStyle: "dotted",
    borderRadius: "12px",
    borderColor: "gray",
  };
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { form_step_number } = facilitator;
  if (form_step_number && parseInt(form_step_number) >= 13) {
    navigate("/dashboard");
  }

  const enrollmentNumberExist = async (filters) => {
    return await benificiaryRegistoryService.isExistEnrollment(userId, filters);
  };

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/enrollmentdetails`);
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
        yearsRange: [2023, moment().format("YYYY")],
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

  const getEnrollmentStatus = async (schemaData) => {
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.ENROLLEMENT_STATUS;
    let newSchema = getOptions(schemaData, {
      key: "payment_receipt_document_id",
      extra: {
        userId,
        document_type: "enrollment_receipt",
      },
    });
    return getOptions(newSchema, {
      key: "enrollment_status",
      arr: list,
      title: "title",
      value: "value",
    });
  };

  React.useEffect(async () => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setPages(newSteps);
      setSubmitBtn(t("NEXT"));
    }

    const { result } = await benificiaryRegistoryService.getOne(userId);
    setBenificiary(result);
    if (result?.program_beneficiaries?.enrollment_status === "not_enrolled") {
      const propertiesMain = schema1.properties;
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
      const newSchema = await getEnrollmentStatus({
        ...constantSchema,
        properties,
        required,
      });
      setSchema(newSchema);
    } else if (
      result?.program_beneficiaries?.enrollment_status ===
        "applied_but_pending" ||
      result?.program_beneficiaries?.enrollment_status === "enrollment_rejected"
    ) {
      const propertiesMain = schema1.properties;
      const constantSchema = propertiesMain[1];
      const { enrollment_number, subjects, enrollment_date, ...properties } =
        constantSchema?.properties;
      const required = constantSchema?.required.filter(
        (item) =>
          !["enrollment_number", "enrollment_date", "subjects"].includes(item)
      );
      const newSchema = await getEnrollmentStatus({
        ...constantSchema,
        properties,
        required,
      });
      setSchema(newSchema);
    } else if (result?.program_beneficiaries?.enrollment_status === "other") {
      const propertiesMain = schema1.properties;
      const constantSchema = propertiesMain[1];
      const { ...properties } = constantSchema?.properties;
      const required = ["enrollment_status"];

      const newSchema = await getEnrollmentStatus({
        ...constantSchema,
        properties,
        required,
      });
      setSchema(newSchema);
    } else {
      const properties1 = schema1.properties;
      const constantSchema = properties1[1];
      const { subjects, ...properties } = constantSchema?.properties;

      const newSchema = await getEnrollmentStatus({
        ...constantSchema,
        properties,
      });
      setSchema(newSchema);
    }

    let enrolled_for_board = result?.program_beneficiaries?.enrolled_for_board
      ? result?.program_beneficiaries?.enrolled_for_board
      : "";
    let enrollment_status = result?.program_beneficiaries?.enrollment_status;
    let enrollment_number = result?.program_beneficiaries?.enrollment_number;
    let subjects = result?.program_beneficiaries?.subjects;
    let enrollment_date = result?.program_beneficiaries?.enrollment_date;
    let subjectData = subjects ? JSON.parse(subjects) : [];
    let payment_receipt_document_id =
      result?.program_beneficiaries?.payment_receipt_document_id;
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
          : undefined,
      enrollment_date: enrollment_date ? enrollment_date : "",
      subjects:
        enrollment_status === "other" ? [] : stringsArray ? stringsArray : [],
      facilitator_id: facilitator?.id,
      payment_receipt_document_id: payment_receipt_document_id,
    });
    setLoading(false);
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

  const clearForm = async () => {
    navigate(`/beneficiary/profile/${userId}`);
  };

  const onChange = async (e, id) => {
    setErrors();
    const data = e.formData;
    if (id === "root_enrollment_number") {
      if (data?.enrollment_number) {
        const debouncedFunction = debounce(async () => {
          const result = await enrollmentNumberExist({
            enrollment_number: data?.enrollment_number,
          });
          if (result.error) {
            setNotMatched(true);
            const newErrors = {
              enrollment_number: {
                __errors: [t("ENROLLMENT_NUMBER_ALREADY_EXISTS")],
              },
            };
            setErrors(newErrors);
          }
        }, 3000);

        debouncedFunction();
      }
    }
    if (moment.utc(data?.enrollment_date) > moment.utc()) {
      const newErrors = {
        enrollment_date: {
          __errors: [t("FUTUTRE_DATES_NOT_ALLOWED")],
        },
      };
      setErrors(newErrors);
    }
    if (
      typeof e?.formData?.enrollment_number !== "number" &&
      typeof e?.formData?.enrollment_number !== "undefined"
    ) {
      const newErrors = {
        enrollment_number: {
          __errors: [t("REQUIRED_MESSAGE_ENROLLMENT_NUMBER")],
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
          facilitator_id: facilitator?.id,
        };
        setFormData(newData);
        setSchema({ ...constantSchema, properties, required });
      } else if (
        data?.enrollment_status === "applied_but_pending" ||
        data?.enrollment_status === "enrollment_rejected"
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
          facilitator_id: facilitator?.id,
        };
        setSchema({ ...constantSchema, properties, required });
        setFormData(newData);
      } else if (data?.enrollment_status === "other") {
        if (!data?.enrolled_for_board) {
          const { subjects, ...properties } = constantSchema?.properties;
          const required = ["enrollment_status"];
          setSchema({ ...constantSchema, properties, required });
        } else {
          const { ...properties } = constantSchema?.properties;
          const required = ["enrollment_status"];

          setSchema({ ...constantSchema, properties, required });
        }

        const newData = { ...formData, ...data };
        setFormData(newData);
      } else {
        if (!data?.enrolled_for_board) {
          const properties1 = schema1.properties;
          const constantSchema = properties1[1];
          const { subjects, ...properties } = constantSchema?.properties;
          setSchema({ ...constantSchema, properties });
        } else {
          setSchema(constantSchema);
        }
      }
    }
    const newData = { ...formData, ...data };
    setFormData(newData);
  };

  const onError = (data) => {
    focusToField(data);
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
      focusToField(data);
    }
  };
  React.useEffect(async () => {
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
        newSchema = getOptions(
          {
            ...newSchema,
            properties: {
              ...newSchema["properties"],
              subjects: {
                type: "array",
                label: "SELECT_SUBJECTS",
                uniqueItems: true,
              },
            },
          },
          {
            key: "subjects",
            arr: subjects ? subjects?.data : [],
            title: "name",
            value: "id",
          }
        );
      }
    }
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
      } else if (typeof formData?.enrollment_number !== "number") {
        newErrors.enrollment_number = {
          __errors: [t("REQUIRED_MESSAGE_ENROLLMENT_NOT_A_NUMBER")],
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

  const editSubmit = async () => {
    if (formData?.enrollment_status === "enrolled") {
      if (
        formData?.enrollment_status &&
        formData?.enrolled_for_board !== "null" &&
        formData?.enrollment_number &&
        typeof formData?.enrollment_number === "number" &&
        formData?.enrollment_date &&
        formData?.payment_receipt_document_id &&
        formData?.subjects.length < 8 &&
        formData?.subjects.length >= 1
      ) {
        formRef?.current?.validate();
        if (!errors) {
          navigate(`/beneficiary/edit/${userId}/enrollment-receipt`, {
            state: {
              formData,
            },
          });
        }
      } else {
        validation();
      }
    } else if (
      formData?.enrollment_status === "applied_but_pending" ||
      formData?.enrollment_status === "enrollment_rejected"
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
    } else if (formData?.enrollment_status === "other") {
      if (
        formData?.enrollment_number
          ? typeof formData?.enrollment_number == "number"
          : true
      ) {
        const updateDetails = await AgRegistryService.updateAg(
          formData,
          userId
        );
        navigate(`/beneficiary/profile/${userId}`);
      } else {
        validation();
      }
    }
  };

  return (
    <Layout
      loading={loading}
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
              onChange,
              onError,
              onSubmit: { editSubmit },
              transformErrors,
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              type="submit"
              isLoading={loading}
              onPress={() => {
                formRef?.current?.submit();
              }}
            >
              {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
            </FrontEndTypo.Primarybutton>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>

      <Modal
        isOpen={notMatched}
        size="lg"
        safeAreaTop={true}
        _backdrop={{ opacity: "0.7" }}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content>
          <Modal.Body p="2" bg="white">
            <FrontEndTypo.H3
              textAlign="center"
              pt="2"
              color="textGreyColor.500"
            >
              {t("ENROLLMENT_NUMBER_POPUP_MESSAGE")}
            </FrontEndTypo.H3>

            <VStack space={5}>
              <HStack
                alignItems="center"
                space={4}
                mt="5"
                pt="4"
                borderTopWidth="1px"
                bg="white"
                borderTopColor="appliedColor"
                justifyContent="center"
                flexWrap="wrap"
              >
                <FrontEndTypo.Secondarybutton
                  shadow="BlueFillShadow"
                  px="2"
                  onPress={() => {
                    setNotMatched(false);
                  }}
                >
                  {t("EDIT_ENROLLMENT_NUMBER")}
                </FrontEndTypo.Secondarybutton>
                <FrontEndTypo.Primarybutton
                  px="2"
                  shadow="BlueFillShadow"
                  onPress={() => clearForm()}
                >
                  {t("HOME_PAGE")}
                </FrontEndTypo.Primarybutton>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
