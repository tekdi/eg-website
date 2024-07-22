import {
  AdminTypo,
  PoAdminLayout,
  organisationService,
  getOptions,
  IconByName,
  cohortService,
  setSelectedProgramId,
  Breadcrumb,
  validation,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
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
import { useNavigate, useParams } from "react-router-dom";

const baseSchema = {
  type: "object",
  required: [
    "org_id",
    "name",
    "mobile",
    "contact_person",
    "address",
    "learner_target",
    "email_id",
    "state",
    "camp_target",
    "learner_per_camp",
  ],
  properties: {
    org_id: {
      type: "number",
      title: "ID",
      readOnly: true,
    },
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
      readOnly: true,
    },
    state: {
      title: "STATE",
      format: "select",
      type: "string",
    },
    address: {
      title: "IP_ADDRESS",
      type: "string",
    },
    learner_target: {
      title: "LEARNER_TARGET",
      type: "number",
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

export default function App() {
  const { t } = useTranslation();
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const navigate = useNavigate();
  const [schema, setSchema] = useState(baseSchema);
  const [formData, setFormData] = useState({});
  const [orgId, setOrgId] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const updateSchema = async () => {
      let newSchema = { ...baseSchema };

      const data = await organisationService.getOne({ id });
      setOrgId(data?.data?.program_organisations?.[0]?.id);
      setFormData({
        org_id: data?.data?.id,
        name: data?.data?.name,
        contact_person: data?.data?.contact_person,
        mobile: data?.data?.mobile,
        address: data?.data?.address,
        email_id: data?.data?.email_id,
        state: `${data?.data?.program_organisations?.[0]?.program_id}`,
        learner_target: data?.data?.program_organisations?.[0]?.learner_target,
        learner_per_camp: `${data?.data?.program_organisations?.[0]?.learner_per_camp}`,
        camp_target: data?.data?.program_organisations?.[0]?.camp_target,
      });

      if (newSchema.properties.state) {
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
    };

    updateSchema();
  }, []);
  const onChange = async (e, id) => {
    const newData = e.formData;
    if (newData?.state) {
      setSelectedProgramId({
        program_id: newData?.state,
      });
    }
    if (id === "root_learner_target" || id === "root_learner_per_camp") {
      const avgCount = Math.ceil(
        newData?.learner_target / newData?.learner_per_camp
      );
      const updatedFormData = { ...newData, camp_target: avgCount };
      setFormData(updatedFormData);
    }
  };
  const customValidate = (data, err) => {
    if (data?.mobile) {
      const isValid = validation({
        data: data?.mobile,
        key: "mobile",
        type: "mobile",
      });
      if (isValid) {
        err?.mobile?.addError([t("PLEASE_ENTER_VALID_NUMBER")]);
      }
    }
    return err;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const newData = data.formData;
    const obj = {
      organisation: {
        name: newData?.name,
        contact_person: newData?.contact_person,
        mobile: newData?.mobile,
      },
      program_organisation: {
        id: orgId,
        learner_target: newData?.learner_target,
        learner_per_camp: newData?.learner_per_camp,
        camp_target: newData?.camp_target,
      },
    };

    const result = await organisationService.editOrganisationDetails({
      data: obj,
      id: id,
    });

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
                    {t("EDIT")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </VStack>

        <VStack p="4" space={4}>
          <Form
            key={(lang, formData)}
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
              customValidate,
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
                  formRef?.current?.submit();
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
