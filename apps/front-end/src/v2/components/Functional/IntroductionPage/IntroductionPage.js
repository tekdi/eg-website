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

// import pragati100 from "/public/educate-girls-pragati-100x100.png"

export default function IntroductionPage({
  t,
  showPrerakDuties,
  showApplyNow,
  showLogin,
}) {
  const [language, setLang] = useState(getLanguage);

  useEffect(() => {
    setLang(getLanguage);
  }, []);
  {
    return (
      <Stack style={stylesheet.bgimage} alignItems={"center"}>
        <Image
          mt={5}
          alignSelf="center"
          source={{
            uri: `/images/logos/${language}/educate-girls-pragati.png`,
          }}
          alt={`${language}`}
          resizeMode="contain"
          width={"130px"}
          height={"90px"}
        />
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
            <FrontEndTypo.Secondarybutton minW="60%" onPress={showPrerakDuties}>
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
}
