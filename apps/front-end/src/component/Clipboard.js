import { Pressable, Tooltip } from "native-base";
import React from "react";

export default function Clipboard({ label, text, children }) {
  const [messageText, setMessageText] = React.useState(
    label ? label : `Copy to Clipboard`
  );
  return (
    <Tooltip closeOnClick={0} label={messageText}>
      <Pressable
        onHover
        onPress={() => {
          navigator.clipboard.writeText(text);
          setMessageText(`Copied: ${text}`);
          setTimeout((e) => {
            setMessageText(`Copy to Clipboard`);
          }, 2000);
        }}
      >
        {children}
      </Pressable>
    </Tooltip>
  );
}
