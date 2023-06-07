import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./exprerienceSchema.js";
import { Alert, Box, HStack } from "native-base";
import {
  facilitatorRegistryService,
  Layout,
  BodyMedium,
  filterObject,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  CustomR,
  RadioBtn,
  Aadhaar,
  BaseInputTemplate,
  ArrayFieldTemplate,
  CustomOTPBox,
  select,
  FileUpload,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";

// App
export default function App({ userTokenInfo }) {
  const { type } = useParams();
  const [schema, setSchema] = React.useState({});
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState(userTokenInfo?.authUser);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const nextPreviewStep = async () => {
    setAlert();
    if (index !== undefined) {
      navigate(`/profile/edit/upload`);
    }
  };

  React.useEffect(() => {
    setSchema(schema1);
  }, [type]);

  const formSubmitUpdate = async (data, overide) => {
    const { id } = formData;
    if (id) {
      setLoading(true);
      const result = await facilitatorRegistryService.profileStapeUpdate({
        ...data,
        ...(overide ? overide : {}),
        id: id,
      });
      setLoading(false);
      return result;
    }
  };

  const customValidate = (item, errors, c) => {
    ["role_title", "organization", "description"].forEach((key) => {
      if (item?.[key]) {
        if (
          !item?.[key]?.match(/^[a-zA-Z ]*$/g) ||
          item?.[key]?.replaceAll(" ", "") === ""
        ) {
          errors?.[key]?.addError(
            `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`
          );
        } else if (key === "description" && item?.[key].length > 200) {
          errors?.[key]?.addError(
            `${t("MAX_LENGHT_200")} ${t(schema?.properties?.[key]?.title)}`
          );
        }
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
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (_.isEmpty(errors)) {
      const newdata = filterObject(
        newFormData,
        Object.keys(schema?.properties)
      );
      const data = await formSubmitUpdate({
        ...newdata,
        page_type: "work_experience_details",
        type,
      });
      if (localStorage.getItem("backToProfile") === "false") {
        nextPreviewStep();
      } else {
        navigate("/profile");
      }
    }
  };

  const onClickSubmit = (backToProfile) => {
    if (formRef.current.validateForm()) {
      formRef?.current?.submit();
    }
    localStorage.setItem("backToProfile", backToProfile);
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        leftIcon: <FrontEndTypo.H2>{t(schema?.step_name)}</FrontEndTypo.H2>,
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
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
        <Form
          key={lang}
          ref={formRef}
          widgets={{
            RadioBtn,
            CustomR,
            Aadhaar,
            select,
            CustomOTPBox,
            FileUpload,
          }}
          templates={{
            FieldTemplate,
            ArrayFieldTitleTemplate,
            ObjectFieldTemplate,
            TitleFieldTemplate,
            DescriptionFieldTemplate,
            BaseInputTemplate,
            ArrayFieldTemplate,
          }}
          extraErrors={errors}
          showErrorList={false}
          noHtml5Validate={true}
          {...{
            validator,
            schema: schema ? schema : {},
            formData,
            customValidate,
            onChange,
            onSubmit,
            transformErrors,
          }}
        >
          <FrontEndTypo.Primarybutton
            isLoading={loading}
            p="4"
            mt="4"
            onPress={() => onClickSubmit(false)}
          >
            {t("SAVE_AND_NEXT")}
          </FrontEndTypo.Primarybutton>

          <FrontEndTypo.Secondarybutton
            isLoading={loading}
            p="4"
            mt="4"
            onPress={() => onClickSubmit(true)}
          >
            {t("SAVE_AND_PROFILE")}
          </FrontEndTypo.Secondarybutton>
        </Form>
      </Box>
    </Layout>
  );
}
