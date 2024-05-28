import React from "react";
import Form from "./BasicDetailsForm";
import { useParams } from "react-router-dom";
import { VStack } from "native-base";

export default function BasicDetails(props) {
  const { id } = useParams();

  return (
    <VStack>
      <Form {...props} {...{ id }} />
    </VStack>
  );
}
