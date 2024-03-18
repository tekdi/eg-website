import React, { useEffect, useRef, useState } from "react";
import {
  PoAdminLayout,
  IconByName,
  AdminTypo,
  organisationService,
  getOptions,
  cohortService,
} from "@shiksha/common-lib";
import { VStack, HStack, Button } from "native-base";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useNavigate, useParams } from "react-router-dom";
import { widgets, templates, transformErrors } from "component/BaseInput";
import { useTranslation } from "react-i18next";

const Schema = {
  type: "object",
  required: [
    "state",
    "organisation_id",
    "doc_per_cohort_id",
    "doc_quarterly_id",
    "doc_per_monthly_id",
    "learner_target",
  ],
  properties: {
    state: {
      type: "string",
      title: "STATE",
      readOnly: true,
    },
    organisation_id: {
      type: "string",
      title: "NAME",
      format: "select",
      // regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    learner_target: {
      type: "number",
      title: "LEARNERS_TARGET",
    },
    doc_per_cohort_id: {
      label: "DUE_DILIGENCE_SIGNED_PROPOSAL",
      uploadTitle: "DUE_DILIGENCE_SIGNED_PROPOSAL",
      type: ["string", "number", "null"],
      document_type: "existing_ip",
      format: "FileUpload",
    },
    doc_quarterly_id: {
      label: "QUARTELY_CA_CERTIFIED",
      uploadTitle: "QUARTELY_CA_CERTIFIED",
      type: ["string", "number", "null"],
      document_type: "existing_ip",
      format: "FileUpload",
    },
    doc_per_monthly_id: {
      label: "MONTHLY_UTILIZATION",
      uploadTitle: "MONTHLY_UTILIZATION",
      type: ["string", "number", "null"],
      document_type: "existing_ip",
      format: "FileUpload",
    },
  },
};

function ExistingIpForm() {
  const formRef = useRef();
  const [schema, setSchema] = useState(Schema);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(async () => {
    let newSchema = Schema;
    if (Schema?.properties?.organisation_id) {
      const result = await organisationService.getExistingIpList();
      if (Schema["properties"]["organisation_id"]) {
        newSchema = getOptions(newSchema, {
          key: "organisation_id",
          arr: result?.data,
          title: "name",
          value: "id",
        });
      }
    }
    if (Schema.properties.state) {
      const localData = JSON.parse(localStorage.getItem("program"));
      newSchema = {
        ...newSchema,
        properties: {
          ...newSchema.properties,
          state: {
            ...newSchema.properties.state,
            default: `${localData?.program_id}`,
          },
        },
      };
      const { data } = await cohortService.getProgramList();
      const newData = data.map((e) => ({
        ...e,
        state_name: `${e?.state?.state_name}`,
      }));
      newSchema = getOptions(newSchema, {
        key: "state",
        arr: newData,
        title: "state_name",
        value: "id",
      });
    }
    setSchema(newSchema);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const newData = data?.formData;
    const result = await organisationService.addExistingIP(newData);
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
    <PoAdminLayout>
      <VStack p={4}>
        <HStack pt={4} pb={4} space={2} alignItems={"center"}>
          <IconByName name="CommunityLineIcon" />
          <AdminTypo.H2>{t("IP/ORGANISATION_LIST")}</AdminTypo.H2>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={() => navigate("/poadmin/ips")}
          />
        </HStack>
        <AdminTypo.H6 color={"textGreyColor.500"} bold>
          {t("ADD_EXISTING_IP")}
        </AdminTypo.H6>
        <VStack p={4}>
          <Form
            ref={formRef}
            validator={validator}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            schema={schema || {}}
            {...{
              widgets,
              templates,
              validator,
              onSubmit,
              transformErrors: (e) => transformErrors(e, schema, t),
            }}
          >
            <HStack pt={6} space={6}>
              <AdminTypo.Secondarybutton
                icon={
                  <IconByName
                    color="black"
                    _icon={{ size: "18px" }}
                    name="DeleteBinLineIcon"
                  />
                }
                onPress={(e) => navigate(`/poadmin/ips`)}
              >
                {t("CANCEL")}
              </AdminTypo.Secondarybutton>
              <AdminTypo.Dangerbutton
                isLoading={loading}
                onPress={() => {
                  formRef?.current?.submit();
                }}
              >
                {t("SAVE")}
              </AdminTypo.Dangerbutton>
            </HStack>
          </Form>
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}

export default ExistingIpForm;
