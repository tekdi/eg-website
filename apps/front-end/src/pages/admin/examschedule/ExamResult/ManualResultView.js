import { AdminTypo, useWindowSize } from "@shiksha/common-lib";
import { Box, HStack, ScrollView, VStack, Stack } from "native-base";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

const ManualResultView = () => {
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();

  const data = [
    {
      srNo: 1,
      subjectName: "Hindi (201)",
      maxMarks: 100,
      marksTheory: 32,
      marksPractical: 9,
      marksSessional: 41,
      totalMarks: 179,
      result: "PASS",
    },
    {
      srNo: 2,
      subjectName: "Business Studies (215)",
      maxMarks: 100,
      marksTheory: 0,
      marksPractical: 9,
      marksSessional: 9,
      totalMarks: 18,
      result: "SYC",
    },
    {
      srNo: 3,
      subjectName: "Home Science (216)",
      maxMarks: 100,
      marksTheory: 18,
      marksPractical: 10,
      marksSessional: 8,
      totalMarks: 36,
      result: "PASS",
    },
    {
      srNo: 4,
      subjectName: "Psychology (222)",
      maxMarks: 100,
      marksTheory: 30,
      marksPractical: 9,
      marksSessional: 39,
      totalMarks: 78,
      result: "PASS",
    },
    {
      srNo: 5,
      subjectName: "Drawing (225)",
      maxMarks: 100,
      marksTheory: 2,
      marksPractical: 50,
      marksSessional: 2,
      totalMarks: 54,
      result: "PASS",
    },
  ];

  const customStyles = {
    header: {
      style: {
        background: "#F4F4F7",
        minHeight: "72px",
        cursor: "pointer",
        justifyContent: "left",
      },
    },
    headRow: {
      style: {
        size: "1px",
        justifyContent: "center",
        fontWeight: "bold",
      },
    },
    headCells: {
      style: {
        background: "#EEEEEE",
        size: "4px",
        justifyContent: "center",
        padding: "0px",
      },
    },
    cells: {
      style: {
        background: "#EEEEEE",
        justifyContent: "center",
      },
    },
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: "srNo",
    },
    {
      name: "Subject Name (Code)",
      selector: "subjectName",
    },
    {
      name: "Max Marks",
      selector: "maxMarks",
    },
    {
      name: "Marks Theory",
      selector: "marksTheory",
    },
    {
      name: "Marks Practical",
      selector: "marksPractical",
    },
    {
      name: "Marks Sessional",
      selector: "marksSessional",
    },
    {
      name: "Total Marks",
      selector: "totalMarks",
    },
    {
      name: "Result",
      selector: "result",
    },
  ];

  return (
    <VStack space={4}>
      <ScrollView
        maxH={Height - refAppBar?.clientHeight}
        minH={Height - refAppBar?.clientHeight}
      >
        <Stack bg={"dividerColor"} p={4}>
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            striped
            responsive
            noHeader
          />
        </Stack>
      </ScrollView>
      <HStack
        bg={"dividerColor"}
        p={4}
        alignItems={"center"}
        justifyContent={"space-evenly"}
      >
        <HStack width={"40%"} justifyContent={"space-between"}>
          <AdminTypo.H3>{t("TOTAL")}</AdminTypo.H3>
          <AdminTypo.H3>{"32"}</AdminTypo.H3>
        </HStack>
        <HStack width={"40%"} justifyContent={"space-between"}>
          <AdminTypo.H3>{t("RESULT")}</AdminTypo.H3>
          <AdminTypo.H3>{"PASS"}</AdminTypo.H3>
        </HStack>
      </HStack>
      <VStack>
        <AdminTypo.H4>{t("P_PASS")}</AdminTypo.H4>
        <AdminTypo.H4>{t("SYC")}</AdminTypo.H4>
        <AdminTypo.H4>{t("SYCT")}</AdminTypo.H4>
        <AdminTypo.H4>{t("SYCP")}</AdminTypo.H4>
        <AdminTypo.H4>{t("RWH")}</AdminTypo.H4>
        <AdminTypo.H4>{t("XXXX")}</AdminTypo.H4>
      </VStack>
    </VStack>
  );
};

export default ManualResultView;
