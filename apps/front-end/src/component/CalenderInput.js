import { jsonParse } from "@shiksha/common-lib";
import moment from "moment";
import { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

const formate = (value) => {
  const data = JSON.parse(value || "{}");
  return {
    ...data,
    startDate: data.startDate
      ? moment(data.startDate).toDate()
      : moment().toDate(),
    endDate: data.endDate ? moment(data.endDate).toDate() : moment().toDate(),
  };
};

function CalenderInput({ schema, value, onChange }) {
  const { minDate, maxDate, daysDiff } = schema;
  const [selectedDate, setSelectedDate] = useState();
  const handleSelect1 = ({ selection }) => {
    const data = JSON.stringify(selection || "{}");
    onChange(data);
    setSelectedDate(selection);
  };
  const startDate = moment(jsonParse(value)?.startDate || moment().toDate());
  // const maxDateData =
  //   maxDate || daysDiff ? startDate.add(daysDiff, "days") : null;

  return (
    <DateRange
      minDate={minDate}
      // maxDate={selectedDate?.startDate && maxDateData.toDate()}
      ranges={[
        {
          startDate: moment().toDate(),
          endDate: moment().toDate(),
          key: "selection",
          color: "red",
          ...formate(value),
        },
      ]}
      onChange={handleSelect1}
    />
  );
}

export default CalenderInput;
