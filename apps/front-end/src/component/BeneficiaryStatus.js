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
export function ChipStatus({ status, ...props }) {
  const [color, setColor] = React.useState("identifiedColor");
  const [textColor, setTextColor] = React.useState("textGreyColor.800");
  const [newStatus, setNewStatus] = React.useState(status);

  React.useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case "rejected":
        setNewStatus(t("REJECTED"));
        setTextColor("textMaroonColor.400");
        setColor("textMaroonColor.100");
        break;
      case "dropout":
        setNewStatus(t("BENEFICIARY_STATUS_DROPOUT"));
        setTextColor("textMaroonColor.400");
        setColor("textMaroonColor.100");
        break;
      case "duplicated":
        setNewStatus(t("BENEFICIARY_STATUS_DUPLICATED"));
        setTextColor("textMaroonColor.400");
        setColor("textMaroonColor.100");
        break;
      case "ready_to_enroll":
        setNewStatus(t("BENEFICIARY_STATUS_READY_TO_ENROLL"));
        setTextColor("badgeColor.600");
        setColor("badgeColor.50");
        break;
      case "enrollment_pending":
        setNewStatus(t("ENROLLMENT_PENDING"));
        setTextColor("textMaroonColor.500");
        setColor("textMaroonColor.50");
        break;
      case "pragati_syc":
        setNewStatus(t("BENEFICIARY_STATUS_PRAGATI_SYC"));
        setTextColor("textMaroonColor.500");
        setColor("textMaroonColor.50");
        break;
      case "enrolled":
        setNewStatus(t("ENROLLED"));
        setTextColor("textGreen.700");
        setColor("textGreen.300");
        break;
      case "activate":
        setNewStatus(t("BENEFICIARY_STATUS_ACTIVATE"));
        setTextColor("textGreen.700");
        setColor("textGreen.300");
        break;
      case "registered_in_camp":
        setNewStatus(t("BENEFICIARY_STATUS_REGISTERED_IN_CAMP"));
        setTextColor("textGreen.700");
        setColor("textGreen.300");
        break;
      case "approved_ip":
        setNewStatus(t("BENEFICIARY_STATUS_APPROVED_IP"));
        setTextColor("textGreen.700");
        setColor("textGreen.300");
        break;
      default:
        setNewStatus(t("IDENTIFIED"));
        setTextColor("textGreyColor.800");
        setColor("identifiedColor");
    }
  }, [status]);

  return (
    <Chip
      px="4"
      bg={color}
      color={textColor}
      label={newStatus}
      _text={{ textTransform: "capitalize" }}
      rounded="sm"
      {...props}
    />
  );
}
