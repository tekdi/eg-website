import React from "react";
import { Pressable, Tooltip } from "native-base";
import PropTypes from "prop-types";

export default function Clipboard({
  label,
  text,
  children,
  onPress,
  ...props
}) {
  const [messageText, setMessageText] = React.useState(
    label || `Copy to Clipboard`,
  );
  return (
    <Tooltip closeOnClick={0} label={messageText}>
      <Pressable
        onPress={() => {
          navigator.clipboard.writeText(text);
          setMessageText(`Copied: ${text}`);
          setTimeout((e) => {
            setMessageText(`Copy to Clipboard`);
          }, 2000);
          if (onPress) onPress();
        }}
        {...props}
      >
        {children}
      </Pressable>
    </Tooltip>
  );
}

Clipboard.propTypes = {
  label: PropTypes.string,
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
  onPress: PropTypes.func,
};
