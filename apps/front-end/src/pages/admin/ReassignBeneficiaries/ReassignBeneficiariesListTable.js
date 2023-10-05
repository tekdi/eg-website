import { AdminTypo } from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import { HStack, VStack, ScrollView, Text } from "native-base";

import React from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PrerakName = (row) => {
  return (
    <VStack alignItems={"center"} space="2">
      <Text
        color={
          ["rusticate", "rejected", "quit"].includes(row?.status)
            ? "textMaroonColor.500"
            : "textGreyColor.100"
        }
        fontSize={"13px"}
        fontWeight={"bold"}
      >
        {row?.first_name + " "}
        {row?.last_name ? row?.last_name : ""}
      </Text>
    </VStack>
  );
};

const PrerakStatus = (row) => {
  return (
    <VStack alignItems={"center"} space="2">
      <Text
        color={
          ["rusticate", "rejected", "quit"].includes(row?.status)
            ? "textMaroonColor.500"
            : "textGreyColor.100"
        }
        fontSize={"13px"}
        fontWeight={"bold"}
      >
        {row?.status}
      </Text>
    </VStack>
  );
};

const statusCount = (row) => {
  return row?.status_count?.map((item) => {
    return (
      <Text key={item} mx={2}>
        <ChipStatus statusCount={item?.status}>
          {item?.count === 0 ? "0" : item?.count}
        </ChipStatus>
      </Text>
    );
  });
};

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
      size: "16px",
      justifyContent: "center", // override the alignment of columns
    },
  },
  cells: {
    style: {
      color: "#616161",
      size: "19px",
      justifyContent: "center", // override the alignment of columns
    },
  },
};

const action = (row, t, navigate) => {
  return (
    <AdminTypo.Secondarybutton
      my="3"
      onPress={() => {
        navigate(`/admin/learners/reassignList/${row?.id}`);
      }}
    >
      {t("VIEW")}
    </AdminTypo.Secondarybutton>
  );
};

// Table component
function Table({
  facilitator,
  paginationTotalRows,
  loading,
  data,
  setFilter,
  filter,
}) {
  const { t } = useTranslation();

  const beneficiaryStatus = [
    {
      title: "BENEFICIARY_STATUS_IDENTIFIED",
      value: "identified",
    },
    {
      title: "BENEFICIARY_STATUS_READY_TO_ENROLL",
      value: "ready_to_enroll",
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

  const columns = (e) => [
    {
      name: t("PRERAK_NAME"),
      selector: (row) => PrerakName(row),
      sortable: true,
      attr: "aadhaar",
      wrap: true,
    },
    {
      name: t("PRERAK_STATUS"),
      selector: (row) => PrerakStatus(row),
      sortable: true,
      attr: "status",
      wrap: true,
    },
    {
      name: t("LEARNER_COUNT"),
      selector: (row) => row?.learner_total_count,
      sortable: true,
      attr: "count",
    },
    {
      name: t("LEARNER_DISTRIBUTION"),
      selector: (row) => statusCount(row),
      sortable: true,
      attr: "count",
    },
  ];
  const navigate = useNavigate();

  return (
    <VStack>
      <ScrollView horizontal={true} mb="2">
        <AdminTypo.H1 px="5">{t("LEARNER_DISTRIBUTION")} : </AdminTypo.H1>
        <HStack pb="2">
          {beneficiaryStatus?.map((item) => {
            return (
              <Text key={item} mx={2}>
                <ChipStatus status={item?.value} />
              </Text>
            );
          })}
        </HStack>
      </ScrollView>
      <DataTable
        customStyles={CustomStyles}
        columns={[
          ...columns(),
          {
            name: t("ACTION"),
            selector: (row) => action(row, t, navigate),
          },
        ]}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={(e) => {
          setFilter({ ...filter, limit: e });
        }}
        onChangePage={(e) => {
          setFilter({ ...filter, page: e });
        }}
      />
    </VStack>
  );
}

export default Table;
