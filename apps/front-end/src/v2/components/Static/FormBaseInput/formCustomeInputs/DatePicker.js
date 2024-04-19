import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stack } from "native-base";
import moment from "moment";

function DatePicker({ subjectArr, examType, setSelectedDate, status }) {
  const [selectedDates, setSelectedDates] = useState({});

  const handleDateChange = (subject, id, date) => {
    const subjectExists =
      Array.isArray(selectedDates) &&
      selectedDates.some(
        (existingSubject) => existingSubject.subject_id === id
      );

    if (subjectExists) {
      setSelectedDates((prevState) => ({
        ...prevState,
        ...(Array.isArray(prevState)
          ? prevState.map((existingSubject) =>
              existingSubject.subject_id === id
                ? {
                    ...existingSubject,
                    exam_date: date,
                    type: examType,
                    status,
                  }
                : existingSubject
            )
          : []),
      }));

      setSelectedDate((prevState) => ({
        ...prevState,
        ...(Array.isArray(prevState)
          ? prevState.map((existingSubject) =>
              existingSubject.subject_id === id
                ? {
                    ...existingSubject,
                    exam_date: date,
                    type: examType,
                    status,
                  }
                : existingSubject
            )
          : []),
      }));
    } else {
      setSelectedDates((prevState) => [
        ...(Array.isArray(prevState) ? prevState : []),
        { subject_id: id, exam_date: date, type: examType },
      ]);

      setSelectedDate((prevState) => [
        ...(Array.isArray(prevState) ? prevState : []),
        { subject_id: id, exam_date: date, type: examType, status },
      ]);
    }
  };

  return (
    <Stack>
      {subjectArr?.map((subject) => (
        <div
          key={subject}
          style={{
            marginBottom: "10px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <label style={{ marginRight: "10" }}>{subject?.name}</label>
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
            value={selectedDates?.subject_details?.find(
              (subject) => subject?.subject_name === subject
            )}
            min={moment().format("YYYY-MM-DD")}
            onChange={(e) =>
              handleDateChange(subject, subject?.id, e.target.value)
            }
          />
        </div>
      ))}
    </Stack>
  );
}

DatePicker.propTypes = {
  subjectArr: PropTypes.array,
  examType: PropTypes.string,
  setSelectedDate: PropTypes.func,
};
export default DatePicker;
