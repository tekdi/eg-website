import Form from "@rjsf/core";
import {
  BodyMedium,
  FrontEndTypo,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  enrollmentDateOfBirth,
  enumRegistryService,
  filterObject,
  getArray,
  getOptions,
  getSelectedProgramId,
  getUiSchema,
} from "@shiksha/common-lib";
import { Alert, Box, HStack, Image, Modal, VStack } from "native-base";
import { useCallback, useEffect, useRef, useState } from "react";
import schema1 from "./schema.js";
//updateSchemaEnum
import validator from "@rjsf/validator-ajv8";
import { debounce } from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { LABEL_NAMES } from "v2/views/Beneficiary/utils/beneficiaryData.js";
import {
  MultiCheckSubject,
  onError,
  scrollToField,
  templates,
  transformErrors,
  widgets,
} from "../../../Static/FormBaseInput/FormBaseInput.js";

const setSchemaByStatus = async (data, fixedSchema, boards = []) => {
  const constantSchema = fixedSchema;
  let newSchema = {};
  let newData = {};
  const keys = Object.keys(schema1?.properties || {}).reduce((acc, key) => {
    if (schema1.properties[key].properties) {
      acc = [...acc, ...Object.keys(schema1.properties[key].properties)];
    }
    return acc;
  }, []);
  [...keys, "is_eligible"].forEach((e) => {
    if (e === "enrolled_for_board") {
      newData = { ...newData, [e]: data?.[e] ? `${data?.[e]}` : undefined };
    } else if (e === "subjects") {
      newData = { ...newData, [e]: getArray(data?.[e]) };
    } else if (e === "payment_receipt_document_id") {
      if (Array.isArray(data?.[e])) {
        const idDoc = data?.[e]?.find((ie) =>
          ie?.id && (ie?.key == data?.enrollment_status) === "sso_id_enrolled"
            ? "sso_id_receipt_document_id"
            : "payment_receipt_document_id",
        );
        newData = { ...newData, [e]: `${idDoc?.id}` };
      } else {
        newData = { ...newData, [e]: undefined };
      }
    } else newData = { ...newData, [e]: data?.[e] || undefined };
  });

  switch (data?.enrollment_status) {
    case "enrollment_awaited":
    case "enrollment_rejected":
      {
        newSchema = getOptions(constantSchema, {
          key: "enrolled_for_board",
          arr: boards || [],
          title: "name",
          value: "id",
        });
        const { enrolled_for_board: efd, enrollment_status } =
          newSchema?.properties || {};
        newSchema = {
          ...constantSchema,
          properties: {
            enrollment_status,
            enrolled_for_board: efd,
          },
          required: ["enrollment_status", "enrolled_for_board"],
        };
        newData = {
          enrollment_status: data?.enrollment_status,
          enrolled_for_board: `${data?.enrolled_for_board}`,
        };
      }
      break;
    case "ready_to_enroll":
      {
        const { enrollment_status } = constantSchema?.properties || {};
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
      }
      break;
    case "sso_id_enrolled":
      {
        newSchema = getOptions(constantSchema, {
          key: "enrolled_for_board",
          arr: boards || [],
          filters: { name: "RSOS" },
          title: "name",
          value: "id",
        });

        const {
          enrollment_status,
          type_of_enrollement,
          enrolled_for_board,
          sso_id,
          enrollment_mobile_no,
          enrollment_date,
          enrollment_first_name,
          enrollment_middle_name,
          enrollment_last_name,
          enrollment_dob,
        } = newSchema?.properties || {};

        // only for sso id validation
        newSchema = {
          ...constantSchema,
          properties: {
            enrollment_status,
            type_of_enrollement,
            enrolled_for_board,
            sso_id,
            enrollment_mobile_no,
            enrollment_date,
            enrollment_first_name,
            enrollment_middle_name,
            enrollment_last_name,
            enrollment_dob,
          },
          required: constantSchema?.required?.filter(
            (e) => e != "enrollment_number",
          ),
        };
      }
      break;

    default:
      {
        const { sso_id: sso_id_1, ...properties } =
          constantSchema?.properties || {};
        newSchema = {
          ...constantSchema,
          properties,
          required: constantSchema?.required?.filter((e) => e != "sso_id"),
        };
        newSchema = getOptions(newSchema, {
          key: "enrolled_for_board",
          arr: boards || [],
          title: "name",
          value: "id",
        });
      }
      break;
  }
  return { newSchema, newData };
};

