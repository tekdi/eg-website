import React, { useEffect, useRef, useState } from "react";
import {
  PoAdminLayout,
  IconByName,
  AdminTypo,
  organisationService,
  getOptions,
  cohortService,
  Breadcrumb,
} from "@shiksha/common-lib";
import { VStack, HStack } from "native-base";
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
    "learner_target",
    "learner_per_camp",
    "camp_target",
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
    },
    learner_target: {
      title: "LEARNER_TARGET",
      type: "string",
    },
    learner_per_camp: {
      title: "LEARNERS_PER_TARGET",
      format: "select",
      enum: ["15", "16", "17", "18", "19", "20"],
    },
    camp_target: {
      type: ["string", "number"],
      title: "TARGET_CAMP",
      readOnly: true,
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
  const [formData, setFormData] = useState();

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

  const onChange = async (e, id) => {
    const newData = e.formData;
    if (id === "root_learner_target" || id === "root_learner_per_camp") {
      const avgCount = Math.ceil(
        newData?.learner_target / newData?.learner_per_camp
      );
      const updatedFormData = { ...newData };
      updatedFormData.camp_target = avgCount;
      setFormData(updatedFormData);
    }
  };

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
        <VStack pt={4} pb={4}>
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
                    {t("EXISTING_IP")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </VStack>

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
              formData,
              onChange,
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
