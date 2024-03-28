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
    <Stack style={stylesheet.bgimage} alignItems={"center"}>
      <FrontEndTypo.H2 bold color="textMaroonColor.400" my="4">
        {t("PROJECT_PRAGATI")}
      </FrontEndTypo.H2>
      <Text
        width={292}
        textAlign="center"
        color="textGreyColor.800"
        p={2}
        fontSize={"22px"}
        lineHeight={"33px"}
        fontWeight={600}
      >
        {t("SPLASHSCREEN_1")}
      </Text>
      <VStack space="8">
        <Image
          width={292}
          height={264}
          resizeMode="cover"
          source={{
            uri: "/images/facilitator-duties/img7.png",
          }}
          alt={"Alternate Text "}
          style={stylesheet.image}
        />
        <VStack width={"100%"} alignItems={"center"} space={4} pb="4">
          <FrontEndTypo.Primarybutton width="60%" onPress={showApplyNow}>
            {t("APPLY_NOW")}
          </FrontEndTypo.Primarybutton>
          <FrontEndTypo.Secondarybutton width="60%" onPress={showPrerakDuties}>
            {t("KNOW_PRERAK_DUTIES")}
          </FrontEndTypo.Secondarybutton>

          <Pressable onPress={() => showLogin()}>
            <Text style={stylesheet.text1}>
              {t("ALREADY_APPLIED_CHECK_STATUS")}
            </Text>
          </Pressable>
        </VStack>
      </VStack>
    </Stack>
  );
}
