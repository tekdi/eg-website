import {
  CardComponent,
  CustomRadio,
  FrontEndTypo,
  IconByName,
  ImageView,
  Layout,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import React from "react";
import {
  Actionsheet,
  Box,
  HStack,
  Pressable,
  ScrollView,
  Stack,
  VStack,
  Image,
  Container,
  Content,
} from "native-base";
import Drawer from "react-modern-drawer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import airplane from "./airoplane.gif";

export default function CampExecution({ userTokenInfo, footerLinks }) {
  const { id } = userTokenInfo?.authUser;
  const [facilitator, setFacilitator] = React.useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpenDropOut, setIsOpenDropOut] = React.useState(false);

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    setFacilitator(result);
  }, []);

  console.log("facilator photo", facilitator?.profile_photo_1?.id);

  return (
    <Layout
      _appBar={""}
      //   loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack space="5" pt="5">
        <VStack alignItems={"center"}>
          <FrontEndTypo.H3>{t("Hello, tushar mahajan")}</FrontEndTypo.H3>
        </VStack>
        <Box
          margin={"auto"}
          height={"200px"}
          width={"380px"}
          borderColor={"black"}
          bg={"red.100"}
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            source={airplane}
            alt="Airplane GIF"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={-1}
          />

          <VStack alignItems="center" justifyContent="center">
            <ImageView
              width="100px"
              height="100px"
              source={{ document_id: facilitator?.profile_photo_1?.id }}
            ></ImageView>

            <FrontEndTypo.H3
              textAlign="center"
              fontSize="16px"
              fontWeight="bold"
            >
              {t("You're welcome! Are you ready for your dream to come true?")}
            </FrontEndTypo.H3>
          </VStack>
        </Box>{" "}
        <VStack alignItems="center" space="5">
          <FrontEndTypo.H2>
            {t("Will the camp be conducted today?")}
          </FrontEndTypo.H2>
        </VStack>
        <VStack alignItems="center" space="5">
          <FrontEndTypo.Primarybutton>
            {t("Yes, absolutely yes.")}
          </FrontEndTypo.Primarybutton>
          <FrontEndTypo.Secondarybutton>
            {t("No, I have other plans for today.")}
          </FrontEndTypo.Secondarybutton>
        </VStack>
      </VStack>
    </Layout>
  );
}
