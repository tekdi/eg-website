import React, { useEffect, useState } from "react";
import { PCusers_layout as Layout, FrontEndTypo } from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { HStack, Image, VStack } from "native-base";
import DashboardCard from "component/common_components/DashboardCard";
import PropTypes from "prop-types";

const PcDashboard = ({ userTokenInfo }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [menus, setMenus] = useState();
  const headerName = localStorage.getItem("fullName")
    ? localStorage.getItem("fullName")
    : "";
  useEffect(() => {
    const fetchData = async () => {
      setMenus([
        {
          title: "MY_PROFILE",
          titleDetail:
            "YOU_CAN_ACCESS_YOUR_PROFILE_DETAILS_AND_EDIT_THEM_FROM_HERE",
          primaryBtn: "VIEW_MY_PROFILE",
          navigation: "/profile",
        },
        {
          title: "MY_DAILY_ACTIVITIES",
          titleDetail: "MARK_YOUR_DAILY_ACTIVITIES_AND_TASKS",
          primaryBtn: "MARK_DAILY_ACTIVITIES",
          navigation: "/select-village",
        },
      ]);
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
      facilitator={userTokenInfo?.authUser || {}}
      _footer={{ menues: true }}
      analyticsPageTitle={"HOME"}
      pageTitle={t("HOME")}
    >
      <VStack p="4" space="6">
        <HStack flex="1" py="2">
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
        <VStack space={4}>
          {menus?.map((menu) => (
            <DashboardCard
              key={menu}
              title={menu?.title}
              titleDetail={menu?.titleDetail}
              primaryBtn={menu?.primaryBtn}
              navigation={menu?.navigation}
            />
          ))}
        </VStack>
      </VStack>
    </Layout>
  );
};

export default PcDashboard;

PcDashboard.propTypes = {
  userTokenInfo: PropTypes.object,
};
