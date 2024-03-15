import {
  AdminTypo,
  PoAdminLayout,
  organisationService,
} from "@shiksha/common-lib";
import { VStack } from "native-base";
import React, { useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  widgets,
  templates,
  onError,
  transformErrors,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const schema = {
  title: "CREATE_IP",
  description: "ADD_A_IP",
  type: "object",
  required: ["name", "mobile", "contact_person"],
  properties: {
    name: {
      type: "string",
      title: "NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    mobile: {
      type: "string",
      title: "MOBILE_NUMBER",
      format: "MobileNumber",
    },
    contact_person: {
      type: "string",
      title: "CONTACT_PERSON",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    address: {
      type: "string",
      title: "CONTACT_PERSON",
      col: 4,
      format: "textarea",
    },
  },
};

export default function App() {
  const { t } = useTranslation();
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  //   const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    const newData = data.formData;
    const result = await organisationService.create(newData);

    if (!result.error) {
      navigate("/poadmin/ips");
    } else {
      setErrors({
        name: {
          __errors: [result?.message],
        },
      });
    }
    setLoading(false);
  };

  return (
    <PoAdminLayout _appBar={{ setLang }}>
      <VStack p="4">
        <Form
          key={lang}
          ref={formRef}
          extraErrors={errors}
          showErrorList={false}
          noHtml5Validate={true}
          {...{
            widgets,
            templates,
            validator,
            schema: schema || {},
            // formData,
            onError,
            onSubmit,
            transformErrors: (e) => transformErrors(e, schema, t),
          }}
        >
          <AdminTypo.PrimaryButton
            isLoading={loading}
            type="submit"
            p="4"
            mt="10"
            onPress={(e) => {
              formRef?.current?.submit();
            }}
          >
            {t("SUBMIT")}
          </AdminTypo.PrimaryButton>
        </Form>
      </VStack>
    </PoAdminLayout>
  );
}
