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
  templates,
  onError,
  transformErrors,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";

// App
export default function PsycCycle() {
  const { t } = useTranslation();
  const { id } = useParams();
  const board_id = useLocation().state;
  const userId = id;
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const [psyc, setPsyc] = useState();

  const uiSchema = {
    syc_subjects: {
      "ui:widget": "checkboxes",
      "ui:readonly": psyc || false,
    },
    exam_fee_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [2023, moment().format("YYYY")],
        format: "DMY",
      },
      "ui:readonly": psyc || false,
    },
    exam_fee_document_id: {
      readonly: psyc || false,
    },
  };

  const onPressBackButton = async () => {
    if (page === "edit_enrollement_details") {
      await nextPreviewStep("p");
    } else {
      navigate(`/beneficiary/${userId}`);
    }
  };

  const validate = (data, key) => {
    let error = {};
    if (
      key == "exam_fee_date" &&
      moment.utc(data?.exam_fee_date) > moment.utc()
    ) {
      error = { [key]: t("FUTUTRE_DATES_NOT_ALLOWED") };
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
        await formSubmitUpdate({ ...formData, form_step_number: "6" });
        setPage("SAVE");
      } else {
        return true;
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await benificiaryRegistoryService.getOne(id);
      const data = result?.result?.program_beneficiaries;
      setFormData({
        ...formData,
        exam_fee_date: data?.exam_fee_date,
        exam_fee_document_id: data?.exam_fee_document_id,
        syc_subjects: JSON.parse(data?.syc_subjects || "[]"),
      });
      setPsyc(data?.is_continued);
    };

    fetchData();
  }, []);

  const getSubjects = async (schemaData) => {
    let subjectList = await enumRegistryService.subjectsList(board_id);
    let newSchema = getOptions(schemaData, {
      key: "syc_subjects",
      arr: subjectList?.subjects,
      title: "name",
      value: "subject_id",
    });
    setSchema(newSchema);
  };

  useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      getSubjects(properties[newSteps[0]]);
      setPages(newSteps);
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
            widgets,
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
            isDisabled={psyc}
          >
            {t("SAVE")}
          </FrontEndTypo.Primarybutton>
        </Form>
      </Box>
    </Layout>
  );
}
