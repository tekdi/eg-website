import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export const TimePick = () => {
  const [value, onChange] = useState("10:00:00");
  return (
    <div>
      <TimePicker onChange={onChange} value={value} format="HH:mm:ss" />
    </div>
  );
};
