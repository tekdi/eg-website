import React, { useEffect, useState } from "react";
import { Layout, FrontEndTypo, organisationService } from "@shiksha/common-lib";
import { VStack, Stack } from "native-base";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const ExamAttendanceReport = ({ footerLinks, userTokenInfo: { authUser } }) => {
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
      cell: (row) => `${row?.name} (${row?.boardname})`,
      wrap: true,
    },
    {
      name: t("TOTAL_STUDENTS"),
      cell: (row) => row?.total_students,
      wrap: true,
    },
    {
      name: t("A_PRESENT"),
      cell: (row) => row?.present,
      wrap: true,
    },
    {
      name: t("ABSENT"),
      cell: (row) => row?.absent,
      wrap: true,
    },
    {
      name: t("NOT_MARKED"),
      cell: (row) => row?.not_marked,
      wrap: true,
    },
  ];

  const onPressBackButton = () => {
    navigate(-1);
  };

  return (
    <Layout
      _appBar={{
        onPressBackButton,
      }}
      facilitator={{
        ...authUser,
        program_faciltators: authUser?.user_roles?.[0],
      }}
      loading={loading}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="primary.50" p="5" space={4} style={{ zIndex: -1 }}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {t("LEARNER_EXAM_ATTENDANCE_OVERVIEW")}
        </FrontEndTypo.H2>
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

export default ExamAttendanceReport;
