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
    const setStatusAndColors = (newStatus, textColor, color) => {
      setNewStatus(newStatus);
      setTextColor(textColor);
      setColor(color);
    };

    const statusKey = status
      ? status.toLowerCase()
      : statusCount?.toLowerCase();

    const statusMap = {
      rejected: {
        newStatus: t("REJECTED"),
        textColor: "#fff",
        color: "textRed.400",
      },
      is_deactivated: {
        newStatus: t("DEACTIVATE"),
        textColor: "white",
        color: "textRed.100",
      },
      dropout: {
        newStatus: t("BENEFICIARY_STATUS_DROPOUT"),
        textColor: "white",
        color: "textRed.200",
      },
      is_duplicated: {
        newStatus: t("BENEFICIARY_STATUS_DUPLICATED"),
        textColor: "textMaroonColor.400",
        color: "textMaroonColor.100",
      },
      ineligible_for_pragati_camp: {
        newStatus: t("BENEFICIARY_STATUS_INELIGIBLE_FOR_PRAGATI_CAMP"),
        textColor: "textMaroonColor.400",
        color: "textMaroonColor.100",
      },
      ready_to_enroll: {
        newStatus: t("BENEFICIARY_STATUS_READY_TO_ENROLL"),
        textColor: "badgeColor.600",
        color: "badgeColor.50",
      },
      enrollment_pending: {
        newStatus: t("ENROLLMENT_PENDING"),
        textColor: "textMaroonColor.500",
        color: "textMaroonColor.50",
      },
      pragati_syc: {
        newStatus: t("BENEFICIARY_STATUS_PRAGATI_SYC"),
        textColor: "textMaroonColor.500",
        color: "textMaroonColor.50",
      },

      pragati_syc_reattempt: {
        newStatus: t("BENEFICIARY_STATUS_PRAGATI_SYC_REATTEMPT"),
        textColor: "black",
        color: "warning.400",
      },
      sso_id_enrolled: {
        newStatus: t("SSO_ID_ENROLLED"),
        textColor: "black",
        color: "textBlue.100",
      },
      sso_id_verified: {
        newStatus: t("ENROLLMENT_SSO_ID_VERIFIED"),
        textColor: "#fff",
        color: "textBlue.200",
      },
      enrolled: {
        newStatus: t("ENROLLED"),
        textColor: "#fff",
        color: "textGreen.100",
      },
      activate: {
        newStatus: t("BENEFICIARY_STATUS_ACTIVATE"),
        textColor: "textGreen.700",
        color: "textGreen.300",
      },
      registered_in_neev_camp: {
        newStatus: t("BENEFICIARY_STATUS_REGISTERED_IN_NEEV_CAMP"),
        textColor: "textGreen.900",
        color: "textGreen.300",
      },
      registered_in_camp: {
        newStatus: t("BENEFICIARY_STATUS_REGISTERED_IN_CAMP"),
        textColor: "textGreen.900",
        color: "textGreen.300",
      },
      approved_ip: {
        newStatus: t("BENEFICIARY_STATUS_APPROVED_IP"),
        textColor: "textGreen.400",
        color: "textGreen.50",
      },
      enrolled_ip_verified: {
        newStatus: t("BENEFICIARY_STATUS_APPROVED_IP"),
        textColor: "textGreen.400",
        color: "textGreen.50",
      },
      enrollment_awaited: {
        newStatus: t("BENEFICIARY_STATUS_ENROLLMENT_AWAITED"),
        textColor: "textMaroonColor.400",
        color: "textBlue.100",
      },
      enrollment_rejected: {
        newStatus: t("BENEFICIARY_STATUS_ENROLLMENT_REJECTED"),
        textColor: "#fff",
        color: "textRed.400",
      },
      "10th_passed": {
        newStatus: t("BENEFICIARY_STATUS_10TH_PASSED"),
        textColor: "#fff",
        color: "textGreen.600",
      },
      identified_ready_to_enroll: {
        newStatus: t("IDENTIFIED_READY_TO_ENROLL"),
        textColor: "textGreyColor.800",
        color: "identifiedColor",
      },
      deactivated: {
        newStatus: t("BENEFICIARY_STATUS_DEACTIVATED"),
        textColor: "textGreyColor.800",
        color: "textMaroonColor.100",
      },
      default: {
        newStatus: t("IDENTIFIED"),
        textColor: "textGreyColor.800",
        color: "identifiedColor",
      },
    };

    // Apply the corresponding settings from the map or use default
    const { newStatus, textColor, color } =
      statusMap[statusKey] || statusMap["default"];
    setStatusAndColors(newStatus, textColor, color);
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
