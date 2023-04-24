import { H1, IconByName, Loading } from "@shiksha/common-lib";
import { Button, VStack } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound({ goBack }) {
  const navigator = useNavigate();
  return (
    <Loading
      customComponent={
        <VStack space={"10"} alignItems="center">
          <IconByName
            name={"SearchEyeLineIcon"}
            color={"primary"}
            _icon={{ size: "50" }}
          />
          <VStack space={"5"} alignItems="center">
            <H1>Not Found</H1>
            <Button onPress={(e) => (goBack ? goBack : navigator("/login"))}>
              Go to back
            </Button>
          </VStack>
        </VStack>
      }
    />
  );
}
