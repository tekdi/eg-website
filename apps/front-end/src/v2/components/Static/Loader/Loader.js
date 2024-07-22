import { VStack, Image, Spinner } from "native-base";
import React from "react";
import { FrontEndTypo } from "@shiksha/common-lib";
export default function Loader({ message = "Loading..." }) {
  return (
    <VStack space={2} alignItems={"center"}>
      <VStack space={2} alignItems="center">
        <Spinner
          accessibilityLabel="Loading posts"
          color="bgRed.500"
          style={{ width: "100px", height: "100px" }}
          size={""}
        />
        {/* <Image
          source={{
            uri: "/gif/loader.gif",
          }}
          alt="loader.gif"
          width={"210px"}
          height={"110px"}
        /> */}
        <FrontEndTypo.H1 color="textMaroonColor.500" bold>
          {message}
        </FrontEndTypo.H1>
      </VStack>
    </VStack>
  );
}
