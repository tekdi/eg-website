import React, { useEffect, useState } from "react";
import { Layout, FrontEndTypo, organisationService } from "@shiksha/common-lib";
import { VStack, Stack } from "native-base";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const ExamResultReport = ({ footerLinks }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const data = await organisationService.examResultReport();
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
      name: t("NO_OF_LEARNERS"),
      cell: (row) => row?.total_learners,
      wrap: true,
    },
    {
      name: t("BENEFICIARY_STATUS_10TH_PASSED"),
      cell: (row) => row?.tenth_passed,
      wrap: true,
    },
    {
      name: t("BENEFICIARY_STATUS_PRAGATI_SYC"),
      cell: (row) => row?.pragati_syc,
      wrap: true,
    },
    {
      name: t("RESULT_UPLOAD_PENDING"),
      cell: (row) => row?.not_uploaded,
      wrap: true,
    },
  ];
  return (
    <Layout loading={loading} _footer={{ menues: footerLinks }}>
      <VStack bg="primary.50" p="5" space={4} style={{ zIndex: -1 }}>
        <FrontEndTypo.H2 color="textMaroonColor.400">
          {t("LEARNER_EXAM_RESULTS_OVERVIEW")}
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
            navigate(`/examresult`);
          }}
        >
          {t("UPDATE_LEARNER_EXAM_RESULTS")}
        </FrontEndTypo.Primarybutton>
      </VStack>
    </Layout>
  );
};

export default ExamResultReport;
