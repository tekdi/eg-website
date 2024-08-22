import React, { useEffect, useState } from "react";
import {
  PCusers_layout as Layout,
  FrontEndTypo,
  PcuserService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { HStack, Image, VStack } from "native-base";
import DashboardCard from "component/common_components/DashboardCard";

const PcDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const headerName = localStorage.getItem("fullName")
    ? localStorage.getItem("fullName")
    : "";
  useEffect(() => {
    const fetchData = async () => {
      const data = await PcuserService.getPcProfile();
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Layout
      loading={loading}
      _appBar={{
        profile_url: "facilitator?.profile_photo_1?.name",
        name: headerName,
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      // facilitator={facilitator}
      _footer={{ menues: true }}
      analyticsPageTitle={"HOME"}
      pageTitle={t("HOME")}
    >
      <VStack bg="primary.50" style={{ zIndex: -1 }}>
        <VStack space="5">
          <HStack py="4" flex="1" px="4">
            <Image
              source={{
                uri: "/hello.svg",
              }}
              alt="Add AG"
              size={"30px"}
              resizeMode="contain"
            />
            <FrontEndTypo.H1 color="textMaroonColor.400" pl="1">
              {t("WELCOME")} {headerName},
            </FrontEndTypo.H1>
          </HStack>
          <VStack
            bg="primary.50"
            p="5"
            mb="50px"
            space={4}
            style={{ zIndex: -1 }}
          >
            <DashboardCard
              title={"MY_PROFILE"}
              titleDetail={
                "YOU_CAN_ACCESS_YOUR_PROFILE_DETAILS_AND_EDIT_THEM_FROM_HERE"
              }
              primaryBtn={"VIEW_MY_PROFILE"}
              navigation={"/profile"}
            />

            {/* Temp Comment */}
            <DashboardCard
              title={"MY_DAILY_ACTIVITIES"}
              titleDetail={"MARK_YOUR_DAILY_ACTIVITIES_AND_TASKS"}
              primaryBtn={"MARK_DAILY_ACTIVITIES"}
              navigation={"/markDailyActivity"}
            />
            {/* <DashboardCard
              title={"PRAGATI_SABHA"}
              titleDetail={"USE_THIS_SPACE_TO_ORGANISE_YOUR_PRAGATI_SABHA"}
              primaryBtn={"ORGANISE_EVENT"}
              navigation={"/examresultreport"}
            /> */}
            {/* Temp Comment  End*/}
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
};

export default PcDashboard;
