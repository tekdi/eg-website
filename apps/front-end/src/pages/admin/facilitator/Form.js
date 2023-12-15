import { AdminLayout as Layout, H1, Loading, t } from "@shiksha/common-lib";
import React from "react";

export default function Form() {
  return (
    <Layout>
      {/* <Form /> */}
      <Loading customComponent={<H1>{t("COMING_SOON")}</H1>} />
    </Layout>
  );
}
