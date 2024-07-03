import React, { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";
// import PropTypes from "prop-types";
import {
  geolocationRegistryService,
  PCusers_layout as Layout,
  BodyMedium,
  filterObject,
  FrontEndTypo,
  enumRegistryService,
  getOptions,
  validation,
  campService,
  jsonParse,
} from "@shiksha/common-lib";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";

// App
export default function App({ footerLinks }) {
  const { step } = useParams();
  const { id } = useParams();
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEdit] = useState(true);
  const [campDetails, setCampDetails] = useState();
  const [enumOptions, setEnumOptions] = useState({});
  const programSelected = jsonParse(localStorage.getItem("program"));
  const location = useLocation();

  const getCampKitDetails = async () => {
    setLoading(true);
    try {
      const payload = {
        academic_year_id: location.state?.academic_year_id,
        program_id: location.state?.program_id,
        user_id: location.state?.user_id,
        camp_id: id,
      };
      const result = await campService.getCampKitDetails(payload);
      console.log("result", result);
      setCampDetails(result?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoading(false);
    }
  };

  React.useEffect(() => {
    getCampKitDetails();
  }, []);

  useEffect(async () => {
    setLoading(true);
    if (step === "edit_kit_details") {
      const kit = campDetails;
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      let schemaData = properties[newStep];
      if (campDetails?.kit_received === null) {
        const { kit_received } = schemaData.properties;
        const required = schemaData?.required.filter((item) =>
          ["kit_received"].includes(item)
        );
        const newSchema = {
          ...schemaData,
          properties: { kit_received },
          required: required,
        };
        setSchema(newSchema);
      } else {
        setFormData({
          ...formData,
          kit_was_sufficient: kit?.kit_was_sufficient || undefined,
          kit_received: kit?.kit_received || undefined,
          kit_ratings: kit?.kit_ratings || undefined,
          kit_feedback: kit?.kit_feedback || undefined,
        });
      }
    }
    setLoading(false);
  }, [campDetails, step]);

  const onPressBackButton = async () => {
    const data = await nextPreviewStep("p");
    if (data && onClick) {
      onClick("SplashScreen");
    }
  };

  const nextPreviewStep = async (pageStape = "n") => {
    setAlert();
    const index = pages.indexOf(page);
    if (index !== undefined) {
      let nextIndex = "";
      if (pageStape.toLowerCase() === "n") {
        nextIndex = pages[index + 1];
      } else {
        nextIndex = pages[index - 1];
      }
      if (pageStape === "p") {
        navigate(`/camps`);
      } else if (nextIndex !== undefined) {
        if (step === "edit_kit_details") {
          // navigate(`/camps/${id}/edit_family_consent`);
        } else {
          // navigate(`/camps/${id}/${nextIndex}`);
        }
      }
    }
  };

  const fetchData = async () => {
    try {
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data : {});
    } catch (error) {
      // Handle errors appropriately
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(async () => {
    const facilitiesData = enumOptions?.CAMP_PROPERTY_FACILITIES;
    if (step === "edit_property_facilities") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      const newSchema = properties[newStep];
      newSchema.properties.property_facilities.required = [];
      facilitiesData?.map((element) => {
        const propertyName = element?.value;
        newSchema.properties.property_facilities.required.push(propertyName);
        newSchema.properties.property_facilities.properties[propertyName] = {
          label: element?.title,
          type: "string",
          format: "CheckUncheck",
          readOnly: true,
        };
      });

      const facilities = {
        property_facilities: jsonParse(
          campDetails?.properties?.property_facilities || "{}"
        ),
      };
      setFormData(facilities);
    }
  }, [step, campDetails]);

  // update schema
  useEffect(async () => {
    let newSchema = schema;
    if (schema?.["properties"]?.["property_type"]) {
      newSchema = getOptions(newSchema, {
        key: "property_type",
        arr: enumOptions?.CAMP_PROPERTY_TYPE,
        title: "title",
        value: "value",
      });
    }
    if (schema?.properties?.district) {
      await setDistric({
        schemaData: newSchema,
        state: programSelected?.state_name,
        district: formData?.district,
        block: formData?.block,
        gramp: formData?.grampanchayat,
      });
    }
  }, [enumOptions, page, formData]);

  useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = step || newSteps[0];
      let schemaData = properties[newStep];
      setPage(newStep);
      setSchema(schemaData);
      setPages(newSteps);

      if (step === "edit_kit_details") {
        if (formData?.kit_received == "yes") {
          setSchema(schemaData);
        } else if (formData?.kit_received === "no") {
          const { kit_received } = schemaData.properties;
          const required = schemaData?.required.filter((item) =>
            ["kit_received"].includes(item)
          );
          const newSchema = {
            ...schemaData,
            properties: { kit_received },
            required: required,
          };
          setSchema(newSchema);
        }
      } else {
        setSchema(schemaData);
      }
    }
  }, [step, formData]);

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t(schema?.step_name)}</FrontEndTypo.H2>,
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      loading={loading || !campDetails?.group?.status}
      analyticsPageTitle={"CAMP"}
      pageTitle={t("CAMP_FORM")}
      stepTitle={step}
    >
      {["camp_ip_verified", "inactive"].includes(campDetails?.group?.status) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <FrontEndTypo.H3>{t("PAGE_NOT_ACCESSABLE")}</FrontEndTypo.H3>
          </HStack>
        </Alert>
      ) : (
        <Box py={6} px={4} mb={5}>
          {alert && (
            <Alert status="warning" alignItems={"start"} mb="3">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon />
                <FrontEndTypo.H2>{alert}</FrontEndTypo.H2>
              </HStack>
            </Alert>
          )}
          {page && page !== "" && (
            <Form
              key={schema}
              ref={formRef}
              extraErrors={errors}
              showErrorList={false}
              noHtml5Validate={true}
              {...{
                widgets,
                templates,
                validator,
                schema: schema || {},
                formData,
                onError,
                transformErrors: (errors) => transformErrors(errors, schema, t),
              }}
            ></Form>
          )}
        </Box>
      )}
    </Layout>
  );
}
