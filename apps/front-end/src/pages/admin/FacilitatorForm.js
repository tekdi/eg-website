import { AdminLayout as Layout } from "@shiksha/common-lib";
import React from "react";
import Form from "../front-end/Form";

export default function FacilitatorForm() {
  return (
    <Layout
      _appBar={{
        isShowNotificationButton: true,
      }}
    >
      <Form />
    </Layout>
  );
}
