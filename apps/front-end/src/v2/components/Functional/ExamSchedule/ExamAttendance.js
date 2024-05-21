import React, { useEffect, useState } from "react";
import {
  Layout,
  FrontEndTypo,
  enumRegistryService,
  organisationService,
} from "@shiksha/common-lib";
import { HStack, VStack, Radio } from "native-base";
import { useTranslation } from "react-i18next";
import DatePicker from "v2/components/Static/FormBaseInput/DatePicker";
import CustomAccordion from "v2/components/Static/FormBaseInput/CustomAccordion";
import { setIndexedDBItem } from "v2/utils/Helper/JSHelper";

const ExamAttendance = ({ userTokenInfo, footerLinks }) => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState();
  const [subjects, setSubjects] = useState([]);

  useEffect(async () => {
    const boardList = await enumRegistryService.boardList();
    setBoardList(boardList);
    setLoading(false);
  }, []);

  const handleSelect = (optionId) => {
    setFilter({ ...filter, selectedId: optionId, date: "" });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (filter?.date) {
        const subjectData = await organisationService.getSubjectOnDate({
          filter,
        });
        const subject = !Array.isArray(subjectData?.data)
          ? []
          : subjectData?.data;
        const newData = subject?.flatMap((subject) => {
          return subject.events.map((event) => ({
            subject_name: subject.name,
            subject_id: subject.id,
            event_id: event.id,
            type: event.type.charAt(0).toUpperCase() + event.type.slice(1), // Capitalize the type
          }));
        });
        const LearnerList = await organisationService.getattendanceLearnerList(
          newData
        );

        setSubjects(!Array.isArray(LearnerList?.data) ? [] : LearnerList?.data);
      }
    };

    fetchData();
  }, [filter?.date]);

  return (
    <Layout loading={loading} _footer={{ menues: footerLinks }}>
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
            {boardList?.boards?.map((board) => (
              <Radio.Group
                key={board.id}
                onChange={(nextValue) => handleSelect(nextValue)}
                value={filter?.selectedId}
              >
                <Radio colorScheme="red" value={board.id}>
                  {board.name}
                </Radio>
              </Radio.Group>
            ))}
          </HStack>
          {filter?.selectedId && (
            <DatePicker setFilter={setFilter} filter={filter} />
          )}
          {filter?.date != "" && (
            <CustomAccordion
              data={subjects}
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
