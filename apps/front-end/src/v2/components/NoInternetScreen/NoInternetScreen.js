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
import React from "react";
import { FrontEndTypo } from "@shiksha/common-lib";
import Plug from "../../assets/Png/Offline/Plug.png";
import NoConnection from "../../assets/Png/Offline/NoConnection.png";
import getWindowSize from "v2/utils/Helper/JSHelper";

export default function NoInternetScreen({ t }) {
  const [width, height] = getWindowSize();
  return (
    <Center
      _text={{
        color: "white",
        fontWeight: "bold",
      }}
      margin={"auto"}
      height={height}
      width={width}
    >
      <VStack space={2} alignItems={"center"}>
        <VStack space={2} alignItems="center">
          <Image
            source={{
              uri: Plug,
            }}
            alt=""
            size={"xl"}
            resizeMode="contain"
          ></Image>
          <Image
            source={{
              uri: NoConnection,
            }}
            alt=""
            size={"2xl"}
            resizeMode="contain"
          ></Image>
          <FrontEndTypo.H1>{t("OFFLINE_STATUS")}</FrontEndTypo.H1>
        </VStack>
      </VStack>
    </Center>
  );
}
