import Chip from "component/Chip";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// ChipStatus
export function ChipStatus({ width, status, ...props }) {
  const [color, setColor] = useState("appliedColor");
  const [newStatus, setNewStatus] = useState(status);
  const { t } = useTranslation();

  useEffect(() => {
    switch (status && status?.toLowerCase()) {
      case "approved":
        setColor("potentialColor");
        setNewStatus(t("APPROVED"));
        break;
      default:
        setNewStatus(t("applied"));
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
