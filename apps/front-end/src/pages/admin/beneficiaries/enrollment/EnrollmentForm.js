import Form from "@rjsf/core";
import {
  AdminTypo,
  BodyMedium,
  FrontEndTypo,
  IconByName,
  AdminLayout as Layout,
  benificiaryRegistoryService,
  enrollmentDateOfBirth,
  enumRegistryService,
  filterObject,
  getArray,
  getEnrollmentIds,
  getOptions,
  getSelectedProgramId,
  getUiSchema,
} from "@shiksha/common-lib";
import { Alert, Box, HStack, Image, Modal, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import schema1 from "./schema.js";
//updateSchemaEnum
import { debounce } from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  onError,
  scrollToField,
  templates,
  transformErrors,
  validator,
  widgets,
} from "../../../../component/BaseInput.js";
import PropTypes from "prop-types";

const setSchemaByStatus = async (data, fixedSchema, page) => {
  let { state_name } = await getSelectedProgramId();
  const properties = schema1.properties;
  const constantSchema = properties[page];

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
    case "not_enrolled":
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
      newSchema = {
        ...constantSchema,
        properties: {
          enrollment_status,
          enrolled_for_board,
        },
        required: ["enrollment_status", "enrolled_for_board"],
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
  let boardList = await enumRegistryService.boardList();
  newSchema = getOptions(newSchema, {
    key: "enrolled_for_board",
    arr: boardList?.boards,
    title: "name",
    value: "id",
  });
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
export default function App(footerLinks) {
  const [RefAppBar, setRefAppBar] = useState();
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
  const [lang] = useState(localStorage.getItem("lang"));
  const [notMatched, setNotMatched] = useState();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [uiSchema, setUiSchema] = useState({
    subjects: {
      "ui:widget": "checkboxes",
    },
    enrollment_date: {
      "ui:widget": "alt-date",
      "ui:options": {
        hideNowButton: true,
        hideClearButton: true,
        yearsRange: [2023, moment().format("YYYY")],
      },
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
        const regex = /^([+]\d{2})?\d{10}$/;
        if (!mobile || !mobile?.match(regex)) {
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
      let { state_name } = await getSelectedProgramId();

      const constantSchema = schema1.properties?.[page];
      const { result } = await benificiaryRegistoryService.getOne(userId);
      setBenificiary(result);
      const { program_beneficiaries } = result || {};

      if (page === "edit_enrollement") {
        const newSchema = await getEnrollmentStatus(constantSchema);
        setFixedSchema(newSchema);
        const updatedSchema = await setSchemaByStatus(
          program_beneficiaries,
          newSchema,
          page
        );
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
        const { enrollment_number, ...otherErrors } = errors;
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

  const handleEnrollmentNumberChange = async (data) => {
    const { enrollment_number, ...otherError } = errors || {};
    setErrors(otherError);

    if (data?.enrollment_number) {
      const debouncedFunction = debounce(async () => {
        await enrollmentNumberExist(data?.enrollment_number);
      }, 1000);
      debouncedFunction();
    }
  };

  const handleEnrollmentDateChange = (data) => {
    const { enrollment_date, ...otherErrore } = errors || {};
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
  };

  const handleEnrollmentStatusChange = async (data, fixedSchema, page) => {
    const updatedSchema = await setSchemaByStatus(data, fixedSchema, page);
    const updatedData = updatedSchema?.newData || {};
    setSchema(updatedSchema?.newSchema);
    setErrors();
    return updatedData;
  };

  // const handleAadhaarNoChange = (data) => {
  //   const result = validate(data, "enrollment_aadhaar_no");
  //   if (result?.enrollment_aadhaar_no) {
  //     setErrors({
  //       ...errors,
  //       enrollment_aadhaar_no: {
  //         __errors: [result?.enrollment_aadhaar_no],
  //       },
  //     });
  //   } else {
  //     const { enrollment_aadhaar_no, ...otherError } = errors || {};
  //     setErrors(otherError);
  //   }
  // };

  const handleDobChange = (data) => {
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
      return { ...data, is_eligible: "no" };
    } else {
      setUiSchema(
        getUiSchema(uiSchema, {
          key: "enrollment_dob",
          extra: {
            "ui:help": age?.age?.message,
          },
        })
      );
      return { ...data, is_eligible: "yes" };
    }
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    let newData = { ...formData, ...data };

    switch (id) {
      case "root_enrollment_number":
        await handleEnrollmentNumberChange(data);
        break;
      case "root_enrollment_date":
        handleEnrollmentDateChange(data);
        break;
      case "root_enrolled_for_board":
        if (data.enrollment_status === "enrolled") {
          setSchema(await getSubjects(schema, data?.enrolled_for_board, page));
        }
        break;
      case "root_enrollment_status":
        newData = await handleEnrollmentStatusChange(data, fixedSchema, page);
        break;
      // case "root_enrollment_aadhaar_no":
      //   handleAadhaarNoChange(data);
      //   break;
      case "root_enrollment_dob":
        newData = handleDobChange(data);
        break;
      default:
        break;
    }
    setFormData(newData);
  };

  // form submit
  const handleValidationErrors = async () => {
    const keys = Object.keys(errors || {});

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
            t("ENROLLMENT_NUMBER_ALREADY_EXISTS")
          )
        ) {
          setNotMatched(errorData.filter((e) => e !== "enrollment_number"));
        } else {
          setNotMatched(errorData);
        }
      }

      scrollToField({ property: keys?.[0] });
    } else {
      return handleFormSubmission();
    }
  };

  const handleFormSubmission = async () => {
    let { state_name } = await getSelectedProgramId();
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
    const { success, isUserExist } = await benificiaryRegistoryService.updateAg(
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
      navigate(`/admin/beneficiary/${userId}`);
    }
  };

  const onSubmit = async () => {
    setBtnLoading(true);
    setIsButtonLoading(true);
    await handleValidationErrors();
    setBtnLoading(false);
    setIsButtonLoading(false);
  };

  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      RefAppBar={RefAppBar}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack alignItems={"center"} space="1" pt="3">
        <IconByName name="UserLineIcon" size="md" />
        <AdminTypo.H1 color="Activatedcolor.400">{t("PROFILE")}</AdminTypo.H1>
        <IconByName
          size="sm"
          name="ArrowRightSLineIcon"
          onPress={(e) => navigate(-1)}
        />
        <AdminTypo.H1>
          {benificiary?.program_beneficiaries?.status === "enrolled_ip_verified"
            ? `${
                benificiary?.program_beneficiaries?.enrollment_first_name ?? "-"
              } ${
                benificiary?.program_beneficiaries?.enrollment_last_name ?? "-"
              }`
            : `${benificiary?.first_name ?? "-"} ${
                benificiary?.last_name ?? "-"
              }`}
        </AdminTypo.H1>
        <IconByName
          size="sm"
          name="ArrowRightSLineIcon"
          onPress={(e) => navigate(-1)}
        />

        <AdminTypo.H1
          color="textGreyColor.800"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {t("ENROLLMENT_DETAILS")}
        </AdminTypo.H1>
      </HStack>
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

App.PropTypes = {
  footerLinks: PropTypes.any,
};
