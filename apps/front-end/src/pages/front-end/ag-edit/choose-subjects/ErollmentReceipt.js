import React from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  benificiaryRegistoryService,
  dateOfBirth,
  enrollmentDateOfBirth,
  validation,
} from "@shiksha/common-lib";
import enrollmentSchema from "./EnrollmentSchema.js";
import { Alert, Box, Button, HStack } from "native-base";
import { useParams, useLocation } from "react-router-dom";

import { Layout, filtersByObject, BodyMedium } from "@shiksha/common-lib";

//updateSchemaEnum
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  TitleFieldTemplate,
  DescriptionFieldTemplate,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTitleTemplate,
  BaseInputTemplate,
  select,
} from "../../../../component/BaseInput.js";
import { useTranslation } from "react-i18next";

// App
export default function App({ facilitator }) {
  const [page, setPage] = React.useState();
  const [pages, setPages] = React.useState();
  const [schema, setSchema] = React.useState({});
  const [submitBtn, setSubmitBtn] = React.useState();
  const formRef = React.useRef();
  const [formData, setFormData] = React.useState(facilitator);
  const [errors, setErrors] = React.useState({});
  const [alert, setAlert] = React.useState();
  const [yearsRange, setYearsRange] = React.useState([1980, 2030]);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const [benificiary, setBenificiary] = React.useState();
  const { state } = useLocation();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const onPressBackButton = async () => {
    navigate(`/beneficiary/${id}/enrollmentdetails`);
  };
  const ref = React.createRef(null);
  React.useEffect(() => {
    benificiaryDetails();
  }, []);
  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setBenificiary(result?.result);
  };

  const [uiSchema, setUiSchema] = React.useState({
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
    setAlert();
    const index = pages.indexOf(page);
    const properties = enrollmentSchema.properties;
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
        setPage("upload");
      } else {
        return true;
      }
    }
  };
  const setStep = async (pageNumber = "") => {
    if (enrollmentSchema.type === "step") {
      const properties = enrollmentSchema.properties;
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

  React.useEffect(async () => {
    if (enrollmentSchema.type === "step") {
      const properties = enrollmentSchema.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchema(properties[newSteps[0]]);
      setPages(newSteps);
      let minYear = moment().subtract("years", 50);
      let maxYear = moment().subtract("years", 18);
      setYearsRange([minYear.year(), maxYear.year()]);
      setSubmitBtn(t("NEXT"));
    }
    if (facilitator?.id) {
      const data = localStorage.getItem(`id_data_${facilitator?.id}`);
      const newData = JSON.parse(data);
      setFormData({ ...newData, ...facilitator });
    }

    const qData = await benificiaryRegistoryService.getOne(id);
    let enrollment_first_name =
      qData?.result?.program_beneficiaries?.enrollment_first_name;
    let enrollment_middle_name =
      qData?.result?.program_beneficiaries?.enrollment_middle_name;
    let enrollment_last_name =
      qData?.result?.program_beneficiaries?.enrollment_last_name;
    let enrollment_dob = qData?.result?.program_beneficiaries?.enrollment_dob;
    let enrollment_aadhaar_no =
      qData?.result?.program_beneficiaries?.enrollment_aadhaar_no;
    setFormData({
      ...formData,
      enrollment_first_name: enrollment_first_name ? enrollment_first_name : "",
      enrollment_middle_name: enrollment_middle_name
        ? enrollment_middle_name
        : "",
      enrollment_last_name: enrollment_last_name ? enrollment_last_name : "",
      enrollment_dob: enrollment_dob ? enrollment_dob : "",
      enrollment_aadhaar_no: enrollment_aadhaar_no
        ? parseInt(enrollment_aadhaar_no)
        : "",
    });
  }, []);

  React.useEffect(() => {
    if (formData?.enrollment_dob) {
      const dob = moment.utc(formData.enrollment_dob).format("DD-MM-YYYY");

      enrollmentDateOfBirth(state?.enrollment_date, dob)
        .then((age) => {
          setUiSchema((prevUiSchema) => ({
            ...prevUiSchema,
            enrollment_dob: {
              ...prevUiSchema.enrollment_dob,
              "ui:help": age?.message,
            },
          }));
          if (!(age.diff >= 14 && age.diff <= 29)) {
            setAlert(t("THE_AGE_OF_THE_LEARNER_SHOULD_BE_15_TO_29_YEARS"));
          } else {
            setAlert();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [formData, benificiary?.program_beneficiaries?.enrollment_date]);

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        const data = enrollmentSchema["properties"][e]["properties"][key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const transformErrors = (errors, uiSchema) => {
    return errors?.map((error) => {
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
    setErrors({});
    const data = e.formData;
    if (id === "root_enrollment_aadhaar_no") {
      if (data?.enrollment_aadhaar_no) {
        const newErrors = validation({
          data: data?.enrollment_aadhaar_no,
          key: "enrollment_aadhaar_no",
          errors: {
            enrollment_aadhaar_no: {
              addError: (e) => {
                setErrors({
                  ...errors,
                  enrollment_aadhaar_no: {
                    __errors: [e],
                  },
                });
              },
            },
          },
          message: `${t("AADHAAR_SHOULD_BE_12_DIGIT_VALID_NUMBER")}`,
          type: "aadhaar",
        });
      }
    }

    if (
      data?.enrollment_first_name &&
      !`${data?.enrollment_first_name}`?.match(/^[a-zA-Z ]*$/g)
    ) {
      const newErrors = {
        enrollment_first_name: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    }

    if (
      data?.enrollment_middle_name &&
      !`${data?.enrollment_middle_name}`?.match(/^[a-zA-Z ]*$/g)
    ) {
      const newErrors = {
        enrollment_middle_name: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    }

    if (
      data?.enrollment_last_name &&
      !`${data?.enrollment_last_name}`?.match(/^[a-zA-Z ]*$/g)
    ) {
      const newErrors = {
        enrollment_last_name: {
          __errors: [t("REQUIRED_MESSAGE")],
        },
      };
      setErrors(newErrors);
    }

    const newData = { ...formData, ...data };
    setFormData(newData);
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    const bodyData = {
      edit_page_type: "edit_enrollement_details",
      enrollment_status: "enrolled",
      is_eligible: alert ? "no" : "yes",
      enrollment_first_name: newFormData?.enrollment_first_name,
      enrollment_middle_name: newFormData?.enrollment_middle_name,
      enrollment_last_name: newFormData?.enrollment_last_name,
      enrollment_dob: newFormData?.enrollment_dob,
      enrollment_aadhaar_no: newFormData?.enrollment_aadhaar_no.toString(),
    };
    if (bodyData) {
      const updateDetails = await benificiaryRegistoryService.enrollmentReceipt(
        id,
        bodyData
      );
      if (updateDetails) {
        navigate(`/beneficiary/profile/${id}`);
      }
    } else {
      validation();
    }
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "userInfo"],
        name: t("ENROLLMENT_RECEIPT"),
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <Box py={6} px={4} mb={5}>
        {/* Box */}
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
            key={lang + schema + uiSchema}
            ref={formRef}
            widgets={{ select }}
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
              uiSchema,
              formData,
              onChange,
              onError,
              onSubmit,
              transformErrors,
            }}
          >
            <Button
              mt="3"
              variant={"primary"}
              onPress={() => {
                if (Object.keys(errors).length > 0) {
                  console.log("hi");
                } else {
                  formRef?.current?.submit();
                }
              }}
            >
              {pages[pages?.length - 1] === page ? t("SAVE") : submitBtn}
            </Button>
          </Form>
        ) : (
          <React.Fragment />
        )}
      </Box>
    </Layout>
  );
}
