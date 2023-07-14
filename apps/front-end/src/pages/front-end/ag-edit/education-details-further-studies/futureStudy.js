import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./futureStudySchema.js";
import { Alert, Box, HStack } from "native-base";
import {
  AgRegistryService,
  Layout,
  BodyMedium,
  benificiaryRegistoryService,
  enumRegistryService,
  FrontEndTypo,
  getOptions,
  filterObject,
  getUniqueArray,
  Loading,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { widgets, templates } from "../../../../component/BaseInput";
import { useTranslation } from "react-i18next";

// App

export default function AgformUpdate({ userTokenInfo }) {
  const { authUser } = userTokenInfo;
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const [userId, setuserId] = React.useState(id);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/educationdetails`);
  };
  const ref = React.createRef(null);

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    const properties = schema1.properties;
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else if (page == "1") {
        navigate("/beneficiary", { state: { id: userId } });
      } else {
        nextIndex = pages[index - 1];
      }
      if (nextIndex !== undefined) {
        setPage(nextIndex);
        setSchema(properties[nextIndex]);
      } else if (pageStape.toLowerCase() === "n") {
        setPage("upload");
      } else {
        return true;
      }
    }
  };

  React.useEffect(async () => {
    setLoading(true);
    setFormData({ ...formData, edit_page_type: "add_contact" });
    setLoading(false);
  }, [page]);

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

  // Type Of Student

  React.useEffect(async () => {
    setLoading(true);
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      let newSchema = properties[newSteps[0]];
      setPage(newSteps[0]);
      setPages(newSteps);
      setSubmitBtn(t("NEXT"));
      const career_aspiration = await enumRegistryService.listOfEnum();
      if (newSchema["properties"]?.["career_aspiration"]) {
        newSchema = getOptions(newSchema, {
          key: "career_aspiration",
          arr: career_aspiration?.data?.CAREER_ASPIRATION,
          title: "title",
          value: "value",
        });
      }

      if (newSchema?.["properties"]?.["aspiration_mapping"]) {
        newSchema = getOptions(newSchema, {
          key: "aspiration_mapping",
          extra: getOptions(newSchema?.["properties"]?.["aspiration_mapping"], {
            key: "learning_motivation",
            arr: career_aspiration.data?.LEARNING_MOTIVATION,
            title: "title",
            value: "value",
          }),
        });
      }
      newSchema = getOptions(newSchema, {
        key: "aspiration_mapping",
        extra: getOptions(newSchema["properties"]?.["aspiration_mapping"], {
          key: "type_of_support_needed",
          arr: career_aspiration.data?.TYPE_OF_SUPPORT_NEEDED,
          title: "title",
          value: "value",
        }),
      });

      setSchema(newSchema);
    }
    const { result } = await benificiaryRegistoryService.getOne(userId);
    if (result) {
      setFormData({
        ...formData,
        career_aspiration_details:
          result?.core_beneficiaries?.career_aspiration_details,
        career_aspiration: result?.core_beneficiaries?.career_aspiration,
        aspiration_mapping: {
          learning_motivation: getUniqueArray(
            result?.program_beneficiaries?.learning_motivation
          ),
          type_of_support_needed: getUniqueArray(
            result?.program_beneficiaries?.type_of_support_needed
          ),
        },
      });
    }
    setLoading(false);
  }, []);

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        const data = schema1["properties"][e]["properties"][key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const transformErrors = (errors, uiSchema) => {
    console.log(errors);
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
    if (id === "root_mobile") {
      if (data?.mobile?.toString()?.length === 10) {
        const result = await userExist({ mobile: data?.mobile });
        if (result.isUserExist) {
          const newErrors = {
            mobile: {
              __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        }
      }
    }
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    const newdata = filterObject(newFormData, Object.keys(schema?.properties));
    const updateDetails = await AgRegistryService.updateAg(newdata, userId);
    if (updateDetails) {
      navigate(`/beneficiary/${userId}/educationdetails`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo"],
        name: t("LEARNER_ASPIRATION"),
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

        {page && page !== "" ? (
          <Form
            key={lang}
            ref={formRef}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            uiSchema={{
              career_aspiration: {
                "ui:widget": "RadioBtn",
              },
              aspiration_mapping: {
                learning_motivation: {
                  "ui:widget": "MultiCheck",
                },
                type_of_support_needed: {
                  "ui:widget": "MultiCheck",
                },
              },
            }}
            {...{
              widgets,
              templates,
              validator,
              schema: schema ? schema : {},
              formData,
              onChange,
              onError,
              transformErrors,
              onSubmit,
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
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
