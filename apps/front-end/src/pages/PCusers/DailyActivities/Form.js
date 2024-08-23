import { useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import {
  Breadcrumb,
  FrontEndTypo,
  getOptions,
  jsonParse,
  PCusers_layout as Layout,
  PcuserService,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  onError,
  templates,
  transformErrors,
  validator,
  widgets,
} from "v2/components/Static/FormBaseInput/FormBaseInput";
import { schema1 } from "./ActivitiesSchema";
import PropTypes from "prop-types";

const hours = [
  { title: "0" },
  { title: 1 },
  { title: 2 },
  { title: 3 },
  { title: 4 },
  { title: 5 },
  { title: 6 },
  { title: 7 },
  { title: 8 },
];
const minutes = [{ title: "0" }, { title: 15 }, { title: 30 }, { title: 45 }];

const uiSchema = {
  labelTime: {
    "ui:widget": "LabelTimeWidget",
  },
};

export const PCUserBreadcrumb = ({ category, activity, t }) => (
  <Breadcrumb
    _hstack={{ flexWrap: "wrap", pb: 4 }}
    data={[
      <FrontEndTypo.H1 key="1-b">{t("DAILY_ACTIVITIES")}</FrontEndTypo.H1>,
      <FrontEndTypo.H2 key="2-b">
        {t(
          "PCUSER_ACTIVITY.PC_USER_ACTIVITY_CATEGORIES_" +
            category.replace("_ACTIVITY", ""),
        )}
      </FrontEndTypo.H2>,
      <FrontEndTypo.H2 key="3-b" color="textGreyColor.700">
        {t(`PCUSER_ACTIVITY.${category}_${activity.toUpperCase()}`)}
      </FrontEndTypo.H2>,
    ]}
  />
);

PCUserBreadcrumb.propTypes = {
  category: PropTypes.string,
  activity: PropTypes.string,
  t: PropTypes.func,
};

const DailyActivities = () => {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [schema, setSchema] = useState({});
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [isDisable, setIsDisable] = useState(false);
  const { id, category, activity } = useParams();

  useEffect(() => {
    const activityAddress = jsonParse(localStorage.getItem("activityAddress"));
    if (!_.isEmpty(activityAddress)) {
      setFormData({
        ...formData,
        village: activityAddress?.village,
      });
    } else {
      navigate(`/daily-activities/${category}/${activity}/view`);
    }
  }, []);

  const getActivityDetail = async () => {
    const payload = {
      page: "1",
      limit: "10",
      type: activity,
      date: moment().format("YYYY-MM-DD"),
    };
    const data = await PcuserService.activitiesDetails(payload);
    const activities = data?.data?.activities;
    const selectedActivity = activities.find((item) => {
      return item.id == id;
    });
    setFormData({
      ...formData,
      village: selectedActivity?.village,
      description: selectedActivity?.description,
      hours: selectedActivity?.hours?.toString(),
      minutes: selectedActivity?.minutes?.toString(),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getActivityDetail();
      }
      let newSchema = getOptions(schema1, {
        key: "hours",
        arr: hours,
        title: "title",
        value: "title",
      });

      newSchema = getOptions(newSchema, {
        key: "minutes",
        arr: minutes,
        title: "title",
        value: "title",
      });
      setSchema(newSchema);
      setLoading(false);
    };
    fetchData();
  }, []);

  const validateTime = ({ hours, minutes }) => {
    const totalHours = parseInt(hours, 10) + parseInt(minutes, 10) / 60;
    const MAX_HOURS = 8;

    if (totalHours > MAX_HOURS) {
      return {
        minutes: {
          __errors: [t("CAN_ONLY_ADD_UPTO_8_HOURS_PER_DAY")],
        },
      };
    }

    if (totalHours === 0) {
      return {
        minutes: {
          __errors: [t("TIME_CANNOT_BE_ZERO")],
        },
      };
    }

    return null;
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
      const errorResult = validateTime(obj);
      if (errorResult) {
        setErrors({ ...errors, ...errorResult });
      }
    }

    if (id === "root_description") {
      if (data?.description === "") {
        setFormData({ ...formData, description: undefined });
      }
    }
  };

  const onSubmit = async (data) => {
    setIsDisable(true);
    let newFormData = data.formData;
    const obj = {
      hours: newFormData?.hours || 0,
      minutes: newFormData?.minutes || 0,
    };

    if (_.isEmpty(errors) && !validateTime(obj)) {
      const payload = {
        ...newFormData,
        type: activity,
        date: moment().format("YYYY-MM-DD"),
        hours: parseInt(newFormData.hours),
        minutes: parseInt(newFormData.minutes),
        id: id,
        categories: category?.replace("_ACTIVITY", "")?.toLowerCase(),
      };
      if (id) {
        await PcuserService.editActivity(payload);
      } else {
        await PcuserService.MarkActivity(payload);
      }
      navigate(`/daily-activities/${category}/${activity}/view`);
    }
    setIsDisable(false);
  };

  return (
    <Layout
      loading={loading}
      _appBar={{
        lang,
        setLang,
        onPressBackButton: (e) => {
          navigate(`/daily-activities/${category}/${activity}/view`);
        },
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
      }}
    >
      <VStack space="4" p="4" pb="90px" alignContent="center">
        <PCUserBreadcrumb {...{ category, activity, t }} />
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
              {t("ADD_ONE_ACTIVITY")}
            </FrontEndTypo.Primarybutton>
          </HStack>
        </Form>
      </VStack>
    </Layout>
  );
};

export default DailyActivities;
