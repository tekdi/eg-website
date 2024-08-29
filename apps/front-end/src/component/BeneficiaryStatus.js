import { Box, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { FrontEndTypo } from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function Chip({
  label,
  children,
  is_duplicate,
  is_deactivated,
  isActive,
  _text,
  ...props
}) {
  const { t } = useTranslation();
  return (
    <Box
      bg={isActive ? "primary.500" : "primary.100"}
      rounded={"full"}
      py="1"
      px="2"
      m="1"
      {...props}
    >
      <Text color={isActive ? "white" : "black"} {..._text}>
        {children || label}
        {is_duplicate === "yes" && is_deactivated === null && (
          <FrontEndTypo.H3>
            {`${"-"}(${t("BENEFICIARY_STATUS_DUPLICATED")})`}
          </FrontEndTypo.H3>
        )}
      </Text>
    </Box>
  );
}
Chip.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  is_duplicate: PropTypes.bool,
  is_deactivated: PropTypes.bool,
  isActive: PropTypes.bool,
  _text: PropTypes.any,
};
// ChipStatus
export function ChipStatus({
  status,
  statusCount,
  sufix,
  prefix,
  is_duplicate,
  is_deactivated,
  ...props
}) {
  const [color, setColor] = useState("identifiedColor");
  const [textColor, setTextColor] = useState("black");
  const [newStatus, setNewStatus] = useState(status);
  const { t } = useTranslation();

  useEffect(() => {
    // Define a function to set status and colors to avoid repetition
    function setStatusAndColors(newStatus, textColor, color) {
      setNewStatus(newStatus);
      setTextColor(textColor);
      setColor(color);
    }

    const statusKey = status
      ? status.toLowerCase()
      : statusCount?.toLowerCase();

    switch (statusKey) {
      case "rejected":
        setStatusAndColors(t("REJECTED"), "#fff", "textRed.400");
        break;
      case "is_deactivated":
        setStatusAndColors(t("DEACTIVATE"), "white", "textRed.100");
        break;
      case "dropout":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_DROPOUT"),
          "white",
          "textRed.200",
        );
        break;
      case "is_duplicated":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_DUPLICATED"),
          "textMaroonColor.400",
          "textMaroonColor.100",
        );
        break;
      case "ineligible_for_pragati_camp":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_INELIGIBLE_FOR_PRAGATI_CAMP"),
          "textMaroonColor.400",
          "textMaroonColor.100",
        );
        break;
      case "ready_to_enroll":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_READY_TO_ENROLL"),
          "badgeColor.600",
          "badgeColor.50",
        );
        break;
      case "enrollment_pending":
        setStatusAndColors(
          t("ENROLLMENT_PENDING"),
          "textMaroonColor.500",
          "textMaroonColor.50",
        );
        break;
      case "pragati_syc":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_PRAGATI_SYC"),
          "textMaroonColor.500",
          "textMaroonColor.50",
        );
        break;
      case "sso_id_enrolled":
        setStatusAndColors(t("SSO_ID_ENROLLED"), "black", "textBlue.100");
        break;
      case "sso_id_verified":
        setStatusAndColors(
          t("ENROLLMENT_SSO_ID_VERIFIED"),
          "#fff",
          "textBlue.200",
        );
        break;
      case "enrolled":
        setStatusAndColors(t("ENROLLED"), "#fff", "textGreen.100");
        break;
      case "activate":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_ACTIVATE"),
          "textGreen.700",
          "textGreen.300",
        );
        break;
      case "registered_in_neev_camp":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_REGISTERED_IN_NEEV_CAMP"),
          "textGreen.900",
          "textGreen.300",
        );
        break;
      case "registered_in_camp":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_REGISTERED_IN_CAMP"),
          "textGreen.900",
          "textGreen.300",
        );
        break;
      case "approved_ip":
      case "enrolled_ip_verified":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_APPROVED_IP"),
          "textGreen.400",
          "textGreen.50",
        );
        break;
      case "enrollment_awaited":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_ENROLLMENT_AWAITED"),
          "textMaroonColor.400",
          "textBlue.100",
        );
        break;
      case "enrollment_rejected":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_ENROLLMENT_REJECTED"),
          "#fff",
          "textRed.400",
        );
        break;
      case "10th_passed":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_10TH_PASSED"),
          "#fff",
          "textGreen.600",
        );
        break;
      case "identified_ready_to_enroll":
        setStatusAndColors(
          t("IDENTIFIED_READY_TO_ENROLL"),
          "textGreyColor.800",
          "identifiedColor",
        );
        break;
      case "deactivated":
        setStatusAndColors(
          t("BENEFICIARY_STATUS_DEACTIVATED"),
          "textGreyColor.800",
          "textMaroonColor.100",
        );
        break;
      default:
        setStatusAndColors(
          t("IDENTIFIED"),
          "textGreyColor.800",
          "identifiedColor",
        );
    }
  }, [status]);

  return (
    <Chip
      px="4"
      bg={color}
      is_duplicate={is_duplicate}
      is_deactivated={is_deactivated}
      _text={{ color: textColor, textTransform: "capitalize" }}
      rounded="sm"
      {...props}
    >
      <>
        <>{prefix}</>
        {status ? newStatus : ""}
        <>{sufix}</>
      </>
    </Chip>
  );
}
ChipStatus.propTypes = {
  status: PropTypes.string,
  statusCount: PropTypes.any,
  sufix: PropTypes.any,
  prefix: PropTypes.any,
  is_duplicate: PropTypes.bool,
  is_deactivated: PropTypes.bool,
};
