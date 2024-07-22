import React, { useEffect, useState } from "react";
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
import {
  HStack,
  Progress,
  Radio,
  ScrollView,
  Select,
  Stack,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";
import DatePicker from "./DatePicker";

function ScheduleExam() {
  const { t } = useTranslation();
  const [boardList, setBoardList] = useState();
  const [programList, setProgramList] = useState();
  const [filter, setFilter] = useState({});
  const [selectedDate, setSelectedDate] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [isDisableCancelBtn, setIsDisableCancelBtn] = useState(true);
  const [isVisibleEditBtn, setIsVisibleEditBtn] = useState(false);
  const [isVisibleEdit, setIsVisibleEdit] = useState(false);
  const [practicalSubjects, setPracticalSubjects] = useState([]);
  const [theorySubjects, setTheorySubjects] = useState([]);
  const [oldSelectedData, setOldSelectedData] = useState([]);
  const [theoryEvent, setTheoryEvent] = useState([]);
  const [practicalEvent, setPracticalEvent] = useState([]);
  const [eventOverallData, setEventOverallData] = useState([]);
  const [publishDate, setPublishDate] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasDraftStatus, setHasDraftStatus] = useState(false);
  const [isPublishDisable, setIsPublishDisable] = useState(false);

  useEffect(async () => {
    const data = await cohortService.getProgramList();
    setProgramList(data?.data);
    const localData = await getSelectedProgramId();
    if (localData?.length === undefined) {
      const obj = data?.data?.[0];
      const defaultData = {
        program_id: obj?.id,
        name: obj?.name,
        state_name: obj?.state?.state_name,
      };
      setSelectedProgramId(defaultData);
      setFilter({ ...filter, program_id: obj?.id });
    } else {
      setFilter({ ...filter, program_id: localData?.program_id });
    }
  }, []);

  useEffect(async () => {
    const boardList = await enumRegistryService.boardList();
    setBoardList(boardList);
  }, [filter]);

  const resetFillData = (selectedItem) => {
    setTheorySubjects([]);
    setPracticalSubjects([]);
    setIsVisibleEdit(false);
    setHasDraftStatus(false);
    setProgress(0);
    setEventOverallData([]);
    setPracticalEvent([]);
    setTheoryEvent([]);
    setFilter({ program_id: selectedItem });
    setIsDisable(true);
    setIsDisableCancelBtn(true);
    setIsVisibleEditBtn(false);
  };

  const handleProgramChange = async (selectedItem) => {
    setLoading(true);
    const data = programList.find((e) => e.id == selectedItem);
    await setSelectedProgramId({
      program_id: data?.id,
      program_name: data?.name,
      state_name: data?.state?.state_name,
    });
    setFilter({ ...filter, program_id: selectedItem });
    resetFillData(selectedItem);
    setLoading(false);
  };

  useEffect(async () => {
    setLoading(true);
    const subjectData = await organisationService.getSubjectList({
      id: filter?.board_id,
    });
    setOldSelectedData(subjectData?.data);
    if (Array.isArray(subjectData?.data)) {
      const practical = [];
      const theory = [];
      const practicalEvent = [];
      const theoryEvent = [];
      const allEventData = [];

      const subjectDataArray = [];

      subjectData?.data?.forEach((item) => {
        if (item?.events?.length > 0) {
          item.events.forEach((statusItem) => {
            if (statusItem?.status === "draft") {
              const subjId = statusItem?.context_id;
              const status =
                statusItem?.status === "draft" ? "publish" : statusItem?.status;
              const date = statusItem?.start_date;
              const type = statusItem?.type;
              subjectDataArray.push({
                subject_id: subjId,
                exam_date: date,
                type: type,
                status: status,
              });
            }
          });
        }
      });
      setPublishDate(subjectDataArray);

      subjectData?.data?.forEach((subject, events) => {
        if (subject.is_practical) {
          subject?.events?.map((item) => {
            if (item?.type === "practical") {
              const obj = { subject_id: item?.context_id, type: item?.type };
              allEventData.push(obj);
            }
          });
          practical.push(subject);
        }
        if (subject.is_theory) {
          subject?.events?.map((item) => {
            if (item?.type === "theory") {
              const obj = { subject_id: item?.context_id, type: item?.type };
              allEventData.push(obj);
            }
          });
          theory.push(subject);
        }
      });
      const data = await organisationService.PoExamScheduleEdit(allEventData);
      const eventData = [];
      if (data) {
        data?.map((item) => {
          if (item?.type === "theory") {
            theoryEvent.push(item);
            eventData.push(item);
          }
          if (item?.type === "practical") {
            practicalEvent.push(item);
            eventData.push(item);
          }
        });
      }
      setEventOverallData(eventData);
      setPracticalEvent(practicalEvent);
      setTheoryEvent(theoryEvent);
      setPracticalSubjects(practical);
      setTheorySubjects(theory);
    }
    setLoading(false);
  }, [filter?.board_id, hasDraftStatus]);

  useEffect(() => {
    if (Array?.isArray(oldSelectedData)) {
      const isDraft = oldSelectedData?.some((subject) => {
        return subject?.events?.some((event) => event?.status === "draft");
      });
      setHasDraftStatus(isDraft);
    } else {
      setIsVisibleEditBtn(false);
    }
  }, [oldSelectedData, selectedDate, hasDraftStatus]);

  useEffect(() => {
    if (theorySubjects?.length !== 0 && practicalSubjects?.length !== 0) {
      const data =
        (theorySubjects.length ||
          practicalSubjects.length ||
          selectedDate.length) > 0;
      if (data === true && selectedDate?.length != 0) {
        setIsDisable(false);
        setIsDisableCancelBtn(false);
      }
    }
  }, [selectedDate]);

  const handleSelect = (optionId, board) => {
    setFilter({ ...filter, program_id: board?.program_id, board_id: optionId });
    // Edit button visibility (current-reverse)
    setHasDraftStatus(false);
    setIsVisibleEditBtn(false);
  };
  const handleSaveButton = async () => {
    setIsDisable(true);
    const data = await organisationService.PoExamSchedule(selectedDate);
    if (data?.success === true) {
      setPracticalEvent([]);
      setTheoryEvent([]);
      setSelectedDate([]);
      setIsDisable(true);
      setIsDisableCancelBtn(true);
      setIsVisibleEdit(false);
      setIsVisibleEditBtn(true);
      const subjectData = await organisationService.getSubjectList({
        id: filter?.board_id,
      });
      setOldSelectedData(subjectData?.data);
    }
  };
  const handleCancelButton = async () => {
    setIsDisableCancelBtn(true);
    const subjectData = await organisationService.getSubjectList({
      id: filter?.board_id,
    });
    setOldSelectedData(subjectData?.data);
    setSelectedDate([]);
    setIsDisable(true);
    setIsVisibleEdit();
  };

  const handleEditButton = () => {
    setIsVisibleEdit(true);
    setIsDisableCancelBtn(false);
  };

  const handlePublish = async () => {
    setIsPublishDisable(true);
    const data = await organisationService.PoExamSchedule(publishDate);
    if (data?.success === true) {
      setPracticalEvent([]);
      setTheoryEvent([]);
      setSelectedDate([]);
      setIsDisable(true);
      setIsVisibleEdit();
      setIsVisibleEditBtn(true);
      setHasDraftStatus(false);
      setPublishDate([]);
    }
    setIsPublishDisable(false);
  };
  useEffect(() => {
    const theoryCount = (theoryEvent?.length / theorySubjects?.length) * 100;
    const practicalCount =
      (practicalEvent?.length / practicalSubjects?.length) * 100;
    const progressArray = {
      theoryCount: theoryCount,
      practicalCount: practicalCount,
    };
    setProgress(progressArray);
  }, [
    filter?.board,
    theorySubjects,
    theoryEvent,
    practicalSubjects,
    practicalEvent,
  ]);

  return (
    <PoAdminLayout loading={loading}>
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

        <HStack>
          <VStack space={4}>
            <AdminTypo.H5 bold color="textGreyColor.500">
              {t("SELECT_BOARD")}
            </AdminTypo.H5>
            <HStack space={6}>
              {boardList?.boards?.map((board) => (
                <Radio.Group
                  key={board.id}
                  onChange={(nextValue) => handleSelect(nextValue, board)}
                  value={filter?.board_id || null}
                >
                  <Radio colorScheme="red" value={board.id}>
                    {board.name}
                  </Radio>
                </Radio.Group>
              ))}
            </HStack>
          </VStack>
        </HStack>

        <VStack p={4} pl={0} space={4}>
          <HStack justifyContent={"space-between"} alignItems={"center"}>
            <AdminTypo.H5 bold color="textGreyColor.500">
              {t("SELECT_DATE")}
            </AdminTypo.H5>
            <HStack space={4}>
              {(theoryEvent?.length > 0 ||
                practicalEvent?.length > 0 ||
                isVisibleEditBtn === true) && (
                <AdminTypo.Secondarybutton
                  icon={<IconByName color="black" name="PencilLineIcon" />}
                  onPress={handleEditButton}
                >
                  <AdminTypo.H6 bold>{t("EDIT")}</AdminTypo.H6>
                </AdminTypo.Secondarybutton>
              )}
              {hasDraftStatus && (
                <AdminTypo.Secondarybutton
                  isDisabled={isPublishDisable}
                  icon={<IconByName color="black" name="ShareLineIcon" />}
                  onPress={handlePublish}
                >
                  <AdminTypo.H6 bold>{t("PUBLISH")}</AdminTypo.H6>
                </AdminTypo.Secondarybutton>
              )}
            </HStack>
          </HStack>
          <HStack space={4}>
            <CardComponent
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0, flex: 1, bg: "light.100" }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              title={t("THEORY_EXAM")}
              isHideProgressBar={true}
            >
              {filter?.board_id && (
                <>
                  <Progress
                    value={progress?.theoryCount}
                    colorScheme={"warning"}
                  />
                  <ScrollView>
                    <VStack padding={3} height={"350px"}>
                      <DatePicker
                        subjectArr={theorySubjects}
                        examType={"theory"}
                        setSelectedDate={setSelectedDate}
                        oldSelectedData={oldSelectedData}
                        isVisibleEdit={isVisibleEdit}
                        eventOverallData={eventOverallData}
                        status={"draft"}
                      />
                    </VStack>
                  </ScrollView>
                </>
              )}
            </CardComponent>
            <CardComponent
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0, flex: 1, bg: "light.100" }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              title={t("PRACTICAL_EXAM")}
              isHideProgressBar={true}
            >
              {filter?.board_id && (
                <>
                  <Progress
                    value={progress?.practicalCount}
                    colorScheme={"warning"}
                  />
                  <ScrollView>
                    <VStack padding={3} height={"350px"}>
                      <DatePicker
                        subjectArr={practicalSubjects}
                        examType={"practical"}
                        setSelectedDate={setSelectedDate}
                        oldSelectedData={oldSelectedData}
                        isVisibleEdit={isVisibleEdit}
                        eventOverallData={eventOverallData}
                        status={"draft"}
                      />
                    </VStack>
                  </ScrollView>
                </>
              )}
            </CardComponent>
          </HStack>
        </VStack>
        <HStack space={4} alignSelf={"center"}>
          <AdminTypo.Secondarybutton
            isDisabled={isDisableCancelBtn}
            onPress={handleCancelButton}
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

export default ScheduleExam;
