import {
  Center,
  VStack,
  Image,
  HStack,
  Text,
  Input,
  Stack,
  Box,
  Button,
  Pressable,
} from "native-base";
import React, { useEffect, useState } from "react";
import { FrontEndTypo } from "@shiksha/common-lib";
import { setLanguage, getLanguage } from "v2/utils/Helper/JSHelper";
import { stylesheet } from "./IntroductionPage.Styles";

export default function IntroductionPage({
  t,
  showPrerakDuties,
  showApplyNow,
  showLogin,
}) {
  return (
    <Stack style={stylesheet.bgimage}>
      <FrontEndTypo.H2
        bold
        color="textMaroonColor.400"
        textAlign="center"
        my="4"
      >
        {t("PROJECT_PRAGATI")}
      </FrontEndTypo.H2>
      <FrontEndTypo.H1
        color="textGreyColor.800"
        p={2}
        bold
        textAlign={"center"}
      >
        {t("SPLASHSCREEN_1")}
      </FrontEndTypo.H1>
      <VStack
        space={2}
        justifyContent="center"
        alignItems="center"
        safeAreaTop
        mb={6}
      >
        <Image
          size={"2xl"}
          resizeMode="cover"
          source={{
            uri: "/images/facilitator-duties/img7.png",
          }}
          alt={"Alternate Text "}
          style={stylesheet.image}
        />
        <Box bg="white" width="100%" px="5">
          <Center my="8">
            <Pressable onPress={showPrerakDuties}>
              <FrontEndTypo.H3 style={stylesheet.text1} color={"linkColor"}>
                {" "}
                {t("KNOW_PRERAK_DUTIES")}
              </FrontEndTypo.H3>
            </Pressable>
          </Center>
          <FrontEndTypo.Primarybutton width="60%" mx="auto" onPress={showApplyNow}>
            {t("APPLY_NOW")}
          </FrontEndTypo.Primarybutton>
        </Box>
        <Center my={8}>
          <Pressable onPress={() => showLogin()}>
            <Text style={stylesheet.text1}>
              {" "}
              {t("ALREADY_APPLIED_CHECK_STATUS")}
            </Text>
          </Pressable>
        </Center>
      </VStack>
    </Stack>
  );
}
