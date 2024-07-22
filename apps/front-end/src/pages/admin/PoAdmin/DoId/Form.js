import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  AdminTypo,
  PoAdminLayout,
  getOptions,
  IconByName,
  setSelectedProgramId,
  Breadcrumb,
  enumRegistryService,
  eventService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import {
  widgets,
  templates,
  onError,
  transformErrors,
} from "component/BaseInput";
import Schema from "./Schema";

export default function AddEditForm() {
  const { t } = useTranslation();
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const navigate = useNavigate();
  const { id } = useParams();
  const [schema, setSchema] = useState(Schema);
  const [formData, setFormData] = useState({});
  const [doId, setDoId] = useState();

  useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    let newSchema = { ...Schema };

    if (id) {
      const data = await eventService.getOneDoIdDetails({ id });
      setDoId({ ...data?.data });
      newSchema = {
        ...newSchema,
        required: [...newSchema.required, "id"],
        properties: {
          id: {
            type: "number",
            title: "ID",
            label: "ID",
            readOnly: true,
          },
          ...(newSchema?.properties || {}),
        },
      };
      setFormData({
        ...data?.data,
      });
    }

    newSchema = getOptions(newSchema, {
      key: "event_type",
      arr: result?.data?.FACILITATOR_EVENT_TYPE?.map((e) => ({
        ...e,
        title: t(e?.title),
      })),
      title: "title",
      value: "value",
    });
    setSchema(newSchema);
  }, []);

  const onChange = async (e, id) => {
    const newData = e?.formData;
    if (newData?.state) {
      setSelectedProgramId({
        program_id: newData?.state,
      });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const newData = data.formData;
    let result;
    try {
      if (id) {
        result = await eventService.updateEventDoId({
          data: newData,
          id: newData.id,
        });
      } else {
        result = await eventService.createDoId(newData);
      }
      if (result.error) {
        setFormData(newData);
        setErrors({ [result?.key || "name"]: { __errors: [result?.message] } });
        return;
      }
      navigate("/poadmin/do-ids");
      setLoading(false);
    } catch (error) {
      console.error("Failed to submit form:", error);
      setErrors({ submit: { __errors: ["An unexpected error occurred"] } });
    }
  };

  if (!schema) {
    return <div>Loading form data, please wait...</div>;
  }

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
                      {t("ALL_DO_IDS")}
                    </AdminTypo.H4>
                  </HStack>
                ),
                link: "/poadmin/do-ids",
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
                    {id ? t("EDIT") : t("CREATE")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </VStack>

        <VStack p="4" space={4}>
          <Form
            key={`${lang}-${JSON.stringify(formData)}`}
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
                onPress={() => navigate("/poadmin/do-ids")}
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
