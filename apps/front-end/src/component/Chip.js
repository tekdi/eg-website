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
  const newStatus = status ? status : "lead";

  React.useEffect(() => {
    switch (newStatus.toLowerCase()) {
      case "lead":
      case "applied":
        setColor("info.300");
        break;
      case "selected":
      case "screened":
      case "approve":
        setColor("green.300");
        break;
      case "shortlisted":
        setColor("amber.300");
        break;
      case "reject":
      case "rejected":
        setColor("danger.300");
        break;
      case "review later":
      case "review_later":
      case "marked_review":
        setColor("warning.300");
        break;
      default:
        setColor("gray.300");
    }
  }, [newStatus]);

  return (
    <Chip
      px="4"
      bg={color}
      label={newStatus}
      _text={{ textTransform: "capitalize" }}
      {...props}
    />
  );
}
