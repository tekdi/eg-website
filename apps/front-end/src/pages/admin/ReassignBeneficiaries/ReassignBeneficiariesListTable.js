import React from "react";
import { AdminTypo } from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { ChipStatus as BeneficiaryStatus } from "component/BeneficiaryStatus";
import { HStack, VStack, ScrollView, Text } from "native-base";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrerakName = ({ first_name, last_name, status }) => (
  <VStack alignItems="center" space="2">
    <Text
      color={
        ["rusticate", "rejected", "quit"].includes(status)
          ? "textMaroonColor.500"
          : "textGreyColor.100"
      }
      fontSize="13px"
      fontWeight="bold"
    >
      {first_name} {last_name || ""}
    </Text>
  </VStack>
);

const PrerakStatus = ({ status }) => <ChipStatus status={status} />;

const StatusCount = ({ status_count }) =>
  status_count?.map(({ status, count }, index) => (
    <Text key={index} mx={2}>
      <BeneficiaryStatus statusCount={status} prefix={count || "0"} />
    </Text>
  ));

export const CustomStyles = {
  rows: {
    style: {
      minHeight: "72px",
    },
  },
  headCells: {
    style: {
      background: "#E0E0E0",
      color: "#616161",
      fontSize: "16px",
      justifyContent: "center",
    },
  },
  cells: {
    style: {
      color: "#616161",
      fontSize: "19px",
      justifyContent: "center",
    },
  },
};

const Action = ({ id, t, navigate }) => (
  <AdminTypo.Secondarybutton
    my="3"
    onPress={() => navigate(`/admin/learners/reassignList/${id}`)}
  >
    {t("VIEW")}
  </AdminTypo.Secondarybutton>
);

const Table = ({ paginationTotalRows, loading, data, setFilter, filter }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const beneficiaryStatus = [
    {
      title: "IDENTIFIED_READY_TO_ENROLL",
      value: "identified_ready_to_enroll",
    },
    {
      title: "BENEFICIARY_STATUS_ENROLLED",
      value: "enrolled",
    },
    {
      title: "BENEFICIARY_STATUS_ENROLLED_IP_VERIFIED",
      value: "enrolled_ip_verified",
    },
  ];

  const columns = [
    {
      name: t("PRERAK_ID"),
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
    },
    {
      name: t("PRERAK_NAME"),
      selector: (row) => <PrerakName {...row} />,
      sortable: true,
      wrap: true,
    },
    {
      name: t("PRERAK_STATUS"),
      selector: (row) => <PrerakStatus {...row} />,
      wrap: true,
    },
    {
      name: t("LEARNER_COUNT"),
      selector: (row) => row.learner_total_count,
      sortable: true,
    },
    {
      name: t("LEARNER_DISTRIBUTION"),
      selector: (row) => <StatusCount status_count={row.status_count} />,
      sortable: true,
      wrap: true,
    },
    {
      name: t("ACTION"),
      selector: (row) => <Action {...row} t={t} navigate={navigate} />,
    },
  ];

  return (
    <VStack>
      <ScrollView horizontal mb="2">
        <AdminTypo.H1 px="5">{t("LEARNER_DISTRIBUTION")}</AdminTypo.H1>
        <HStack pb="2">
          {beneficiaryStatus.map((item) => (
            <Text key={item.value} mx={2}>
              <BeneficiaryStatus status={item.value} />
            </Text>
          ))}
        </HStack>
      </ScrollView>
      <DataTable
        customStyles={CustomStyles}
        columns={columns}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={(e) => setFilter({ ...filter, limit: e })}
        onChangePage={(e) => setFilter({ ...filter, page: e })}
        dense
      />
    </VStack>
  );
};

Table.propTypes = {
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  paginationTotalRows: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Table;
