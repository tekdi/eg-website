import { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import {
  FrontEndTypo,
  jsonParse,
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
import { setBlock, setDistrict, setVillage } from "utils/localHelper";
import PropTypes from "prop-types";

const App = ({ userTokenInfo }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});

  const uiSchema = {
    labelTime: {
      "ui:widget": "LabelTimeWidget",
    },
  };

  useEffect(() => {
    setFormData(jsonParse(localStorage.getItem("activityAddress"), {}));
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, [formData]);

  const fetchDistricts = async () => {
    try {
      const { data } = await PcuserService.getPcProfile();
      let newSchema = schema1;
      if (newSchema?.properties?.district) {
        newSchema = await setDistrict({
          schemaData: newSchema,
          state: data?.program_users?.programs?.state?.state_name,
          district: formData?.district,
          block: formData?.block,
        });
        setSchema(newSchema);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error in fetching district", error);
    }
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
      await setVillage({
        block: data?.block,
        district: data?.district,
        schemaData: schema,
      });
    }
  };
  const onSubmit = () => {
    if (formData?.village) {
      localStorage.setItem("activityAddress", JSON.stringify(formData));
      navigate(`/daily-activities/categories`);
    }
  };

  return (
    <Layout
      facilitator={userTokenInfo?.authUser || {}}
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

export default App;

App.propTypes = {
  userTokenInfo: PropTypes.object,
};
