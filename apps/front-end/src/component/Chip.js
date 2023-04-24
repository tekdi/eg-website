import { Box } from "native-base";
import React from "react";

export default function Chip({ label, children, isActive, ...props }) {
  return (
    <Box
      bg={isActive ? "primary.500" : "primary.100"}
      _text={{
        color: isActive ? "white" : "black",
      }}
      rounded={"full"}
      py="1"
      px="2"
      m="1"
      {...props}
    >
      {children ? children : label}
    </Box>
  );
}

export function ChipStatus({ status, ...props }) {
  const [color, setColor] = React.useState("gray");

  React.useEffect(() => {
    switch (status.toLowerCase()) {
      case "lead":
        setColor("info.300");
        break;
      case "selected":
        setColor("green.300");
        break;
      case "shortlisted":
        setColor("amber.300");
        break;
      case "reject":
        setColor("danger.300");
        break;
      case "review later":
      case "review_later":
        setColor("warning.300");
        break;
      default:
        setColor("gray.300");
    }
  }, []);

  return <Chip px="4" bg={color} label={status} {...props} />;
}
