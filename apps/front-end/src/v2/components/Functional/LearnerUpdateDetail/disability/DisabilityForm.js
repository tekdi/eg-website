import Form from "@rjsf/core";
import {
  FrontEndTypo,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
  filterObject,
  getOptions,
  getSelectedProgramId,
} from "@shiksha/common-lib";
import { VStack } from "native-base";
import { useEffect, useRef, useState } from "react";
import schema1 from "./schema.js";
//updateSchemaEnum
import validator from "@rjsf/validator-ajv8";
import { scrollToField } from "component/BaseInput.js";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  onError,
  templates,
  transformErrors,
  widgets,
} from "../../../Static/FormBaseInput/FormBaseInput.js";

const setSchemaByDependency = async (data, fixedSchema) => {
  const constantSchema = fixedSchema;
  let newSchema = {};
  let newData = {};
  const keys = Object.keys(schema1?.properties || {}).reduce((acc, key) => {
    if (schema1.properties[key].properties) {
      acc.push(...Object.keys(schema1.properties[key].properties));
    }
    return acc;
  }, []);
  keys.forEach((e) => {
    newData = { ...newData, [e]: data?.[e] || undefined };
  });

  if (data?.has_disability == "yes") {
    let otherProperties = {},
      required = [];
    if (data?.has_govt_advantage == "yes") {
      otherProperties = constantSchema?.properties || {};
      required = keys;
    } else {
      const { govt_advantages, ...other } = constantSchema?.properties || {};
      otherProperties = other;
      required = keys.filter((e) => e != "govt_advantages");
    }
    newSchema = {
      ...constantSchema,
      properties: otherProperties,
      required: required,
    };
  } else {
    const { has_disability } = constantSchema?.properties || {};
    newSchema = {
      ...constantSchema,
      properties: {
        has_disability,
      },
      required: ["has_disability"],
    };
  }
  return { newSchema, newData };
};

const setEnums = async (schemaData) => {
  let { state_name } = await getSelectedProgramId();
  let ListofEnum = await enumRegistryService.listOfEnum();
  const {
    BENEFICIARY_HAVE_DISABILITY,
    BENEFICIARY_DISABILITY_TYPE,
    BENEFICIARY_DISABILITY_CERTIFICATE,
    BENEFICIARY_DISABILITY_OCCURENCE,
    BENEFICIARY_TAKING_ADVANTAGE_DISABILITY,
    BENEFICIARY_EXAM_SUPPORT_NEEDED,
  } = ListofEnum?.data || {};

  let newSchema = getOptions(schemaData, {
    key: "has_disability",
    arr: BENEFICIARY_HAVE_DISABILITY,
    title: "title",
    value: "value",
  });

  newSchema = getOptions(newSchema, {
    key: "has_disability_certificate",
    arr: BENEFICIARY_DISABILITY_CERTIFICATE,
    title: "title",
    value: "value",
  });

  newSchema = getOptions(newSchema, {
    key: "type_of_disability",
    arr: BENEFICIARY_DISABILITY_TYPE,
    title: "title",
    value: "value",
  });

  newSchema = getOptions(newSchema, {
    key: "disability_occurence",
    arr: BENEFICIARY_DISABILITY_OCCURENCE,
    title: "title",
    value: "value",
  });

  newSchema = getOptions(newSchema, {
    key: "has_govt_advantage",
    arr: BENEFICIARY_TAKING_ADVANTAGE_DISABILITY,
    title: "title",
    value: "value",
  });

  newSchema = getOptions(newSchema, {
    key: "govt_advantages",
    arr:
      ListofEnum?.data?.[
        `BENEFICIARY_DISABILITY_${state_name.replace(" ", "_")}`
      ] || [],
    title: "title",
    value: "value",
  });

  newSchema = getOptions(newSchema, {
    key: "support_for_exam",
    arr: BENEFICIARY_EXAM_SUPPORT_NEEDED,
    title: "title",
    value: "value",
  });
  return newSchema;
};

const uiSchema = {
  type_of_disability: {
    "ui:widget": "MultiCheck",
  },
  govt_advantages: {
    "ui:widget": "MultiCheck",
  },
  support_for_exam: {
    "ui:widget": "MultiCheck",
  },
};

// App
export default function DisabilityForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const userId = id;
  const [schema, setSchema] = useState();
  const [fixedSchema, setFixedSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate(`/beneficiary/${userId}/disability-details`);
  };

  useEffect(() => {
    const init = async () => {
      const properties = schema1.properties;
      const newSteps = Object.keys(properties);
      const newStep = newSteps[0];
      const constantSchema = schema1.properties?.[newStep];
      const { result } = await benificiaryRegistoryService.getOne(userId);
      const { extended_users } = result || {};
      const newSchema = await setEnums(constantSchema);
      setFixedSchema(newSchema);
      const updatedSchema = await setSchemaByDependency(
        extended_users,
        newSchema
      );
      setSchema(updatedSchema?.newSchema);
      const newdata = filterObject(
        updatedSchema?.newData,
        Object.keys(updatedSchema?.newSchema?.properties)
      );

      setFormData(newdata);
      setLoading(false);
    };
    init();
  }, []);

  const onChange = async (e, id) => {
    const data = e.formData;
    let newData = { ...formData, ...data };
    if (["root_has_disability", "root_has_govt_advantage"].includes(id)) {
      const updatedSchema = await setSchemaByDependency(data, fixedSchema);
      newData = updatedSchema?.newData ? updatedSchema?.newData : {};
      setSchema(updatedSchema?.newSchema);
      setErrors();
    } else if (id == "root_support_for_exam") {
      if (
        formData?.support_for_exam?.length == 1 &&
        formData?.support_for_exam.includes("na") &&
        newData?.support_for_exam?.length > 1
      ) {
        newData = {
          ...newData,
          support_for_exam: newData?.support_for_exam.filter((e) => e != "na"),
        };
      } else if (newData?.support_for_exam?.includes("na")) {
        newData = { ...newData, support_for_exam: ["na"] };
      }
    }

    setFormData(newData);
  };

  // form submit
  const onSubmit = async () => {
    setBtnLoading(true);
    const keys = Object.keys(errors || {});
    if (keys?.length == 0) {
      const newFormData = formData;
      let newdata = filterObject(
        newFormData,
        Object.keys(schema?.properties),
        {},
        undefined
      );
      const { success, errors } =
        await benificiaryRegistoryService.updateDisability({
          ...newdata,
          id: userId,
        });
      const errorKeys = Object.keys(errors || {});
      if (errorKeys.length > 0) {
        setErrors(errors);
        scrollToField({ property: errorKeys?.[0] });
      } else if (success) {
        navigate(`/beneficiary/${userId}/disability-details`);
      }
    } else {
      scrollToField({ property: keys?.[0] });
    }
    setBtnLoading(false);
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton,
        name: t("BENEFICIARY_DISABILITY_DETAILS"),
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <VStack py={6} px={4} mb={5}>
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
            uiSchema,
            formData,
            onChange,
            onError,
            onSubmit,
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
      </VStack>
    </Layout>
  );
}
