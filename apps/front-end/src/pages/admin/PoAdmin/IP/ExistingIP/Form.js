import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  PoAdminLayout,
  IconByName,
  AdminTypo,
  organisationService,
} from "@shiksha/common-lib";
import { VStack, HStack, Button } from "native-base";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useNavigate, useParams } from "react-router-dom";
import { widgets, templates } from "component/BaseInput";
import { useTranslation } from "react-i18next";

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

function ExistingIpForm() {
  const formRef = useRef();
  const [schema, setSchema] = useState(Schema);
  const [dataIp, setDataIp] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    setLoading(true);
    const newData = data.formData;
    const result = await organisationService.createOrg(newData);
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
            noHtml5Validate={true}
            schema={schema || {}}
            {...{
              widgets,
              templates,
              validator,
              // onSubmit,
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

ExistingIpForm.propTypes = {};

export default ExistingIpForm;
