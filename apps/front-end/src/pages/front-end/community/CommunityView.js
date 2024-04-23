import {
  AdminTypo,
  CardComponent,
  CustomAlert,
  FrontEndTypo,
  GetEnumValue,
  Layout,
  benificiaryRegistoryService,
  enumRegistryService,
  getOptions,
} from "@shiksha/common-lib";
import React, { useEffect, useRef, useState } from "react";
import { templates, widgets } from "component/BaseInput";
import { useTranslation } from "react-i18next";
import schema1 from "./schema";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Alert, Box, VStack } from "native-base";
import PropTypes from "prop-types";

export default function CommunityView({ footerLinks }) {
  const { t } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [schema, setSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [addMore, setAddMore] = useState();
  const [data, setData] = useState({});
  const [enumOptions, setEnumOptions] = useState({});
  const formRef = useRef();

  useEffect(async () => {
    const qData = await enumRegistryService.listOfEnum();
    setEnumOptions(qData?.data ? qData?.data : {});
    const data = qData?.data?.COMMUNITY_MEMBER_DESIGNATIONS;
    let newSchema = schema1;
    if (schema1["properties"]) {
      newSchema = getOptions(newSchema, {
        key: "designation",
        arr: data,
        title: "title",
        value: "value",
      });
      setSchema(newSchema);
    }
  }, []);

  useEffect(async () => {
    const getData = await benificiaryRegistoryService.getCommunityReferences({
      context: "community.user",
    });
    const {
      data: { community_response },
    } = getData || {};
    setData(community_response);
  }, []);

  const onChange = async (e, id) => {
    const data = e.formData;
    const newData = { ...formData, ...data };
    if (id === "root_contact_number") {
      if (newData?.contact_number?.length !== 10) {
        const newErrors = {
          contact_number: {
            __errors: [t("PLEASE_ENTER_VALID_NUMBER")],
          },
        };
        setErrors(newErrors);
      } else {
        setErrors();
      }
    }
    setFormData(newData);
  };

  const transformErrors = (errors) => {
    return errors.map((error) => {
      if (error.name === "required") {
        if (schema?.properties?.[error?.property]?.title) {
          error.message = `${t("REQUIRED_MESSAGE")} "${t(
            schema?.properties?.[error?.property]?.title
          )}"`;
        } else {
          error.message = `${t("REQUIRED_MESSAGE")}`;
        }
      }
      return error;
    });
  };

  const onAdd = () => {
    setFormData();
    setAddMore(true);
  };
  const onSubmit = async () => {
    const result = await benificiaryRegistoryService.createCommunityReference(
      formData
    );
    if (result?.message === "Mobile number already exists") {
      const newErrors = {
        contact_number: {
          __errors: [t("MOBILE_NUMBER_ALREADY_EXISTS")],
        },
      };
      setErrors(newErrors);
    } else {
      setAddMore(false);
    }
    if (result?.success === true) {
      window?.location?.reload(true);
    }
  };

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["userInfo", "loginBtn", "langBtn"],
        lang,
        setLang,
        _box: { bg: "white", shadow: "appBarShadow" },
      }}
      _page={{ _scollView: { bg: "formBg.500" } }}
      _footer={{ menues: footerLinks }}
    >
      <Box p="4">
        {!addMore ||
          (data?.length <= 2 && (
            <CustomAlert
              _hstack={{ mb: 9 }}
              status={"customAlertdanger"}
              title={t("COMMUNITY_ALERT_MESSAGE")}
            />
          ))}
        {!addMore ? (
          <VStack paddingTop="4" space="4">
            <FrontEndTypo.H3 color="textGreyColor.750" bold>
              {t("COMMUNITY_DETAILS")}
            </FrontEndTypo.H3>
            {data?.length > 0 &&
              data
                ?.slice()
                .reverse()
                .map((item, index) => {
                  return (
                    <CardComponent
                      key={item?.id}
                      _vstack={{ pb: 2, mb: 5 }}
                      title={`${index + 1}. ${t("MEMBER_DETAILS")}`}
                      _mainTitle={{ p: 2, pb: 0 }}
                      item={{
                        ...item,
                        designation: item?.designation ? (
                          <GetEnumValue
                            t={t}
                            enumType={"COMMUNITY_MEMBER_DESIGNATIONS"}
                            enumOptionValue={item?.designation}
                            enumApiData={enumOptions}
                          />
                        ) : (
                          "-"
                        ),
                      }}
                      label={[
                        "FIRST_NAME",
                        "MIDDLE_NAME",
                        "LAST_NAME",
                        "DESIGNATION",
                        "CONTACT_NUMBER",
                      ]}
                      arr={[
                        "first_name",
                        "middle_name",
                        "last_name",
                        "designation",
                        "contact_number",
                      ]}
                    />
                  );
                })}
            {data?.length < 10 && (
              <FrontEndTypo.Primarybutton onPress={onAdd}>
                {t("ADD_COMMUNITY_MEMBER")}
              </FrontEndTypo.Primarybutton>
            )}
          </VStack>
        ) : (
          <Form
            key={schema}
            ref={formRef}
            extraErrors={errors}
            showErrorList={false}
            noHtml5Validate={true}
            {...{
              validator,
              templates,
              widgets,
              schema: schema || {},
              formData,
              onChange,
              onSubmit,
              transformErrors,
            }}
          >
            <FrontEndTypo.Primarybutton
              p="4"
              mt="4"
              onPress={() => {
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }}
            >
              {t("ADD_MEMBER")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              p="4"
              mt="4"
              onPress={() => setAddMore()}
            >
              {t("CANCEL")}
            </FrontEndTypo.Secondarybutton>
          </Form>
        )}
      </Box>
    </Layout>
  );
}

CommunityView.PropTypes = {
  footerLinks: PropTypes.any,
};
