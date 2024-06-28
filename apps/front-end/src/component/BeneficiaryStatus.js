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
    switch (status ? status?.toLowerCase() : statusCount?.toLowerCase()) {
      case "rejected":
        setNewStatus(t("REJECTED"));
        setTextColor("#fff");
        setColor("textRed.400");
        break;
      case "is_deactivated":
        setNewStatus(t("DEACTIVATE"));
        setTextColor("white");
        setColor("textRed.100");
        break;
      case "dropout":
        setNewStatus(t("BENEFICIARY_STATUS_DROPOUT"));
        setTextColor("white");
        setColor("textRed.200");
        break;
      case "is_duplicated":
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
        setTextColor("#fff");
        setColor("textGreen.100");
        break;
      case "activate":
        setNewStatus(t("BENEFICIARY_STATUS_ACTIVATE"));
        setTextColor("textGreen.700");
        setColor("textGreen.300");
        break;
      case "registered_in_camp":
        setNewStatus(t("BENEFICIARY_STATUS_REGISTERED_IN_CAMP"));
        setTextColor("textGreen.900");
        setColor("textGreen.300");
        break;
      case "approved_ip":
        setNewStatus(t("BENEFICIARY_STATUS_APPROVED_IP"));
        setTextColor("textGreen.700");
        setColor("textGreen.200");
        break;
      case "ineligible_for_pragati_camp":
        setNewStatus(t("BENEFICIARY_STATUS_INELIGIBLE_FOR_PRAGATI_CAMP"));
        setTextColor("textMaroonColor.400");
        setColor("textMaroonColor.100");
        break;
      // case "not_enrolled":
      //   setNewStatus(t("BENEFICIARY_STATUS_NOT_ENROLLED"));
      //   setTextColor("textMaroonColor.400");
      //   setColor("textMaroonColor.100");
      //   break;
      case "enrollment_awaited":
        setNewStatus(t("BENEFICIARY_STATUS_ENROLLMENT_AWAITED"));
        setTextColor("textMaroonColor.400");
        setColor("textBlue.100");
        break;
      case "enrollment_rejected":
        setNewStatus(t("BENEFICIARY_STATUS_ENROLLMENT_REJECTED"));
        setTextColor("#fff");
        setColor("textRed.400");
        break;
      case "enrolled_ip_verified":
        setNewStatus(t("BENEFICIARY_STATUS_APPROVED_IP"));
        setTextColor("textGreen.400");
        setColor("textGreen.50");
        break;
      case "10th_passed":
        setNewStatus(t("BENEFICIARY_STATUS_10TH_PASSED"));
        setTextColor("#fff");
        setColor("textGreen.600");
        break;
      case "identified_ready_to_enroll":
        setNewStatus(t("IDENTIFIED_READY_TO_ENROLL"));
        setTextColor("textGreyColor.800");
        setColor("identifiedColor");
        break;
      case "deactivated":
        setNewStatus(t("BENEFICIARY_STATUS_DEACTIVATED"));
        setTextColor("textGreyColor.800");
        setColor("textMaroonColor.100");
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
