import { FrontEndTypo } from "@shiksha/common-lib";
import { Stack, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EpcpCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <VStack padding="2">
      <Stack space={4}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {t("EPCP_ACTIVITIES")}
        </FrontEndTypo.H2>
        <FrontEndTypo.H4 color="textMaroonColor.400">
          {t("EPCP_INFO")}
        </FrontEndTypo.H4>
        <FrontEndTypo.Secondarybutton
          onPress={(e) => navigate("/camps/epcplearnerlist")}
        >
          <FrontEndTypo.H3 color="textMaroonColor.400">
            {t("EPCP.TITLE")}
          </FrontEndTypo.H3>
        </FrontEndTypo.Secondarybutton>
      </Stack>
    </VStack>
  );
};

export default EpcpCard;
