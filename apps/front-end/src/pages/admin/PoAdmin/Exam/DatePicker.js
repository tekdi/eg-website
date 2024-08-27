import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HStack, ScrollView, Stack } from "native-base";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { AdminTypo, FrontEndTypo, IconByName } from "@shiksha/common-lib";
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
  const [isEditableDates, setIsEditableDates] = useState({});
  const [draftSubjects, setDraftSubjects] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (Array.isArray(oldSelectedData)) {
      const updatedSelectedDates = {};
      const isEditable = {};
      const draftSubjects = [];

      oldSelectedData.forEach((subject) => {
        const hasDraftEvent = subject.events.some(
          (event) => event.type === examType && event.status === "draft",
        );
        if (hasDraftEvent) {
          draftSubjects.push({ id: subject.id, type: subject.type });
        }
        subject?.events.forEach((event) => {
          if (event.type === examType) {
            updatedSelectedDates[subject.id] = event.start_date;
          }
        });
      });
      setDraftSubjects(draftSubjects);
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
        (existingSubject) => existingSubject.subject_id === id,
      );

    const updatedSelectedDates = {
      ...selectedDates,
      [id]: date,
    };

    const updatedSelectedDate = [
      ...(Array.isArray(selectedDate) ? selectedDate : []),
      { subject_id: id, exam_date: date, type: examType, status },
    ];

    if (subjectExists) {
      setSelectedDates(updatedSelectedDates);
      setSelectedDate((prevState) =>
        prevState.map((existingSubject) =>
          existingSubject.subject_id === id
            ? updatedSelectedDate[0]
            : existingSubject,
        ),
      );
    } else {
      setSelectedDates(updatedSelectedDates);
      setSelectedDate(updatedSelectedDate);
    }
  };

  return (
    <Stack space="4">
      {subjectArr?.map((subject) => {
        let minDate = moment().subtract(2, "months").format("YYYY-MM-DD");
        let maxDate = moment().add(2, "months").format("YYYY-MM-DD");

        if (!isEditableDates?.[subject?.id] || isVisibleEdit) {
          minDate = moment().subtract(2, "months").format("YYYY-MM-DD");
          maxDate = moment().add(2, "months").format("YYYY-MM-DD");
        }

        return (
          <ScrollView key={subject.id}>
            <HStack justifyContent={"space-between"} alignItems={"center"}>
              <AdminTypo.H3 flex="1">{subject.name}</AdminTypo.H3>
              <HStack justifyContent={"center"} flex={2}>
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
                  max={maxDate}
                  disabled={
                    disableDates?.[subject?.id] &&
                    !(isVisibleEdit && isEditableDates[subject?.id])
                  }
                  onChange={(e) =>
                    handleDateChange(subject, subject?.id, e.target.value)
                  }
                />
              </HStack>
              <HStack alignItems={"center"} flex={1}>
                {draftSubjects?.some(
                  (draftSubject) =>
                    draftSubject?.id === subject.id &&
                    draftSubject.type === subject.type,
                ) && (
                  <HStack alignItems={"center"}>
                    <IconByName color="#484848" name="InformationLineIcon" />
                    <FrontEndTypo.H3 color="#484848">
                      {t("SCHEDULE_BANNER")}
                    </FrontEndTypo.H3>
                  </HStack>
                )}
              </HStack>
            </HStack>
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
  isVisibleEdit: PropTypes.bool,
  eventOverallData: PropTypes.array,
};

export default DatePicker;
