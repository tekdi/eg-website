import React from "react";
import Form from "./ErollmentReceipt";
import { VStack } from "native-base";

export default function enrollmentForm() {
  const [facilitator, setFacilitator] = React.useState({});

  return (
    <VStack>
      <Form {...{ facilitator }} />
    </VStack>
  );
}
