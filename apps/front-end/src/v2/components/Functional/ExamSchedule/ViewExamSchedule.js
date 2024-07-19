import React, { useEffect, useState } from "react";
import {
  Layout,
  FrontEndTypo,
  enumRegistryService,
  organisationService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { HStack, VStack, Radio, Input } from "native-base";
import { useNavigate } from "react-router-dom";
import { optionId } from "@rjsf/utils";

const ViewExamSchedule = ({ footerLinks, userTokenInfo: { authUser } }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [filter, setFilter] = useState();
  const [boardList, setBoardList] = useState();
  const [practicalSubjects, setPracticalSubjects] = useState([]);
  const [theorySubjects, setTheorySubjects] = useState([]);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const onPressBackButton = () => {
    navigate("/");
  };

  useEffect(async () => {
    const boardList = await enumRegistryService.boardList();
    setBoardList(boardList);
    setLoading(false);
  }, []);

  const handleSelect = (event) => {
    setFilter({ ...filter });
    setSelectedId(event.target.value);
    getSubjectList(event.target.value);
  };

  const getSubjectList = async (id) => {
    setLoading(true);
    const subjectData = await organisationService.getSubjectList({ id });
    if (Array.isArray(subjectData?.data)) {
      const practical = [];
      const theory = [];

      subjectData?.data?.forEach((subject) => {
        // Filter events based on type (theory or practical)
        const practicalEvents = subject.events.filter(
          (event) => event.type === "practical"
        );
        const theoryEvents = subject.events.filter(
          (event) => event.type === "theory"
        );

        // Add filtered events to subjects
        const subjectWithPracticalEvents = {
          ...subject,
          events: practicalEvents,
        };
        const subjectWithTheoryEvents = { ...subject, events: theoryEvents };

        // Push subjects with events to respective arrays
        if (subject.is_practical) {
          practical.push(subjectWithPracticalEvents);
        }
        if (subject.is_theory) {
          theory.push(subjectWithTheoryEvents);
        }
      });

      setPracticalSubjects(practical);
      setTheorySubjects(theory);
    }
    setLoading(false);
  };

  function hasEventWithStatusPublish(data) {
    return data.some((subject) => {
      return subject.events.some((event) => event.status === "publish");
    });
  }

  return (
    <Layout
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      loading={loading}
      _footer={{ menues: footerLinks }}
      _appBar={{
        onPressBackButton,
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
    >
      <VStack
        //bg="primary.50"
        p="5"
        minHeight={"500px"}
        space={4}
        style={{ zIndex: -1 }}
      >
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {t("VIEW_EXAM_SCHEDULE")}
        </FrontEndTypo.H2>
        <VStack space={4}>
          <FrontEndTypo.H3 bold color="textGreyColor.500">
            {t("SELECT_BOARD")}
          </FrontEndTypo.H3>
          <HStack space={6}>
            {boardList?.boards?.map((board) => (
              <label key={board.id}>
                <input
                  colorScheme="red"
                  type="radio"
                  value={board.id}
                  checked={selectedId === board.id.toString()}
                  onChange={handleSelect}
                />
                {board.name}
              </label>
            ))}
          </HStack>
        </VStack>

        {(theorySubjects.length > 0 || practicalSubjects.length > 0) && (
          <VStack space={4}>
            <VStack space={4}>
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {t("THEORY")}
              </FrontEndTypo.H2>
              {hasEventWithStatusPublish(theorySubjects) ? (
                <VStack borderRadius={"5px"} p={4} bg={"white"} space={4}>
                  {theorySubjects
                    ?.filter(
                      (subjects) => subjects?.events?.[0]?.status === "publish"
                    )
                    .sort((a, b) => {
                      // Access the start_date directly and convert them to Date objects for comparison
                      const dateA = new Date(a?.events?.[0]?.start_date);
                      const dateB = new Date(b?.events?.[0]?.start_date);
                      return dateA - dateB;
                    })
                    .map((subjects) => (
                      <HStack
                        key={subjects?.name}
                        alignItems={"center"}
                        justifyContent={"space-Between"}
                        padding={2}
                        borderBottomWidth={1}
                        borderColor={"grayInLight"}
                      >
                        <FrontEndTypo.H3>{subjects?.name}</FrontEndTypo.H3>
                        <FrontEndTypo.H4>
                          {subjects?.events?.[0]?.start_date || "-"}
                        </FrontEndTypo.H4>
                      </HStack>
                    ))}
                </VStack>
              ) : (
                <HStack>{t("DATA_NOT_PUBLISH")}</HStack>
              )}
            </VStack>
            <VStack space={4}>
              <FrontEndTypo.H2 color="textMaroonColor.400">
                {t("PRACTICALS")}
              </FrontEndTypo.H2>
              {hasEventWithStatusPublish(practicalSubjects) ? (
                <VStack borderRadius={"5px"} p={4} bg={"white"} space={4}>
                  {practicalSubjects
                    ?.filter(
                      (subjects) => subjects?.events?.[0]?.status === "publish"
                    )
                    .sort((a, b) => {
                      // Access the start_date directly and convert them to Date objects for comparison
                      const dateA = new Date(a?.events?.[0]?.start_date);
                      const dateB = new Date(b?.events?.[0]?.start_date);
                      return dateA - dateB;
                    })
                    .map((subjects) => (
                      <HStack
                        key={subjects?.name}
                        alignItems={"center"}
                        justifyContent={"space-Between"}
                        padding={2}
                        borderBottomWidth={1}
                        borderColor={"grayInLight"}
                      >
                        <FrontEndTypo.H3>{subjects?.name}</FrontEndTypo.H3>
                        <FrontEndTypo.H4>
                          {subjects?.events?.[0]?.start_date || "-"}
                        </FrontEndTypo.H4>
                      </HStack>
                    ))}
                </VStack>
              ) : (
                <HStack>{t("DATA_NOT_PUBLISH")}</HStack>
              )}
            </VStack>
            <FrontEndTypo.Primarybutton
              onPress={(e) => {
                navigate(`/examattendance`);
              }}
              isDisabled={
                !hasEventWithStatusPublish(theorySubjects) &&
                !hasEventWithStatusPublish(practicalSubjects)
              }
            >
              {t("MARK_LEARNER_EXAM_ATTENDANCE")}
            </FrontEndTypo.Primarybutton>
          </VStack>
        )}
      </VStack>
    </Layout>
  );
};

export default ViewExamSchedule;
