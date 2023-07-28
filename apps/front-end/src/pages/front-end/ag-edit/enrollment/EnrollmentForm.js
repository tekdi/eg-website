import React from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import { Alert, Box, HStack, Image, Modal } from "native-base";
import {
  Layout,
  enumRegistryService,
  benificiaryRegistoryService,
  FrontEndTypo,
  getOptions,
  debounce,
  getArray,
  filterObject,
  enrollmentDateOfBirth,
  getUiSchema,
  BodyMedium,
} from "@shiksha/common-lib";
//updateSchemaEnum
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  widgets,
  templates,
  onError,
  transformErrors,
  scrollToField,
  validator,
} from "../../../../component/BaseInput.js";
import { useTranslation } from "react-i18next";

const setSchemaByStatus = async (data, fixedSchema, page) => {
  const properties = schema1.properties;
  const constantSchema = properties[page];
  const { enrollment_status, payment_receipt_document_id } =
    fixedSchema?.properties ? fixedSchema?.properties : {};
  let newSchema = {};
  let newData = {};
  [
    "enrollment_status",
    "enrolled_for_board",
    "enrollment_number",
    "enrollment_aadhaar_no",
    "enrollment_date",
    "subjects",
    "payment_receipt_document_id",
  ].forEach((e) => {
    if (e === "subjects") {
      newData = { ...newData, [e]: getArray(data?.[e]) };
    } else newData = { ...newData, [e]: data?.[e] };
  });

  switch (data?.enrollment_status) {
    case "not_enrolled":
      newSchema = {
        ...constantSchema,
        properties: {
          enrollment_status,
        },
        required: ["enrollment_status"],
      };
      newData = {
        enrollment_status: data?.enrollment_status,
        subjects: [],
      };
      break;

    case "applied_but_pending":
    case "enrollment_rejected":
      const { enrolled_for_board, subjects } = constantSchema?.properties;
      const required = constantSchema?.required.filter(
        (item) =>
          ![
            "enrollment_number",
            "enrollment_date",
            "subjects",
            "enrollment_aadhaar_no",
            "payment_receipt_document_id",
          ].includes(item)
      );
      newSchema = {
        ...constantSchema,
        properties: {
          enrollment_status,
          enrolled_for_board,
        },
        required,
      };
      newData = {
        enrollment_status: data?.enrollment_status,
        enrolled_for_board: data?.enrolled_for_board,
      };
      break;

    default:
      if (data?.enrolled_for_board) {
        newSchema = {
          ...constantSchema,
          properties: {
            ...constantSchema?.properties,
            enrollment_status,
            payment_receipt_document_id,
          },
        };
        newSchema = await getSubjects(
          newSchema,
          data?.enrolled_for_board,
          page
        );
      } else {
        const { subjects, ...properties } = constantSchema?.properties;
        newSchema = {
          ...constantSchema,
          properties: {
            ...properties,
            enrollment_status,
            payment_receipt_document_id,
          },
        };
      }
      break;
  }
  return { newSchema, newData };
};

const getSubjects = async (schemaData, value, page) => {
  if (value) {
    const propertiesMain = schema1.properties;
    const constantSchema = propertiesMain[page];
    const { subjects } = constantSchema?.properties;
    const { payment_receipt_document_id, ...properties } =
      schemaData.properties;
    let { data } = await enumRegistryService.getSubjects({
      board: value,
    });
    let newSchema = getOptions(
      {
        ...schemaData,
        properties: {
          ...properties,
          subjects,
          payment_receipt_document_id,
        },
      },
      {
        key: "subjects",
        arr: data ? data : [],
        title: "name",
        value: "id",
      }
    );
    return newSchema;
  } else {
    return schemaData;
  }
};

