import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  CheckIcon,
  HStack,
  Modal,
  ScrollView,
  Select,
  VStack,
} from "native-base";
import {
  PoAdminLayout as Layout,
  useWindowSize,
  benificiaryRegistoryService,
  AdminTypo,
  getSelectedAcademicYear,
  eventService,
  setSelectedAcademicYear,
  setSelectedProgramId,
  cohortService,
} from "@shiksha/common-lib";
import Table from "./Table";
import { useTranslation } from "react-i18next";

export default function AdminHome({ footerLinks, userTokenInfo }) {
  const [Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const [duplicateData, setduplicateData] = useState();
  const [loading, setLoading] = useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({ limit: 10 });
  const [modal, setModal] = useState(true);
  const [academicYear, setAcademicYear] = useState();
  const [academicData, setAcademicData] = useState();
  const [programID, setProgramID] = useState();
  const [programData, setProgramData] = useState([]);
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  // facilitator pagination

  const cohortData = useCallback(async () => {
    setLoading(true);
    const data = await cohortService.getAcademicYear();
    const academicYearparseData = data?.data?.[0];
    console.log({ data });
    if (data?.data?.length < 2) {
      setModal(false);
      const programData = await cohortService.getPrograms(
        academicYearparseData?.academic_year_id
      );
      const parseData = programData?.data?.[0];
      setSelectedAcademicYear(academicYearparseData);
      setSelectedProgramId(parseData);
      setSelectedAcademicYear({ parseData, academicYearparseData });
    }
    setAcademicData(data?.data);
    setLoading(false);
  }, [modalVisible]);

  useEffect(() => {
    cohortData();
  }, [modalVisible]);

  useEffect(async () => {
    const dupliData =
      await benificiaryRegistoryService.getDuplicateBeneficiariesList(filter);
    setPaginationTotalRows(dupliData?.count || 0);
    setduplicateData(dupliData?.data);
    setLoading(false);
  }, [filter]);

  const handleYearChange = (itemValue) => {
    console.log({ itemValue });
    setAcademicYear(itemValue);
    const parseData = jsonParse(itemValue);
    const fetchData = async () => {
      const data = await cohortService.getPrograms(parseData?.academic_year_id);
      setProgramData(data?.data);
    };
    fetchData();
  };

  const handleContinueBtn = () => {
    const parseData = jsonParse(programID);
    const academicYearparseData = jsonParse(academicYear);
    setSelectedAcademicYear(academicYearparseData);
    setSelectedProgramId(parseData);
    setSelectedAcademicYear({ parseData, academicYearparseData });
    // setModal(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      let academic_Id = await getSelectedAcademicYear();
      if (academic_Id) {
        // setModal(false);
      }
    };
    fetchData();
  }, []);
  console.log({ academicData, academicYear });
  return (
    <Layout
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack>
        <ScrollView
          maxH={Height - refAppBar?.clientHeight}
          minH={Height - refAppBar?.clientHeight}
        >
          <Box roundedBottom={"2xl"} py={6} px={4} mb={5}>
            <Table
              filter={filter}
              setFilter={setFilter}
              duplicateData={duplicateData}
              facilitator={userTokenInfo?.authUser}
              paginationTotalRows={paginationTotalRows}
              loading={loading}
            />
          </Box>
        </ScrollView>
      </HStack>
      <Modal isOpen={modal} safeAreaTop={true} size="xl">
        <Modal.Content>
          <Modal.Header p="5" borderBottomWidth="0">
            <AdminTypo.H3 textAlign="center" color="black">
              {t("SELECT_YOUR_COHORT")}
            </AdminTypo.H3>
          </Modal.Header>
          <Modal.Body p="5" pb="10">
            <VStack space="5">
              <HStack
                space="5"
                borderBottomWidth={1}
                borderBottomColor="gray.300"
                pb="5"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <AdminTypo.H4> {t("ACADEMIC_YEAR")}</AdminTypo.H4>

                <Select
                  selectedValue={academicYear}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => handleYearChange(itemValue)}
                >
                  {academicData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.academic_year_name}
                        value={JSON.stringify(item)}
                      />
                    );
                  })}
                </Select>
              </HStack>
              <HStack
                space="5"
                borderBottomWidth={1}
                borderBottomColor="gray.300"
                pb="5"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <AdminTypo.H4> {t("STATE")}</AdminTypo.H4>

                <Select
                  selectedValue={programID}
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder={t("SELECT")}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => setProgramID(itemValue)}
                >
                  {programData?.map((item) => {
                    return (
                      <Select.Item
                        key={item.id}
                        label={item?.state_name}
                        value={JSON.stringify(item)}
                      />
                    );
                  })}
                </Select>
              </HStack>
              {programID && (
                <VStack alignItems={"center"}>
                  <AdminTypo.Dangerbutton onPress={handleContinueBtn}>
                    {t("CONTINUE")}
                  </AdminTypo.Dangerbutton>
                </VStack>
              )}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}
