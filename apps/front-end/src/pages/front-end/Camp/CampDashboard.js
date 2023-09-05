import {
  AdminTypo,
  FrontEndTypo,
  IconByName,
  ImageView,
  Layout,
  arrList,
  benificiaryRegistoryService,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import {
  HStack,
  VStack,
  Box,
  Select,
  Pressable,
  Text,
  Progress,
  Center,
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PrerakListView({ userTokenInfo, footerLinks }) {
  const navigate = useNavigate();
  const fa_id = localStorage.getItem("id");
  const { t } = useTranslation();
  const [facilitator, setfacilitator] = React.useState();

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id: fa_id });
    setfacilitator(result);
  }, []);

  return (
    <Layout _appBar={{ name: t("MY_CAMP") }} _footer={{ menues: footerLinks }}>
      <Box
        bg="boxBackgroundColour.100"
        borderColor="btnGray.100"
        borderRadius="10px"
        borderWidth="1px"
        padding="6"
        margin={"20px"}
        shadow="AlertShadow"
      >
        <HStack justifyContent={"space-between"}>
          <Text>{t("CAMP")}</Text>
          <HStack>
            <IconByName
              isDisabled
              name="ErrorWarningLineIcon"
              color="textMaroonColor.400"
              _icon={{ size: "20px" }}
            />
            <Text ml={2} color="textMaroonColor.400">
              {t("NOT_REGISTER")}
            </Text>
          </HStack>
        </HStack>
        <HStack justifyContent={"space-between"} alignItems={"center"} mt={5}>
          <VStack>
            <Text>
              {facilitator?.first_name} {facilitator?.last_name}
            </Text>
            <AdminTypo.H2 color="textMaroonColor.400">
              14 {t("LEARNERS")}
            </AdminTypo.H2>
          </VStack>
          <HStack>
            <IconByName
              isDisabled
              name="AccountCircleLineIcon"
              _icon={{ size: "40px" }}
            ></IconByName>
            <IconByName
              isDisabled
              marginLeft={"-20px"}
              name="AccountCircleLineIcon"
              _icon={{ size: "40px" }}
            ></IconByName>
            <IconByName
              marginLeft={"-20px"}
              isDisabled
              name="AccountCircleLineIcon"
              _icon={{ size: "40px" }}
            ></IconByName>
            <IconByName
              isDisabled
              marginLeft={"-20px"}
              name="AccountCircleLineIcon"
              _icon={{ size: "40px" }}
            ></IconByName>
            <ImageView
              source={{
                uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
              }}
              alt="Alternate Text"
              width={"35px"}
              height={"35px"}
            />
          </HStack>
        </HStack>
        <VStack mt={5}>
          <Center w="100%">
            <Box w="100%" maxW="700">
              <Progress value={45} size="xs" colorScheme="info" />
            </Box>
          </Center>
          <AdminTypo.H6 my={3}>{t("START_CAMP_REGISTER")}</AdminTypo.H6>
        </VStack>
        <FrontEndTypo.Secondarybutton
          onPress={() => {
            navigate(`/CampDashboard/CampRegistration`);
          }}
        >
          {t("START_CAMP_REGISTER")}
        </FrontEndTypo.Secondarybutton>
        <Box
          bg="boxBackgroundColour.100"
          borderColor="btnGray.100"
          borderRadius="10px"
          borderWidth="1px"
          padding="6"
          margin={"20px"}
          background={"amber.100"}
        >
          <HStack alignItems={"center"} justifyContent={"center"}>
            <IconByName
              isDisabled
              name="ErrorWarningLineIcon"
              color="amber.400"
              _icon={{ size: "30px" }}
            />
            <Text ml={2} fontSize={"16px"}>
              {t("CAMP_WARNING")}
            </Text>
          </HStack>
        </Box>
      </Box>
      <Box padding="6">
        <AdminTypo.H2>{t("HOW_TO_START_CAMP")}</AdminTypo.H2>
      </Box>
    </Layout>
  );
}
