import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Box, Button, HStack, Modal, VStack } from "native-base";

import {
  Layout,
  t,
  enumRegistryService,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";

import { useNavigate, useParams } from "react-router-dom";
import { useScreenshot } from "use-screenshot-hook";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  RadioBtn,
  CustomR,
} from "../../../../../front-end/src/component/BaseInput.js";

export default function CommunityForm({ ip }) {
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const navigate = useNavigate();
  const onPressBackButton = async () => {
    navigate(`/community/list`);
  };

  React.useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(id);
    setFormData(qData.result);
  }, []);

  React.useEffect(async () => {
    let rfirst_name = formData?.references?.[0]?.first_name;
    let rmiddle_name = formData?.references?.[0]?.middle_name;
    let rlast_name = formData?.references?.[0]?.last_name;
    let rrelation = formData?.references?.[0]?.relation;
    let rcontact_number = formData?.references?.[0]?.contact_number;

    setFormData({
      ...formData,
      referencefullname: {
        first_name: rfirst_name,
        middle_name: rmiddle_name == "null" ? "" : rmiddle_name,
        last_name: rlast_name == "null" ? "" : rlast_name,
        relation: rrelation,
        contact_number: rcontact_number,
      },
    });
  }, [formData?.id]);

  const uiSchema = {};

  const nextPreviewStep = async (pageStape = "n") => {
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

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      setSubmitBtn(t("NEXT"));
    }
  }, []);

  const formSubmitUpdate = async (formData) => {
    if (id) {
      const data = await enumRegistryService.editProfileById({
        ...formData,
        id: id,
      });
    }
  };

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        const data = schema1["properties"]?.[e]["properties"]?.[key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const customValidate = (data, errors, c) => {
    if (data?.referencefullname?.contact_number) {
      if (data?.referencefullname?.contact_number.toString()?.length !== 10) {
        errors.referencefullname.contact_number.addError(
          t("MINIMUM_LENGTH_IS_10")
        );
      }
      if (
        !(
          data?.referencefullname?.contact_number > 6000000000 &&
          data?.referencefullname?.contact_number < 9999999999
        )
      ) {
        errors.referencefullname.contact_number.addError(
          t("PLEASE_ENTER_VALID_NUMBER")
        );
      }
    }

    ["relation", "first_name"].forEach((key) => {
      if (
        key === "first_name" &&
        data?.referencefullname?.first_name?.replaceAll(" ", "") === ""
      ) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (
        data?.referencefullname?.[key] &&
        !data?.referencefullname?.[key]?.match(/^[a-zA-Z ]*$/g)
      ) {
        errors?.[`referencefullname`]?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }

      if (key === "relation" && data?.relation?.replaceAll(" ", "") === "") {
        errors?.[`referencefullname`]?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
        );
      }
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

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_contact_number") {
      if (data?.mobile?.toString()?.length === 10) {
        const result = await userExist({ mobile: data?.mobile });

        const newErrors = {
          mobile: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
      }
    }
    setFormData(newData);
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    if (formData?.referencefullname?.contact_number.toString()?.length !== 10) {
      const newErrors = {
        contact_number: {
          __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
        },
      };
      setErrors(newErrors);
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("REFERENCE_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      <Box py={6} px={4} mb={5}>
        {page && page !== "" ? (
          <Form
            key={lang}
            ref={formRef}
            widgets={{ RadioBtn, CustomR }}
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
              uiSchema,
              formData,
              customValidate,
              onChange,
              onError,
              onSubmit,
              transformErrors,
            }}
          >
            <Button
              mt="3"
              variant={"primary"}
              type="submit"
              onPress={() => formRef?.current?.submit()}
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
