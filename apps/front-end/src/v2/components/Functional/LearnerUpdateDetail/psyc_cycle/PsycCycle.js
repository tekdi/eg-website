import React, { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import { Box } from "native-base";
import {
  Layout,
  enumRegistryService,
  FrontEndTypo,
  getOptions,
  organisationService,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
//updateSchemaEnum
import moment from "moment";
import validator from "@rjsf/validator-ajv8";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  widgets,
  MultiCheckSubject,
  templates,
  onError,
  transformErrors,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";

// function getFormattedDateRange() {
//   const currentYear = moment().format("YYYY");

//   const startOfRange = moment(`${currentYear}-09-01`).format("DD-MM-YYYY");
//   const endOfRange = moment(`${currentYear}-12-31`).format("DD-MM-YYYY");

//   return `${startOfRange} to ${endOfRange}`;
// }
// App
export default function PsycCycle() {
  const { t } = useTranslation();
  const { id } = useParams();
  const board_id = useLocation().state;
  const userId = id;
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const uiSchema = {
    syc_subjects: {
      "ui:widget": "MultiCheckSubject",
    },
    exam_fee_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [
          moment().subtract(1, "years").format("YYYY"),
          moment().format("YYYY"),
        ],
        format: "DMY",
        // help: `date bitween ${getFormattedDateRange()}`,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await benificiaryRegistoryService.getOne(id);
      const data = result?.result?.program_beneficiaries;
      setFormData({
        ...formData,
        exam_fee_date: data?.exam_fee_date || undefined,
        exam_fee_document_id: data?.exam_fee_document_id || undefined,
        syc_subjects: JSON.parse(data?.syc_subjects || "[]"),
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  const validate = (data, key) => {
    let error = {};

    if (key == "exam_fee_date") {
      // Define your date
      const dateToCheck = moment(data?.exam_fee_date); // Replace with your date

      // Define the start and end of the range
      const startOfRange = moment().startOf("year").month(8); // September (month index starts from 0)
      const endOfRange = moment().startOf("year").month(11).endOf("month"); // December
      // Check if the date is between the range and not in the future
      const isBetweenDateValid = dateToCheck.isBetween(
        startOfRange,
        endOfRange,
        null,
        "[]",
      );
      const isDateValid = dateToCheck.isSameOrBefore(moment(), "day");
      if (!isBetweenDateValid) {
        error = { [key]: t("DATES_NOT_ALLOWED") };
      } else if (!isDateValid) {
        error = { [key]: t("FUTUTRE_DATES_NOT_ALLOWED") };
      }
    } else if (key == "syc_subjects") {
      const countLanguageSubjects = (subjectsArr, subjects) => {
        // Convert the subjects array to a Set for faster lookups
        const subjectsSet = new Set(subjects);
        // Filter the array for objects with "language" subject_type and a subject_id in the subjects array
        const languageSubjects = subjectsArr?.filter(
          (subject) =>
            subject.subject_type === "language" &&
            subjectsSet.has(String(subject.subject_id)),
        );
        // Return the count of filtered objects
        return languageSubjects.length;
      };
      const langCount = countLanguageSubjects(
        schema?.properties?.syc_subjects?.enumOptions,
        data?.syc_subjects,
      );
      const nonLangCount = data?.syc_subjects?.length - langCount;
      if (langCount === 0 && nonLangCount === 0) {
        error = { [key]: t("GROUP_A_GROUP_B_MIN_SUBJECTS") };
      } else if (langCount + nonLangCount > 7) {
        error = { [key]: t("GROUP_A_GROUP_B_MAX_SUBJECTS") };
      } else if (langCount > 3) {
        error = { [key]: t("GROUP_A_MAX_SUBJECTS") };
      } else if (nonLangCount > 5) {
        error = { [key]: t("GROUP_B_MAX_SUBJECTS") };
      }
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

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}`);
  };

  const getSubjects = async (schemaData) => {
    let subjectList = await enumRegistryService.subjectsList(board_id);
    let newSchema = getOptions(schemaData, {
      key: "syc_subjects",
      arr: subjectList?.subjects,
      title: "name",
      value: "subject_id",
      extra: { enumOptions: subjectList?.subjects },
    });
    setSchema(newSchema);
  };

  useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      getSubjects(properties[newSteps[0]]);
    }
  }, []);

  const onChange = async (e, id) => {
    const data = e.formData;
    let newData = { ...formData, ...data };
    if (id == "root_exam_fee_date") {
      let { exam_fee_date, ...otherErrore } = errors || {};
      setErrors(otherErrore);
      const resultDate = validate(data, "exam_fee_date");

      if (resultDate?.exam_fee_date) {
        setErrors({
          ...errors,
          exam_fee_date: {
            __errors: [resultDate?.exam_fee_date],
          },
        });
      }
    } else if (id == "root_syc_subjects") {
      let { syc_subjects, ...otherErrore } = errors || {};
      setErrors(otherErrore);
      const resultDate = validate(data, "syc_subjects");
      if (resultDate?.syc_subjects) {
        setErrors({
          ...errors,
          syc_subjects: {
            __errors: [resultDate?.syc_subjects],
          },
        });
      }
    }

    setFormData(newData);
  };

  // form submit
  const onSubmit = async () => {
    setBtnLoading(true);
    console.log("asd");
    const newFormData = { ...formData, is_continued: true, user_id: userId };
    const data = await organisationService.psycStatus(newFormData);
    if (data?.success) {
      navigate(`/beneficiary/${userId}`);
    }
    setBtnLoading(false);
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
        name: t("BOARD_EXAM_DETAILS"),
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
        <Form
          key={lang + schema}
          ref={formRef}
          extraErrors={errors}
          showErrorList={false}
          noHtml5Validate={true}
          {...{
            widgets: { ...widgets, MultiCheckSubject },
            templates,
            validator,
            schema: schema || {},
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
      </Box>
    </Layout>
  );
}
