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
  getOptions,
  getSelectedProgramId,
  getUiSchema,
} from "@shiksha/common-lib";
import { Alert, Box, HStack, Image, Modal, VStack } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { MultiCheckSubject } from "v2/components/Static/FormBaseInput/FormBaseInput.js";

const setSchemaByStatus = async (data, fixedSchema, boards = []) => {
  const constantSchema = fixedSchema;
  let newSchema = {};
  let newData = {};
  const keys = Object.keys(schema1?.properties || {}).reduce((acc, key) => {
    if (schema1.properties[key].properties) {
      // acc = [...acc, ...Object.keys(schema1.properties[key].properties)];
      acc.push(...Object.keys(schema1.properties[key].properties));
    }
    return acc;
  }, []);
  [...keys, "is_eligible"].forEach((e) => {
    if (e === "subjects") {
      newData = { ...newData, [e]: getArray(data?.[e]) };
    } else if (e === "enrolled_for_board") {
      newData = { ...newData, [e]: data?.[e] ? `${data?.[e]}` : undefined };
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
          subjects,
          payment_receipt_document_id,
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
            subjects,
            payment_receipt_document_id,
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
    let newSchema = getOptions(schemaData, {
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
            height={"124px"}
            width={"200px"}
            maxWidth={400}
            alt="background image"
          />
        ),
      },
    });
    newSchema = getOptions(newSchema, {
      key: "subjects",
      arr: data?.subjects || [],
      title: "name",
      value: "subject_id",
      extra: { enumOptions: data?.subjects },
    });
    return newSchema;
  } else {
    return schemaData;
  }
};
// App
export default function App(footerLinks) {
  const [refAppBar, setRefAppBar] = useState();
  const { id } = useParams();
  const userId = id;
  const [page, setPage] = useState();
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
  const [boards, setBoards] = useState();

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

  // const nextPreviewStep = async (pageStape = "n") => {
  //   const index = pages.indexOf(page);
  //   if (index !== undefined) {
  //     let nextIndex = "";
  //     if (pageStape.toLowerCase() === "n") {
  //       nextIndex = pages[index + 1];
  //     } else {
  //       nextIndex = pages[index - 1];
  //     }
  //     if (nextIndex !== undefined) {
  //       setPage(nextIndex);
  //     } else if (pageStape === "p") {
  //       navigate(`/beneficiary/${userId}/enrollmentdetails`);
  //     } else {
  //       navigate(`/beneficiary/${userId}`);
  //     }
  //   }
  // };

  const checkEnrollmentDobAndDate = (data, key) => {
    let error = {};
    if (data?.enrollment_dob) {
      const age = enrollmentDateOfBirth(
        benificiary?.program_beneficiaries?.enrollment_date,
        data?.enrollment_dob,
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
          [key]: t("THE_AGE_OF_THE_LEARNER_SHOULD_BE_14_TO_30_YEARS"),
          age,
        };
      } else {
        error = { age };
      }
    }
    return error;
  };

  const getEnrollmentStatus = async (schemaData, status) => {
    let ListofEnum = await enumRegistryService.listOfEnum();
    let list = ListofEnum?.data?.ENROLLEMENT_STATUS;
    let { state_name } = await getSelectedProgramId();

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
    let newSchema = getOptions(schemaData, {
      key: "type_of_enrollement",
      arr: ListofEnum?.data?.ENROLLEMENT_VERIFICATION_TYPE,
      title: "title",
      value: "value",
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
        {
          const mobile = data?.enrollment_mobile_no;
          const regex = /^[1-9]\D{0,9}$/;
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
        }
        break;
      case "enrollment_date": {
        if (moment.utc(data?.enrollment_date) > moment.utc()) {
          error = { [key]: t("FUTURE_DATES_NOT_ALLOWED") };
        }
        break;
      }
      case "subjects": {
        if (
          page === "edit_enrollement" &&
          ["enrolled", "sso_id_enrolled"].includes(data?.enrollment_status)
        ) {
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
      }
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
    const init = async () => {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = newSteps[0];
      setPage(newStep);
      const { result } = await benificiaryRegistoryService.getOne(userId);
      setBenificiary(result);
      const { program_beneficiaries } = result || {};
      const updatedSchema = await setSchemaByStatus(program_beneficiaries, {});
      setFormData(updatedSchema?.newData || {});
      let resultBoards = await enumRegistryService.boardList();
      setBoards(resultBoards?.boards || []);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (page && benificiary?.program_beneficiaries && boards) {
        const constantSchema = schema1.properties?.[page];
        if (page === "edit_enrollement") {
          const newSchema = await getEnrollmentStatus(
            constantSchema,
            benificiary?.program_beneficiaries?.status,
          );
          setFixedSchema(newSchema);
          const updatedSchema = await setSchemaByStatus(
            benificiary?.program_beneficiaries,
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
          if (
            ["enrolled", "sso_id_enrolled"].includes(
              formData?.enrollment_status,
            )
          ) {
            const subjectsEnum = await getSubjects(
              constantSchema,
              formData?.enrolled_for_board,
            );
            updatedSchema.newSchema.properties.subjects =
              subjectsEnum?.properties?.subjects;
          }
          setSchema(updatedSchema?.newSchema);
        } else if (
          ["enrolled", "sso_id_enrolled"].includes(formData?.enrollment_status)
        ) {
          setSchema(
            await getSubjects(constantSchema, formData?.enrolled_for_board),
          );
        } else {
          setSchema(constantSchema);
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
      (state_name === "RAJASTHAN" && enrollment_number.length === 11) ||
      (state_name === "MADHYA PRADESH" && enrollment_number.length === 12) ||
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
      } else if (!re) {
        const { enrollment_number, ...otherErrors } = errors ?? {};
        setErrors(otherErrors);
      }
    } else if (state_name === "RAJASTHAN") {
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
        {
          let { enrollment_number, ...otherError } = errors || {};
          setErrors(otherError);
          if (data?.enrollment_number) {
            debouncedFunction(data);
          }
        }
        break;
      case "root_sso_id":
        {
          let { sso_id, ...ssoOtherError } = errors || {};
          setErrors(ssoOtherError);
          if (data?.sso_id) {
            debouncedSSOID(data);
          }
        }
        break;
      case "root_enrollment_date":
        {
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
        }
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

      case "root_enrollment_status":
        {
          const updatedSchema = await setSchemaByStatus(
            data,
            fixedSchema,
            boards,
          );
          newData = updatedSchema?.newData ? updatedSchema?.newData : {};
          if (
            ["enrolled", "sso_id_enrolled"].includes(newData?.enrollment_status)
          ) {
            const constantSchema = schema1.properties?.[page];
            const subjectsEnum = await getSubjects(
              constantSchema,
              formData?.enrolled_for_board,
            );
            updatedSchema.newSchema.properties.subjects =
              subjectsEnum?.properties?.subjects;
          }
          setSchema(updatedSchema?.newSchema);
          setErrors();
        }
        break;

      //   break;
      case "root_enrollment_dob":
        {
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
        }
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
            t("ENROLLMENT_NUMBER_ALREADY_EXISTS"),
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
      "",
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
    const { isUserExist } = await benificiaryRegistoryService.updateAg(
      {
        ...newdata,
        edit_page_type: page,
        is_eligible: newFormData?.is_eligible,
      },
      userId,
    );
    if (isUserExist) {
      setNotMatched(["enrollment_number"]);
    }
    // else if (success && formData.enrollment_status === "enrolled") {
    //   nextPreviewStep();
    // }
    else {
      navigate(`/admin/beneficiary/${userId}`);
    }
  };

  const onSubmit = async () => {
    setBtnLoading(true);
    await handleValidationErrors();
    setBtnLoading(false);
  };

  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      RefAppBar={refAppBar}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack alignItems={"center"} space="1" pt="3">
        <IconByName name="UserLineIcon" size="md" />
        <AdminTypo.H1 color="Activatedcolor.400">
          {t("All_AG_LEARNERS")}
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
          {["enrolled_ip_verified", "registered_in_camp"].includes(
            benificiary?.program_beneficiaries?.status,
          )
            ? `${
                [
                  benificiary?.program_beneficiaries?.enrollment_first_name,
                  benificiary?.program_beneficiaries?.enrollment_last_name,
                ]
                  .filter(Boolean)
                  .join(" ") || "-"
              }`
            : `${
                [benificiary?.first_name, benificiary?.last_name]
                  .filter(Boolean)
                  .join(" ") || "-"
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
