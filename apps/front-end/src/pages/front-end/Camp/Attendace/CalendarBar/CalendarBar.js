// Lib
import React from "react";
import { TimeBar } from "./TimeBar/TimeBar";

const CalendarBar = ({ view, ...props }) => {
  let CalendarBar = <></>;
  switch (view) {
    case "month":
    case "monthInDays":
      props.type = "monthInDays";
      break;
    case "week":
    case "weeks":
      props.type = "week";
      break;
    default:
      props.type = "days";
      break;
  }
  // @ts-ignore
  CalendarBar = <TimeBar {...props} />;
  return CalendarBar;
};

CalendarBar.defaultProps = {
  view: "days",
};

export default CalendarBar;
