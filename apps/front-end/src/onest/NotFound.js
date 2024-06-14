import NotFound from "pages/NotFound";
import React from "react";
import Layout from "./Layout";
import { VStack } from "native-base";

export default function App({ userTokenInfo: { authUser } }) {
  // add user info for drawer
  return (
    <Layout
      userAccess
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.use_role?.[0],
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
