import React from "react";
import Form from "./educationForm";
import { useParams } from "react-router-dom";
import { VStack } from "native-base";

export default function EducationDetails() {
  const { id } = useParams();

  return (
    <VStack>
      <Form {...{ id }} onClick={(e) => setPage(e)} />
    </VStack>
  );
}
