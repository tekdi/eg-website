// Lib
import * as React from "react";
import { useState, useEffect } from "react";
import { calendar, overrideColorTheme } from "@shiksha/common-lib";
import moment from "moment";

// Helper Components
import { Display } from "./Display";
import { Children } from "./Children";

const colors = overrideColorTheme({});

export const TimeBar = (props) => {
  // Type decides if array or not
  // etc
  const [date, setDate] = useState();
  useEffect(() => {
    if (props.type === "days") setDate(moment().add(props.page, "days"));
    else setDate(calendar(props.page, props.type));
    if (props.setActiveColor) {
      props.setActiveColor(props.page === 0 ? colors.primary : color.gray);
    }
  }, [props.page, props.setActiveColor]);

  return (
    <Display {...props}>
      <Children type={props.type} date={date} page={props.page} />
    </Display>
  );
};
