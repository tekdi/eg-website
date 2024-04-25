import moment from "moment";
import React, { useEffect, useState } from "react";

const DatePicker = ({ filter, setFilter }) => {
  const [minDate, setMinDate] = useState();

  useEffect(() => {
    const date = moment().subtract(1, "months").format("YYYY-MM-DD");
    setMinDate(date);
  }, []);

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
      min={minDate}
      onChange={(e) => handleDateChange(e.target.value)}
    />
  );
};

export default DatePicker;
