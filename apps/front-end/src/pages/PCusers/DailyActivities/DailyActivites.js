import React, { useState, useEffect, useRef } from "react";
import {
  PCusers_layout as Layout,
  CardComponent,
  FrontEndTypo,
  getOptions,
  geolocationRegistryService,
  PcuserService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { Box, HStack, Pressable, VStack } from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import Form from "@rjsf/core";

import {
  templates,
  widgets,
  validator,
  transformErrors,
  onError,
} from "v2/components/Static/FormBaseInput/FormBaseInput";
import { schema1 } from "./ActivitiesSchema";
const DailyActivities = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [isDisable, setIsDisable] = useState(false);
  const { activity } = useParams();
  const { step } = useParams();

  console.log({ step });

  const hours = [
    { title: 1 },
    { title: 2 },
    { title: 3 },
    { title: 4 },
    { title: 5 },
    { title: 6 },
    { title: 7 },
    { title: 8 },
  ];
  const minutes = [{ title: 0 }, { title: 15 }, { title: 30 }, { title: 45 }];

  const uiSchema = {
    labelTime: {
      "ui:widget": "LabelTimeWidget",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const qData = await geolocationRegistryService.getVillages({
        name: "ARTHUNA",
        state: "RAJASTHAN",
        district: "BANSWARA",
        gramp: "null",
      });
      console.log({ qData });
      let newSchema = getOptions(schema1, {
        key: "hours",
        arr: hours,
        title: "title",
        value: "title",
      });

      newSchema = getOptions(
        newSchema,

        {
          key: "village",
          arr: qData.villages,
          title: "village_ward_name",
          value: "village_ward_name",
        }
      );
      newSchema = getOptions(
        newSchema,

        {
          key: "minutes",
          arr: minutes,
          title: "title",
          value: "title",
        }
      );
      setSchema(newSchema);
      setLoading(false);
    };
    fetchData();
  }, []);

  const validateTime = (input) => {
    console.log({ input });
    const MAX_HOURS = 8;
    const prev_hours = 3 + parseInt(input.hours);
    const prev_min = 15 + parseInt(input.minutes);
    const hours = parseInt(prev_hours, 10);
    const minutes = parseInt(prev_min, 10);
    console.log({ hours, minutes });
    // Convert the total time into hours
    const totalHours = hours + minutes / 60;
    console.log({ totalHours });
    if (totalHours > MAX_HOURS) {
      setErrors({
        ...errors,
        minutes: {
          __errors: ["CAN_ONLY_ADD_UPTO_8_HOURS_PER_DAY"],
        },
      });
    } else {
      setErrors();
    }
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setErrors();
    const newData = { ...formData, ...data };
    setFormData({ ...newData });
    const obj = {
      hours: data?.hours || 0,
      minutes: data?.minutes || 0,
    };
    if (id === "root_hours" || id === "root_minutes") {
      validateTime(obj);
    }

    if (id === "root_description") {
      if (data?.description === "") {
        setFormData({ ...formData, description: undefined });
      }
    }
  };

  const onSubmit = async (data) => {
    let newFormData = data.formData;
    if (_.isEmpty(errors)) {
      console.log({ newFormData });
      const data = await PcuserService.MarkActivity(newFormData);
      console.log({ data });
      //navigate(`/dailyactivities/${activity}/view`);
    }
  };

  return (
    <Layout
      loading={loading}
      //facilitator={facilitator}
      analyticsPageTitle={"HOME"}
      pageTitle={t("HOME")}
    >
      <VStack space="4" px="4" pb="90px" alignContent="center">
        <FrontEndTypo.H1 pt="10px">{t("DAILY_ACTIVITIES")}</FrontEndTypo.H1>
        <FrontEndTypo.H3>{t(activity)}</FrontEndTypo.H3>

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
              isDisabled={isDisable}
              onPress={() => {
                if (formRef.current.validateForm()) {
                  formRef?.current?.submit();
                }
              }}
            >
              {t("MARK_AND_DONE")}
            </FrontEndTypo.Primarybutton>
          </HStack>
        </Form>
      </VStack>
    </Layout>
  );
};

export default DailyActivities;
