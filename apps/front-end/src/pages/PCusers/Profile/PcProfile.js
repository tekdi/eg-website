import React from "react";
import { HStack, VStack, Box, Progress, Divider } from "native-base";
import {
  IconByName,
  arrList,
  PCusers_layout as Layout,
  FrontEndTypo,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { objProps } from "@shiksha/common-lib";
import { getOnboardingData } from "v2/utils/OfflineHelper/OfflineHelper";

export default function PcProfile({ userTokenInfo }) {
  const { id } = userTokenInfo?.authUser;
  const full_name = localStorage.getItem("fullName");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate("/"),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("YOUR_PROFILE")}</FrontEndTypo.H2>,
      }}
      analyticsPageTitle={"PC_PROFILE"}
      pageTitle={t("PC_PROFILE")}
      stepTitle={t("PROFILE")}
    >
      <VStack bg="bgGreyColor.200" pb="10">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <FrontEndTypo.H1 color="textMaroonColor.400" pt="5" bold>
            {t("WELCOME")} {full_name}
          </FrontEndTypo.H1>

          <Box
            bg="boxBackgroundColour.100"
            borderColor="btnGray.100"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("BASIC_DETAILS")}
                </FrontEndTypo.H3>

                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  onPress={(e) => {
                    navigate(`/profile/basicdetails`);
                  }}
                />
              </HStack>
              <Divider
                orientation="horizontal"
                bg="btnGray.100"
                thickness="1"
              />
              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.800" bold>
                  {t("IP_ADDRESS")}
                </FrontEndTypo.H3>

                <IconByName
                  name="ArrowRightSLineIcon"
                  color="textMaroonColor.400"
                  onPress={(e) => {
                    navigate(`/profile/basicdetails`);
                  }}
                />
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Layout>
  );
}
