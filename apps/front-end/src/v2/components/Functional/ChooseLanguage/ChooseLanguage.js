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
    <Stack>
      <Box p="5">
        <FrontEndTypo.H1 pt="24px" bold textAlign={"center"}>
          {t("CHOOSE_LANGUAGE")}
        </FrontEndTypo.H1>
        <FrontEndTypo.H3 pt="5" color="textGreyColor.700" textAlign={"center"}>
          {t("PREFERED_LANGUAGE")}
        </FrontEndTypo.H3>

        <HStack space={3} mt={50}>
          <Button
            flex={1 / 2}
            variant={"secondary"}
            borderRadius={"2px"}
            height={"87.24px"}
            _pressed={{
              bgColor:
                "linear-gradient(81.61deg, #FFFFFF -31.46%, rgba(255, 255, 255, 0) -31.44%, rgba(255, 255, 255, 0.42) -10.63%, #FFFFFF 26.75%, #FFFFFF 70.75%, rgba(255, 255, 255, 0.580654) 108.28%, rgba(255, 255, 255, 0) 127.93%)",
            }}
            onPress={async () => {
              setCode("en");
              setLangChanged(true);
            }}
          >
            {t("ENGLISH")}
          </Button>
          <Button
            flex={1 / 2}
            variant={"secondary"}
            borderRadius={"2px"}
            height={"87.24px"}
            onPress={() => {
              setCode("hi");
              setLangChanged(true);
            }}
          >
            {t("HINDI")}
          </Button>
        </HStack>
      </Box>
    </Stack>
  );
}
