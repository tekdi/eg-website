import React, { useEffect, useState } from "react";
import {
  Layout,
  FrontEndTypo,
  enumRegistryService,
  organisationService,
  IconByName,
} from "@shiksha/common-lib";
import { HStack, VStack, Radio, Stack } from "native-base";
import { useTranslation } from "react-i18next";
import DatePicker from "v2/components/Static/FormBaseInput/DatePicker";
import { useNavigate } from "react-router-dom";
import CustomAccordion from "v2/components/Static/FormBaseInput/CustomAccordion";

const ExamAttendance = ({ userTokenInfo, footerLinks }) => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState();
  const [subjects, setSubjects] = useState([]);
  const [maxDate, setMaxDate] = useState();
  const [selectedBoardId, setSelectedBoardId] = useState("");

  useEffect(async () => {
    const boardList = await enumRegistryService.ExamboardList();
    setBoardList(boardList);
    setLoading(false);
  }, []);

  const handleSelect = (optionId) => {
    setFilter({ ...filter, selectedId: optionId?.target?.value, date: "" });
  };

  const fetchData = async () => {
    if (filter?.date) {
      const subjectData = await organisationService.getSubjectOnDate({
        filter,
      });
      const subject = !Array.isArray(subjectData?.data)
        ? []
        : subjectData?.data;
      // const newData = subject?.flatMap((subject) => {
      //   return subject.events.map((event) => ({
      //     subject_name: subject.name,
      //     subject_id: subject.id,
      //     event_id: event.id,
      //     start_date: event?.start_date,
      //     end_date: event?.end_date,
      //     type: event.type.charAt(0).toUpperCase() + event.type.slice(1), // Capitalize the type
      //   }));
      // });
      // const LearnerList = await organisationService.getattendanceLearnerList(
      //   newData
      // );

      setSubjects(!Array.isArray(subject) ? [] : subject);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filter?.date]);

  return (
    <Layout
      // loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack
        bg="primary.50"
        p="5"
        minHeight={"500px"}
        space={4}
        style={{ zIndex: -1 }}
      >
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {t("MARK_LEARNER_EXAM_ATTENDANCE")}
        </FrontEndTypo.H2>
        <VStack space={4}>
          <FrontEndTypo.H3 bold color="textGreyColor.500">
            {t("SELECT_BOARD")}
          </FrontEndTypo.H3>
          <HStack space={6}>
            {boardList?.map((board) => (
              <label key={board?.board?.id}>
                <input
                  type="radio"
                  name="board"
                  value={board?.board?.id}
                  key={board?.board?.id}
                  onChange={(board) => {
                    handleSelect(board);
                    setMaxDate(board?.addedMaxDate);
                    setSelectedBoardId(board);
                  }}
                />
                {board?.board?.name}
              </label>
            ))}
          </HStack>
          {filter?.selectedId && (
            <DatePicker setFilter={setFilter} filter={filter} />
          )}
          {filter?.date != "" && (
            <CustomAccordion
              data={subjects}
              maxDate={maxDate}
              setFilter={setFilter}
              setBoardList={setBoardList}
              date={filter?.date}
              board={filter?.selectedId}
            />
          )}
        </VStack>
      </VStack>
    </Layout>
  );
};

export default ExamAttendance;
