import { Box, VStack } from "native-base";
import React from "react";
import Clipboard from "./Clipboard";

export default function Test() {
  const [text, setText] = React.useState("");
  return (
    <VStack space="5" p="40">
      <input value={text ?? ""} onChange={(e) => setText(e.target.value)} />
      <Clipboard
        p="5"
        bg="red.100"
        label={text}
        text={`"${text.toUpperCase().replaceAll(" ", "_")}": "${text}"`}
      >
        <div>{`"${text.toUpperCase().replaceAll(" ", "_")}": "${text}"`}</div>
      </Clipboard>
    </VStack>
  );
}
