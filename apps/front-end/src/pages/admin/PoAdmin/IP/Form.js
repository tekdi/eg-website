import {
  AdminTypo,
  PoAdminLayout,
  organisationService,
  getOptions,
  CardComponent,
  IconByName,
  cohortService,
  setSelectedProgramId,
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
  FileUpload,
} from "component/BaseInput";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Schema = {
  title: "CREATE_IP",
  description: "ADD_A_IP",
  type: "object",
  required: ["name", "mobile", "contact_person"],
  properties: {
    ip_name: {
      type: "string",
      title: "IP_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    contact_person_name: {
      type: "string",
      title: "CONTACT_PERSON",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    contact_person_mobile: {
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
    ip_address: {
      title: "IP_ADDRESS",
      type: "string",
    },
    learner_target: {
      title: "LEARNER_TARGET",
      type: "string",
    },
  },
};

export default function App() {
  const { t } = useTranslation();
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const navigate = useNavigate();
  const [schema, setSchema] = useState({});

  useEffect(async () => {
    if (Schema?.properties?.state) {
      const data = await cohortService.getProgramList();
      const extractData = data?.data.map((e) => e?.state?.state_name);
      const uniqueStateNames = extractData.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      const formattedData = uniqueStateNames.map((value) => ({
        value,
        name: value,
      }));

      let newSchema = Schema;
      if (Schema["properties"]["state"]) {
        newSchema = getOptions(newSchema, {
          key: "state",
          arr: formattedData,
          title: "name",
          value: "value",
        });
      }
      setSchema(newSchema);
    }
  }, []);

  const onChange = async (e, id) => {
    const data = e.formData;
    let newData = { ...formData, ...data };
    console.log({ newData });
    if (newData?.state) {
      const parseData = JSON.parse(formData?.state);
      setSelectedProgramId({
        program_id: parseData?.id,
        program_name: parseData?.name,
        state_name: parseData?.state?.state_name,
      });
    }
    // setFormData(newData);
  };
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
    <PoAdminLayout _appBar={{ setLang }}>
      <VStack p={4}>
        <HStack pt={4} space={2} alignItems={"center"}>
          <IconByName name="CommunityLineIcon" />
          <AdminTypo.H2>{t("IP/ORGANISATION_LIST")}</AdminTypo.H2>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={() => navigate("/poadmin/ips")}
          />
        </HStack>

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
            <Button display={"none"} type="submit"></Button>
          </Form>
          <CardComponent
            _body={{ bg: "light.100" }}
            _header={{ bg: "light.100" }}
            _vstack={{ space: 0 }}
            _hstack={{ borderBottomWidth: 0, p: 1 }}
            // item={}
            title={t("DOCUMENT_DETAILS")}
            label={["FIRST_NAME", "MIDDLE_NAME", "LAST_NAME", "MOBILE_NO"]}
            arr={["first_name", "middle_name", "last_name", "mobile"]}
            // buttonText={<AdminTypo.H5>User list</AdminTypo.H5>}
            // _buttonStyle={{ py: "2" }}
            // onButtonClick={handleButtonClick}
          />
          <FileUpload
            schema={{
              label: "UPLOAD_CONSENT_FORM",
              document_type: "camp",
              document_sub_type: "consent_form",
            }}
            // value={uploadData?.document_id}
            // onChange={(e) => setUploadData({ ...uploadData, document_id: e })}
          />
          <HStack space={6} justifyContent={"center"}>
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
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }}
            >
              {t("SUBMIT")}
            </AdminTypo.PrimaryButton>
          </HStack>
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}
