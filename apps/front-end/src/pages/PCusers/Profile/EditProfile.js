import React, { useEffect, useRef, useState } from "react";
import {
  PCusers_layout as Layout,
  CardComponent,
  FrontEndTypo,
  getOptions,
  geolocationRegistryService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import Form from "@rjsf/core";
import { schema1 } from "./schema";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "v2/components/Static/FormBaseInput/FormBaseInput";
import { useParams } from "react-router-dom";

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const formRef = useRef();
  const [schema, setSchema] = useState({});
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const { activity } = useParams();
  const { step } = useParams();

  useEffect(async () => {
    setSchema(schema1);
    setLoading(false);
  }, []);

  const uiSchema = {
    labelTime: {
      "ui:widget": "LabelTimeWidget",
    },
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData({ ...newData });
    const obj = {
      hours: data?.hours || 0,
      minutes: data?.minutes || 0,
    };
    if (id === "root_hours" || id === "root_minutes") {
      validateTime(obj);
    }

    if (id === "root_description") {
      if (data?.description === "") {
        setFormData({ ...formData, description: undefined });
      }
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (_.isEmpty(errors)) {
      console.log({ newFormData });
      navigate(`/dailyactivities/${activity}/view`);
    }
  };
  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate("/"),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("YOUR_PROFILE")}</FrontEndTypo.H2>,
      }}
      analyticsPageTitle={"FACILITATOR_PROFILE"}
      pageTitle={t("FACILITATOR")}
      stepTitle={t("PROFILE")}
    >
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
          onChange,
          onSubmit,
          uiSchema,
          onError,
          transformErrors: (errors) => transformErrors(errors, schema, t),
        }}
      ></Form>
    </Layout>
  );
};

export default EditProfile;
