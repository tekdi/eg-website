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
      case "screened":
        setColor("PrerakScreenedColor");
        setTextColor("textGreen.700");
        setNewStatus(t("SCREENED"));
        break;
      case "rejected":
        setNewStatus(t("REJECTED"));
        setTextColor("textMaroonColor.400");
        setColor("textMaroonColor.100");
        break;
      case "shortlisted":
        setNewStatus(t("SHORTLISTED"));
        setTextColor("blueText.700");
        setColor("blueText.350");
        break;
      case "selected_for_training":
        setNewStatus(t("SELECTED_FOR_TRAINING"));
        setTextColor("textGreen.700");
        setColor("progressBarColor.300");
        break;
      case "selected_for_onboarding":
        setNewStatus(t("SELECTED_FOR_ONBOARDING"));
        setTextColor("textGreen.700");
        setColor("progressBarColor.300");
        break;
      case "dropped_out":
        setNewStatus(t("DROPPED_OUT"));
        setTextColor("textMaroonColor.400");
        setColor("textMaroonColor.100");
        break;
      case "under_review":
        setNewStatus(t("UNDER_REVIEW"));
        setTextColor("badgeColor.600");
        setColor("badgeColor.450");
        break;
        case "duplicated":
          setNewStatus(t("DUPLICATED"));
          setTextColor("white");
          setColor("duplicatedColor");
          break;
        case "documents_completed":
        setNewStatus(t("DOCUMENTS_COMPLETED"));
        setTextColor("badgeColor.600");
        setColor("badgeColor.50");
        break;
        case "enrollment_pending":
        setNewStatus(t("ENROLLMENT_PENDING"));
        setTextColor("textMaroonColor.500");
        setColor("textMaroonColor.50");
        break;
        case "enrolled":
        setNewStatus(t("ENROLLED"));
        setTextColor("blueText.700");
        setColor("blueText.200");
        break;
        case "verified":
          setNewStatus(t("VERIFIED"));
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
