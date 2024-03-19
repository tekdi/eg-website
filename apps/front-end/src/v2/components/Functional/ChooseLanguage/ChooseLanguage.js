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
import { FrontEndTypo, TitleCard } from "@shiksha/common-lib";
import { setLanguage, getLanguage } from "v2/utils/Helper/JSHelper";
import Motif_EG from "../../../assets/Images/Logo/Motif_EG.svg";

export default function ChooseLanguage({ t, languageChanged }) {
  const [code, setCode] = useState(getLanguage());
  const [langChanged, setLangChanged] = useState(false);
  useEffect(() => {
    setLanguage(code);
  }, [code]);
  useEffect(() => {
    if (langChanged) {
      languageChanged();
    }
  }, [langChanged]);

  return (
    <HStack flexDirection={"column"}>
      <Image
        source={{
          uri: Motif_EG,
        }}
        width={"100%"}
        padding={"20px 0px"}
        height={"100%"}
      />
      <Box p="5">
        <FrontEndTypo.H1 bold textAlign={"center"}>
          {t("CHOOSE_LANGUAGE")}
        </FrontEndTypo.H1>
        <FrontEndTypo.H3
          pt="5"
          color="textGreyColor.750"
          textAlign={"center"}
          lineHeight="21px"
        >
          {t("PREFERED_LANGUAGE")}
        </FrontEndTypo.H3>

        <HStack space={4} mt={50}>
          <TitleCard
            onPress={async () => {
              setCode("en");
              setLangChanged(true);
            }}
            title={<FrontEndTypo.H3 color="white">{t("En")}</FrontEndTypo.H3>}
          >
            <FrontEndTypo.H3>{t("ENGLISH")}</FrontEndTypo.H3>
          </TitleCard>

          <TitleCard
            onPress={() => {
              setCode("hi");
              setLangChanged(true);
            }}
            title={<FrontEndTypo.H3 color="white">{t("HIN")}</FrontEndTypo.H3>}
          >
            <FrontEndTypo.H3>{t("HINDI")}</FrontEndTypo.H3>
          </TitleCard>
        </HStack>
      </Box>
    </HStack>
  );
}
