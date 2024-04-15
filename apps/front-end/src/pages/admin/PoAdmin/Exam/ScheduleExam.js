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

  useEffect(async () => {
    const data = await cohortService.getProgramList();
    setProgramList(data?.data);
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

  const handleProgramChange = async (selectedItem) => {
    const data = programList.find((e) => e.id == selectedItem);
    await setSelectedProgramId({
      program_id: data?.id,
      program_name: data?.name,
      state_name: data?.state?.state_name,
    });
    setFilter({ ...filter, program_id: selectedItem });
  };

  const handleSelect = (optionId) => {
    setSelectedDate({ ...selectedDate, board_id: optionId });
  };

  const theoryExams = [
    "Sindhi",
    "Rajasthani",
    "Mathematics",
    "Data Entry Operations",
    "Psychology",
  ];
  const practicalExams = [
    "Mathematics",
    "Data Entry Operations",
    "Science",
    "Painting",
    "Home Science",
  ];

  useEffect(() => {
    const data =
      theoryExams?.length + practicalExams?.length ==
      selectedDate?.subject_details?.length;
    if (data === true) {
      setIsDisable(false);
    }
  }, [selectedDate]);

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
                  value={filter?.selectedId}
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
              <VStack>
                <DatePicker
                  subjectArr={theoryExams}
                  examType={"theory"}
                  setSelectedDate={setSelectedDate}
                />
              </VStack>
            </CardComponent>
            {console.log({ selectedDate })}
            <CardComponent
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0, flex: 1, bg: "light.100" }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              title={t("Practical Exams")}
            >
              <DatePicker
                subjectArr={practicalExams}
                examType={"practical"}
                setSelectedDate={setSelectedDate}
              />
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
            onPress={() => navigate("/")}
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
