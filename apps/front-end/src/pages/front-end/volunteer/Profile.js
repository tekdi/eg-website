import {
  CardComponent,
  FrontEndTypo,
  IconByName,
  arrList,
  objProps,
} from "@shiksha/common-lib";
import { Box, Divider, HStack, Progress, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getOnboardingData } from "v2/utils/OfflineHelper/OfflineHelper";
import Layout from "onest/Layout";
import schema from "./registration/schema";

export default function Profile({ userTokenInfo: { authUser } }) {
  const [facilitator, setFacilitator] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const init = async () => {
      setFacilitator(authUser);
      setLoading(false);
    };
    init();
  }, []);

  console.log(facilitator);
  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate("/"),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("YOUR_PROFILE")}</FrontEndTypo.H2>,
        profile_url: facilitator?.profile_photo_1?.name,
        name: [facilitator?.first_name, facilitator?.last_name].join(" "),
        exceptIconsShow: ["backBtn", "userInfo"],
      }}
      facilitator={facilitator}
      // _footer={{ menues: footerLinks }}
      analyticsPageTitle={"FACILITATOR_PROFILE"}
      pageTitle={t("FACILITATOR")}
      stepTitle={t("PROFILE")}
    >
      <VStack pb="10">
        <VStack paddingLeft="16px" pt={4} paddingRight="16px" space="24px">
          <FrontEndTypo.H1 color="textGreyColor.900" pt="5" bold>
            {t("HELLO_HOME")}, {facilitator?.first_name}!
          </FrontEndTypo.H1>

          {Object.keys(schema?.properties || {})?.map((item) => (
            <CardComponent
              _vstack={{ bg: "boxBackgroundColour.100" }}
              grid={2}
              key={item}
              item={{
                ...facilitator,
                qualification:
                  facilitator?.qualifications?.qualification_master?.name ||
                  "-",
              }}
              label={Object.values(schema?.properties?.[item].properties || {})}
              arr={Object.keys(schema?.properties?.[item].properties || {})}
            />
          ))}
        </VStack>
      </VStack>
    </Layout>
  );
}
