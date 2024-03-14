import React, { useEffect, useRef, useState } from "react";
import {
  AdminTypo,
  IconByName,
  PoAdminLayout,
  geolocationRegistryService,
  getOptions,
  organisationService,
  t,
} from "@shiksha/common-lib";
import { Button, HStack, VStack } from "native-base";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { widgets, templates } from "component/BaseInput";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

const Schema = {
  type: "object",
  required: ["ip_id", "first_name", "role", "mobile_number"],
  properties: {
    ip_id: {
      type: "string",
      title: "IP_ID",
      readOnly: true,
    },
    state: {
      type: "string",
      title: "STATE",
      readOnly: true,
    },
    first_name: {
      type: "string",
      title: "FIRST_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    last_name: {
      type: "string",
      title: "LAST_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    role: {
      type: "string",
      title: "USER_ROLE",
      format: "select",
    },
    mobile_number: {
      type: "string",
      title: "MOBILE_NUMBER",
      format: "MobileNumber",
    },
  },
};

function UserForm() {
  const formRef = useRef();
  const [schema, setSchema] = useState(Schema);
  const [dataIp, setDataIp] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(async () => {
    const data = await organisationService.rolesList();
    let newSchema = Schema;

    if (Schema.properties.ip_id) {
      newSchema = {
        ...newSchema,
        properties: {
          ...newSchema.properties,
          ip_id: { ...newSchema.properties.ip_id, default: id },
        },
      };
    }
    if (Schema.properties.state) {
      const localData = JSON.parse(localStorage.getItem("program"));
      newSchema = {
        ...newSchema,
        properties: {
          ...newSchema.properties,
          state: {
            ...newSchema.properties.state,
            default: localData?.program?.state?.state_name,
          },
        },
      };
    }
    if (schema?.properties?.role) {
      newSchema = getOptions(newSchema, {
        key: "role",
        arr: data?.data,
        title: "role_type",
        value: "slug",
      });
    }
    setSchema(newSchema);
  }, []);

  useEffect(async () => {
    const data = await organisationService.getDetailsOfIP({ id });
    setDataIp(data?.data?.[0]);
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    let newFormData = data.formData;
    const localData = JSON.parse(localStorage.getItem("program"));
    const newDataToSend = {
      ...newFormData,
      mobile: newFormData?.mobile_number,
      role: newFormData?.role,
      role_fields: {
        role_slug: newFormData?.role,
        organisation_id: localData?.organisation_id,
        program_id: localData?.program_id,
        academic_year_id: localData?.academic_year_id,
      },
    };

    delete newDataToSend.ip_id;
    delete newDataToSend.state;

    const result = await organisationService.createIp(newDataToSend);
    if (result?.success === true) {
      navigate(`/poadmin/ips/${id}/user/${result?.data?.user?.id}`);
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
            onPress={() => navigate(`/poadmin/ips/${id}`)}
          />
          {dataIp?.first_name}
        </HStack>
        <AdminTypo.H6 color={"textGreyColor.500"} bold>
          {t("CREATE_IP")}
        </AdminTypo.H6>
        <VStack pt={4}>
          <Form
            ref={formRef}
            validator={validator}
            extraErrors={errors}
            noHtml5Validate={true}
            schema={schema || {}}
            {...{
              widgets,
              templates,
              validator,
              onSubmit,
            }}
          >
            <Button display={"none"} type="submit"></Button>
            <HStack pt={6} space={6} alignSelf={"center"}>
              <AdminTypo.Secondarybutton
                icon={
                  <IconByName
                    color="black"
                    _icon={{ size: "18px" }}
                    name="DeleteBinLineIcon"
                  />
                }
                onPress={(e) => navigate(`/poadmin/ips/${id}`)}
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

UserForm.propTypes = {};

export default UserForm;
