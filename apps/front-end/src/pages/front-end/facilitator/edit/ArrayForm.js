import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./arraySchema.js";
import { Alert, Box, Button, HStack, VStack } from "native-base";
import {
  facilitatorRegistryService,
  Layout,
  BodyMedium,
  filterObject,
  FrontEndTypo,
  getOptions,
  IconByName,
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
  const [data, setData] = React.useState();
  const [addMore, setAddMore] = React.useState();
  const stepLabel =
    type === "reference_details"
      ? "REFERENCE_DETAILS"
      : type === "experience"
      ? "JOB_EXPERIENCE"
      : "VOLUNTEER_EXPERIENCE";

  const nextPreviewStep = async (p = "n") => {
    setAlert();
    if (addMore) {
      setAddMore();
    } else if (p === "p") {
      if (type === "vo_experience") {
        navigate(`/profile/edit/work_availability_details`);
      } else if (type === "experience") {
        navigate(`/profile/edit/array-form/vo_experience`);
      } else {
        navigate(`/profile/edit/personal_details`);
      }
    } else if (type === "reference_details") {
      navigate(`/profile/edit/work_availability_details`);
    } else if (type === "vo_experience") {
      navigate(`/profile/edit/array-form/experience`);
    } else {
      navigate(`/profile/edit/qualification_details`);
    }
  };

  React.useEffect(async () => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      let newSchema1 = properties[type];
      if (newSchema1) {
        let newSchema = newSchema1;
        if (newSchema1?.properties?.document_id) {
          setLoading(true);
          if (newSchema["properties"]["document_id"]) {
            newSchema = getOptions(newSchema, {
              key: "document_id",
              extra: { userId: formData?.id },
            });
          }
          setLoading(false);
        }
        setSchema(newSchema);
      }

      getData();
    }
  }, [type]);

  const getData = async () => {
    const { id } = userTokenInfo?.authUser;
    if (id) {
      const result = await facilitatorRegistryService.getOne({ id });
      if (type === "reference_details") {
        setData(result?.references);
      } else if (type === "vo_experience") {
        setData(result?.vo_experience);
      } else if (type === "experience") {
        setData(result?.experience);
      }
    }
  };

  const formSubmitUpdate = async (data, overide) => {
    const { id } = formData;
    if (id) {
      setLoading(true);
      const result = await facilitatorRegistryService.profileStapeUpdate({
        ...data,
        ...(overide ? overide : {}),
        id: id,
      });
      getData();
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
        page_type:
          type === "reference_details"
            ? "reference_details"
            : "work_experience_details",
        type,
      });
      setAddMore(false);
    }
  };

  const dataDelete = async (id) => {
    if (type === "reference_details") {
      const result = await facilitatorRegistryService.referenceDelete({ id });
    } else {
      const result = await facilitatorRegistryService.experienceDelete({ id });
    }
    setData(data.filter((e) => e.id !== id));
  };

  const onClickSubmit = () => {
    if (localStorage.getItem("backToProfile") === "false") {
      nextPreviewStep();
    } else {
      navigate("/profile");
    }
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        leftIcon: <FrontEndTypo.H2>{t(stepLabel)}</FrontEndTypo.H2>,
        lang,
        setLang,
        onPressBackButton: (e) => nextPreviewStep("p"),
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
        {!addMore ? (
          <VStack>
            {data &&
              data.constructor.name === "Array" &&
              data?.map((item, index) => (
                <Box key={index}>
                  {Object.keys(item)?.map((subItem) => (
                    <spam>
                      {typeof item?.[subItem] === "string"
                        ? item?.[subItem]
                        : "-"}
                    </spam>
                  ))}
                  <IconByName
                    color="textMaroonColor.400"
                    name="DeleteBinLineIcon"
                    onPress={(e) => dataDelete(item?.id)}
                  />
                </Box>
              ))}
            <Button
              variant={"link"}
              colorScheme="info"
              onPress={(e) => {
                setAddMore(true);
              }}
            >
              <FrontEndTypo.H3 color="blueText.400" underline bold>
                {`${t("ADD")} ${t(stepLabel)}`}
              </FrontEndTypo.H3>
            </Button>
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
          </VStack>
        ) : (
          <Box>
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
        )}
      </Box>
    </Layout>
  );
}
