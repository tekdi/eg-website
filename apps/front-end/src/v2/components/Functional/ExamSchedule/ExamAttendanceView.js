import React, { useEffect, useState } from "react";
import { Layout, FrontEndTypo, organisationService } from "@shiksha/common-lib";
import { VStack, Stack, Text } from "native-base";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const ExamAttendanceView = ({ footerLinks }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const data = await organisationService.attendanceReport();
      setTableData(data?.data);
      setLoading(false);
    };
    fetchData();
  }, []);

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
        justifyContent: "center",
      },
    },
    headCells: {
      style: {
        background: "#acadac5f",
        size: "4px",
        justifyContent: "center",
        padding: "0px",
        border: "0.1px solid #999",
      },
    },
    cells: {
      style: {
        background: "#F4F4F7",
        justifyContent: "center",
        border: "0.1px solid #999",
      },
    },
  };

  const columns = (t) => [
    {
      name: t("SUBJECT"),
      cell: (row) => t(row?.name),
      wrap: true,
    },
    {
      name: t("TOTAL_STUDENTS"),
      cell: (row) => t(row?.total_students),
      wrap: true,
    },
    {
      name: t("PRESENT"),
      cell: (row) => t(row?.present),
      wrap: true,
    },
    {
      name: t("ABSENT"),
      cell: (row) => t(row?.absent),
      wrap: true,
    },
    {
      name: t("NOT_MARKED"),
      cell: (row) => t(row?.not_marked),
      wrap: true,
    },
  ];
  return (
    <Layout loading={loading} _footer={{ menues: footerLinks }}>
      <VStack bg="primary.50" p="5" space={4} style={{ zIndex: -1 }}>
        <Text
          fontSize="20px"
          lineHeight="24px"
          fontWeight="600"
          color="textGreyColor.900"
        >
          {t("LEARNER_EXAM_ATTENDANCE")}
        </Text>
        <Stack width={"100%"}>
          <DataTable
            customStyles={customStyles}
            columns={columns(t)}
            data={tableData}
            width={"50%"}
          />
        </Stack>
        <FrontEndTypo.Primarybutton
          onPress={(e) => {
            navigate(`/examattendance`);
          }}
        >
          {t("MARK_LEARNER_EXAM_ATTENDANCE")}
        </FrontEndTypo.Primarybutton>
      </VStack>
    </Layout>
  );
};

export default ExamAttendanceView;
