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
} from "@shiksha/common-lib";
import { HStack, Radio, Select, Stack, VStack } from "native-base";
import { useTranslation } from "react-i18next";

const ExamSchedule = (footerLinks) => {
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const { t } = useTranslation();
  const [filter, setFilter] = useState({});
  const [boardList, setBoardList] = useState();
  const [programList, setProgramList] = useState();
  const [selectedDate, setSelectedDate] = useState([]);
  const [isDisable, setIsDisable] = useState(true);

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
    setFilter({ ...filter, selectedId: optionId });
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
                    {t("LEARNER_EXAM_RESULT")}
                  </AdminTypo.H4>
                ),
              },
            ]}
          />
        </HStack>

        <VStack space={4}>
          <AdminTypo.H5 bold color="textGreyColor.500">
            Swapnil Phalke
          </AdminTypo.H5>
          <HStack space={6}>
            <AdminTypo.H6 bold color="textGreyColor.500">
              {t("ENROLLMENT_NO")} : 123456789
            </AdminTypo.H6>
          </HStack>
        </VStack>
        <VStack p={4} pl={0} space={4}>
          <HStack space={4}>
            <CardComponent
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0, flex: 1, bg: "light.100" }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              title="Theory Exams"
            >
              <VStack></VStack>
            </CardComponent>

            <CardComponent
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0, flex: 1, bg: "light.100" }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              title={t("Practical Exams")}
            ></CardComponent>
          </HStack>
        </VStack>
      </Stack>
    </Layout>
  );
};

ExamSchedule.propTypes = {};

export default ExamSchedule;
