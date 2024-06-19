import React from "react";
import PropTypes from "prop-types";
import {
  PCusers_layout as Layout,
  CardComponent,
  FrontEndTypo,
  getOptions,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import { HStack, ScrollView, VStack } from "native-base";
import { useTranslation } from "react-i18next";

function DailyActivitiesView(props) {
  const { t } = useTranslation();
  const { activity } = useParams();
  const navigate = useNavigate();
  console.log({ activity });
  return (
    <Layout
    //   loading={loading}
    >
      <VStack space="2" p={4}>
        <VStack space={4}>
          <FrontEndTypo.H1>{t("DAILY_ACTIVITIES")}</FrontEndTypo.H1>
          <FrontEndTypo.H2 color={"#4F4F4F"}>{activity}</FrontEndTypo.H2>
        </VStack>
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
            <FrontEndTypo.H4 bold>Jaipur</FrontEndTypo.H4>
          </VStack>
          <VStack space={2}>
            <FrontEndTypo.H4 bold color="#1F1D76">
              {t("DESCRIPTION")}
            </FrontEndTypo.H4>
            <FrontEndTypo.H4 bold>aBCSJED</FrontEndTypo.H4>
          </VStack>
          <VStack space={2}>
            <FrontEndTypo.H4 bold color="#1F1D76">
              {t("TIME_SPENT_IN_HOURS")}
            </FrontEndTypo.H4>
            <FrontEndTypo.H4 bold>7</FrontEndTypo.H4>
          </VStack>
          <HStack alignSelf={"center"} space={4}>
            <FrontEndTypo.Secondarybutton>
              {t("DELETE")}
            </FrontEndTypo.Secondarybutton>
            <FrontEndTypo.Primarybutton
              onPress={() => navigate(`/dailyactivities/${activity}/edit`)}
            >
              {t("EDIT")}
            </FrontEndTypo.Primarybutton>
          </HStack>
        </VStack>
        <VStack alignSelf={"center"}>
          <FrontEndTypo.H4
            underline
            color="#0500FF"
            onPress={() => navigate(`/dailyactivities/${activity}/form`)}
          >
            {t("ADD_ACTIVITY_FOR_ANOTHER_VILLAGE")}
          </FrontEndTypo.H4>
        </VStack>
      </VStack>
    </Layout>
  );
}

DailyActivitiesView.propTypes = {};

export default DailyActivitiesView;
