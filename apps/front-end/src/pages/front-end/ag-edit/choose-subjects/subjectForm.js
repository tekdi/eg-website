import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Box, HStack, Modal, VStack } from "native-base";
import {
  Layout,
  enumRegistryService,
  benificiaryRegistoryService,
  enrollmentDateOfBirth,
  FrontEndTypo,
  getOptions,
  debounce,
  getArray,
} from "@shiksha/common-lib";
//updateSchemaEnum
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  widgets,
  templates,
  onError,
  transformErrors,
} from "../../../../component/BaseInput.js";
import { useTranslation } from "react-i18next";

const setSchemaByStatus = async (data, fixedSchema) => {
  const properties = schema1.properties;
  const constantSchema = properties[1];
  const { enrollment_status, payment_receipt_document_id } =
    fixedSchema?.properties ? fixedSchema?.properties : {};
  let newSchema = {};
  let newData = {};
  [
    "enrollment_status",
    "enrolled_for_board",
    "enrollment_number",
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
          !["enrollment_number", "enrollment_date", "subjects"].includes(item)
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
        subjects: [],
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
        newSchema = await getSubjects(newSchema, data?.enrolled_for_board);
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

const getSubjects = async (schemaData, value) => {
  if (value) {
    const propertiesMain = schema1.properties;
    const constantSchema = propertiesMain[1];
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
export default function App({ id }) {
  const [schema, setSchema] = React.useState({});
  const [fixedSchema, setFixedSchema] = React.useState({});
  const [benificiary, setBenificiary] = React.useState({});
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [userId, setuserId] = React.useState(id);
  const [notMatched, setNotMatched] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
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
  });

  const enrollmentNumberExist = async (filters) => {
    return await benificiaryRegistoryService.isExistEnrollment(userId, filters);
  };

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/enrollmentdetails`);
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
    const constantSchema = schema1.properties?.[1];
    const newSchema = await getEnrollmentStatus(constantSchema);
    setFixedSchema(newSchema);
    const { result } = await benificiaryRegistoryService.getOne(userId);
    setBenificiary(result);
    const { program_beneficiaries } = result ? result : {};
    const updatedSchema = await setSchemaByStatus(
      program_beneficiaries,
      newSchema
    );
    setSchema(updatedSchema?.newSchema);
    setFormData({
      ...formData,
      ...updatedSchema?.newData,
    });
    setLoading(false);
  }, []);

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
        if (moment.utc(data?.enrollment_date) > moment.utc()) {
          const newErrors = {
            enrollment_date: {
              __errors: [t("FUTUTRE_DATES_NOT_ALLOWED")],
            },
          };
          setErrors(newErrors);
        }
        const dob = moment.utc(benificiary?.dob).format("DD-MM-YYYY");
        const dataAge = enrollmentDateOfBirth(formData?.enrollment_date, dob);
        setUiSchema({
          ...uiSchema,
          enrollment_date: {
            ...uiSchema?.enrollment_date,
            "ui:help": dataAge?.message,
          },
        });
        break;
      case "root_enrolled_for_board":
        setSchema(await getSubjects(schema, data?.enrolled_for_board));
        break;

      case "root_enrollment_status":
        const updatedSchema = await setSchemaByStatus(data, fixedSchema);
        newData = updatedSchema?.newData ? updatedSchema?.newData : {};
        setSchema(updatedSchema?.newSchema);
        break;

      default:
        break;
    }
    setFormData(newData);
  };

  const onSubmit = async () => {
    const { success, isUserExist } = await benificiaryRegistoryService.updateAg(
      { ...formData, edit_page_type: "edit_enrollement" },
      userId
    );
    if (isUserExist) {
      setNotMatched(true);
    } else if (success) {
      navigate(`/beneficiary/profile/${userId}`);
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
              transformErrors: (errors) => transformErrors(errors, schema, t),
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              type="submit"
              isLoading={loading}
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
              {t("ENROLLMENT_NUMBER_POPUP_MESSAGE")}
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
