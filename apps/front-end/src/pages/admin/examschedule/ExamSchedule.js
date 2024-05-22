import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  AdminTypo,
  Breadcrumb,
  AdminLayout as Layout,
  useWindowSize,
  CardComponent,
  IconByName,
  cohortService,
  enumRegistryService,
  getSelectedProgramId,
  setSelectedProgramId,
  organisationService,
} from "@shiksha/common-lib";
import { HStack, Radio, ScrollView, Stack, VStack } from "native-base";
import { useTranslation } from "react-i18next";

const ExamSchedule = (footerLinks) => {
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const { t } = useTranslation();
  const [filter, setFilter] = useState();
  const [boardList, setBoardList] = useState();
  const [practicalSubjects, setPracticalSubjects] = useState([]);
  const [theorySubjects, setTheorySubjects] = useState([]);

  useEffect(async () => {
    const data = await cohortService.getProgramList();
    const localData = await getSelectedProgramId();
    if (localData === null) {
      const obj = data?.data?.[0];
      const defaultData = {
        program_id: obj?.id,
        name: obj?.name,
        state_name: obj?.state?.state_name,
      };
      setSelectedProgramId(defaultData);
    }
    const boardList = await enumRegistryService.boardList();
    setBoardList(boardList);
  }, []);

  const handleSelect = (optionId) => {
    setFilter({ ...filter, selectedId: optionId });
    getSubjectList(optionId);
  };

  const getSubjectList = async (id) => {
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
  };

  return (
    <Layout
      w={Width}
      h={Height}
      getRefAppBar={(e) => setRefAppBar(e)}
      refAppBar={refAppBar}
      _sidebar={footerLinks}
    >
      <Stack p={4} space={4}>
        <HStack justifyContent={"space-between"}>
          <Breadcrumb
            _hstack={{ alignItems: "center" }}
            drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
            data={[
              {
                title: (
                  <HStack alignItems={"center"} space={2}>
                    <IconByName name="Home4LineIcon" size="md" />
                    <AdminTypo.H4 bold color="Activatedcolor.400">
                      {t("HOME")}
                    </AdminTypo.H4>
                  </HStack>
                ),
                link: "/",
                icon: "GroupLineIcon",
              },
              {
                title: (
                  <AdminTypo.H4
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    bold
                  >
                    {t("VIEW_EXAM_SCHEDULE")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </HStack>

        <VStack space={4}>
          <AdminTypo.H5 bold color="textGreyColor.500">
            {t("SELECT_BOARD")}
          </AdminTypo.H5>
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
        </VStack>
        {practicalSubjects.length > 0 && (
          <VStack p={4} pl={0} space={4}>
            <AdminTypo.H5 bold color="textGreyColor.500">
              {t("SELECT_DATE")}
            </AdminTypo.H5>
            <HStack space={4}>
              <CardComponent
                _header={{ bg: "light.100" }}
                _vstack={{ space: 0, flex: 1, bg: "light.100" }}
                _hstack={{ borderBottomWidth: 0, p: 1 }}
                title="Theory Exams"
              >
                <ScrollView>
                  <VStack space={2} padding={4} height="400px">
                    {theorySubjects?.map((subjects) => {
                      return (
                        subjects?.events?.[0]?.status === "publish" && (
                          <HStack
                            key={subjects?.name}
                            justifyContent={"space-Between"}
                          >
                            <AdminTypo.H3>{subjects?.name}</AdminTypo.H3>
                            <AdminTypo.H3>
                              {subjects?.events?.[0]?.start_date || "-"}
                            </AdminTypo.H3>
                          </HStack>
                        )
                      );
                    })}
                  </VStack>
                </ScrollView>
              </CardComponent>

              <CardComponent
                _header={{ bg: "light.100" }}
                _vstack={{ space: 0, flex: 1, bg: "light.100" }}
                _hstack={{ borderBottomWidth: 0, p: 1 }}
                title={t("Practical Exams")}
              >
                <VStack>
                  {practicalSubjects?.map((subjects) => {
                    return (
                      subjects?.events?.[0]?.start_date && (
                        <HStack
                          key={subjects?.name}
                          justifyContent={"space-Between"}
                        >
                          <AdminTypo.H3>{subjects?.name}</AdminTypo.H3>
                          <AdminTypo.H3>
                            {subjects?.events?.[0]?.start_date || "-"}
                          </AdminTypo.H3>
                        </HStack>
                      )
                    );
                  })}
                </VStack>
              </CardComponent>
            </HStack>
          </VStack>
        )}
      </Stack>
    </Layout>
  );
};

ExamSchedule.propTypes = {};

export default ExamSchedule;
