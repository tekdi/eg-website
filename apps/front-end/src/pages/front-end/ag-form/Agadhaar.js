import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "../ag-form/parts/SchemaAdhaar.js";
import {
  Alert,
  Box,
  Button,
  Center,
  HStack,
  Image,
  Modal,
  Radio,
  Stack,
  VStack,
  Text,
} from "native-base";
import CustomRadio from "../../../component/CustomRadio";
import Steper from "../../../component/Steper";
import {
  facilitatorRegistryService,
  Layout,
  t,
  BodyMedium,
  CustomOTPBox,
  FrontEndTypo,
} from "@shiksha/common-lib";

import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
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
} from "../../../component/BaseInput";
import { useScreenshot } from "use-screenshot-hook";
import Success from "../Success.js";

// App

export default function Agform({ userTokenInfo }) {
  const { authUser } = userTokenInfo;
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const [addBtn, setAddBtn] = React.useState(t("YES"));
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [userId, setuserId] = React.useState();

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setuserId(location?.state?.id);
  }, []);

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
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

  const userExist = async (filters) => {
    return await facilitatorRegistryService.isExist(filters);
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

  const customValidate = (data, errors, c) => {
    if (data?.aadhar_token) {
      if (
        data?.aadhar_token &&
        !`${data?.aadhar_token}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
      ) {
        errors?.aadhar_token?.addError(
          `${t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER")}`
        );
      }
    }

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
    console.log("data", data);
    console.log("ee", id);
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_aadhar_token") {
      if (data?.aadhar_token?.toString()?.length === 12) {
        const result = await userExist({ aadhar_token: data?.aadhar_token });
        if (result.isUserExist) {
          const newErrors = {
            aadhar_token: {
              __errors: [t("AADHAAR_NUMBER_ALREADY_EXISTS")],
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

  console.log("error", errors);

  const onSubmit = () => {
    navigate(`/beneficiary/${userId}/profile`);
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton: (e) => {
          navigate("/beneficiary/2", { state: { id: userId, page: "5" } });
        },
        onlyIconsShow: ["backBtn", "userInfo"],
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
            widgets={{ RadioBtn, CustomR, CustomOTPBox }}
            templates={{
              FieldTemplate,
              ArrayFieldTitleTemplate,
              ObjectFieldTemplate,
              TitleFieldTemplate,
              BaseInputTemplate,
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
              customValidate,
              onChange,
              onError,
              onSubmit,
              transformErrors,
            }}
          >
            {errors?.aadhar_token ? (
              <FrontEndTypo.Primarybutton
                mt="5"
                type="submit"
                onPress={() =>
                  navigate("/beneficiary/4", { state: { id: userId } })
                }
              >
                {pages[pages?.length - 1] === page ? "NEXT" : submitBtn}
              </FrontEndTypo.Primarybutton>
            ) : (
              <FrontEndTypo.Primarybutton
                mt="5"
                type="submit"
                onPress={() => formRef?.current?.submit()}
              >
                {pages[pages?.length - 1] === page ? "NEXT" : submitBtn}
              </FrontEndTypo.Primarybutton>
            )}
            {/* <Button
              mt="5"
              variant={"primary"}
              type="submit"
              onPress={() => formRef?.current?.submit()}
            >
              {pages[pages?.length - 1] === page ? "NEXT" : submitBtn}
            </Button> */}
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
