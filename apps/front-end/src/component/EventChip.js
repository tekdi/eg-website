import { Box } from "native-base";
import React from "react";
import { t } from "@shiksha/common-lib";

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

// ChipStatus
export function EventChip({ status, ...props }) {
  const [color, setColor] = React.useState("gray.300");
  const [newStatus, setNewStatus] = React.useState(status);

  React.useEffect(() => {
    switch (status && status?.toLowerCase()) {
     
      case "orientation":
        setNewStatus(t("ORIENTATION"));
        setColor("progressBarColor.300");
        break;
      case "camp":
        setNewStatus(t("CAMP"));
        setColor("textMaroonColor.100");
        break;
      case "training":
        setNewStatus(t("TRAINING"));
        setColor("badgeColor.450");
        break;
    }
  }, [status]);

  return (
    <Chip
      px="4"
      bg={color}
      label={newStatus}
      _text={{ textTransform: "capitalize" }}
      rounded="sm"
      {...props}
    />
  );
}
