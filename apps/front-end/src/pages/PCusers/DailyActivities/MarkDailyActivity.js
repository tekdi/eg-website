import { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import {
  FrontEndTypo,
  geolocationRegistryService,
  getOptions,
  PCusers_layout as Layout,
  PcuserService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  onError,
  templates,
  transformErrors,
  validator,
  widgets,
} from "v2/components/Static/FormBaseInput/FormBaseInput";
import { schema1 } from "./MarkActivitySchema";

const MarkDailyActivity = () => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [pcDetails, setPcDetails] = useState();

  const uiSchema = {
    labelTime: {
      "ui:widget": "LabelTimeWidget",
    },
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const data = await PcuserService.getPcProfile();
      setPcDetails(data?.data);
      let newSchema = schema1;
      if (newSchema?.properties?.district) {
        newSchema = await setDistric({
          schemaData: newSchema,
          state: "RAJASTHAN",
          district: formData?.district,
          block: formData?.block,
          // gramp: formData?.grampanchayat,
        });
        setSchema(newSchema);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error in fetching district", error);
    }
  };

  const setDistric = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    if (schema1?.properties?.district && state) {
      const qData = await geolocationRegistryService.getDistricts({
        name: state,
      });
      if (schema1["properties"]["district"]) {
        newSchema = getOptions(newSchema, {
          key: "district",
          arr: qData?.districts,
          title: "district_name",
          value: "district_name",
        });
      }
      if (schema1["properties"]["block"]) {
        newSchema = await setBlock({
          gramp,
          state,
          district,
          block,
          schemaData: newSchema,
        });
        setSchema(newSchema);
      }
    } else {
      newSchema = getOptions(newSchema, { key: "district", arr: [] });
      if (schema1["properties"]["block"]) {
        newSchema = getOptions(newSchema, { key: "block", arr: [] });
      }
      if (schema1["properties"]["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    return newSchema;
  };

  const setBlock = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;

    if (schema1?.properties?.block && district) {
      const qData = await geolocationRegistryService.getBlocks({
        name: district,
        state: "RAJASTHAN",
        // state: programSelected?.state_name,
      });
      if (schema1["properties"]["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData?.blocks,
          title: "block_name",
          value: "block_name",
        });
      }

      newSchema = await setVilage({
        state,
        district,
        block,
        gramp: "null",
        schemaData: newSchema,
      });
      setSchema(newSchema);
      // }
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schema1["properties"]["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    return newSchema;
  };

  const setVilage = async ({ state, district, gramp, block, schemaData }) => {
    let newSchema = schemaData;
    if (schema1?.properties?.village && block) {
      const qData = await geolocationRegistryService.getVillages({
        name: block,
        // state: programSelected?.state_name,
        state: "RAJASTHAN",
        district: district,
        gramp: gramp || "null",
      });
      if (schema1["properties"]["village"]) {
        newSchema = getOptions(newSchema, {
          key: "village",
          arr: qData?.villages,
          title: "village_ward_name",
          value: "village_ward_name",
        });
      }
      setSchema(newSchema);
    } else {
      newSchema = getOptions(newSchema, { key: "village", arr: [] });
      setSchema(newSchema);
    }
    return newSchema;
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData(newData);
    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: null,
        schemaData: schema,
      });
    }

    if (id === "root_block") {
      await setVilage({
        block: data?.block,
        district: data?.district,
        schemaData: schema,
      });
    }
  };
  const onSubmit = () => {
    if (formData && formData?.village) {
      localStorage.setItem("activityAddress", JSON.stringify(formData));
      navigate(`/dailyactivities/list`);
    }
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        lang,
        setLang,
        onPressBackButton: () => {
          navigate(`/`);
        },
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
      }}
    >
      <VStack space="4" px="4" pb="90px" alignContent="center">
        <FrontEndTypo.H1 pt="10px">{t("SELECT_VILLAGE")}</FrontEndTypo.H1>

        <Form
          key={schema}
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
            onChange,
            onSubmit,
            uiSchema,
            onError,
            transformErrors: (errors) => transformErrors(errors, schema, t),
          }}
        >
          <HStack alignItems={"center"} justifyContent={"center"}>
            <FrontEndTypo.Primarybutton
              isLoading={loading}
              mt="4"
              onPress={() => {
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }}
            >
              {t("SAVE_AND_NEXT")}
            </FrontEndTypo.Primarybutton>
          </HStack>
        </Form>
      </VStack>
    </Layout>
  );
};

export default MarkDailyActivity;
