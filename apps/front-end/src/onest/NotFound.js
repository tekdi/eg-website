import NotFound from "pages/NotFound";
import React from "react";
import Layout from "./Layout";
import { VStack } from "native-base";

export default function App() {
  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["helpAppBtn"],
      }}
    >
      <VStack p="4">
        <NotFound
          message={"VOLUNTEER_MESSAGE_NOT_APPROVED"}
          _message={{ textAline: "center" }}
        />
      </VStack>
    </Layout>
  );
}
