import React, { useState } from "react";

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
        marginBottom: "7px",
        padding: "5px",
        position: "relative",
        zIndex: "2",
        background: "transparent",
        width: "100%",
        marginBottom: "30px",
      }}
      type="time"
      onChange={handleTimeChange}
      value={value}
    />
  );
}
