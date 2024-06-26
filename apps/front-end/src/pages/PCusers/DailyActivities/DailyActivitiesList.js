import React, { useState, useEffect } from "react";
import {
  PCusers_layout as Layout,
  CardComponent,
  FrontEndTypo,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { HStack, Pressable, VStack } from "native-base";
import { useNavigate, useParams } from "react-router-dom";
import { activities } from "./ActivitiesSchema";

const DailyActivitiesList = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setList(activities);
    setLoading(false);
  }, []);

  return (
    <Layout
      loading={loading}
      //facilitator={facilitator}
      analyticsPageTitle={"HOME"}
      pageTitle={t("HOME")}
    >
      <VStack space="4" p="4" alignContent="center">
        <FrontEndTypo.H1>{t("DAILY_ACTIVITIES")}</FrontEndTypo.H1>
        {list?.map((item) => {
          return (
            <CardComponent
              key={item}
              _body={{ px: "3", py: "3" }}
              _vstack={{ p: 0, space: 0, flex: 1 }}
            >
              <Pressable
                flex={1}
                onPress={async () => {
                  navigate(`/dailyactivities/${item}/view`);
                }}
              >
                <HStack justifyContent="space-between" space={1}>
                  {t(item)}
                </HStack>
              </Pressable>
            </CardComponent>
          );
        })}
      </VStack>
    </Layout>
  );
};

export default DailyActivitiesList;
