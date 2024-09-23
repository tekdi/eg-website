import {
  AdminTypo,
  Breadcrumb,
  FrontEndTypo,
  IconByName,
  AdminLayout as Layout,
  geolocationRegistryService,
  getOptions,
  PcuserService,
  facilitatorRegistryService,
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
import { setBlock, setDistrict, setVillage } from "utils/localHelper";
import { transformErrors } from "component/BaseInput";

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
    const getData = async () => {
      let newSchema = schema1;
      const programData = JSON.parse(localStorage.getItem("program"));
      if (programData) {
        try {
          setFormData({
            ...formData,
            state: programData?.state_name,
          });

          setLoading(true);

          await setDistrict({
            schemaData: newSchema,
            state: programData?.state_name,
            district: formData?.district,
            block: formData?.block,
            setSchema,
          });
        } catch (error) {
          console.error("An error occurred:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    getData();
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
        if (!errors?.[key]?.__errors?.includes(isValid[key]))
          err?.[key]?.addError(isValid[key]);
      }
    });
    return err;
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

  const onChange = async (e, id) => {
    const data = e.formData;
    const newData = { ...formData, ...data };
    let error = {};
    setFormData(newData);

    if (id === "root_mobile") {
      if (data?.mobile > 6000000000 && data?.mobile < 9999999999) {
        const mobile = data?.mobile;
        const result = await PcuserService.verifyMobilePC({ mobile });
        console.log("result", result);
        if (!result?.data?.success) {
          const newErrors = {
            mobile: {
              __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
            },
          };
          setErrors(newErrors);
        }
      } else {
        const newErrors = {};
        setErrors(newErrors);
      }
    }

    if (id === "root_district") {
      await setBlock({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
        state: data?.state,
        setSchema,
      });
    }

    if (id === "root_block") {
      await setVillage({
        district: data?.district,
        block: data?.block,
        schemaData: schema,
        state: data?.state,
        setSchema,
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
              {t("ADD_PC")}
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
            transformErrors: (errors) => transformErrors(errors, schema, t),
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
