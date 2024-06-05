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
  eventService,
  enumRegistryService
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
// import Schema from "./Schema";

const Schema = {
  // title: "CREATE_IP",
  // description: "ADD_A_IP",
  type: "object",
  required: [
    "do_id",
    "event_type",
    // "status"
  ],
  properties: {
    do_id: {
      type: "string",
      label:"DO_ID",
      title: "DO_ID",
      // regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    // event_type: {
    //   type: "string",
    //   title: "EVENT_TYPE",
    //   // regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    // },
    event_type: {
      type: "string",
      label: "EVENT_TYPE",
      title: "EVENT_TYPE",
      format: "select"
    },
    
    // status: {
    //   type: "string",
    //   title: "STATUS",
    // },
   
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
  const [enumSchema, setEnumSchema] = useState();

  // useEffect(async () => {
  //   if (Schema?.properties?.do_id) {
  //     const { data } = await cohortService.getProgramList();
  //     const newData = data.map((e) => ({
  //       ...e,
  //       state_name: `${e?.state?.state_name}`,
  //     }));
  //     let newSchema = Schema;
  //     if (Schema["properties"]["state"]) {
  //       newSchema = getOptions(newSchema, {
  //         key: "state",
  //         arr: newData,
  //         title: "state_name",
  //         value: "id",
  //       });
  //     }

  //     setSchema(newSchema);
  //   }
  // }, []);

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
      const updatedFormData = { ...newData };
      updatedFormData.camp_target = avgCount;
      setFormData(updatedFormData);
    }
  };

  // const customValidate = (data, err) => {
  //   if (data?.mobile) {
  //     const isValid = validation({
  //       data: data?.mobile,
  //       key: "mobile",
  //       type: "mobile",
  //     });
  //     if (isValid) {
  //       err?.mobile?.addError([t("PLEASE_ENTER_VALID_NUMBER")]);
  //     }
  //   }
  //   return err;
  // };

  const onSubmit = async (data) => {
    setLoading(true);
    const newData = data.formData;
    const result = await eventService.createDoId(newData);
    if (!result.error) {
      navigate("/poadmin/do-ids");
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

  useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    let newSchema = Schema;
    newSchema = getOptions(newSchema, {
      key: "event_type",
      arr: result?.data?.FACILITATOR_EVENT_TYPE?.map((e) => ({
        ...e,
        title: t(e.title),
      })),
      title: "title",
      value: "value",
    });
    setSchema(newSchema);
  }, []);

  

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
              enumSchema,
              // customValidate,
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
