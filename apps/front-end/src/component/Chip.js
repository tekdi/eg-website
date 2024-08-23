import { Box } from "native-base";
import React, { useEffect, useState } from "react";
import { t } from "@shiksha/common-lib";
import PropTypes from "prop-types";

export default function Chip({ label, children, isActive, ...props }) {
  return (
    <Box
      bg={isActive ? "textMaroonColor.500" : "primary.100"}
      _text={{
        color: isActive ? "white" : "black",
      }}
      rounded={"full"}
      py="1"
      px="2"
      m="1"
      {...props}
    >
      {children || label}
    </Box>
  );
}
Chip.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  isActive: PropTypes.bool,
};
// ChipStatus
export function ChipStatus({ width, status, ...props }) {
  const [color, setColor] = useState("appliedColor");
  const [newStatus, setNewStatus] = useState(status);

  useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case "application_screened":
      case "screened":
        setColor("screenedColor");
        setNewStatus(t("SCREENED"));
        break;
      case "rejected":
        setNewStatus(t("REJECTED"));
        setColor("rejectedColor");
        break;
      case "shortlisted_for_orientation":
        setNewStatus(t("SHORTLISTED_FOR_ORIENTATION"));
        setColor("shortlistedColor");
        break;
      case "pragati_mobilizer":
        setNewStatus(t("PRAGATI_MOBILIZER"));
        setColor("potentialColor");
        break;
      case "selected_for_training":
        setNewStatus(t("SELECTED_FOR_TRAINING"));
        setColor("selectedColor");
        break;
      case "selected_for_onboarding":
        setNewStatus(t("SELECTED_FOR_ONBOARDING"));
        setColor("selectedColor");
        break;
      case "selected_prerak":
        setNewStatus(t("SELECTED_PRERAK"));
        setColor("selectedColor");
        break;
      case "quit":
        setNewStatus(t("QUIT"));
        setColor("rejectedColor");
        break;
      case "rusticate":
        setNewStatus(t("RUSTICATE"));
        setColor("rejectedColor");
        break;
      case "on_hold":
        setNewStatus(t("FACILITATOR_STATUS_ON_HOLD"));
        setColor("rejectedColor");
        break;
      case "registered":
        setNewStatus(t("GROUPS_STATUS_REGISTERED"));
        setColor("selectedColor");
        break;
      case "not_registered":
        setNewStatus(t("GROUPS_STATUS_NOT_REGISTERED"));
        setColor("rejectedColor");
        break;
      default:
        setNewStatus(t("APPLIED"));
        setColor("appliedColor");
    }
  }, [status]);

  return (
    <Chip
      px="4"
      py="2"
      width={width || "100px"}
      bg={color}
      label={newStatus}
      _text={{
        textTransform: "capitalize",
        fontSize: "10px",
        fontWeight: "500",
        textAlign: "center",
      }}
      rounded="sm"
      {...props}
    />
  );
}
ChipStatus.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.string,
};

// ChipStatus
export function CampChipStatus({ status, ...props }) {
  const [color, setColor] = useState("appliedColor");
  const [newStatus, setNewStatus] = useState(status);

  useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case "rejected":
        setNewStatus(t("REJECTED"));
        setColor("rejectedColor");
        break;
      case "registered":
        setNewStatus(t("GROUPS_STATUS_REGISTERED"));
        setColor("warningColor");
        break;
      case "not_registered":
        setNewStatus(t("GROUPS_STATUS_NOT_REGISTERED"));
        setColor("rejectedColor");
        break;
      case "camp_ip_verified":
        setNewStatus(t("GROUPS_STATUS_CAMP_IP_VERIFIED"));
        setColor("selectedColor");
        break;
      case "change_required":
        setNewStatus(t("GROUPS_STATUS_CHANGE_REQUIRED"));
        setColor("green.200");
        break;
      case "inactive":
        setNewStatus(t("GROUPS_STATUS_INACTIVE"));
        setColor("green.200");
        break;
      case "camp_initiated":
        setNewStatus(t("GROUPS_STATUS_CAMP_INITIATED"));
        setColor("green.200");
        break;
      default:
        setNewStatus(t("NA"));
        setColor("appliedColor");
    }
  }, [status]);

  return (
    <Chip
      px="4"
      py="2"
      width="100px"
      bg={color}
      label={newStatus}
      _text={{
        textTransform: "capitalize",
        fontSize: "10px",
        fontWeight: "500",
        textAlign: "center",
      }}
      rounded="sm"
      {...props}
    />
  );
}
CampChipStatus.propTypes = {
  status: PropTypes.string,
};

export function ExamChipStatus({ width, status, ...props }) {
  const [color, setColor] = useState("appliedColor");
  const [newStatus, setNewStatus] = useState(status);

  useEffect(() => {
    switch (status) {
      case "P":
      case "PASS":
        setColor("screenedColor");
        setNewStatus(t("EXAM_RESULT_STATUS_P"));
        break;
      case "SYC":
        setNewStatus(t("EXAM_RESULT_STATUS_SYC"));
        setColor("rejectedColor");
        break;
      case "SYCT":
        setNewStatus(t("EXAM_RESULT_STATUS_SYCT"));
        setColor("shortlistedColor");
        break;
      case "SYCP":
        setNewStatus(t("EXAM_RESULT_STATUS_SYCP"));
        setColor("potentialColor");
        break;
      case "RWH":
        setNewStatus(t("EXAM_RESULT_STATUS_RWH"));
        setColor("selectedColor");
        break;
      case "XXXX":
        setNewStatus(t("EXAM_RESULT_STATUS_XXXX"));
        setColor("selectedColor");
        break;
      case "yet_to_upload":
        setNewStatus(t("YET_TO_BE_UPLOAD"));
        setColor("yellowColor");
        break;
      case "assign_to_ip":
        setNewStatus(t("ASSIGNED_TO_IP"));
        setColor("yellowColor");
        break;
      default:
        setNewStatus(t("ASSIGNED_TO_IP"));
        setColor("yellowColor");
    }
  }, [status]);

  return (
    <Chip
      px="2"
      py="1"
      width={width || "100px"}
      bg={color}
      label={newStatus}
      _text={{
        textTransform: "capitalize",
        fontSize: "10px",
        fontWeight: "400",
        textAlign: "center",
      }}
      rounded="sm"
      {...props}
    />
  );
}
