import { VStack, Image, HStack, Box } from "native-base";
import React from "react";
import { FrontEndTypo } from "@shiksha/common-lib";
import Plug from "../../../assets/Images/Offline/Plug.png";
import NoConnection from "../../../assets/Images/Offline/NoConnection.jpg";

export default function NoInternetScreen({ t }) {
  return (
    <>
      <HStack>
        <Box>
          <Image
            source={{
              uri: Plug,
            }}
            alt="Plug"
            size={"xl"}
            resizeMode="contain"
          ></Image>
        </Box>
        <Box>
          <Image
            source={{
              uri: NoConnection,
            }}
            alt=""
            size={"xl"}
            resizeMode="contain"
          ></Image>
        </Box>
      </HStack>
      <FrontEndTypo.H1>{t("OFFLINE_STATUS")}</FrontEndTypo.H1>
    </>
  );
}
