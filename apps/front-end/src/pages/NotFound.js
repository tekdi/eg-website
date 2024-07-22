import { H1, IconByName, Loading, t } from "@shiksha/common-lib";
import { Button, VStack } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound({ goBack, message, _message }) {
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
            {message ? (
              <H1 {..._message}>{t(message)}</H1>
            ) : (
              <H1>{t("NOT_FOUND")}</H1>
            )}
            <Button onPress={(e) => (goBack ? goBack : navigator("/"))}>
              {t("GO_TO_BACK")}
            </Button>
          </VStack>
        </VStack>
      }
    />
  );
}