// App
export default function App() {
  const { step, id } = useParams();
  const userId = id;
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [fixedSchema, setFixedSchema] = React.useState({});
  const [benificiary, setBenificiary] = React.useState({});
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [notMatched, setNotMatched] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [btnLoading, setBtnLoading] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    enrollment_dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [1980, moment().format("YYYY")],
      },
    },
  });
  const enrollmentNumberExist = async (filters) => {
    return await benificiaryRegistoryService.isExistEnrollment(userId, filters);
  };

  const nextPreviewStep = async (pageStape = "n") => {
    const index = pages.indexOf(page);
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (nextIndex !== undefined) {
        setPage(nextIndex);
      } else if (pageStape === "p") {
        navigate(`/beneficiary/${userId}/enrollmentdetails`);
      } else {
        navigate(`/beneficiary/${userId}`);
      }
    }
  };

  const checkEnrollmentDobAndDate = (data, key) => {
    let error = {};
    const age = enrollmentDateOfBirth(
      benificiary?.program_beneficiaries?.enrollment_date,
      data?.enrollment_dob
    );
    if (!benificiary?.program_beneficiaries?.enrollment_date) {
      error = {
        [key]: t("REQUIRED_MESSAGE_ENROLLMENT_DATE"),
        age,
      };
    } else if (!(age.diff >= 14 && age.diff <= 29)) {
      error = {
        [key]: t("THE_AGE_OF_THE_LEARNER_SHOULD_BE_15_TO_29_YEARS"),
        age,
      };
    } else {
      error = { age };
    }
    return error;
  };

  const onPressBackButton = async () => {
    await nextPreviewStep("p");
  };

  const getEnrollmentStatus = async (schemaData) => {
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.ENROLLEMENT_STATUS;
    let newSchema = getOptions(schemaData, {
      key: "payment_receipt_document_id",
      extra: {
        userId,
        document_type: "enrollment_receipt",
        iconComponent: (
          <Image
            source={{ uri: "/payment-receipt.jpeg" }}
            size="200"
            alt="background image"
          />
        ),
      },
    });
    return getOptions(newSchema, {
      key: "enrollment_status",
      arr: list,
      title: "title",
      value: "value",
    });
  };

  const validate = (data, key) => {
    let error = {};
    switch (key) {
      case "enrollment_aadhaar_no":
        if (
          data.enrollment_aadhaar_no &&
          `${data.enrollment_aadhaar_no}` !== `${benificiary.aadhar_no}`
        ) {
          error = { [key]: t("ENROLLMENT_AADHAR_NUMBER_ERROR") };
        }
        break;
      case "enrollment_date":
        if (moment.utc(data?.enrollment_date) > moment.utc()) {
          error = { [key]: t("FUTUTRE_DATES_NOT_ALLOWED") };
        }
        break;
      default:
        break;
    }
    return error;
  };

  const customValidate = (data, err) => {
    const arr = Object.keys(err);
    arr.forEach((key) => {
      const isValid = validate(data, key);
      if (isValid?.[key]) {
        if (!errors?.[key]?.__errors.includes(isValid[key]))
          err?.[key]?.addError(isValid[key]);
      }
    });

    return err;
  };

  React.useEffect(() => {
    const properties = schema1.properties;
    const newSteps = Object.keys(properties);
    const newStep = step ? step : newSteps[1];
    setPage(newStep);
    setPages(newSteps);
  }, []);

  React.useEffect(async () => {
    if (page) {
      const constantSchema = schema1.properties?.[page];
      const { result } = await benificiaryRegistoryService.getOne(userId);
      setBenificiary(result);
      const { program_beneficiaries } = result ? result : {};

      if (page === "edit_enrollement") {
        const newSchema = await getEnrollmentStatus(constantSchema);
        setFixedSchema(newSchema);
        const updatedSchema = await setSchemaByStatus(
          program_beneficiaries,
          newSchema,
          page
        );
        setSchema(updatedSchema?.newSchema);
        const newdata = filterObject(
          updatedSchema?.newData,
          Object.keys(updatedSchema?.newSchema?.properties)
        );

        setFormData(newdata);
      } else {
        setSchema(constantSchema);
        let newdata = filterObject(
          program_beneficiaries,
          Object.keys(constantSchema?.properties)
        );
        const age = checkEnrollmentDobAndDate(
          program_beneficiaries,
          "enrollment_dob"
        );
        if (age?.enrollment_dob) {
          setUiSchema(
            getUiSchema(uiSchema, {
              key: "enrollment_dob",
              extra: {
                "ui:help": <AlertCustom alert={age?.enrollment_dob} />,
              },
            })
          );
          newdata = { ...newdata, is_eligible: "no" };
        } else {
          newdata = { ...newdata, is_eligible: "yes" };
          setUiSchema(
            getUiSchema(uiSchema, {
              key: "enrollment_dob",
              extra: {
                "ui:help": age?.age?.message,
              },
            })
          );
        }

        setFormData(newdata);
      }
      setLoading(false);
    }
  }, [page]);

  const onChange = async (e, id) => {
    const data = e.formData;
    let newData = { ...formData, ...data };

    switch (id) {
      case "root_enrollment_number":
        let { enrollment_number, ...otherError } = errors ? errors : {};
        setErrors(otherError);
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
          }, 1000);
          debouncedFunction();
        }
        break;
      case "root_enrollment_date":
        let { enrollment_date, ...otherErrore } = errors ? errors : {};
        setErrors(otherErrore);
        const resultDate = validate(data, "enrollment_date");

        if (resultDate?.enrollment_date) {
          setErrors({
            ...errors,
            enrollment_date: {
              __errors: [resultDate?.enrollment_date],
            },
          });
        }
        break;
      case "root_enrolled_for_board":
        if (data.enrollment_status === "enrolled") {
          setSchema(await getSubjects(schema, data?.enrolled_for_board, page));
        }
        break;

      case "root_enrollment_status":
        const updatedSchema = await setSchemaByStatus(data, fixedSchema, page);
        newData = updatedSchema?.newData ? updatedSchema?.newData : {};
        setSchema(updatedSchema?.newSchema);
        setErrors();
        break;

      case "root_enrollment_aadhaar_no":
        const result = validate(data, "enrollment_aadhaar_no");
        if (result?.enrollment_aadhaar_no) {
          const fun = debounce(() => {
            setErrors({
              ...errors,
              enrollment_aadhaar_no: {
                __errors: [result?.enrollment_aadhaar_no],
              },
            });
            setNotMatched("aadhaar");
          }, 1000);
          fun();
        } else {
          let { enrollment_aadhaar_no, ...otherError } = errors ? errors : {};
          setErrors(otherError);
        }

        break;
      case "root_enrollment_dob":
        const age = checkEnrollmentDobAndDate(data, "enrollment_dob");
        if (age?.enrollment_dob) {
          setUiSchema(
            getUiSchema(uiSchema, {
              key: "enrollment_dob",
              extra: {
                "ui:help": <AlertCustom alert={age?.enrollment_dob} />,
              },
            })
          );
          newData = { ...newData, is_eligible: "no" };
        } else {
          newData = { ...newData, is_eligible: "yes" };
          setUiSchema(
            getUiSchema(uiSchema, {
              key: "enrollment_dob",
              extra: {
                "ui:help": age?.age?.message,
              },
            })
          );
        }
        break;
      default:
        break;
    }
    setFormData(newData);
  };

  const onSubmit = async () => {
    setBtnLoading(true);
    const keys = Object.keys(errors ? errors : {});
    if (keys?.length > 0) {
      scrollToField({ property: keys?.[0] });
    } else {
      const { success, isUserExist } =
        await benificiaryRegistoryService.updateAg(
          { ...formData, edit_page_type: page },
          userId
        );
      if (isUserExist) {
        setNotMatched(true);
      } else if (success && formData.enrollment_status === "enrolled") {
        nextPreviewStep();
      } else {
        navigate(`/beneficiary/${userId}`);
      }
    }
    setBtnLoading(false);
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
        {schema && schema !== "" && (
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
              schema: schema ? schema : {},
              uiSchema,
              formData,
              onChange,
              onError,
              onSubmit,
              customValidate,
              transformErrors: (errors) => transformErrors(errors, schema, t),
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              type="submit"
              isLoading={btnLoading}
              onPress={() => {
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }}
            >
              {t("SAVE")}
            </FrontEndTypo.Primarybutton>
          </Form>
        )}
      </Box>

      <Modal isOpen={notMatched} size="lg" _backdrop={{ opacity: "0.7" }}>
        <Modal.Content>
          <Modal.Body p="4" bg="white">
            <FrontEndTypo.H3 textAlign="center" p="4" color="textGreyColor.500">
              {notMatched === "aadhaar"
                ? t("ENROLLMENT_AADHAR_POPUP_MESSAGE")
                : t("ENROLLMENT_NUMBER_POPUP_MESSAGE")}
            </FrontEndTypo.H3>
          </Modal.Body>
          <Modal.Footer
            flexDirection={["column", "row"]}
            gap={["2"]}
            alignSelf="center"
            bg="transparent"
          >
            <FrontEndTypo.Secondarybutton
              shadow="BlueFillShadow"
              onPress={() => setNotMatched(false)}
            >
              {t("EDIT_ENROLLMENT_NUMBER")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton
              shadow="BlueFillShadow"
              onPress={() => navigate(`/beneficiary/profile/${userId}`)}
            >
              {t("HOME_PAGE")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

const AlertCustom = ({ alert }) => (
  <Alert status="warning" alignItems={"start"} mb="3">
    <HStack alignItems="center" space="2" color>
      <Alert.Icon />
      <BodyMedium>{alert}</BodyMedium>
    </HStack>
  </Alert>
);