const getSubjects = async (schemaData, value) => {
  let { state_name } = await getSelectedProgramId();
  if (value) {
    let data = await enumRegistryService.subjectsList(value);
    let newSchema = getOptions(newSchema, {
      key: "subjects",
      arr: data?.subjects || [],
      title: "name",
      value: "subject_id",
      extra: { enumOptions: data?.subjects },
    });
    newSchema = getOptions(schemaData, {
      key: "payment_receipt_document_id",
      extra: {
        document_type: "enrollment_receipt",
        iconComponent: (
          <Image
            source={{
              uri:
                state_name === "RAJASTHAN"
                  ? "/enrollment-receipt.jpeg"
                  : state_name === "BIHAR"
                    ? "/application_receipt_bihar.jpg"
                    : "/enrollment_receipt_mp.jpg",
            }}
            height={"200px"}
            width={"124px"}
            maxWidth={400}
            alt="background image"
          />
        ),
      },
    });

    return newSchema;
  } else {
    return schemaData;
  }
};

// App
export default function EnrollmentForm() {
  const { t } = useTranslation();
  const { id } = useParams();
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
  const [boards, setBoards] = useState();
  const navigate = useNavigate();
  const [missingData, setMissingData] = useState();

  const [uiSchema, setUiSchema] = useState({
    subjects: {
      "ui:widget": "MultiCheckSubject",
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
        format: "DMY",
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
        data?.enrollment_date,
        data?.enrollment_dob,
      );
      const { enrollment_date } = data || {};

      if (!enrollment_date) {
        error = {
          [key]: t("REQUIRED_MESSAGE_ENROLLMENT_DATE"),
          age,
        };
      } else if (!(age.diff >= 14 && age.diff <= 29)) {
        error = {
          [key]: t("THE_AGE_OF_THE_LEARNER_SHOULD_BE_14_TO_30_YEARS"),
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
      navigate(`/beneficiary/${userId}/enrollmentdetails`);
    }
  };

  const getEnrollmentStatus = async (schemaData, status) => {
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.ENROLLEMENT_STATUS;
    let { state_name } = await getSelectedProgramId();

    let newSchema = getOptions(schemaData, {
      key: "type_of_enrollement",
      arr: ListofEnum?.data?.ENROLLEMENT_VERIFICATION_TYPE,
      title: "title",
      value: "value",
    });

    // filter by sso_id_enrolled if state id not RAJASTHAN

    if (
      state_name === "RAJASTHAN" &&
      [
        "identified",
        "ready_to_enroll",
        "sso_id_enrolled",
        "enrollment_awaited",
        "enrollment_rejected",
      ].includes(status)
    ) {
      list = list.filter((e) => e.value != "enrolled");
    } else if (state_name !== "RAJASTHAN") {
      list = list.filter((e) => e.value != "sso_id_enrolled");
    }

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
          error = { [key]: t("FUTURE_DATES_NOT_ALLOWED") };
        }
        break;
      case "subjects":
        if (page === "edit_enrollement_details") {
          const countLanguageSubjects = (subjectsArr, subjects) => {
            // Convert the subjects array to a Set for faster lookups
            const subjectsSet = new Set(subjects);
            // Filter the array for objects with "language" subject_type and a subject_id in the subjects array
            const languageSubjects = subjectsArr?.filter(
              (subject) =>
                subject.subject_type === "language" &&
                subjectsSet.has(String(subject.subject_id)),
            );
            // Return the count of filtered objects
            return languageSubjects.length;
          };
          const langCount = countLanguageSubjects(
            schema?.properties?.subjects?.enumOptions,
            data?.subjects,
          );
          const nonLangCount = data?.subjects?.length - langCount;
          if (langCount === 0 && nonLangCount === 0) {
            error = { [key]: t("GROUP_A_GROUP_B_MIN_SUBJECTS") };
          } else if (langCount + nonLangCount > 7) {
            error = { [key]: t("GROUP_A_GROUP_B_MAX_SUBJECTS") };
          } else if (langCount > 3) {
            error = { [key]: t("GROUP_A_MAX_SUBJECTS") };
          } else if (nonLangCount > 5) {
            error = { [key]: t("GROUP_B_MAX_SUBJECTS") };
          }
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

  // set form data page, pages and benificiary
  useEffect(() => {
    const init1 = async () => {
      const { result } = await benificiaryRegistoryService.getOne(userId);
      setBenificiary(result);
      setMissingData(await learnerDetailsCheck({ id, benificiary: result }));
      const { program_beneficiaries } = result || {};
      const updatedSchema = await setSchemaByStatus(program_beneficiaries, {});
      setFormData(updatedSchema?.newData || {});
      let resultBoards = await enumRegistryService.boardList();
      setBoards(resultBoards?.boards || []);
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = newSteps[0];
      setPage(newStep);
      setPages(newSteps);
    };
    init1();
  }, []);

  // set fixedSchema, setSchema as per statue and state, dependacy on page
  useEffect(() => {
    const init = async () => {
      if (page && benificiary?.program_beneficiaries && boards) {
        const constantSchema = schema1.properties?.[page];
        if (page === "edit_enrollement") {
          const newSchema = await getEnrollmentStatus(
            constantSchema,
            benificiary?.program_beneficiaries.status,
          );
          setFixedSchema(newSchema);
          const updatedSchema = await setSchemaByStatus(
            formData,
            newSchema,
            boards,
          );
          let { state_name } = await getSelectedProgramId();

          if (updatedSchema?.newSchema?.properties?.enrollment_number?.regex) {
            if (state_name === "BIHAR") {
              updatedSchema.newSchema.properties.enrollment_number.regex =
                /^\d{0,9}$/;
            } else if (state_name === "MADHYA PRADESH") {
              updatedSchema.newSchema.properties.enrollment_number.regex =
                /^\d{0,12}$/;
            } else {
              updatedSchema.newSchema.properties.enrollment_number.regex =
                /^\d{0,11}$/;
            }
          }
          setSchema(updatedSchema?.newSchema);
        } else {
          if (
            ["enrolled", "sso_id_enrolled"].includes(
              formData?.enrollment_status,
            )
          ) {
            setSchema(
              await getSubjects(constantSchema, formData?.enrolled_for_board),
            );
          } else {
            setSchema(constantSchema);
          }
        }
        setLoading(false);
      }
    };
    init();
  }, [page, benificiary, boards]);

  const enrollmentNumberExist = async (enrollment_number, re = false) => {
    let { state_name } = await getSelectedProgramId();
    let error = {};
    if (
      (state_name === "MADHYA PRADESH" && enrollment_number.length === 12) ||
      (state_name === "RAJASTHAN" && enrollment_number.length === 11) ||
      (state_name === "BIHAR" && enrollment_number.length === 9)
    ) {
      const result = await benificiaryRegistoryService.isExistEnrollment(
        userId,
        {
          enrollment_number: enrollment_number,
        },
      );
      if (result.error) {
        error = {
          ...errors,
          enrollment_number: {
            isNotMatched: true,
            __errors: [
              t(
                state_name === "RAJASTHAN"
                  ? "ENROLLMENT_NUMBER_ALREADY_EXISTS"
                  : "APPLICATION_ID_ALREADY_EXISTS",
              ),
            ],
          },
        };
        if (!re) {
          setErrors(error);
        }
      } else {
        if (!re) {
          const { enrollment_number, ...otherErrors } = errors ?? {};
          setErrors(otherErrors);
        }
      }
    } else {
      if (state_name === "RAJASTHAN") {
        error = {
          ...errors,
          enrollment_number: {
            __errors: [t("ENROLLMENT_NUMBER_SHOULD_BE_OF_11_DIGIT")],
          },
        };
        if (!re) {
          setErrors(error);
        }
      } else if (state_name === "MADHYA PRADESH") {
        error = {
          ...errors,
          enrollment_number: {
            __errors: [t("ROLL_NUMBER_SHOULD_BE_OF_12_DIGIT")],
          },
        };
        if (!re) {
          setErrors(error);
        }
      } else {
        error = {
          ...errors,
          enrollment_number: {
            __errors: [t("APPLICATION_ID_SHOULD_BE_OF_9_DIGIT")],
          },
        };
        if (!re) {
          setErrors(error);
        }
      }
    }
    if (re) {
      return error;
    }
  };

  const handleEnrollment = async (data) => {
    await enrollmentNumberExist(data?.enrollment_number);
  };
  const debouncedFunction = useCallback(debounce(handleEnrollment, 1000), []);

  const handleSSOID = async (data) => {
    const result = await benificiaryRegistoryService.isExistSSOID({
      user_id: userId,
      sso_id: data?.sso_id,
    });
    if (result.error) {
      setErrors({
        ...errors,
        sso_id: {
          isNotMatched: true,
          __errors: [t("SSO_ID_ALREADY_EXISTS"), result?.message || ""],
        },
      });
    }
  };
  const debouncedSSOID = useCallback(debounce(handleSSOID, 1000), []);
  const onChange = async (e, id) => {
    const data = e.formData;
    let newData = { ...formData, ...data };

    switch (id) {
      case "root_enrollment_number":
        let { enrollment_number, ...otherError } = errors || {};
        setErrors(otherError);
        if (data?.enrollment_number) {
          debouncedFunction(data);
        }
        break;
      case "root_sso_id":
        let { sso_id, ...ssoOtherError } = errors || {};
        setErrors(ssoOtherError);
        if (data?.sso_id) {
          debouncedSSOID(data);
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
        if (data.enrollment_dob) {
          const ageDate = checkEnrollmentDobAndDate(data, "enrollment_dob");
          if (ageDate?.enrollment_dob) {
            setUiSchema(
              getUiSchema(uiSchema, {
                key: "enrollment_dob",
                extra: {
                  "ui:help": (
                    <VStack>
                      {ageDate?.age?.message}
                      <AlertCustom alert={ageDate?.enrollment_dob} />,
                    </VStack>
                  ),
                },
              }),
            );
            setFormData({ ...formData, is_eligible: "no" });
          } else {
            setUiSchema(
              getUiSchema(uiSchema, {
                key: "enrollment_dob",
                extra: {
                  "ui:help": ageDate?.age?.message,
                },
              }),
            );
            setFormData({ ...formData, is_eligible: "yes" });
          }
        }
        break;

      case "root_enrollment_status":
        const updatedSchema = await setSchemaByStatus(
          data,
          fixedSchema,
          boards,
        );
        newData = updatedSchema?.newData ? updatedSchema?.newData : {};
        setSchema(updatedSchema?.newSchema);
        setErrors();
        break;

      case "root_subjects": {
        let { subjects, ...otherErrore } = errors || {};
        setErrors(otherErrore);
        const resultDate = validate(data, "subjects");
        if (resultDate?.subjects) {
          setErrors({
            ...errors,
            subjects: {
              __errors: [resultDate?.subjects],
            },
          });
        }
        break;
      }

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
                    <AlertCustom alert={age?.enrollment_dob} />,
                  </VStack>
                ),
              },
            }),
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
            }),
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
      const resulten = await enrollmentNumberExist(
        formData?.enrollment_number,
        true,
      );
      if (Object.keys(resulten).includes("enrollment_number")) {
        if (resulten?.enrollment_number?.isNotMatched) {
          setNotMatched(["enrollment_number"]);
        } else {
          setErrors(resulten);
        }
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
                : "APPLICATION_ID_ALREADY_EXISTS",
            ),
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
      const keys = Object.keys(schema1?.properties || {}).reduce((acc, key) => {
        if (schema1.properties[key].properties) {
          acc = [...acc, ...Object.keys(schema1.properties[key].properties)];
        }
        return acc;
      }, []);

      let newdata = filterObject(newFormData, [...keys, "is_eligible"], {}, "");

      if (
        ["enrolled", "sso_id_enrolled"].includes(newdata?.enrollment_status)
      ) {
        newdata = {
          ...newdata,
          payment_receipt_document_id: [
            {
              id: newdata.payment_receipt_document_id,
              key:
                newdata?.enrollment_status === "sso_id_enrolled"
                  ? "sso_id_receipt_document_id"
                  : "payment_receipt_document_id",
            },
          ],
        };
      }

      if (
        page == "edit_enrollement_details" ||
        (page == "edit_enrollement" &&
          !["enrolled", "sso_id_enrolled"].includes(newdata?.enrollment_status))
      ) {
        const { success, isUserExist } =
          await benificiaryRegistoryService.updateAg(
            {
              ...newdata,
              edit_page_type: "edit_enrollement",
              is_eligible: newFormData?.is_eligible,
            },
            userId,
          );
        if (isUserExist) {
          setNotMatched(["enrollment_number"]);
        } else {
          navigate(`/beneficiary/${userId}/enrollmentdetails`);
        }
      } else {
        nextPreviewStep();
      }
    }
    setBtnLoading(false);
  };

  if (missingData) {
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
        <Box py={6} px={4} mb={5}>
          <UserDataCheck {...{ missingData, setMissingData, id }} />
        </Box>
      </Layout>
    );
  }

  if (
    ["enrolled_ip_verified", "registered_in_camp"].includes(
      benificiary?.program_beneficiaries?.status,
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
              widgets: { ...widgets, MultiCheckSubject },
              templates,
              validator,
              schema: schema || {},
              uiSchema,
              formData,
              onChange,
              onError,
              onSubmit,
              customValidate,
              transformErrors: (errorsData) => {
                const filterError = transformErrors(errorsData, schema, t);
                let newError = {};
                filterError
                  .filter((e) => e?.name == "enum" && e?.key_name)
                  .forEach((e) => {
                    newError = {
                      ...newError,
                      [e.key_name]: {
                        __errors: [e.message],
                      },
                    };
                  });
                setErrors({ ...errors, ...newError });
                return filterError;
              },
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
              {t(page == "edit_enrollement" ? "NEXT" : "SAVE")}
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

const learnerDetailsCheck = async ({ id, benificiary }) => {
  const { data: searchKeys } =
    await benificiaryRegistoryService.checkLearnerDetails(id);

  if (searchKeys?.length > 0) {
    return LABEL_NAMES.map((label) => {
      const matchedKeys = Object.keys(label.keys).filter((key) =>
        searchKeys.includes(key),
      );

      if (matchedKeys.length > 0) {
        const filteredKeys = matchedKeys.reduce((acc, key) => {
          acc[key] = label.keys[key];
          return acc;
        }, {});

        return {
          title: label.title,
          path: label.path,
          keys: filteredKeys,
        };
      }

      return null;
    }).filter((item) => item !== null);
  } else {
    const lastStandard = parseInt(
      benificiary?.core_beneficiaries?.last_standard_of_education ?? "",
      10,
    );
    const hasWarning = isNaN(lastStandard) || lastStandard < 5;
    const checkNeeded = ["identified", "ready_to_enroll"].includes(
      benificiary?.program_beneficiaries?.status,
    );

    if (hasWarning && checkNeeded) {
      return "last_standard_of_education";
    }
  }
};

const UserDataCheck = ({ missingData, setMissingData, id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <VStack>
      {Array.isArray(missingData) ? (
        <VStack space={2}>
          {t("LEARNER_FIELDS_MISSING_WARNING")}
          {missingData?.map((item, i) => (
            <VStack
              key={item?.path}
              p="2"
              borderWidth={1}
              borderColor="gray.300"
              rounded={"sm"}
            >
              <HStack alignItems={"center"} justifyContent="space-between">
                <FrontEndTypo.H3 bold color="textGreyColor.500">
                  {t(item?.title)}
                </FrontEndTypo.H3>
                <IconByName
                  p="1"
                  name="PencilLineIcon"
                  color="iconColor.200"
                  _icon={{ size: "20" }}
                  onPress={(e) => {
                    const searchParams = new URLSearchParams({
                      redirectLink: `/beneficiary/edit/${id}/enrollment-details`,
                    }).toString();
                    if (item.title == "PROFILE_PHOTO") {
                      navigate(
                        `${item?.path
                          ?.replace(":id", id)
                          ?.replace(
                            "upload_no",
                            Object.keys(item?.keys || {})?.[0]?.replace(
                              "profile_photo_",
                              "",
                            ),
                          )}?${searchParams}`,
                      );
                    } else {
                      navigate(
                        `${item?.path?.replace(":id", id)}?${searchParams}`,
                      );
                    }
                  }}
                />
              </HStack>
              <VStack>
                {Object.keys(item?.keys || {}).map((keyName) => (
                  <FrontEndTypo.H4 color="textGreyColor.500">
                    {t(item?.keys?.[keyName])}
                  </FrontEndTypo.H4>
                ))}
              </VStack>
            </VStack>
          ))}
        </VStack>
      ) : (
        <VStack
          space={4}
          p="2"
          borderWidth={1}
          borderColor="gray.300"
          rounded={"sm"}
          divider={<HStack borderBottomWidth={1} borderColor="gray.300" />}
        >
          {t("EDUCATION_STANDARD_WARNING")}
          <HStack justifyContent={"space-between"}>
            <FrontEndTypo.Secondarybutton
              onPress={() => navigate(`/beneficiary/${id}`)}
            >
              {t("CANCEL")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton onPress={() => setMissingData()}>
              {t("PRERAK_PROCEED_BTN")}
            </FrontEndTypo.Primarybutton>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};
