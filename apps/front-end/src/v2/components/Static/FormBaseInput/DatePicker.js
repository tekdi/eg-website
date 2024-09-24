import React from "react";
import moment from "moment";
import PropTypes from "prop-types";

const DatePicker = ({ filter, setFilter }) => {
  const handleDateChange = (value) => {
    setFilter({ ...filter, date: value });
  };

  return (
    <input
      type="date"
      style={{
        borderWidth: "1px",
        borderColor: "textGreyColor.50",
        backgroundColor: "#f0f0f0",
        padding: "5px 10px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
      }}
      value={filter?.date}
      min={moment().subtract(2, "months").format("YYYY-MM-DD")}
      max={moment().format("YYYY-MM-DD")}
      onChange={(e) => handleDateChange(e.target.value)}
    />
  );
};

export default DatePicker;


DatePicker.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
};
