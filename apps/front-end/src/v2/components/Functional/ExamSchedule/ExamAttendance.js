import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  Layout,
  FrontEndTypo,
  enumRegistryService,
  organisationService,
  IconByName,
  CardComponent,
} from "@shiksha/common-lib";
import { HStack, VStack, Radio, Stack, Pressable, Box } from "native-base";
import { useTranslation } from "react-i18next";
import DatePicker from "v2/components/Static/FormBaseInput/DatePicker";
import { useNavigate } from "react-router-dom";
import CustomAccordion from "v2/components/Static/FormBaseInput/CustomAccordion";
import MarkLearnerAttendance from "./MarkLearnerAttendance";

const ExamAttendance = ({
  userTokenInfo: { authUser },
  footerLinks,
  learners,
}) => {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState();
  const [subjects, setSubjects] = useState([]);
  const [maxDate, setMaxDate] = useState();
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const [learnersListData, setLearnersListData] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);

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
      const newData = subject?.flatMap((subject) => {
        return {
          subject_name: subject.name,
          subject_id: subject.id,
          event_id: subject.events?.[0]?.id,
          start_date: subject.events?.[0]?.start_date,
          end_date: subject.events?.[0]?.end_date,
          type:
            subject.events?.[0]?.type.charAt(0).toUpperCase() +
            subject.events?.[0]?.type.slice(1), // Capitalize the type
        };
      });
      const learnersList = await organisationService.getattendanceLearnerList(
        newData
      );
      setNoDataFound(
        learnersList.data.find((learner) => learner.data.length > 0)
          ? false
          : true
      );
      setLearnersListData(learnersList?.data);
      console.log("learnersList", learnersList?.data[0]?.data);
      setSubjects(!Array.isArray(subject) ? [] : subject);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filter?.date]);

  const onPressBackButton = () => {
    navigate("/examschedule");
  };

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      // loading={loading}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
      _footer={{ menues: footerLinks }}
    >
      <VStack
        // bg="primary.50"
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
          {filter?.date != "" && filter?.selectedId && subjects?.length > 0 && (
            <Stack space={2}>
              <FrontEndTypo.H2 color="textGreyColor.750">
                {t("SUBJECTS")}
              </FrontEndTypo.H2>

              {/* <CustomAccordion
                data={subjects}
                setFilter={setFilter}
                setBoardList={setBoardList}
                date={filter?.date}
                board={filter?.selectedId}
              /> */}

              <VStack space={4}>
                {subjects?.map((subject, index) => (
                  <Box key={subject?.id}>
                    {learnersListData?.map((learner, index) => (
                      <Box key={subject?.id}>
                        {subject.id === learner.subject_id &&
                          learner?.data.length > 0 && (
                            <VStack key={subject.id}>
                              <Pressable
                                p={2}
                                bg="boxBackgroundColour.100"
                                // shadow="AlertShadow"
                                borderBottomColor={"garyTitleCardBorder"}
                                borderBottomStyle={"solid"}
                                borderBottomWidth={"2px"}
                                onPress={() => {
                                  navigate(`/learner/examattendance`, {
                                    state: { subject, filter, boardList },
                                  });
                                }}
                              >
                                <HStack
                                  w={"100%"}
                                  justifyContent={"space-between"}
                                >
                                  <HStack space={2} alignItems={"center"}>
                                    <FrontEndTypo.H2 color={"blueText.700"}>
                                      {subject?.name}
                                      {subject?.events?.[0]?.type ==
                                        "Practical" && ` - ${t("PRACTICALS")}`}
                                    </FrontEndTypo.H2>
                                  </HStack>
                                  {
                                    <IconByName
                                      isDisabled
                                      name="ArrowRightSLineIcon"
                                      _icon={{ size: "30px" }}
                                      color="blueText.700"
                                    />
                                  }
                                </HStack>
                              </Pressable>
                            </VStack>
                          )}
                      </Box>
                    ))}
                  </Box>
                ))}
              </VStack>
            </Stack>
          )}

          {noDataFound && (
            <>
              <FrontEndTypo.H2>{t("EXAM_WARNING")}</FrontEndTypo.H2>
            </>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
};

export default ExamAttendance;
