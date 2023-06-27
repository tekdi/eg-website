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
  enumRegistryService,
  validation,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { widgets, templates } from "component/BaseInput";
import { useTranslation } from "react-i18next";
import ItemComponent from "./ItemComponent.js";

// App
export default function App({ userTokenInfo, footerLinks }) {
  const { type } = useParams();
  const [schema, setSchema] = React.useState({});
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState();
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = React.useState();
  const [addMore, setAddMore] = React.useState();
  const [keys, setKeys] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const [enumObj, setEnumObj] = React.useState();
  const stepLabel =
    type === "reference_details"
      ? "REFERENCE_DETAILS"
      : type === "experience"
      ? "JOB_EXPERIENCE"
      : "ADD_VOLUNTEER_EXPERIENCE";

  const setpTitle = type === "experience" ? "JOB_TITLE" : "VOLUNTEER_TITLE";
  const nextPreviewStep = async (p = "n") => {
    setAlert();
    if (addMore) {
      setAddMore();
    } else if (p === "p") {
      navigate("/profile");

      // if (type === "vo_experience") {
      //   navigate(`/profile/edit/work_availability_details`);
      // } else if (type === "experience") {
      //   navigate(`/profile/edit/array-form/vo_experience`);
      // } else {
      //   navigate(`/profile/edit/reference_details`);
      // }
    } else if (type === "reference_details") {
      navigate(`/profile/edit/work_availability_details`);
    } else if (type === "vo_experience") {
      navigate(`/profile/edit/array-form/experience`);
    } else {
      navigate(`/profile/edit/qualification_details`);
    }
  };

  React.useEffect(async () => {
    const { id } = userTokenInfo?.authUser;
    if (schema1.type === "step") {
      const properties = schema1.properties;
      let newSchema1 =
        properties[
          ["vo_experience", "experience"].includes(type) ? "experience" : type
        ];
      if (newSchema1) {
        let newSchema = newSchema1;
        if (
          newSchema["properties"]?.["reference_details"]?.["properties"]?.[
            "document_id"
          ]
        ) {
          newSchema = getOptions(newSchema, {
            key: "reference_details",
            extra: getOptions(newSchema["properties"]?.["reference_details"], {
              key: "document_id",
              extra: {
                userId: id,
              },
            }),
          });
        }

        if (newSchema["properties"]?.["role_title"]) {
          newSchema = getOptions(newSchema, {
            key: "role_title",
            extra: { title: setpTitle },
          });
        }
        setSchema({ ...newSchema, title: stepLabel });
        const refPro =
          newSchema?.properties["reference_details"]?.["properties"];
        let newKeys = Object.keys(newSchema?.properties).filter(
          (e) => e !== "reference_details"
        );

        let newLabels = newKeys.map((e) =>
          newSchema?.properties?.[e]?.label
            ? newSchema?.properties?.[e]?.label
            : newSchema?.properties?.[e]?.title
            ? newSchema?.properties?.[e]?.title
            : ""
        );

        if (refPro) {
          let refKeys = Object.keys(refPro);
          newKeys = [...newKeys, ...refKeys];
          const refLabels = refKeys.map((e) =>
            refPro?.[e]?.label
              ? refPro?.[e]?.label
              : refPro?.[e]?.title
              ? refPro?.[e]?.title
              : ""
          );
          newLabels = [...newLabels, ...refLabels];
        }
        setLabels(newLabels);
        setKeys(newKeys);

        const ListOfEnum = await enumRegistryService.listOfEnum();
        if (!ListOfEnum?.error) {
          setEnumObj(ListOfEnum?.data);
        }
      }

      getData();
      setFormData();
      setAddMore();
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
    const { id } = userTokenInfo?.authUser;
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
    if (["experience", "vo_experience"].includes(type)) {
      if (schema?.properties?.reference_details?.properties?.contact_number) {
        if (item?.reference_details?.contact_number) {
          const result = validation({
            data: item?.reference_details?.contact_number,
            type: "mobile",
          });
          if (result) {
            errors?.reference_details?.contact_number?.addError(
              `${t("PLEASE_ENTER_VALID_10_DIGIT_NUMBER")}`
            );
          }
        }
      }
    }
    ["role_title", "organization", "description"].forEach((key) => {
      if (item?.[key]) {
        if (
          // !item?.[key]?.match(/^[a-zA-Z ]*$/g) ||
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
      } else if (["format", "type"].includes(error.name)) {
        const { format, type } = error?.params ? error?.params : {};
        let message = "REQUIRED_MESSAGE";
        if (["format", "type"].includes("email")) {
          message = "PLEASE_ENTER_VALID_EMAIL";
        } else if (["format", "type"].includes("string")) {
          message = "PLEASE_ENTER_VALID_STREING";
        } else if (["format", "type"].includes("number")) {
          message = "PLEASE_ENTER_VALID_NUMBER";
        }

        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t(message)} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t(message)}`;
        }
      }
      return error;
    });
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    const user = userTokenInfo?.authUser;
    setErrors();
    if (id === "root_reference_details_type_of_document") {
      let newSchema = schema;
      setLoading(true);
      if (
        newSchema["properties"]?.["reference_details"]?.["properties"]?.[
          "document_id"
        ]
      ) {
        newSchema = getOptions(newSchema, {
          key: "reference_details",
          extra: getOptions(newSchema["properties"]?.["reference_details"], {
            key: "document_id",
            extra: {
              userId: user.id,
              document_type: data?.reference_details?.type_of_document,
            },
          }),
        });
      }
      setLoading(false);
      setSchema(newSchema);
    }

    const newData = { ...formData, ...data };
    setFormData(newData);
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (_.isEmpty(errors)) {
      const newdata = filterObject(newFormData, [
        ...Object.keys(schema?.properties),
        "arr_id",
      ]);
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

  const onAdd = () => {
    setFormData();
    setAddMore(true);
  };

  const onEdit = (item) => {
    setFormData({
      ...item,
      reference_details: item?.reference ? item?.reference : {},
      arr_id: item?.id,
    });
    setAddMore(true);
  };

  const onDelete = async (id) => {
    if (type === "reference_details") {
      const result = await facilitatorRegistryService.referenceDelete({ id });
    } else {
      const result = await facilitatorRegistryService.experienceDelete({ id });
    }
    setData(data.filter((e) => e.id !== id));
  };

  const onClickSubmit = (data) => {
    if (!data) {
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
      _footer={{ menues: footerLinks }}
    >
      <Box py={6} px={4} mb={5}>
        {!addMore ? (
          <VStack space={"4"}>
            {data &&
              data.constructor.name === "Array" &&
              data?.map((item, index) => {
                const { name, contact_number, type_of_document, document_id } =
                  item?.reference ? item?.reference : {};
                return (
                  <Box key={index}>
                    <ItemComponent
                      schema={schema}
                      index={index + 1}
                      item={{
                        ...item,
                        ...(item?.reference?.constructor.name === "Object"
                          ? {
                              name,
                              contact_number,
                              type_of_document,
                              document_id,
                            }
                          : {}),
                      }}
                      onEdit={(e) => onEdit(e)}
                      onDelete={(e) => onDelete(e.id)}
                      arr={keys}
                      label={labels}
                    />
                  </Box>
                );
              })}
            <Button variant={"link"} colorScheme="info" onPress={onAdd}>
              <FrontEndTypo.H3 color="blueText.400" underline bold>
                {`${t(stepLabel)}`}
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
              extraErrors={errors}
              showErrorList={false}
              noHtml5Validate={true}
              {...{
                widgets,
                templates,
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
              <FrontEndTypo.Secondarybutton
                isLoading={loading}
                p="4"
                mt="4"
                onPress={() => setAddMore()}
              >
                {t("CANCEL")}
              </FrontEndTypo.Secondarybutton>
            </Form>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
