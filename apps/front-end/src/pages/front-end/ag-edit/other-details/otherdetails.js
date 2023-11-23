import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./otherdetailsSchema.js";
import { Alert, Box, HStack } from "native-base";
import {
  AgRegistryService,
  Layout,
  t,
  filtersByObject,
  BodyMedium,
  CustomOTPBox,
  benificiaryRegistoryService,
  enumRegistryService,
  FrontEndTypo,
} from "@shiksha/common-lib";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import Clipboard from "component/Clipboard.js";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  RadioBtn,
  CustomR,
  select,
} from "../../../../component/BaseInput.js";

import { useLocation } from "react-router-dom";

// App

export default function AgformUpdate({ userTokenInfo }) {
  const { authUser } = userTokenInfo;
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [cameraModal, setCameraModal] = React.useState(false);
  const [credentials, setCredentials] = React.useState();
  const [cameraUrl, setCameraUrl] = React.useState();
  const [submitBtn, setSubmitBtn] = React.useState();
  const [addBtn, setAddBtn] = React.useState(t("YES"));
  const formRef = React.useRef();
  const uplodInputRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const [userId, setuserId] = React.useState(id);

  const location = useLocation();

  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/educationdetails`);
  };
  const ref = React.createRef(null);

  const updateData = (data, deleteData = false) => {};

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
        await formSubmitUpdate({ ...formData, form_step_number: "13" });
        setPage("upload");
      } else {
        return true;
      }
    }
  };

  React.useEffect(async () => {
    setFormData({ ...formData, edit_page_type: "add_contact" });
    if (page === "2") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "add_address" });
    } else if (page === "3") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "personal" });
    } else if (page === "4") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
      setFormData({ ...formData, edit_page_type: "add_education" });
    } else if (page === "upload") {
      const updateDetails = await AgRegistryService.updateAg(formData, userId);
    }
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

  const getOptions = (schema, { key, arr, title, value, filters } = {}) => {
    let enumObj = {};
    let arrData = arr;
    if (!_.isEmpty(filters)) {
      arrData = filtersByObject(arr, filters);
    }
    enumObj = {
      ...enumObj,
      ["enumNames"]: arrData.map((e) => `${e?.[title]}`),
    };
    enumObj = { ...enumObj, ["enum"]: arrData.map((e) => `${e?.[value]}`) };
    const newProperties = schema["properties"][key];
    let properties = {};
    if (newProperties) {
      if (newProperties.enum) delete newProperties.enum;
      let { enumNames, ...remainData } = newProperties;
      properties = remainData;
    }
    return {
      ...schema,
      ["properties"]: {
        ...schema["properties"],
        [key]: {
          ...properties,
          ...(_.isEmpty(arr) ? {} : enumObj),
        },
      },
    };
  };

  // Type Of Student

  React.useEffect(async () => {
    const ListOfEnum = await enumRegistryService.listOfEnum();
    let newSchema = schema;
    if (schema["properties"]["learning_motivation"]) {
      newSchema = getOptions(newSchema, {
        key: "learning_motivation",
        arr: ListOfEnum?.data?.LEARNING_MOTIVATION,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
        key: "type_of_support_needed",
        arr: ListOfEnum?.data?.TYPE_OF_SUPPORT_NEEDED,
        title: "title",
        value: "value",
      });
    }

    setSchema(newSchema);
  }, [formData]);

  React.useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
  }, []);

  React.useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(userId);
    let learning_motivation =
      qData?.result?.program_beneficiaries?.learning_motivation;
    let type_of_support_needed =
      qData?.result?.program_beneficiaries?.type_of_support_needed;

    setFormData({
      ...formData,
      type_of_support_needed: type_of_support_needed,
      learning_motivation: learning_motivation,
    });
  }, []);

  const formSubmitUpdate = async (formData) => {
    const { id } = authUser;

    if (id) {
      updateData({}, true);
    }
  };

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
    updateData(newData);
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

  const EditEducation = async (data) => {
    const updateDetails = await AgRegistryService.updateAg(formData, userId);
    if (updateDetails) {
      navigate(`/beneficiary/${userId}/educationdetails`);
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
        name: t("OTHER_DETAILS"),
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
            key={lang + addBtn}
            ref={formRef}
            widgets={{ RadioBtn, CustomR, CustomOTPBox, select }}
            templates={{
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              BaseInputTemplate,
              DescriptionFieldTemplate,
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
              transformErrors,
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              type="submit"
              onPress={() => EditEducation()}
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
