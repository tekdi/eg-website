import { Box } from "native-base";
import React from "react";
import { t } from "@shiksha/common-lib";

export default function PrerakChip({ label, children, isActive, ...props }) {
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
  const [color, setColor] = React.useState("gray.300");
  const [newStatus, setNewStatus] = React.useState(status);

  React.useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case "screened":
        setColor("PrerakScreenedColor");
        setNewStatus(t("SCREENED"));
        break;
      case "rejected":
        setNewStatus(t("REJECTED"));
        setColor("textMaroonColor.100");
        break;
      case "shortlisted":
        setNewStatus(t("SHORTLISTED"));
        setColor("blueText.350");
        break;
      case "potential_prerak":
        setNewStatus(t("POTENTIAL_PRERAK"));
        setColor("progressBarColor.300");
        break;
      case "selected_for_training":
        setNewStatus(t("SELECTED_FOR_TRAINING"));
        setColor("progressBarColor.300");
        break;
      case "selected_for_onboarding":
        setNewStatus(t("SELECTED_FOR_ONBOARDING"));
        setColor("progressBarColor.300");
        break;
      case "prerak":
        setNewStatus(t("PRERAK"));
        setColor("progressBarColor.300");
        break;
      case "dropped_out":
        setNewStatus(t("DROPPED_OUT"));
        setColor("textMaroonColor.100");
        break;
      case "under_review":
        setNewStatus(t("UNDER_REVIEW"));
        setColor("badgeColor.450");
        break;
      default:
        setNewStatus(t("APPLIED"));
        setColor("textGreyColor.800");
    }
  }, [status]);

  return (
    <PrerakChip
      px="4"
      bg={color}
      label={newStatus}
      _text={{ textTransform: "capitalize" }}
      rounded="sm"
      {...props}
    />
  );
}
