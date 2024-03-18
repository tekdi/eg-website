import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  AdminTypo,
  IconByName,
  PoAdminLayout,
  cohortService,
  getOptions,
  organisationService,
} from "@shiksha/common-lib";
import { Button, HStack, VStack } from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  widgets,
  templates,
  FileUpload,
  transformErrors,
} from "component/BaseInput";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

const Schema = {
  type: "object",
  required: ["state", "organisation_id", "user_id", "role_slug"],
  properties: {
    organisation_id: {
      type: "string",
      title: "IP_ID",
      readOnly: true,
    },
    state: {
      type: "string",
      title: "STATE",
      readOnly: true,
    },
    user_id: {
      type: "string",
      title: "NAME",
      format: "select",
    },

    role_slug: {
      type: "string",
      title: "USER_ROLE",
      format: "select",
    },
  },
};

function ExitingUser(props) {
  const formRef = useRef();
  const [schema, setSchema] = useState(Schema);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataIp, setDataIp] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(async () => {
    const data = await organisationService.getOne({ id });
    setDataIp(data?.data?.[0]);
  }, [id]);

  useEffect(async () => {
    const data = await organisationService.rolesList();
    let newSchema = Schema;

    if (Schema?.properties?.user_id) {
      const data = await organisationService.getExistingUserList();
      const arrWithFullName = data.data.map((item) => ({
        ...item,
        full_name: item.last_name
          ? `${item.first_name} ${item.last_name}`
          : item.first_name,
      }));
      newSchema = getOptions(newSchema, {
        key: "user_id",
        arr: arrWithFullName,
        title: "full_name",
        value: "id",
      });
    }
    if (Schema.properties.organisation_id) {
      newSchema = {
        ...newSchema,
        properties: {
          ...newSchema.properties,
          organisation_id: {
            ...newSchema.properties.organisation_id,
            default: id,
          },
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
    if (schema?.properties?.role_slug) {
      newSchema = getOptions(newSchema, {
        key: "role_slug",
        arr: data?.data,
        title: "role_type",
        value: "slug",
      });
    }
    setSchema(newSchema);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const newData = data?.formData;
    console.log({ newData });
    const result = await organisationService.addExistingUser(newData);
    if (!result.error) {
      navigate(`/poadmin/ips/${id}`);
    } else {
      setErrors({
        organisation_id: {
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
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={() => navigate(`/poadmin/ips/${id}`)}
          />
          {dataIp?.first_name}
        </HStack>
        <AdminTypo.H6 color={"textGreyColor.500"} bold>
          {t("CREATE_EXISTING_IP")}
        </AdminTypo.H6>
        <VStack pt={4}>
          <Form
            ref={formRef}
            validator={validator}
            extraErrors={errors}
            noHtml5Validate={true}
            showErrorList={false}
            schema={schema || {}}
            {...{
              widgets,
              templates,
              validator,
              onSubmit,
              transformErrors: (e) => transformErrors(e, schema, t),
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

ExitingUser.propTypes = {};

export default ExitingUser;
