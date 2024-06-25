import React from "react";
import PropTypes from "prop-types";

export default function Time({ value, onChange }) {
  const handleTimeChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <input
      style={{
        border: "1px solid #bfc9e2",
        borderRadius: "5px",
        height: "28px",
        padding: "5px",
        position: "relative",
        zIndex: "2",
        background: "transparent",
        width: "100%",
      }}
      type="time"
      onChange={handleTimeChange}
      value={value}
    />
  );
}

Time.PropTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};
