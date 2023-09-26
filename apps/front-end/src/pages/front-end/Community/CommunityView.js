import { FrontEndTypo, Layout } from "@shiksha/common-lib";
import React from "react";
import {
  widgets,
  templates,
  FieldTemplate,
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  RadioBtn,
  CustomR,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";
import schema1 from "./CommunityForm";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Box, Button } from "native-base";

export default function CommunityView({ footerLinks }) {
  const { t } = useTranslation();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [schema, setSchema] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [addMore, setAddMore] = React.useState();

  const formRef = React.useRef();

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setSchema(properties[newSteps[0]]);
    }
  }, []);

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
  console.log(schema);
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

  const onAdd = () => {
    setFormData();
    setAddMore(true);
  };
  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };
  console.log(formData);
  const onSubmit = async (data) => {
    if (formData?.referencefullname?.contact_number.toString()?.length !== 10) {
      const newErrors = {
        contact_number: {
          __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
        },
      };
      setAddMore(false);
      setErrors(newErrors);
    }
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        leftIcon: <FrontEndTypo.H2>{t("Community Details")}</FrontEndTypo.H2>,
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <Box p="4">
        <Button variant={"link"} colorScheme="info">
          <FrontEndTypo.H3 color="blueText.400" underline bold onPress={onAdd}>
            {t("Add Communty member")}
          </FrontEndTypo.H3>
        </Button>

        <Form
          key={lang}
          ref={formRef}
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
            onSubmit,
            transformErrors,
          }}
        >
          <FrontEndTypo.Primarybutton p="4" mt="4">
            {t("SAVE")}
          </FrontEndTypo.Primarybutton>
          <FrontEndTypo.Secondarybutton
            p="4"
            mt="4"
            onPress={() => setAddMore()}
          >
            {t("CANCEL")}
          </FrontEndTypo.Secondarybutton>
        </Form>
      </Box>
    </Layout>
  );
}
