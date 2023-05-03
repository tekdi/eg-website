import { AdminLayout as Layout, H1, Loading, t } from "@shiksha/common-lib";
import { Center, VStack } from "native-base";
import React from "react";
import Form from "../front-end/Form";

export default function FacilitatorForm() {
  return (
    <Layout
      _appBar={{
        isShowNotificationButton: true,
      }}
    >
      {/* <Form /> */}
      <Loading customComponent={<H1>{t("coming_soon")}</H1>} />
    </Layout>
  );
}
