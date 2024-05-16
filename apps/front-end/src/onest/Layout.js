import { Layout } from "@shiksha/common-lib";
import React from "react";

export default function App({ children, ...props }) {
  return (
    <Layout
      allowRoles={["facilitator", "volunteer", "beneficiary"]}
      _appBar={{
        onlyIconsShow: ["loginBtn", "backBtn", "userInfo", "langBtn"],
      }}
      {...props}
    >
      {children}
    </Layout>
  );
}
