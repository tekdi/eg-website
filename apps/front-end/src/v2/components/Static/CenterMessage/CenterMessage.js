import { Center, VStack, Image } from "native-base";
import React from "react";
import { FrontEndTypo } from "@shiksha/common-lib";
import getWindowSize from "v2/utils/Helper/JSHelper";
export default function CenterMessage({ message = "Loading..." }) {
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
          <center>
            <FrontEndTypo.H1 bold>{message}</FrontEndTypo.H1>
          </center>
        </VStack>
      </VStack>
    </Center>
  );
}
