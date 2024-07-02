import React, { useEffect, useRef, useState } from "react";
import {
  AdminTypo,
  Breadcrumb,
  IconByName,
  PoAdminLayout,
  cohortService,
  getOptions,
  getSelectedAcademicYear,
  getSelectedProgramId,
  organisationService,
  t,
  validation,
} from "@shiksha/common-lib";
import { Alert, Button, HStack, VStack } from "native-base";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { widgets, templates, transformErrors } from "component/BaseInput";
import { useNavigate, useParams } from "react-router-dom";
import Chip from "component/Chip";

const Schema = {
  type: "object",
  required: ["ip_id", "state", "first_name", "role", "mobile"],
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
    mobile: {
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
  const [formData, setFormData] = useState();
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
      setSchema(newSchema);
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
    const data = await organisationService.getOne({ id });
    setDataIp(data?.data);
  }, [id]);

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
    let newFormData = data.formData;
    const programLocal = await getSelectedProgramId();
    const academicYearLocal = await getSelectedAcademicYear();
    const { first_name, mobile, role } = newFormData;
    const newDataToSend = {
      first_name,
      mobile,
      role: "staff",
      role_fields: {
        role_slug: role,
        organisation_id: id,
        program_id: programLocal?.program_id,
        academic_year_id: academicYearLocal?.academic_year_id,
      },
    };

    const result = await organisationService.createIpUser(newDataToSend);
    if (result?.success === true) {
      navigate(`/poadmin/ips/user/${result?.data?.user?.id}`);
    } else {
      setFormData(newFormData);
      setErrors({
        [result?.key || "other"]: {
          __errors: Array.isArray(result?.message)
            ? result?.message
            : [result?.message],
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
                  <Chip
                    textAlign="center"
                    lineHeight="15px"
                    label={dataIp?.id}
                  />
                ),
                link: `/poadmin/ips/${id}`,
              },
              {
                title: (
                  <AdminTypo.H4
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    bold
                  >
                    {t("USER_CREATE")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </VStack>
        <VStack pt={4} space={4}>
          {errors?.other && (
            <Alert status="warning" alignItems={"start"}>
              <HStack alignItems="center" space="2">
                <Alert.Icon />
                <AdminTypo.H6 bold>
                  {errors?.other?.__errors?.join(",")}
                </AdminTypo.H6>
              </HStack>
            </Alert>
          )}
          <Form
            ref={formRef}
            validator={validator}
            extraErrors={errors}
            noHtml5Validate={true}
            showErrorList={false}
            schema={schema || {}}
            {...{
              widgets,
              formData,
              templates,
              validator,
              customValidate,
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

export default UserForm;
