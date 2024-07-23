import React, { useRef, useState, useEffect } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./Schema/SchemaAdhaar.js";
import { Alert, Box, HStack, Modal, VStack, TextArea } from "native-base";
import {
  facilitatorRegistryService,
  Layout,
  BodyMedium,
  CustomOTPBox,
  FrontEndTypo,
  IconByName,
  AgRegistryService,
  benificiaryRegistoryService,
} from "@shiksha/common-lib";
import PropTypes from "prop-types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
} from "../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";
import AadhaarNumberValidation from "../PrerakOnboardingDetail/AadhaarNumberValidation.js";

// App

export default function LearnerAdhaar({ userTokenInfo, footerLinks }) {
  const textAreaRef = useRef();
  const [textVisible, setTextVisible] = useState(false);
  const { t } = useTranslation();
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const [submitBtn, setSubmitBtn] = useState();
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [userId, setUserId] = useState();
  const [isExistflag, setIsExistflag] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const id = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUserId(id?.id);
    const fetchData = async () => {
      if (userId) {
        let data = await benificiaryRegistoryService.getOne(userId);

        setFormData({
          aadhar_no: data?.result?.aadhar_no,
          edit_page_type: "add_ag_duplication",
          is_duplicate: "no",
        });
      }
    };
    fetchData();
  }, [userId]);

  const onPressBackButton = async () => {
    const route = location?.state?.route;
    if (route) {
      navigate(`/beneficiary/${userId}/aadhaardetails`, {
        state: { id: userId, route: true },
      });
    } else {
      navigate(`/beneficiary/${userId}/2`, {
        state: { id: userId, route: true },
      });
    }
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

  useEffect(() => {
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
      const validation = AadhaarNumberValidation({ aadhaar: data?.aadhar_no });
      if (validation) {
        errors?.aadhar_no?.addError(`${t(validation)}`);
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
        if (result?.registeredAsFacilitator) {
          setIsExistflag("registeredAsFacilitator");
        } else if (result?.underSameFacilitator) {
          setIsExistflag("underSameFacilitator");
        } else if (result?.registeredAsBeneficiaries) {
          setIsExistflag("registeredAsBeneficiaries");
        } else {
          setIsExistflag();
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
    await AgRegistryService.updateAg(adddata, userId);
    navigate(`/dashboard`);
  };

  useEffect(() => {
    if (!isExistflag) {
      setFormData({
        ...formData,
        aadhar_no: formData?.aadhar_no,
        is_duplicate: "no",
      });
    }
  }, [formData?.aadhar_no]);

  const onSubmit = () => {
    setIsDisable(true);
    if (isExistflag === "registeredAsFacilitator") {
      setModalVisible(true);
      setIsDisable(false);
    } else if (isExistflag === "underSameFacilitator") {
      setIsDisable(false);
      setModalVisible(true);
    } else if (isExistflag === "registeredAsBeneficiaries") {
      setFormData({
        ...formData,
        aadhar_no: formData?.aadhar_no,
        is_duplicate: "yes",
      });
      setIsDisable(false);
      setModalVisible(true);
    } else if (!isExistflag) {
      addAdhaar();
    }
  };

  const addAdhaarduplicate = async () => {
    setIsDisable(true);
    const text = textAreaRef.current.value;
    if (text !== "") {
      await AgRegistryService.updateAg(formData, userId);
      navigate(`/aadhaar-kyc/${userId}`, {
        state: { aadhar_no: formData?.aadhar_no },
      });
      setTextVisible(false);
      setAddmodal(!addmodal);
    } else {
      setIsDisable(false);
      setTextVisible(true);
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <Box py={6} px={4} mb={5}>
        {alert && (
          <Alert status="warning" alignItems={"start"} mb="3">
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <BodyMedium>{alert}</BodyMedium>
            </HStack>
          </Alert>
        )}

        {page && page !== "" && (
          <Form
            key={lang}
            ref={formRef}
            widgets={{ RadioBtn, CustomR, CustomOTPBox, Aadhaar }}
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
                isDisabled={isDisable}
                mt="5"
                type="submit"
                onPress={() => formRef?.current?.submit()}
              >
                {pages[pages?.length - 1] === page
                  ? t("SAVE_AND_HOME")
                  : submitBtn}
              </FrontEndTypo.Primarybutton>
            )}
          </Form>
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
                size="25px"
              />
              {isExistflag === "registeredAsFacilitator" && (
                <FrontEndTypo.H2 color="textGreyColor.600" pl="2">
                  {t("SAME_PRERAK_AADHAAR_NUMBER_MESSAGE")}
                </FrontEndTypo.H2>
              )}
              {isExistflag === "underSameFacilitator" && (
                <FrontEndTypo.H2 color="textGreyColor.600" pl="2">
                  {t("AG_LEARNER_ALREADY_IDENTIFIED")}
                </FrontEndTypo.H2>
              )}
            </HStack>
            {isExistflag === "registeredAsBeneficiaries" && (
              <VStack pt="3">
                <FrontEndTypo.H2 color="textGreyColor.600">
                  {t("AG_LEARNER_ALREADY_IDENTIFIED_DES")}
                </FrontEndTypo.H2>
              </VStack>
            )}
          </Modal.Body>
          <Modal.Footer>
            {isExistflag === "registeredAsBeneficiaries" ? (
              <React.Fragment>
                <FrontEndTypo.Primarybutton
                  py="2"
                  width="100%"
                  onPress={() => {
                    setAddmodal(!addmodal);
                    setModalVisible(!modalVisible);
                  }}
                >
                  {t("CONTINUE_ADDING")}
                </FrontEndTypo.Primarybutton>
                <FrontEndTypo.Secondarybutton
                  width="100%"
                  marginTop={"1em"}
                  onPress={() => navigate(`/beneficiary/${userId}`)}
                >
                  {t("CANCEL_AND_GO_TO_PROFILE")}
                </FrontEndTypo.Secondarybutton>
              </React.Fragment>
            ) : (
              <FrontEndTypo.Secondarybutton
                width="100%"
                marginTop={"1em"}
                onPress={() => setModalVisible(false)}
              >
                {t("CANCEL_AND_GO_BACK")}
              </FrontEndTypo.Secondarybutton>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={addmodal} onClose={() => setAddmodal(false)} size="md">
        <Modal.Content py="0">
          <Modal.Body>
            <VStack alignItems={"center"}>
              <IconByName
                name="CheckboxCircleLineIcon"
                color="textGreyColor.150"
                _icon={{ size: "50px" }}
              />
              <FrontEndTypo.H1
                pb="2"
                color="worksheetBoxText.400"
                fontWeight={"600"}
              >
                {t("AG_ADDED_SUCCESSFULLY")}
              </FrontEndTypo.H1>
              <TextArea
                ref={textAreaRef}
                placeholder="Explain your claim of the AG Learner*"
                w="100%"
                onChange={(e) => {
                  getReason(e);
                  setTextVisible(false);
                }}
              />
              {textVisible && (
                <FrontEndTypo.H2 color={"danger.500"}>
                  {t("REQUIRED_MESSAGE")}
                </FrontEndTypo.H2>
              )}
              <FrontEndTypo.Primarybutton
                isDisabled={isDisable}
                width={250}
                marginTop={"1em"}
                onPress={() => {
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

LearnerAdhaar.propTypes = {
  userTokenInfo: PropTypes.any,
  footerLinks: PropTypes.any,
};
