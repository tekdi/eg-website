import { Layout } from "@shiksha/common-lib";
import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import List from "./CampList/CampList";

export default function CampDashboard({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();

  return (
    <Layout
      _appBar={{
        name: t("MY_CAMP"),
        onlyIconsShow: ["langBtn", "userInfo", "loginBtn"],
      }}
      _footer={{ menues: footerLinks }}
    >
      <List userTokenInfo={userTokenInfo} />
    </Layout>
  );
}

CampDashboard.propTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
