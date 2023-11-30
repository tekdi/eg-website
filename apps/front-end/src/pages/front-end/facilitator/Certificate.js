import React from "react";
import { VStack } from "native-base";
import {
  Layout,
  FrontEndTypo,
  facilitatorRegistryService,
  ImageView,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Profile({ userTokenInfo, footerLinks }) {
  const { id } = userTokenInfo?.authUser || [];
  const [facilitator, setFacilitator] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    setFacilitator(result);
    setLoading(false);
  }, []);

  return (
    <Layout
      loading={loading}
      _appBar={{
        onPressBackButton: (e) => navigate("/"),
        onlyIconsShow: ["backBtn", "langBtn"],
        leftIcon: <FrontEndTypo.H2>{t("CERTIFICATE")}</FrontEndTypo.H2>,
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="bgGreyColor.200" pb="10">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <FrontEndTypo.H1 color="textMaroonColor.400" pt="5" bold>
            {t("WELCOME")} {facilitator?.first_name}
          </FrontEndTypo.H1>

          {/* <VStack flex="5">
            <ImageView
              frameborder="0"
              _box={{ flex: 1 }}
              height="100%"
              width="100%"
              urlObject={receiptUrl}
              alt="aadhaar_front"
            />
          </VStack> */}
        </VStack>
      </VStack>
    </Layout>
  );
}
