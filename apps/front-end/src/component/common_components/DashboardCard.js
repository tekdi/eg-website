import React from "react";
import { Stack } from "native-base";
import { FrontEndTypo } from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const DashboardCard = ({ title, titleDetail, primaryBtn, navigation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Stack
      space="4"
      p={"4"}
      borderBottomColor={"1px"}
      borderWidth="1px"
      borderColor="garyTitleCardBorder"
      shadow={"CardComponentShadow"}
      rounded="5px"
    >
      <FrontEndTypo.H3
        bold
        _fontWeight={{
          fontWeight: "600",
        }}
        color="textGreyColor.750"
      >
        {t(title)}
      </FrontEndTypo.H3>
      <FrontEndTypo.H4
        _fontWeight={{
          fontWeight: "600",
        }}
        color="textGreyColor.750"
      >
        {t(titleDetail)}
      </FrontEndTypo.H4>

      <FrontEndTypo.Secondarybutton
        width="100%"
        onPress={(e) => navigate(navigation)}
      >
        <FrontEndTypo.H3
          _fontWeight={{
            fontWeight: "500",
          }}
          color="textRed.350"
        >
          {t(primaryBtn)}
        </FrontEndTypo.H3>
      </FrontEndTypo.Secondarybutton>
    </Stack>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string,
  titleDetail: PropTypes.string,
  primaryBtn: PropTypes.string,
  navigation: PropTypes.any,
};

export default DashboardCard;
