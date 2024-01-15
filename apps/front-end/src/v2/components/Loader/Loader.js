import { Center, VStack, Image } from "native-base";
import React from "react";
import { FrontEndTypo } from "@shiksha/common-lib";
import getWindowSize from "v2/utils/Helper/JSHelper";
export default function Loader({ message = "Loading..." }) {
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
              uri: "/gif/loader.gif",
            }}
            alt="loader.gif"
            width={"210px"}
            height={"110px"}
          />
          <FrontEndTypo.H1 color="textMaroonColor.500" bold>
            {message}
          </FrontEndTypo.H1>
        </VStack>
      </VStack>
    </Center>
  );
}
