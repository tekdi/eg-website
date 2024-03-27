import { FrontEndTypo, Layout } from "@shiksha/common-lib";
import { Stack, VStack } from "native-base";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import List from "./CampList/CampList";
import { useNavigate } from "react-router-dom";

export default function CampDashboard({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Layout
      _appBar={{
        name: t("MY_CAMP"),
        onlyIconsShow: ["langBtn", "userInfo", "loginBtn"],
      }}
      _footer={{ menues: footerLinks }}
    >
      <List userTokenInfo={userTokenInfo} />
      <VStack p="4" space="5">
        <VStack
          bg="boxBackgroundColour.200"
          borderColor="btnGray.100"
          borderRadius="10px"
          borderWidth="1px"
          padding="4"
          shadow="AlertShadow"
        >
          <Stack space={4}>
            <FrontEndTypo.H3 color="textMaroonColor.400">
              {t("EPCP_ACTIVITIES")}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4 color="textMaroonColor.400">
              {t("EPCP_INFO")}
            </FrontEndTypo.H4>
            <FrontEndTypo.Secondarybutton
              onPress={(e) => navigate("/camps/EpcpLearnerList")}
            >
              {t("EPCP.TITLE")}
            </FrontEndTypo.Secondarybutton>
          </Stack>
        </VStack>
      </VStack>
    </Layout>
  );
}

CampDashboard.propTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
