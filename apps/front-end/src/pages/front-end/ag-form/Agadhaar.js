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
  TextArea,
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
  IconByName,
  AgRegistryService,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";

import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  Aadhaar,
} from "../../../component/BaseInput";
import { useScreenshot } from "use-screenshot-hook";
import Success from "../Success.js";

// App

export default function Agform({ userTokenInfo, footerLinks }) {
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
  const [isExistflag, setisExistflag] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [addmodal, setaddmodal] = React.useState(false);
  const [beneficiaryData, setBeneficiaryData] = React.useState({});
  const id = useParams();
  const navigate = useNavigate();

  React.useEffect(async () => {
    setuserId(id?.id);
    if (userId) {
      let data = await benificiaryRegistoryService.getOne(userId);

      setFormData({
        aadhar_no: data?.result?.aadhar_no,
        aadhar_no: data?.result?.aadhar_no,
        edit_page_type: "add_ag_duplication",
        is_duplicate: "no",
      });
    }
  }, [userId]);
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
    if (!data?.aadhar_no) {
      errors?.aadhar_no?.addError(
        `${t(
          "AADHAAR_FIRST_NUMBER_SHOULD_BE_GREATER_THAN_1_AND_12_DIGIT_VALID_NUMBER"
        )}`
      );
    }
    if (data?.aadhar_no) {
      if (
        data?.aadhar_no &&
        !`${data?.aadhar_no}`?.match(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/)
      ) {
        errors?.aadhar_no?.addError(
          `${t(
            "AADHAAR_FIRST_NUMBER_SHOULD_BE_GREATER_THAN_1_AND_12_DIGIT_VALID_NUMBER"
          )}`
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
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_aadhar_no") {
      if (data?.aadhar_no?.toString()?.length === 12) {
        const result = await userExist({ aadhar_no: data?.aadhar_no });
        if (result.isUserExist) {
          setisExistflag(true);
        } else {
          setisExistflag(false);
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

  const getReason = (e) => {
    const value = e?.nativeEvent?.text;
    setFormData({
      ...formData,
      duplicate_reason: value,
    });
  };

  const addAdhaar = async () => {
    let adddata = {
      edit_page_type: "add_ag_duplication",
      aadhar_no: formData?.aadhar_no,
      is_duplicate: "no",
    };
    const adhaar = await AgRegistryService.updateAg(adddata, userId);
    navigate(`/aadhaar-kyc/${userId}`, {
      state: { aadhar_no: formData?.aadhar_no, pathname: "/beneficiary/list" },
    });
  };

  React.useEffect(() => {
    if (!isExistflag) {
      setFormData({
        ...formData,
        aadhar_no: formData?.aadhar_no,
        is_duplicate: "no",
      });
    }
  }, [formData?.aadhar_no]);
  const onSubmit = () => {
    if (isExistflag) {
      setFormData({
        ...formData,
        aadhar_no: formData?.aadhar_no,
        is_duplicate: "yes",
      });
      setModalVisible(!modalVisible);
    } else {
      addAdhaar();
    }
  };

  const addAdhaarduplicate = async () => {
    const adhaarduplicate = await AgRegistryService.updateAg(formData, userId);
    navigate(`/aadhaar-kyc/${userId}`, {
      state: { aadhar_no: formData?.aadhar_no },
    });
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton: (e) => {
          navigate(`/beneficiary/${userId}/2`, {
            state: { id: userId, route: true },
          });
        },
        onlyIconsShow: ["backBtn", "userInfo"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
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
            widgets={{ RadioBtn, CustomR, CustomOTPBox, Aadhaar }}
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
            {errors?.aadhar_no ? (
              <FrontEndTypo.Primarybutton
                mt="5"
                type="submit"
                onPress={() =>
                  navigate(`/beneficiary/${userId}/4`, {
                    state: { id: userId },
                  })
                }
              >
                {pages[pages?.length - 1] === page ? t("NEXT") : submitBtn}
              </FrontEndTypo.Primarybutton>
            ) : (
              <FrontEndTypo.Primarybutton
                mt="5"
                type="submit"
                onPress={() => formRef?.current?.submit()}
              >
                {pages[pages?.length - 1] === page ? t("NEXT") : submitBtn}
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

      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        size="md"
      >
        <Modal.Content>
          <Modal.Body py={10}>
            <HStack mx={"auto"} alignItems={"top"}>
              <IconByName
                name="ErrorWarningLineIcon"
                color="textRed.300"
                size="20px"
              ></IconByName>
              <FrontEndTypo.H2 color="textGreyColor.600" pl="2">
                {t("AG_LEARNER_ALREADY_IDENTIFIED")}
              </FrontEndTypo.H2>
            </HStack>
            <VStack pt="3">
              <FrontEndTypo.H5 color="textGreyColor.600">
                {t("AG_LEARNER_ALREADY_IDENTIFIED_DES")}
              </FrontEndTypo.H5>
            </VStack>
            <FrontEndTypo.Primarybutton
              py="2"
              width="100%"
              marginTop={"2em"}
              onPress={() => {
                setaddmodal(!addmodal);
                setModalVisible(!modalVisible);
              }}
            >
              {t("CONTINUE_ADDING")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              width="100%"
              marginTop={"1em"}
              onPress={() => setModalVisible(!modalVisible)}
            >
              {t("CANCEL_AND_GO_BACK")}
            </FrontEndTypo.Secondarybutton>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal isOpen={addmodal} onClose={() => setaddmodal(false)} size="md">
        <Modal.Content py="0">
          <Modal.Body>
            <VStack alignItems={"center"}>
              <IconByName
                name="CheckboxCircleLineIcon"
                color="textGreyColor.150"
                _icon={{ size: "50px" }}
              />
              <FrontEndTypo.H1 pb="2" color="worksheetBoxText.400" bold>
                {t("AG_ADDED_SUCCESSFULLY")}
              </FrontEndTypo.H1>
              <TextArea
                placeholder="Explain your claim of the AG Learner*"
                w="100%"
                onChange={(e) => {
                  getReason(e);
                }}
              />
              <FrontEndTypo.Primarybutton
                width={250}
                marginTop={"1em"}
                onPress={() => {
                  setaddmodal(!addmodal);
                  addAdhaarduplicate();
                }}
              >
                {t("SEND")}
              </FrontEndTypo.Primarybutton>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
