import { Layout, t } from "@shiksha/common-lib";
import React from "react";

export default function CampSetting({ footerLinks }) {
  return (
    <Layout
      _appBar={{ name: t("Settings") }}
      _footer={{ menues: footerLinks }}
    ></Layout>
  );
}
