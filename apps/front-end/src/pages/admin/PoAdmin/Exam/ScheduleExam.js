import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  AdminTypo,
  Breadcrumb,
  CardComponent,
  IconByName,
  PoAdminLayout,
  cohortService,
  enumRegistryService,
  getSelectedProgramId,
  organisationService,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import { HStack, Radio, Select, Stack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import DatePicker from "v2/components/Static/FormBaseInput/formCustomeInputs/DatePicker";
import { useNavigate } from "react-router-dom";

function ScheduleExam() {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState();
  const [programList, setProgramList] = useState();
  const [filter, setFilter] = useState({});
  const [selectedDate, setSelectedDate] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [practicalSubjects, setPracticalSubjects] = useState([]);
  const [theorySubjects, setTheorySubjects] = useState([]);

  useEffect(async () => {
    const data = await cohortService.getProgramList();
    setProgramList(data?.data);
    const localData = await getSelectedProgramId();
    setFilter({ ...filter, program_id: localData?.program_id });
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

  const handleProgramChange = async (selectedItem) => {
    const data = programList.find((e) => e.id == selectedItem);
    await setSelectedProgramId({
      program_id: data?.id,
      program_name: data?.name,
      state_name: data?.state?.state_name,
    });
    setFilter({ ...filter, program_id: selectedItem });
    window.location.reload();
  };

  const handleSelect = (optionId) => {
    setFilter({ ...filter, board_id: optionId });
  };

  useEffect(() => {
    const fetchedData = {
      data: [
        {
          name: "English",
          id: 19,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Urdu",
          id: 20,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Sanskrit",
          id: 21,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Bengali",
          id: 22,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Marathi",
          id: 23,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Telugu",
          id: 24,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Gujarati",
          id: 25,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Kannada",
          id: 26,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Punjabi",
          id: 27,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Assamese",
          id: 28,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Nepali",
          id: 29,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Malayalam",
          id: 30,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Hate",
          id: 31,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [
            {
              context: "subjects",
              context_id: 31,
              program_id: 1,
              academic_year_id: 1,
              id: 1,
              start_date: "2023-05-05",
              end_date: "2023-06-06",
              type: "theory",
              status: "publish",
            },
          ],
        },
        {
          name: "Arabic",
          id: 32,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Persian",
          id: 33,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Tamil",
          id: 34,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Entrepreneurship",
          id: 54,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Social Science",
          id: 38,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Sindhi",
          id: 35,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Economics",
          id: 39,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Science And Technology",
          id: 37,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Business Studies",
          id: 40,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Psychology",
          id: 42,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Indian Culture and Heritage",
          id: 43,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Accountancy",
          id: 44,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Data Entry Operations",
          id: 46,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Carnatic Sangeet",
          id: 48,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Sanskrit Sahitya",
          id: 53,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Sanskrit Vyakaran",
          id: 50,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Hindustani Sangeet",
          id: 47,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Bharatiya Darshan",
          id: 51,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "See Adhyayan",
          id: 49,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Hindi",
          id: 56,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Drawing",
          id: 45,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: null,
          events: [],
        },
        {
          name: "Mathematics",
          id: 36,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: true,
          events: [],
        },
        {
          name: "Home Science",
          id: 41,
          board: "nios",
          board_id: 1,
          is_theory: true,
          is_practical: true,
          events: [],
        },
      ],
    };
    setData(fetchedData?.data);
  }, []);

  useEffect(() => {
    if (data) {
      const practical = [];
      const theory = [];

      data?.forEach((subject) => {
        if (subject.is_practical) {
          practical.push(subject);
        }
        if (subject.is_theory) {
          theory.push(subject);
        }
      });

      setPracticalSubjects(practical);
      setTheorySubjects(theory);
    }
  }, [data]);

  useEffect(() => {
    const data =
      theorySubjects?.length + practicalSubjects?.length ==
      selectedDate?.subject_details?.length;
    if (data === true) {
      setIsDisable(false);
    }
  }, [selectedDate]);

  const handleSaveButton = async () => {
    const data = await organisationService.PoExampSchedule(selectedDate);
    if (data?.success === true) {
      navigate("/");
    }
  };
  return (
    <PoAdminLayout>
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
                    {t("USER")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
          <VStack alignItems={"end"}>
            <Select
              minH="40px"
              maxH="40px"
              selectedValue={`${filter?.program_id}`}
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder={t("SELECT")}
              mt={1}
              onValueChange={handleProgramChange}
            >
              {programList?.map((item) => (
                <Select.Item
                  key={item?.id}
                  label={item?.state?.state_name}
                  value={`${item?.id}`}
                />
              ))}
            </Select>
          </VStack>
        </HStack>

        <HStack justifyContent={"space-between"}>
          <VStack space={4}>
            <AdminTypo.H5 bold color="textGreyColor.500">
              {t("SELECT_BOARD")}
            </AdminTypo.H5>
            <HStack space={6}>
              {boardList?.boards?.map((board) => (
                <Radio.Group
                  key={board.id}
                  onChange={(nextValue) => handleSelect(nextValue)}
                  value={filter?.board_id || null}
                >
                  <Radio colorScheme="red" value={board.id}>
                    {board.name}
                  </Radio>
                </Radio.Group>
              ))}
            </HStack>
          </VStack>
          <VStack>
            <AdminTypo.Secondarybutton
              icon={<IconByName color="black" name="ShareLineIcon" />}
            >
              <AdminTypo.H6 bold>{t("PUBLISH")}</AdminTypo.H6>
            </AdminTypo.Secondarybutton>
          </VStack>
        </HStack>

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
              {filter?.board_id && (
                <VStack>
                  <DatePicker
                    subjectArr={theorySubjects}
                    examType={"theory"}
                    setSelectedDate={setSelectedDate}
                    status={"draft"}
                  />
                </VStack>
              )}
            </CardComponent>
            <CardComponent
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0, flex: 1, bg: "light.100" }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              title={t("Practical Exams")}
            >
              {filter?.board_id && (
                <DatePicker
                  subjectArr={practicalSubjects}
                  examType={"practical"}
                  setSelectedDate={setSelectedDate}
                  status={"draft"}
                />
              )}
            </CardComponent>
          </HStack>
        </VStack>
        <HStack space={4} alignSelf={"center"}>
          <AdminTypo.Secondarybutton
            icon={<IconByName color="black" name="DeleteBinLineIcon" />}
          >
            {t("CANCEL")}
          </AdminTypo.Secondarybutton>
          <AdminTypo.PrimaryButton
            isDisabled={isDisable}
            onPress={handleSaveButton}
          >
            {t("SAVE")}
          </AdminTypo.PrimaryButton>
        </HStack>
      </Stack>
    </PoAdminLayout>
  );
}

ScheduleExam.propTypes = {};

export default ScheduleExam;
