import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";

import {
  Layout,
  BodyMedium,
  benificiaryRegistoryService,
  AgRegistryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  RadioBtn,
  CustomR,
} from "../../../../component/BaseInput.js";
import { useTranslation } from "react-i18next";

// App
export default function BasicDetailsForm({ id }) {
  const { t } = useTranslation();
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const userId = id;
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/basicdetails`);
  };

  React.useEffect(async () => {
    const getdata = await benificiaryRegistoryService.getOne(id);
    const qData = getdata?.result;
    setFormData({
      ...formData,
      ...getdata?.result,
      middle_name: qData?.middle_name,
      first_name: qData?.first_name,
      last_name: qData?.last_name,
      dob: qData?.dob || undefined,
    });
  }, []);

  const uiSchema = {
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
      },
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
      let minYear = moment().subtract("years", 30);
      let maxYear = moment().subtract("years", 12);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
  }, []);

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        console.log(e);
        const data = schema1["properties"]?.[e]["properties"]?.[key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const customValidate = (data, errors, c) => {
    if (data?.dob) {
      const age_in_years = moment().diff(data?.dob, "years", true);
      if (!(age_in_years >= 12 && age_in_years <= 30)) {
        errors?.dob?.addError(t("BENEFICIARY_DATE_OF_BIRTH_VALIDATION"));
      }
    }
    ["first_name", "last_name", "middle_name"].forEach((key) => {
      if (key === "first_name" && data?.first_name?.replace(/ /g, "") === "") {
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

    if (id === "root_dob") {
      if (data?.dob) {
        const age_in_years = moment().diff(data?.dob, "years", true);
        if (!(age_in_years >= 12 && age_in_years <= 30)) {
          const newErrors = {
            dob: {
              __errors: [t("BENEFICIARY_DATE_OF_BIRTH_VALIDATION")],
            },
          };
          setErrors(newErrors);
        }
      }
    }

    if (id === "root_middle_name") {
      if (data?.middle_name === undefined) {
        setFormData({ ...formData, middle_name: "" });
      }
    }
    if (id === "root_last_name") {
      if (data?.last_name === undefined) {
        setFormData({ ...formData, last_name: "" });
      }
    }
  };

  const onError = (data) => {
    console.log(data);
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    await AgRegistryService.updateAg(formData, userId);
    navigate(`/beneficiary/${userId}/basicdetails`);
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("BASIC_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      {formData?.program_beneficiaries?.status === "enrolled_ip_verified" ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <Box py={6} px={4} mb={5}>
          {/* Box */}
          {alert && (
            <Alert status="warning" alignItems={"start"} mb="3">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <BodyMedium>{alert}</BodyMedium>
              </HStack>
            </Alert>
          )}
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
                schema: schema || {},
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
                mt="3"
                type="submit"
                onPress={() => formRef?.current?.submit()}
              >
                {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
              </FrontEndTypo.Primarybutton>
            </Form>
          ) : (
            <></>
          )}
        </Box>
      )}
    </Layout>
  );
}
