import { BodyMedium, FrontEndTypo } from "@shiksha/common-lib";
import { Alert, Box, HStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AddressOffline = ({ alert, facilitator, navigatePage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box py={6} px={4} mb={5}>
      {alert && (
        <Alert status="warning" alignItems={"start"} mb="3">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t(alert)}</BodyMedium>
          </HStack>
        </Alert>
      )}
      <FrontEndTypo.H3 py={4} color={"textMaroonColor.400"}>
        {t("DISTRICT")} : {facilitator?.district || "-"}
      </FrontEndTypo.H3>
      <FrontEndTypo.H3 py={4} color={"textMaroonColor.400"}>
        {t("BLOCK")} : {facilitator?.block || "-"}
      </FrontEndTypo.H3>
      <FrontEndTypo.H3 py={4} color={"textMaroonColor.400"}>
        {t("GRAMPANCHAYAT")} : {facilitator?.grampanchayat || "-"}
      </FrontEndTypo.H3>
      <FrontEndTypo.H3 py={4} color={"textMaroonColor.400"}>
        {t("VILLAGE_WARD")} : {facilitator?.village || "-"}
      </FrontEndTypo.H3>
      <FrontEndTypo.H3 py={4} color={"textMaroonColor.400"}>
        {t("PINCODE")} : {facilitator?.pincode || "-"}
      </FrontEndTypo.H3>

      <FrontEndTypo.Primarybutton
        p="4"
        mt="4"
        onPress={(e) => navigate("/profile/edit/personal_details")}
      >
        {t("NEXT")}
      </FrontEndTypo.Primarybutton>

      <FrontEndTypo.Secondarybutton
        p="4"
        mt="4"
        onPress={() => navigate("/profile")}
      >
        {t("GO_TO_PROFILE")}
      </FrontEndTypo.Secondarybutton>
    </Box>
  );
};

export default AddressOffline;
