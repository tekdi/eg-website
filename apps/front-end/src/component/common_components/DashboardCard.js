import React from "react";
import { Stack } from "native-base";
import { FrontEndTypo } from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DashboardCard = ({ title, titleDetail, primaryBtn, navigation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Stack bg="bgYellowColor.400" space="6" p={4}>
      <FrontEndTypo.H2 color="textMaroonColor.400">{t(title)}</FrontEndTypo.H2>
      <FrontEndTypo.H3>{t(titleDetail)}</FrontEndTypo.H3>

      <FrontEndTypo.Secondarybutton
        width="100%"
        onPress={(e) => navigate(navigation)}
      >
        <FrontEndTypo.H3>{t(primaryBtn)}</FrontEndTypo.H3>
      </FrontEndTypo.Secondarybutton>
    </Stack>
  );
};

export default DashboardCard;
