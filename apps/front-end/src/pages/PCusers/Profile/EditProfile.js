import React, { useEffect, useRef, useState } from "react";
import {
  PCusers_layout as Layout,
  CardComponent,
  FrontEndTypo,
  getOptions,
  geolocationRegistryService,
  PcuserService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import Form from "@rjsf/core";
import { schema1 } from "./schema";
import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "v2/components/Static/FormBaseInput/FormBaseInput";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { VStack } from "native-base";

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const formRef = useRef();
  const [schema, setSchema] = useState({});
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [yearsRange, setYearsRange] = useState([1980, 2030]);
  const { step, id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    let minYear = moment().subtract("years", 30);
    let maxYear = moment().subtract("years", 12);
    setYearsRange([minYear.year(), maxYear.year()]);
    getdata();
    setSchema(schema1);
    setLoading(false);
  }, []);

  const getdata = async () => {
    const data = await PcuserService.getPcProfile();
    setFormData({
      ...formData,
      dob: data?.data?.dob,
      gender: data?.data?.gender,
      id: id,
    });
  };

  const uiSchema = {
    dob: {
      "ui:widget": "alt-date",
      "ui:options": {
        yearsRange: yearsRange,
        hideNowButton: true,
        hideClearButton: true,
        format: "DMY",
      },
    },
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData({ ...newData });
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (_.isEmpty(errors)) {
      await PcuserService.editProfile(newFormData);
      navigate(`/profile/basicdetails`);
    }
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate("/profile/basicdetails"),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("YOUR_PROFILE")}</FrontEndTypo.H2>,
      }}
      analyticsPageTitle={"FACILITATOR_PROFILE"}
      pageTitle={t("FACILITATOR")}
      stepTitle={t("PROFILE")}
    >
      <VStack p={4}>
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
          <FrontEndTypo.Primarybutton
            mt="5"
            p="4"
            variant={"primary"}
            type="submit"
            onPress={() => {
              if (formRef.current.validateForm()) {
                formRef?.current?.submit();
              } else {
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }
            }}
          >
            {t("SAVE")}
          </FrontEndTypo.Primarybutton>
        </Form>
      </VStack>
    </Layout>
  );
};

export default EditProfile;
