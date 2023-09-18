import {
  AdminTypo,
  BodyMedium,
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
  Avatar,
  Alert,
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Example = () => {
  return (
    <Center>
      <Avatar.Group
        _avatar={{
          size: "lg",
        }}
        max={3}
      >
        <Avatar
          bg="green.500"
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        >
          AJ
        </Avatar>
        <Avatar
          bg="cyan.500"
          source={{
            uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          }}
        >
          TE
        </Avatar>
        <Avatar
          bg="indigo.500"
          source={{
            uri: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        >
          JB
        </Avatar>
        <Avatar
          bg="amber.500"
          source={{
            uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          }}
        >
          TS
        </Avatar>
        <Avatar
          bg="green.500"
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        >
          AJ
        </Avatar>
        <Avatar
          bg="cyan.500"
          source={{
            uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          }}
        >
          TE
        </Avatar>
        <Avatar
          bg="indigo.500"
          source={{
            uri: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        >
          JB
        </Avatar>
        <Avatar
          bg="amber.500"
          source={{
            uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          }}
        >
          TS
        </Avatar>
      </Avatar.Group>
    </Center>
  );
};

export default function CampDashboard({ userTokenInfo, footerLinks }) {
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
              14 {t("BENEFICIARY_STATUS_ENROLLED_IP_VERIFIED")} {t("LEARNERS")}
            </AdminTypo.H2>
          </VStack>
          <HStack>{Example()}</HStack>
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
            navigate(`/camp/learnerList`);
          }}
        >
          {t("START_CAMP_REGISTER")}
        </FrontEndTypo.Secondarybutton>

        <Alert
          status="warning"
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
      </Box>
      <Box padding="6">
        <AdminTypo.H2>{t("HOW_TO_START_CAMP")}</AdminTypo.H2>
        <HStack mt={2}>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/_Tbo0cATRGM?si=G7KEFIkHPLg1mFQy"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </HStack>
      </Box>
    </Layout>
  );
}
