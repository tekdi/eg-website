import React, { useEffect, useState } from "react";
import {
  PCusers_layout as Layout,
  FrontEndTypo,
  PcuserService,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import moment from "moment";

function DailyActivitiesView(props) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const { t } = useTranslation();
  const { activity } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getActivityDetail = async () => {
    setLoading(true);
    const payload = {
      page: "1",
      limit: "10",
      type: activity,
      date: moment().format("YYYY-MM-DD"),
    };
    const data = await PcuserService.activitiesDetails(payload);
    setActivities(data?.data?.activities || []);
    setLoading(false);
  };

  useEffect(() => {
    getActivityDetail();
  }, []);

  const deleteActivity = async (id) => {
    await PcuserService.deleteActivity({ id });
    getActivityDetail();
  };

  return (
    <Layout
      _appBar={{
        lang,
        setLang,
        onPressBackButton: (e) => {
          navigate(`/dailyactivities/list`);
        },
        onlyIconsShow: ["backBtn", "userInfo", "langBtn"],
      }}
      loading={loading}
    >
      <VStack space="2" p={4}>
        <VStack space={4}>
          <FrontEndTypo.H1>{t("DAILY_ACTIVITIES")}</FrontEndTypo.H1>
          <FrontEndTypo.H2 color={"#4F4F4F"}>{t(activity)}</FrontEndTypo.H2>
        </VStack>

        {activities.length > 0 ? (
          activities.map((item) => {
            return (
              <VStack
                borderColor="btnGray.100"
                borderRadius="10px"
                borderWidth="1px"
                padding="4"
                shadow="AlertShadow"
                space="4"
                pl={4}
              >
                <VStack space={2}>
                  <FrontEndTypo.H4 bold color="#1F1D76">
                    {t("VILLAGE_WARD")}
                  </FrontEndTypo.H4>
                  <FrontEndTypo.H4 bold>{item?.village}</FrontEndTypo.H4>
                </VStack>
                <VStack space={2}>
                  <FrontEndTypo.H4 bold color="#1F1D76">
                    {t("DESCRIPTION")}
                  </FrontEndTypo.H4>
                  <FrontEndTypo.H4 bold>{item?.description}</FrontEndTypo.H4>
                </VStack>
                <VStack space={2}>
                  <FrontEndTypo.H4 bold color="#1F1D76">
                    {t("TIME_SPENT_IN_HOURS")}
                  </FrontEndTypo.H4>
                  <FrontEndTypo.H4 bold>
                    {item?.hours}: {item?.minutes}
                  </FrontEndTypo.H4>
                </VStack>
                <HStack alignSelf={"center"} space={4}>
                  <FrontEndTypo.Secondarybutton
                    px={"30px"}
                    onPress={() => deleteActivity(item.id)}
                  >
                    {t("DELETE")}
                  </FrontEndTypo.Secondarybutton>
                  <FrontEndTypo.Primarybutton
                    px={"40px"}
                    onPress={() =>
                      navigate(`/dailyactivities/${activity}/edit`, {
                        state: {
                          id: item.id,
                        },
                      })
                    }
                  >
                    {t("EDIT")}
                  </FrontEndTypo.Primarybutton>
                </HStack>
              </VStack>
            );
          })
        ) : (
          <HStack justifyContent={"center"} alignItems="center">
            {t("DATA_NOT_FOUND")}
          </HStack>
        )}

        <VStack alignSelf={"center"}>
          <FrontEndTypo.H4
            underline
            color="#0500FF"
            onPress={() => navigate(`/dailyactivities/${activity}/form`)}
          >
            {activities.length > 0
              ? t("ADD_ACTIVITY_FOR_ANOTHER_VILLAGE")
              : t("ADD_ACTIVITY")}
          </FrontEndTypo.H4>
        </VStack>
      </VStack>
    </Layout>
  );
}

DailyActivitiesView.propTypes = {};

export default DailyActivitiesView;
