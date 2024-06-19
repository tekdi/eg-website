import {
  AdminTypo,
  Breadcrumb,
  FrontEndTypo,
  IconByName,
  AdminLayout as Layout,
  geolocationRegistryService,
  getOptions,
  PcuserService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import { schema1 } from "./Schema";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  widgets,
  templates,
} from "v2/components/Static/FormBaseInput/FormBaseInput";
import { getLanguage } from "v2/utils/Helper/JSHelper";
import { useNavigate } from "react-router-dom";

const PcAdd = ({ footerLinks }) => {
  const [lang] = useState(getLanguage());
  const { t } = useTranslation();
  const formRef = useRef();
  const [errors, setErrors] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState({});
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let newSchema = schema1;
      const qData = await geolocationRegistryService.getStates();
      newSchema = getOptions(newSchema, {
        key: "state",
        arr: qData?.states,
        title: "state_name",
        value: "state_name",
      });
      setSchema(newSchema);
      setLoading(false);
    };
    fetchData();
  }, []);

  const uiSchema = {};

  const validate = (data, key) => {
    let error = {};
    switch (key) {
      case "mobile":
        if (!(data?.mobile > 6000000000 && data?.mobile < 9999999999)) {
          error = { mobile: t("PLEASE_ENTER_VALID_NUMBER") };
          setErrors(error);
        }
        break;
      default:
        break;
    }
    return error;
  };

  const customValidate = (data, err) => {
    const arr = Object.keys(err);
    arr.forEach((key) => {
      const isValid = validate(data, key);
      if (isValid?.[key]) {
        if (!errors?.[key]?.__errors.includes(isValid[key]))
          err?.[key]?.addError(isValid[key]);
      }
    });
    return err;
  };

  const setDistric = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (state) {
      const qData = await geolocationRegistryService.getDistricts({
        name: state,
      });
      if (schemaData?.["properties"]?.["district"]) {
        newSchema = getOptions(newSchema, {
          key: "district",
          arr: qData?.districts,
          title: "district_name",
          value: "district_name",
        });
      }
      if (schemaData?.["properties"]?.["block"]) {
        newSchema = await setBlock({
          state,
          district,
          block,
          gramp,
          schemaData: newSchema,
        });
        setSchema(newSchema);
      }
    }
    setLoading(false);
    return newSchema;
  };

  const setBlock = async ({ gramp, state, district, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schemaData?.properties?.block && district) {
      const qData = await geolocationRegistryService.getBlocks({
        name: district,
        state: state,
      });
      if (schemaData?.["properties"]?.["block"]) {
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
    } else {
      newSchema = getOptions(newSchema, { key: "block", arr: [] });
      if (schemaData?.["properties"]?.["village"]) {
        newSchema = getOptions(newSchema, { key: "village", arr: [] });
      }
      setSchema(newSchema);
    }
    setLoading(false);
    return newSchema;
  };

  const setVilage = async ({ state, district, gramp, block, schemaData }) => {
    let newSchema = schemaData;
    setLoading(true);
    if (schemaData?.properties?.village && block) {
      const qData = await geolocationRegistryService.getVillages({
        name: block,
        state: state,
        district: district,
        gramp: gramp || "null",
      });
      if (schemaData?.["properties"]?.["village"]) {
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
    setLoading(false);
    return newSchema;
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    const payload = getPayload(newFormData);
    const result = await PcuserService.registerPC(payload);
    if (result?.success) {
      navigate("/admin/pc");
    } else {
      setError(result?.message);
    }
  };

  const getPayload = (newFormData) => {
    const nameParts = newFormData?.first_name.split(" ");
    let firstName, middleName, lastName;
    if (nameParts.length) {
      firstName = nameParts[0];
      middleName = nameParts[2] ? nameParts[1] : "";
      lastName = nameParts[2] || nameParts[1];
    }
    const payload = {
      first_name: firstName,
      middle_name: middleName || "",
      last_name: lastName || "",
      mobile: newFormData?.mobile,
      email_id: newFormData?.email_id,
      state: newFormData?.state,
      district: newFormData?.district,
      block: newFormData?.block,
      village: newFormData?.village,
      address: newFormData?.address,
    };
    return payload;
  };
  const transformErrors = (errors, uiSchema) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t("REQUIRED_MESSAGE")}`;
        }
      } else if (error.name === "enum") {
        error.message = `${t("SELECT_MESSAGE")}`;
      }
      return error;
    });
  };
  const onChange = async (e, id) => {
    const data = e.formData;
    const newData = { ...formData, ...data };
    setFormData(newData);

    if (id === "root_state") {
      await setDistric({
        schemaData: schema,
        state: data?.state,
        district: data?.district,
        block: data?.block,
      });
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
        state: data?.state,
      });
    }

    if (id === "root_block") {
      await setVilage({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
        state: data?.state,
      });
    }
  };

  return (
    <Layout
      _appBar={{
        isShowNotificationButton: true,
      }}
      _sidebar={footerLinks}
      loading={loading}
    >
      <VStack py={4} px={[1, 1, 4]} space={4}>
        <Breadcrumb
          drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
          data={[
            <HStack key="1" space={"2"}>
              <IconByName isDisabled name="Home4LineIcon" />
              <AdminTypo.H4
                onPress={() => {
                  navigate("/admin/pc");
                }}
              >
                {t("ALL_PRAGATI_COORDINATOR")}
              </AdminTypo.H4>
            </HStack>,
            <AdminTypo.H4 bold key="2">
              {t(" Add_PC")}
            </AdminTypo.H4>,
          ]}
        />
        <AdminTypo.H5>{t("CREATE_A_PRAGATI_COORDINATOR")}</AdminTypo.H5>
        <Form
          key={lang}
          ref={formRef}
          extraErrors={errors}
          showErrorList={false}
          noHtml5Validate={true}
          widgets={widgets}
          {...{
            //widgets,
            templates,
            validator,
            schema: schema,
            uiSchema,
            formData,
            customValidate,
            onChange,
            //onError,
            onSubmit,
            transformErrors,
          }}
        >
          {error && (
            <AdminTypo.H4
              color="textMaroonColor.400"
              style={{ display: "block", marginTop: "10px" }}
            >
              {t(error)}
            </AdminTypo.H4>
          )}
          <HStack space={4} alignItems={"center"} justifyContent={"center"}>
            <FrontEndTypo.Secondarybutton
              isLoading={loading}
              type="submit"
              p="4"
              mt="10"
              onPress={(e) => {
                setFormData();
              }}
            >
              <HStack space={4}>
                <AdminTypo.H4>{t("cancel")}</AdminTypo.H4>
                <IconByName size="sm" name="DeleteBinLineIcon" />
              </HStack>
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton
              isLoading={loading}
              type="submit"
              p="4"
              width="100px"
              mt="10"
              onPress={(e) => {
                formRef?.current?.submit();
              }}
            >
              <AdminTypo.H4 color={"white"}>{t("SUBMIT")}</AdminTypo.H4>
            </FrontEndTypo.Primarybutton>
          </HStack>
        </Form>
      </VStack>
    </Layout>
  );
};

PcAdd.propTypes = {
  footerLinks: PropTypes.any,
};

export default PcAdd;
