import React, { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import { Alert, Box, HStack, Image, Modal, VStack } from "native-base";
import {
  Layout,
  enumRegistryService,
  benificiaryRegistoryService,
  FrontEndTypo,
  getOptions,
  getArray,
  filterObject,
  enrollmentDateOfBirth,
  getUiSchema,
  BodyMedium,
  getSelectedProgramId,
  getEnrollmentIds,
} from "@shiksha/common-lib";
//updateSchemaEnum
import moment from "moment";
import validator from "@rjsf/validator-ajv8";
import { useNavigate, useParams } from "react-router-dom";
import {
  widgets,
  templates,
  onError,
  transformErrors,
  scrollToField,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import PropTypes from "prop-types";

const setSchemaByStatus = async (data, fixedSchema, page) => {
  let { state_name } = await getSelectedProgramId();
  const properties = schema1.properties;
  const constantSchema = fixedSchema;
  const {
    enrollment_status,
    payment_receipt_document_id,
    application_login_id,
    application_form,
  } = fixedSchema?.properties || {};
  let newSchema = {};
  let newData = {};
  [
    "enrollment_status",
    "enrolled_for_board",
    "enrollment_number",
    // "enrollment_aadhaar_no",
    "enrollment_mobile_no",
    "enrollment_date",
    "subjects",
    "payment_receipt_document_id",
    "application_form",
    "application_login_id",
  ].forEach((e) => {
    if (e === "subjects") {
      newData = { ...newData, [e]: getArray(data?.[e]) };
    } else newData = { ...newData, [e]: data?.[e] };
  });

  switch (data?.enrollment_status) {
    case "ready_to_enroll":
      newSchema = {
        ...constantSchema,
        properties: {
          enrollment_status,
        },
        required: ["enrollment_status"],
      };
      newData = {
        enrollment_status: data?.enrollment_status,
        subjects: [],
      };
      break;

    case "enrollment_awaited":
    case "enrollment_rejected":
      const { enrolled_for_board } = constantSchema?.properties || {};
      const required = constantSchema?.required.filter(
        (item) =>
          ![
            "enrollment_number",
            "enrollment_date",
            "subjects",
            // "enrollment_aadhaar_no",
            "enrollment_mobile_no",
            "payment_receipt_document_id",
            "application_form",
            "application_login_id",
          ].includes(item)
      );
      newSchema = {
        ...constantSchema,
        properties: {
          enrollment_status,
          enrolled_for_board,
        },
        required,
      };
      newData = {
        enrollment_status: data?.enrollment_status,
        enrolled_for_board: data?.enrolled_for_board,
      };
      break;

    default:
      if (data?.enrolled_for_board) {
        if (state_name === "BIHAR") {
          newSchema = {
            ...constantSchema,
            properties: {
              ...constantSchema?.properties,
              enrollment_status,
              payment_receipt_document_id,
              application_form,
              application_login_id,
            },
            required: [
              "enrollment_status",
              "enrolled_for_board",
              "enrollment_number",
              // "enrollment_aadhaar_no",
              "enrollment_mobile_no",
              "enrollment_date",
              "subjects",
              "payment_receipt_document_id",
              "application_form",
              "application_login_id",
            ],
          };
        } else {
          newSchema = {
            ...constantSchema,
            properties: {
              ...constantSchema?.properties,
              enrollment_status,
              payment_receipt_document_id,
            },
          };
        }

        newSchema = await getSubjects(
          newSchema,
          data?.enrolled_for_board,
          page
        );
      } else {
        const { subjects, ...properties } = constantSchema?.properties || {};
        if (state_name === "BIHAR") {
          newSchema = {
            ...constantSchema,
            properties: {
              ...constantSchema?.properties,
              enrollment_status,
              payment_receipt_document_id,
              application_form,
              application_login_id,
            },
            required: [
              "enrollment_status",
              "enrolled_for_board",
              "enrollment_number",
              // "enrollment_aadhaar_no",
              "enrollment_mobile_no",
              "enrollment_date",
              "subjects",
              "payment_receipt_document_id",
              "application_form",
              "application_login_id",
            ],
          };
        } else {
          newSchema = {
            ...constantSchema,
            properties: {
              ...constantSchema?.properties,
              enrollment_status,
              payment_receipt_document_id,
            },
            required: [
              "enrollment_status",
              "enrolled_for_board",
              "enrollment_number",
              // "enrollment_aadhaar_no",
              "enrollment_mobile_no",
              "enrollment_date",
              "subjects",
              "payment_receipt_document_id",
              // "application_form",
              // "application_login_id",
            ],
          };
        }
      }
      break;
  }
  return { newSchema, newData };
};

const getSubjects = async (schemaData, value, page) => {
  let { state_name } = await getSelectedProgramId();
  if (value) {
    const propertiesMain = schema1.properties;
    const constantSchema = propertiesMain[page];
    const { subjects } = constantSchema?.properties || {};
    const {
      payment_receipt_document_id,
      application_form,
      application_login_id,
      ...properties
    } = schemaData.properties;
    let data = await enumRegistryService.subjectsList(value);
    let newSchema;
    if (state_name === "BIHAR") {
      newSchema = getOptions(
        {
          ...schemaData,
          properties: {
            ...properties,
            subjects,
            payment_receipt_document_id,
            application_form,
            application_login_id,
          },
        },
        {
          key: "subjects",
          arr: data?.subjects || [],
          title: "name",
          value: "subject_id",
        }
      );
    } else {
      newSchema = getOptions(
        {
          ...schemaData,
          properties: {
            ...properties,
            subjects,
            payment_receipt_document_id,
          },
        },
        {
          key: "subjects",
          arr: data?.subjects || [],
          title: "name",
          value: "subject_id",
        }
      );
    }
    return newSchema;
  } else {
    return schemaData;
  }
};

// App
export default function EnrollmentForm() {
  const { t } = useTranslation();
  const { step, id } = useParams();
  const userId = id;
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const [fixedSchema, setFixedSchema] = useState({});
  const [benificiary, setBenificiary] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [notMatched, setNotMatched] = useState();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const [uiSchema, setUiSchema] = useState({
    subjects: {
      "ui:widget": "MultiCheck",
    },
    enrollment_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [2023, moment().format("YYYY")],
        format: "DMY",
      },
    },
    enrollmentlabelMobile: {
      "ui:widget": "EnrollmentLabelMobileWidget",
    },
    enrollment_dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [1980, moment().format("YYYY")],
      },
    },
  });

  const nextPreviewStep = async (pageStape = "n") => {
    const index = pages.indexOf(page);
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (nextIndex !== undefined) {
        setPage(nextIndex);
      } else if (pageStape === "p") {
        navigate(`/beneficiary/${userId}/enrollmentdetails`);
      } else {
        navigate(`/beneficiary/${userId}`);
      }
    }
  };

  const checkEnrollmentDobAndDate = (data, key) => {
    let error = {};
    if (data?.enrollment_dob) {
      const age = enrollmentDateOfBirth(
        benificiary?.program_beneficiaries?.enrollment_date,
        data?.enrollment_dob
      );
      const {
        program_beneficiaries: { enrollment_date },
      } = benificiary || {};

      if (!enrollment_date) {
        error = {
          [key]: t("REQUIRED_MESSAGE_ENROLLMENT_DATE"),
          age,
        };
      } else if (!(age.diff >= 14 && age.diff <= 29)) {
        error = {
          [key]: t("THE_AGE_OF_THE_LEARNER_SHOULD_BE_15_TO_29_YEARS"),
          age,
        };
      } else {
        error = { age };
      }
    }
    return error;
  };

  const onPressBackButton = async () => {
    if (page === "edit_enrollement_details") {
      await nextPreviewStep("p");
    } else {
      navigate(`/beneficiary/${userId}`);
    }
  };

  const getEnrollmentStatus = async (schemaData) => {
    let { state_name } = await getSelectedProgramId();
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.ENROLLEMENT_STATUS;
    let newSchema = getOptions(schemaData, {
      key: "payment_receipt_document_id",
      extra: {
        userId,
        document_type: "enrollment_receipt",
        iconComponent: (
          <Image
            source={{
              uri:
                state_name === "RAJASTHAN"
                  ? "/enrollment-receipt.jpeg"
                  : "/payment_receipt_bihar.jpg",
            }}
            height={"124px"}
            width={"200px"}
            maxWidth={400}
            alt="background image"
          />
        ),
      },
    });

    newSchema = getOptions(newSchema, {
      key: "application_form",
      extra: {
        userId,
        document_type: "enrollment_receipt_2",
        iconComponent: (
          <Image
            source={{
              uri: "/application_receipt_bihar.jpg",
            }}
            height={"259px"}
            width={"200px"}
            maxWidth={400}
            alt="background image"
          />
        ),
      },
    });
    newSchema = getOptions(newSchema, {
      key: "application_login_id",
      extra: {
        userId,
        document_type: "enrollment_receipt_2",
        iconComponent: (
          <Image
            source={{
              uri: "/application_login_id_bihar.jpeg",
            }}
            height={"161px"}
            width={"200px"}
            maxWidth={400}
            alt="background image"
          />
        ),
      },
    });

    return getOptions(newSchema, {
      key: "enrollment_status",
      arr: list,
      title: "title",
      value: "value",
    });
  };

  const validate = (data, key) => {
    let error = {};
    switch (key) {
      case "enrollment_mobile_no":
        const mobile = data?.enrollment_mobile_no;
        const regex = /^[1-9][0-9]{0,9}$/;
        if (
          !mobile ||
          !mobile?.match(regex) ||
          !(
            data?.enrollment_mobile_no > 6000000000 &&
            data?.enrollment_mobile_no < 9999999999
          )
        ) {
          error = { [key]: t("REQUIRED_MESSAGE") };
        }
        break;
      case "enrollment_date":
        if (moment.utc(data?.enrollment_date) > moment.utc()) {
          error = { [key]: t("FUTUTRE_DATES_NOT_ALLOWED") };
        }
        break;
      default:
        break;
    }
    return error;
  };

  const customValidate = (data, err) => {
    const arr = Object.keys(err);
    arr.forEach((key) => {
      const isValid = validate(data, key);
      if (isValid?.[key]) {
        if (!errors?.[key]?.__errors.includes(isValid[key]))
          err?.[key]?.addError(isValid[key]);
      }
    });

    return err;
  };

  useEffect(() => {
    const properties = schema1.properties;
    const newSteps = Object.keys(properties);
    const newStep = step || newSteps[0];
    setPage(newStep);
    setPages(newSteps);
  }, []);

  useEffect(async () => {
    if (page) {
      const constantSchema = schema1.properties?.[page];
      const { result } = await benificiaryRegistoryService.getOne(userId);
      setBenificiary(result);
      const { program_beneficiaries } = result || {};

      if (page === "edit_enrollement") {
        const newSchema = await getEnrollmentStatus(constantSchema);
        let boardList = await enumRegistryService.boardList();
        let BoardSchema = getOptions(newSchema, {
          key: "enrolled_for_board",
          arr: boardList?.boards,
          title: "name",
          value: "id",
        });

        setFixedSchema(BoardSchema);
        const updatedSchema = await setSchemaByStatus(
          program_beneficiaries,
          BoardSchema,
          page
        );
        let { state_name } = await getSelectedProgramId();
        if (updatedSchema?.newSchema?.properties?.enrollment_number?.regex) {
          if (state_name === "BIHAR") {
            updatedSchema.newSchema.properties.enrollment_number.regex =
              /^\d{0,9}$/;
          } else {
            updatedSchema.newSchema.properties.enrollment_number.regex =
              /^\d{0,11}$/;
          }
        }
        setSchema(updatedSchema?.newSchema);
        const newdata = filterObject(
          updatedSchema?.newData,
          Object.keys(updatedSchema?.newSchema?.properties)
        );

        setFormData({
          ...newdata,
          enrolled_for_board: newdata?.enrolled_for_board?.toString(),
          ...getEnrollmentIds(newdata?.payment_receipt_document_id, state_name),
        });
      } else {
        setSchema(constantSchema);
        let newdata = filterObject(
          program_beneficiaries,
          Object.keys(constantSchema?.properties)
        );
        const age = checkEnrollmentDobAndDate(
          program_beneficiaries,
          "enrollment_dob"
        );
        if (age?.enrollment_dob) {
          setUiSchema(
            getUiSchema(uiSchema, {
              key: "enrollment_dob",
              extra: {
                "ui:help": (
                  <VStack>
                    {age?.age?.message}
                    <AlertCustom alert={age?.enrollment_dob} />,
                  </VStack>
                ),
              },
            })
          );
          newdata = { ...newdata, is_eligible: "no" };
        } else {
          newdata = { ...newdata, is_eligible: "yes" };
          setUiSchema(
            getUiSchema(uiSchema, {
              key: "enrollment_dob",
              extra: {
                "ui:help": age?.age?.message,
              },
            })
          );
        }

        setFormData(newdata);
      }
      setLoading(false);
    }
  }, [page]);

  const enrollmentNumberExist = async (enrollment_number) => {
    let { state_name } = await getSelectedProgramId();
    if (
      (state_name === "RAJASTHAN" && enrollment_number.length === 11) ||
      (state_name === "BIHAR" && enrollment_number.length === 9)
    ) {
      const result = await benificiaryRegistoryService.isExistEnrollment(
        userId,
        {
          enrollment_number: enrollment_number,
        }
      );
      if (result.error) {
        setErrors({
          ...errors,
          enrollment_number: {
            __errors: [
              t(
                state_name === "RAJASTHAN"
                  ? "ENROLLMENT_NUMBER_ALREADY_EXISTS"
                  : "APPLICATION_ID_ALREADY_EXISTS"
              ),
            ],
          },
        });
      } else {
        const { enrollment_number, ...otherErrors } = errors ?? {};
        setErrors(otherErrors);
        return true;
      }
    } else {
      if (state_name === "RAJASTHAN") {
        setErrors({
          ...errors,
          enrollment_number: {
            __errors: [t("ENROLLMENT_NUMBER_SHOULD_BE_OF_11_DIGIT")],
          },
        });
      } else {
        setErrors({
          ...errors,
          enrollment_number: {
            __errors: [t("APPLICATION_ID_SHOULD_BE_OF_9_DIGIT")],
          },
        });
      }
    }
    return false;
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    let newData = { ...formData, ...data };
    switch (id) {
      case "root_enrollment_number":
        let { enrollment_number, ...otherError } = errors || {};
        setErrors(otherError);
        if (data?.enrollment_number) {
          const debouncedFunction = debounce(async () => {
            await enrollmentNumberExist(data?.enrollment_number);
          }, 1000);
          debouncedFunction();
        }
        break;
      case "root_enrollment_date":
        let { enrollment_date, ...otherErrore } = errors || {};
        setErrors(otherErrore);
        const resultDate = validate(data, "enrollment_date");

        if (resultDate?.enrollment_date) {
          setErrors({
            ...errors,
            enrollment_date: {
              __errors: [resultDate?.enrollment_date],
            },
          });
        }
        break;
      case "root_enrolled_for_board":
        if (data.enrollment_status === "enrolled") {
          setSchema(await getSubjects(schema, data?.enrolled_for_board, page));
          newData = { ...newData, subjects: [] };
        }
        break;

      case "root_enrollment_status":
        const updatedSchema = await setSchemaByStatus(data, fixedSchema, page);
        newData = updatedSchema?.newData ? updatedSchema?.newData : {};
        setSchema(updatedSchema?.newSchema);
        setErrors();
        break;

      // case "root_enrollment_aadhaar_no":
      //   const result = validate(data, "enrollment_aadhaar_no");
      //   if (result?.enrollment_aadhaar_no) {
      //     setErrors({
      //       ...errors,
      //       enrollment_aadhaar_no: {
      //         __errors: [result?.enrollment_aadhaar_no],
      //       },
      //     });
      //   } else {
      //     let { enrollment_aadhaar_no, ...otherError } = errors || {};
      //     setErrors(otherError);
      //   }

      //   break;
      case "root_enrollment_dob":
        const age = checkEnrollmentDobAndDate(data, "enrollment_dob");
        if (age?.enrollment_dob) {
          setUiSchema(
            getUiSchema(uiSchema, {
              key: "enrollment_dob",
              extra: {
                "ui:help": (
                  <VStack>
                    {age?.age?.message}
                    <AlertCustom alert={age?.enrollment_dob} />,
                  </VStack>
                ),
              },
            })
          );
          newData = { ...newData, is_eligible: "no" };
        } else {
          newData = { ...newData, is_eligible: "yes" };
          setUiSchema(
            getUiSchema(uiSchema, {
              key: "enrollment_dob",
              extra: {
                "ui:help": age?.age?.message,
              },
            })
          );
        }
        break;
      default:
        break;
    }
    setFormData(newData);
  };

  // form submit
  const onSubmit = async () => {
    setBtnLoading(true);
    const keys = Object.keys(errors || {});
    let { state_name } = await getSelectedProgramId();

    if (
      keys?.length < 1 &&
      formData?.enrollment_number &&
      page === "edit_enrollement"
    ) {
      const resulten = await enrollmentNumberExist(formData?.enrollment_number);
      if (!resulten) {
        setNotMatched(["enrollment_number"]);
        setBtnLoading(false);
        return resulten;
      }
    }
    if (keys?.length > 0) {
      const errorData = ["enrollment_number"].filter((e) => keys.includes(e));
      if (errorData.length > 0) {
        if (
          errorData.includes("enrollment_number") &&
          !errors.enrollment_number?.__errors?.includes(
            t(
              state_name === "RAJASTHAN"
                ? "ENROLLMENT_NUMBER_ALREADY_EXISTS"
                : "APPLICATION_ID_ALREADY_EXISTS"
            )
          )
        ) {
          setNotMatched(errorData.filter((e) => e !== "enrollment_number"));
        } else {
          setNotMatched(errorData);
        }
      }
      scrollToField({ property: keys?.[0] });
    } else {
      const newFormData = formData;
      let newdata = filterObject(
        newFormData,
        Object.keys(schema?.properties),
        {},
        ""
      );

      if (state_name === "BIHAR" && newdata?.enrollment_status === "enrolled") {
        newdata = {
          ...newdata,
          payment_receipt_document_id: [
            {
              id: newdata.payment_receipt_document_id,
              key: "payment_receipt_document_id",
            },
            { id: newdata.application_form, key: "application_form" },
            { id: newdata.application_login_id, key: "application_login_id" },
          ],
        };

        // Removing individual document ID keys
        delete newdata.application_form;
        delete newdata.application_login_id;
      } else if (
        state_name === "RAJASTHAN" &&
        newdata?.enrollment_status === "enrolled"
      ) {
        newdata = {
          ...newdata,
          payment_receipt_document_id: [
            {
              id: newdata.payment_receipt_document_id,
              key: "payment_receipt_document_id",
            },
          ],
        };
      }

      const { success, isUserExist } =
        await benificiaryRegistoryService.updateAg(
          {
            ...newdata,
            edit_page_type: page,
            is_eligible: newFormData?.is_eligible,
          },
          userId
        );
      if (isUserExist) {
        setNotMatched(["enrollment_number"]);
      } else if (success && formData.enrollment_status === "enrolled") {
        nextPreviewStep();
      } else {
        navigate(`/beneficiary/${userId}/enrollmentdetails`);
      }
    }
    setBtnLoading(false);
  };
  if (
    ["enrolled_ip_verified", "registered_in_camp"].includes(
      benificiary?.program_beneficiaries?.status
    )
  ) {
    return (
      <Layout
        loading={loading}
        _appBar={{
          onPressBackButton,
          onlyIconsShow: ["backBtn", "userInfo"],
          name: t("ENROLLMENT_DETAILS"),
          lang,
          setLang,
          _box: { bg: "white", shadow: "appBarShadow" },
        }}
        _page={{ _scollView: { bg: "formBg.500" } }}
        analyticsPageTitle={"BENEFICIARY_ENROLLMENT_FORM"}
        pageTitle={t("BENEFICIARY")}
        stepTitle={t("ENROLLMENT_DETAILS")}
      >
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
        name: t("ENROLLMENT_DETAILS"),
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
        {schema && schema !== "" && (
          <Form
            key={lang + schema}
            ref={formRef}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              widgets,
              templates,
              validator,
              schema: schema || {},
              uiSchema,
              formData,
              onChange,
              onError,
              onSubmit,
              customValidate,
              transformErrors: (errors) => transformErrors(errors, schema, t),
            }}
          >
            <FrontEndTypo.Primarybutton
              mt="3"
              type="submit"
              isLoading={btnLoading}
              onPress={() => {
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }}
            >
              {t("SAVE")}
            </FrontEndTypo.Primarybutton>
          </Form>
        )}
      </Box>

      <Modal
        isOpen={Array.isArray(notMatched) && notMatched?.length > 0}
        size="lg"
        _backdrop={{ opacity: "0.7" }}
      >
        <Modal.Content>
          <Modal.Body p="4" bg="white">
            <VStack space="2" alignItems="center">
              {/* {notMatched?.includes("enrollment_aadhaar_no") && (
                <FrontEndTypo.H3 textAlign="center" color="textGreyColor.500">
                  {t("ENROLLMENT_AADHAR_POPUP_MESSAGE")}
                </FrontEndTypo.H3>
              )} */}

              {notMatched?.includes("enrollment_number") && (
                <FrontEndTypo.H3 textAlign="center" color="textGreyColor.500">
                  {t("ENROLLMENT_NUMBER_POPUP_MESSAGE")}
                </FrontEndTypo.H3>
              )}
            </VStack>
          </Modal.Body>
          <Modal.Footer
            flexDirection={["column", "row"]}
            gap={["2"]}
            alignSelf="center"
            bg="transparent"
          >
            <FrontEndTypo.Secondarybutton
              shadow="BlueFillShadow"
              onPress={() => setNotMatched()}
            >
              {t("EDIT_ENROLLMENT_NUMBER")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton
              shadow="BlueFillShadow"
              onPress={() => navigate(`/beneficiary/profile/${userId}`)}
            >
              {t("HOME_PAGE")}
            </FrontEndTypo.Primarybutton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

const AlertCustom = ({ alert }) => (
  <Alert status="warning" alignItems={"start"} mb="3">
    <HStack alignItems="center" space="2" color>
      <Alert.Icon />
      <BodyMedium>{alert}</BodyMedium>
    </HStack>
  </Alert>
);

AlertCustom.propTypes = {
  alert: PropTypes.string,
};
