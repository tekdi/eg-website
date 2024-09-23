import React, { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import schema1 from "./schema.js";
import { Alert, Box, HStack } from "native-base";

import {
  geolocationRegistryService,
  Layout,
  t,
  BodyMedium,
  enumRegistryService,
  benificiaryRegistoryService,
  AgRegistryService,
  FrontEndTypo,
  getOptions,
  facilitatorRegistryService,
  jsonParse,
} from "@shiksha/common-lib";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  templates,
  widgets,
} from "../../../Static/FormBaseInput/FormBaseInput.js";
import accessControl from "pages/front-end/facilitator/edit/AccessControl.js";
import { setDistrict, setBlock, setVillage } from "utils/localHelper.js";
import PropTypes from "prop-types";

// App
export default function AddressEdit({ ip }) {
  const [page, setPage] = useState();
  const [pages, setPages] = useState();
  const [schema, setSchema] = useState();
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState();
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const { id } = useParams();
  const userId = id;
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${userId}`);
  };
  const [isDisable, setIsDisable] = useState(false);
  const [searchParams] = useSearchParams();
  const redirectLink = searchParams.get("redirectLink");

  //getting data
  useEffect(async () => {
    const qData = await benificiaryRegistoryService.getOne(id);
    const finalData = qData?.result;
    const { lat, long } = finalData || {};
    let programSelected = jsonParse(localStorage.getItem("program"));
    setFormData({
      ...formData,
      location: { lat, long },
      address: finalData?.address == "null" ? "" : finalData?.address,
      state: programSelected?.state_name,
      district: finalData?.district,
      block: finalData?.block,
      village: finalData?.village,
      grampanchayat:
        finalData?.grampanchayat == "null" ? "" : finalData?.grampanchayat,
      pincode: finalData?.pincode === null ? "" : finalData?.pincode,
    });
    const obj = {
      edit_req_for_context: "users",
      edit_req_for_context_id: id,
    };
    const result = await facilitatorRegistryService.getEditRequests(obj);
    let field;
    const parseField = result?.data[0]?.fields;
    if (parseField && typeof parseField === "string") {
      field = JSON.parse(parseField);
    }
    setFields(field || []);
  }, []);

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
        setSchemaData(properties[nextIndex]);
      } else if (pageStape.toLowerCase() === "n") {
        await formSubmitUpdate({ ...formData, form_step_number: "6" });
        setPage("SAVE");
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
          setSchemaData(properties[pageNumber]);
        }
      } else {
        nextPreviewStep();
      }
    }
  };

  useEffect(async () => {
    if (schema?.properties?.district) {
      const qData = await geolocationRegistryService.getStates();
      let newSchema = schema;
      let programSelected = jsonParse(localStorage.getItem("program"));
      if (schema["properties"]["state"]) {
        newSchema = getOptions(newSchema, {
          key: "state",
          arr: qData?.states,
          title: "state_name",
          value: "state_name",
        });
      }
      newSchema = await setDistrict({
        schemaData: newSchema,
        state: programSelected?.state_name,
        district: formData?.district,
        block: formData?.block,
        // gramp: formData?.grampanchayat,
        // setSchema,
      });
      setSchemaData(newSchema);
    }
  }, [
    formData?.state,
    formData?.district,
    formData?.block,
    // formData?.grampanchayat,
  ]);

  useEffect(() => {
    if (schema1.type === "step") {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      setPage(newSteps[0]);
      setSchemaData(properties[newSteps[0]]);
      setPages(newSteps);
    }
  }, []);

  const formSubmitUpdate = async (formData) => {
    if (id) {
      await enumRegistryService.editProfileById({
        ...formData,
        id: id,
      });
    }
  };

  const goErrorPage = (key) => {
    if (key) {
      pages.forEach((e) => {
        const data = schema1["properties"]?.[e]["properties"]?.[key];
        if (data) {
          setStep(e);
        }
      });
    }
  };

  const customValidate = (data, errors, c) => {
    ["grampanchayat"].forEach((key) => {
      if (
        key === "grampanchayat" &&
        data?.grampanchayat?.replace(/\s/g, "") === ""
      ) {
        errors?.[key]?.addError(
          `${t("REQUIRED_MESSAGE")} ${t(schema?.properties?.[key]?.title)}`,
        );
      }
    });

    return errors;
  };

  const transformErrors = (errors, uiSchema) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title,
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
    if (id === "root_state") {
      await setDistric({
        schemaData: schema,
        state: data?.state,
        district: data?.district,
        block: data?.block,
      });
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: null,
        schemaData: schema,
        // setSchema,
      });
    }

    if (id === "root_block") {
      await setVillage({
        block: data?.block,
        schemaData: schema,
        // setSchema,
      });
    }

    if (id === "root_grampanchayat") {
      if (!data?.grampanchayat?.match(/^[a-zA-Z ]*$/g)) {
        const newErrors = {
          grampanchayat: {
            __errors: [t("REQUIRED_MESSAGE")],
          },
        };
        setErrors(newErrors);
      }
    }

    if (id === "root_address") {
      if (
        !data?.address?.match(
          /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?/\s]*$/,
        ) &&
        data?.address !== null
      ) {
        const newErrors = {
          address: {
            __errors: [t("REQUIRED_MESSAGE")],
          },
        };
        setErrors(newErrors);
      }
    }
    if (id === "root_pincode") {
      const regex = /^\d{6}$/;
      if (data?.pincode && !regex.test(data.pincode)) {
        const newErrors = {
          pincode: {
            __errors: [t("PINCODE_ERROR")],
          },
        };
        setErrors(newErrors);
      }
    }
  };

  const onError = (data) => {
    if (data[0]) {
      const key = data[0]?.property?.slice(1);
      goErrorPage(key);
    }
  };

  const onSubmit = async (data) => {
    if (_.isEmpty(errors)) {
      setIsDisable(true);
      const obj = {
        ...formData,
        lat: formData?.location?.lat,
        long: formData?.location?.long,
      };

      await AgRegistryService.updateAg(obj, userId);
      if (redirectLink) {
        navigate(redirectLink);
      } else navigate(`/beneficiary/${userId}/addressdetails`);
    }
  };

  const setSchemaData = (newSchema) => {
    setSchema(accessControl(newSchema, fields));
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
        name: t("ADDRESS_DETAILS"),
        lang,
        setLang,
      }}
      _page={{ _scollView: { bg: "white" } }}
      analyticsPageTitle={"BENEFICIARY_ADDRESS_EDIT"}
      pageTitle={t("BENEFICIARY")}
      stepTitle={t("ADDRESS_EDIT")}
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
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              validator,
              schema: schema || {},
              formData,
              customValidate,
              onChange,
              onError,
              onSubmit,
              transformErrors,
              widgets,
              templates,
            }}
          >
            {redirectLink && (
              <FrontEndTypo.Primarybutton
                p="4"
                mt="4"
                isDisabled={isDisable}
                onPress={() => {
                  if (formRef.current.validateForm()) {
                    formRef?.current?.submit();
                  }
                }}
              >
                {t("SAVE_AND_ENROLLMENT")}
              </FrontEndTypo.Primarybutton>
            )}
            <FrontEndTypo.Primarybutton
              isDisabled={isDisable}
              mt="3"
              type="submit"
              onPress={() => {
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }}
            >
              {pages[pages?.length - 1] === page && t("SAVE")}
            </FrontEndTypo.Primarybutton>
          </Form>
        )}
      </Box>
    </Layout>
  );
}

AddressEdit.propTypes = {
  ip: PropTypes.any,
};
