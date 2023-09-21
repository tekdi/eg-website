import React from "react";
import { Alert, Box, Center, HStack, Progress, VStack } from "native-base";
import {
  Layout,
  BodyMedium,
  FrontEndTypo,
  AdminTypo,
  IconByName,
} from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { ChipStatus } from "component/BeneficiaryStatus";

// App
export default function CampList({ userTokenInfo, footerLinks }) {
  const [loading] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onPressBackButton = async () => {
    navigate("/camp/campRegistration");
  };

  // update schema

  return (
    <Layout
      loading={loading}
      _page={{ _scollView: { bg: "bgGreyColor.200" } }}
      _appBar={{
        name: t("LEARNERS_IN_CAMP"),
        onPressBackButton,
        _box: { bg: "white" },
      }}
    >
      <Box py={6} px={4} mb={5}>
        <AdminTypo.H3 color={"textMaroonColor.400"}>
          <Alert
            status="info"
            alignItems={"start"}
            mb="3"
            mt="4"
            width={"100%"}
          >
            <HStack alignItems="center" space="2" color>
              <Alert.Icon />
              <BodyMedium>{t("CAMP_WARNING")}</BodyMedium>
            </HStack>
          </Alert>
        </AdminTypo.H3>
        <Center w="100%" my={5}>
          <Box w="100%" maxW="700">
            <Progress value={45} size="xs" colorScheme="info" />
          </Box>
        </Center>
        <HStack
          bg="white"
          p="2"
          my={2}
          shadow="FooterShadow"
          rounded="sm"
          space="1"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <HStack justifyContent="space-between">
            <HStack alignItems="Center" flex="5">
              {/* <ImageView
                    source={{
                      document_id: 11,
                    }}
                    alt="Alternate Text"
                    width={"45px"}
                    height={"45px"}
                  /> */}

              <IconByName
                isDisabled
                name="AccountCircleLineIcon"
                color="gray.300"
                _icon={{ size: "45px" }}
              />

              <VStack
                pl="2"
                flex="1"
                wordWrap="break-word"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                <FrontEndTypo.H3
                  bold
                  color="textGreyColor.800"
                ></FrontEndTypo.H3>
              </VStack>
            </HStack>
          </HStack>

          <Box maxW="121px">
            <ChipStatus status={"verified"} rounded={"sm"} />
          </Box>
        </HStack>
      </Box>
    </Layout>
  );
}
