import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ScrollView, Stack } from "native-base";
import moment from "moment";
function DatePicker({
  subjectArr,
  examType,
  setSelectedDate,
  status,
  oldSelectedData,
  isVisibleEdit,
  eventOverallData,
}) {
  const [selectedDates, setSelectedDates] = useState({});
  const [disableDates, setDisableDates] = useState();
  const [isEditableDates, setIsEditableDates] = useState();

  useEffect(() => {
    if (Array.isArray(oldSelectedData)) {
      const updatedSelectedDates = {};
      const isEditable = {};
      oldSelectedData.forEach((subject) => {
        subject.events.forEach((event) => {
          if (event.type === examType) {
            updatedSelectedDates[subject.id] = event.start_date;
          }
        });
      });
      eventOverallData.forEach((subject) => {
        isEditable[subject.subject_id] = subject.is_editable;
      });
      setIsEditableDates(isEditable);
      setSelectedDates(updatedSelectedDates);
      setDisableDates(updatedSelectedDates);
    }
  }, [oldSelectedData, eventOverallData, examType]);

  const handleDateChange = (subject, id, date) => {
    const subjectExists =
      Array.isArray(selectedDates) &&
      selectedDates.some(
        (existingSubject) => existingSubject.subject_id === id
      );

    if (subjectExists) {
      setSelectedDates((prevState) => ({
        ...prevState,
        [id]: date,
      }));

      setSelectedDate((prevState) => [
        ...(Array.isArray(prevState) ? prevState : []),
        { subject_id: id, exam_date: date, type: examType, status },
      ]);
    } else {
      setSelectedDates((prevState) => ({
        ...prevState,
        [id]: date,
      }));

      setSelectedDate((prevState) => [
        ...(Array.isArray(prevState) ? prevState : []),
        { subject_id: id, exam_date: date, type: examType, status },
      ]);
    }
  };

  return (
    <Stack>
      {subjectArr?.map((subject) => {
        let minDate;
        if (!isEditableDates?.[subject?.id]) {
          minDate =
            ((disableDates || isVisibleEdit) &&
              moment().subtract(2, "months").format("YYYY-MM-DD")) ||
            moment().format("YYYY-MM-DD");
        } else {
          minDate =
            selectedDates[subject?.id] ||
            moment().subtract(2, "months").format("YYYY-MM-DD");
        }
        return (
          <ScrollView key={subject.id}>
            <div
              style={{
                marginBottom: "10px",
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <label style={{ marginRight: "10px" }}>{subject.name}</label>
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
                value={selectedDates[subject?.id] || ""}
                min={minDate}
                disabled={
                  disableDates?.[subject?.id] &&
                  !(isVisibleEdit && isEditableDates[subject?.id])
                }
                onChange={(e) =>
                  handleDateChange(subject, subject?.id, e.target.value)
                }
              />
            </div>
          </ScrollView>
        );
      })}
    </Stack>
  );
}
DatePicker.propTypes = {
  subjectArr: PropTypes.array,
  examType: PropTypes.string,
  setSelectedDate: PropTypes.func,
  status: PropTypes.string,
  oldSelectedData: PropTypes.array,
};
export default DatePicker;
