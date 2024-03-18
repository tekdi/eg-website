import {
  AdminTypo,
  PoAdminLayout,
  organisationService,
  getOptions,
  IconByName,
  cohortService,
  setSelectedProgramId,
  Breadcrumb,
} from "@shiksha/common-lib";
import { Button, HStack, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
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
import Chip from "component/Chip";

const Schema = {
  // title: "CREATE_IP",
  // description: "ADD_A_IP",
  type: "object",
  required: [
    "name",
    "mobile",
    "contact_person",
    "address",
    "learner_target",
    "doc_per_cohort_id",
    "doc_per_monthly_id",
    "doc_quarterly_id",
    "email_id",
    "state",
  ],
  properties: {
    name: {
      type: "string",
      title: "IP_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    contact_person: {
      type: "string",
      title: "CONTACT_PERSON",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    mobile: {
      type: "string",
      title: "CONTACT_PERSON_MOBILE",
      format: "MobileNumber",
    },
    email_id: {
      type: "string",
      format: "email",
      title: "EMAIL_ID",
    },
    state: {
      title: "STATE",
      type: "string",
      format: "select",
    },
    address: {
      title: "IP_ADDRESS",
      type: "string",
    },
    learner_target: {
      title: "LEARNER_TARGET",
      type: "string",
    },
    doc_per_cohort_id: {
      type: "string",
      label: "DUE_DILIGENCE_SIGNED_PROPOSAL",
      document_type: "camp",
      document_sub_type: "consent_form",
      format: "FileUpload",
    },
    doc_per_monthly_id: {
      type: "string",
      label: "QUARTELY_CA_CERTIFIED",
      document_type: "camp",
      document_sub_type: "consent_form",
      format: "FileUpload",
    },
    doc_quarterly_id: {
      type: "string",
      label: "MONTHLY_UTILIZATION",
      document_type: "camp",
      document_sub_type: "consent_form",
      format: "FileUpload",
    },
  },
};

export default function App() {
  const { t } = useTranslation();
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const navigate = useNavigate();
  const [schema, setSchema] = useState({});
  const [formData, setFormData] = useState();

  useEffect(async () => {
    if (Schema?.properties?.state) {
      const { data } = await cohortService.getProgramList();
      const newData = data.map((e) => ({
        ...e,
        state_name: `${e?.state?.state_name}`,
      }));
      let newSchema = Schema;
      if (Schema["properties"]["state"]) {
        newSchema = getOptions(newSchema, {
          key: "state",
          arr: newData,
          title: "state_name",
          value: "id",
        });
      }
      setSchema(newSchema);
    }
  }, []);

  const onChange = async (e, id) => {
    const newData = e.formData;
    if (newData?.state) {
      setSelectedProgramId({
        program_id: newData?.state,
      });
    }
  };
  const onSubmit = async (data) => {
    setLoading(true);
    const newData = data.formData;
    const result = await organisationService.createOrg(newData);

    if (!result.error) {
      navigate("/poadmin/ips");
    } else {
      setFormData(newData);
      setErrors({
        [result?.key || "name"]: {
          __errors: [result?.message],
        },
      });
    }
    setLoading(false);
  };

  return (
    <PoAdminLayout _appBar={{ setLang }}>
      <VStack p={4}>
        <VStack pt={4}>
          <Breadcrumb
            drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
            data={[
              {
                title: (
                  <HStack>
                    <IconByName name="GroupLineIcon" size="md" />
                    <AdminTypo.H4 bold color="Activatedcolor.400">
                      {t("ALL_IPS")}
                    </AdminTypo.H4>
                  </HStack>
                ),
                link: "/poadmin/ips",
                icon: "GroupLineIcon",
              },
              {
                title: (
                  <AdminTypo.H4
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    bold
                  >
                    {t("CREATE")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </VStack>

        <VStack p="4" space={4}>
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
              formData,
              onError,
              onSubmit,
              onChange,
              transformErrors: (e) => transformErrors(e, schema, t),
            }}
          >
            <HStack space={6} justifyContent={"center"} my="4">
              <AdminTypo.Secondarybutton
                icon={
                  <IconByName
                    color="black"
                    _icon={{ size: "18px" }}
                    name="DeleteBinLineIcon"
                  />
                }
                onPress={() => navigate("/poadmin/ips")}
              >
                {t("CANCEL")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.PrimaryButton
                isLoading={loading}
                type="submit"
                p="4"
                onPress={() => {
                  console.log("hello", formRef.current.validateForm());
                  // if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                  // }
                }}
              >
                {t("SUBMIT")}
              </AdminTypo.PrimaryButton>
            </HStack>
          </Form>
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}
