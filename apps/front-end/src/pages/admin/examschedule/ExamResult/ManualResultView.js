import { AdminTypo, useWindowSize } from "@shiksha/common-lib";
import { HStack, ScrollView, VStack, Stack } from "native-base";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";

const ManualResultView = ({ data }) => {
  const { t } = useTranslation();
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();

  const customStyles = {
    rows: {
      style: {
        minHeight: "72px", // override the row height
        cursor: "pointer",
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
        color: "#616161",
        size: "16px",
        justifyContent: "flex-start",
        height: "50px",
      },
    },
    cells: {
      style: {
        background: "#EEEEEE",
        color: "#616161",
        size: "19px",
        justifyContent: "flex-start",
      },
    },
  };

  const columns = (t) => [
    {
      name: "Subject Name (Code)",
      selector: (row) => `${row?.subject_name} (${row?.subject_code || "-"})`,
      wrap: true,
    },
    {
      name: "Max Marks",
      selector: (row) => `${row?.max_marks}`,
      wrap: true,
    },
    {
      name: "Marks Theory",
      selector: (row) => `${row?.theory}`,
      wrap: true,
    },
    {
      name: "Marks Practical",
      selector: (row) => `${row?.practical}`,
      wrap: true,
    },
    {
      name: "Marks Sessional",
      selector: (row) => `${row?.tma_internal_sessional}`,
      wrap: true,
    },
    {
      name: "Total Marks",
      selector: (row) => `${row?.total}`,
      wrap: true,
    },
    {
      name: "Result",
      selector: (row) => `${row?.result}`,
      wrap: true,
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
            columns={columns(t)}
            data={data?.exam_subject_results}
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
          <AdminTypo.H3>{data?.total_marks}</AdminTypo.H3>
        </HStack>
        <HStack width={"40%"} justifyContent={"space-between"}>
          <AdminTypo.H3>{t("RESULT")}</AdminTypo.H3>
          <AdminTypo.H3>{data?.final_result}</AdminTypo.H3>
        </HStack>
      </HStack>
      <VStack>
        <AdminTypo.H4>
          {t("RESULT_DESCRIPTIONS.EXAM_RESULT_STATUS_P")}
        </AdminTypo.H4>
        <AdminTypo.H4>
          {t("RESULT_DESCRIPTIONS.EXAM_RESULT_STATUS_SYC")}
        </AdminTypo.H4>
        <AdminTypo.H4>
          {t("RESULT_DESCRIPTIONS.EXAM_RESULT_STATUS_SYCT")}
        </AdminTypo.H4>
        <AdminTypo.H4>
          {t("RESULT_DESCRIPTIONS.EXAM_RESULT_STATUS_SYCP")}
        </AdminTypo.H4>
        <AdminTypo.H4>
          {t("RESULT_DESCRIPTIONS.EXAM_RESULT_STATUS_RWH")}
        </AdminTypo.H4>
        <AdminTypo.H4>
          {t("RESULT_DESCRIPTIONS.EXAM_RESULT_STATUS_XXXX")}
        </AdminTypo.H4>
      </VStack>
    </VStack>
  );
};

export default ManualResultView;

ManualResultView.propTypes = {
  data: PropTypes.any,
};
