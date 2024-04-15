import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stack } from "native-base";
import moment from "moment";

function DatePicker({ subjectArr, examType, setSelectedDate }) {
  const [selectedDates, setSelectedDates] = useState({});

  const handleDateChange = (subject_name, index, date) => {
    const subjectExists = selectedDates?.subject_details?.some(
      (subject) => subject?.subject_id === index
    );

    if (subjectExists) {
      setSelectedDates((prevState) => ({
        ...prevState,
        subject_details: prevState?.subject_details?.map((subject) =>
          subject.subject_id === index
            ? {
                ...subject,
                subject_name: subject_name,
                exam_date: date,
                exam_type: examType,
              }
            : subject
        ),
      }));

      setSelectedDate((prevState) => ({
        ...prevState,
        subject_details: prevState?.subject_details?.map((subject) =>
          subject?.subject_id === index
            ? {
                ...subject,
                subject_name: subject_name,
                exam_date: date,
                exam_type: examType,
              }
            : subject
        ),
      }));
    } else {
      setSelectedDates((prevState) => ({
        ...prevState,
        subject_details: [
          ...(prevState?.subject_details || []),
          {
            subject_name: subject_name,
            exam_date: date,
            subject_id: index,
            exam_type: examType,
          },
        ],
      }));

      setSelectedDate((prevState) => ({
        ...prevState,
        subject_details: [
          ...(prevState.subject_details || []),
          {
            subject_name: subject_name,
            subject_id: index,
            exam_date: date,
            exam_type: examType,
          },
        ],
      }));
    }
  };

  return (
    <Stack>
      {subjectArr?.map((subject, index) => (
        <div
          key={subject}
          style={{
            marginBottom: "10px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <label style={{ marginRight: "10" }}>{subject}</label>
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
            onChange={(e) => handleDateChange(subject, index, e.target.value)}
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
