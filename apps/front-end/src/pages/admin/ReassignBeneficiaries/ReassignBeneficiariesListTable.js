import {
  IconByName,
  AdminTypo,
  enumRegistryService,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import { HStack, VStack, Image, ScrollView, Text } from "native-base";

import React from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
        navigate(`/admin/learners/reassignList/learnerList/${row?.aadhar_no}`);
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
  duplicateData,
  setFilter,
  filter,
}) {
  const { t } = useTranslation();
  const [beneficiaryStatus, setBeneficiaryStatus] = React.useState();

  console.log("aadhar_no");

  const columns = (e) => [
    {
      name: t("PRERAK_NAME"),
      selector: (row) => row?.aadhar_no,
      sortable: true,
      attr: "aadhaar",
      wrap: true,
    },
    {
      name: t("LEARNER_COUNT"),
      selector: (row) => row?.count,
      sortable: true,
      attr: "count",
    },
    {
      name: t("LEARNER_DISTRIBUTION"),
      selector: (row) => row?.count,
      sortable: true,
      attr: "count",
    },
  ];
  const navigate = useNavigate();

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBeneficiaryStatus(result?.data?.BENEFICIARY_STATUS);
  }, []);

  return (
    <VStack>
      <HStack my="1" mb="3" justifyContent="space-between">
        <HStack justifyContent="space-between" alignItems="center">
          <IconByName
            name="Home4LineIcon"
            alt=""
            size={"sm"}
            resizeMode="contain"
          />
          <AdminTypo.H1 color="Activatedcolor.400">
            {t("All_AG_LEARNERS")}
          </AdminTypo.H1>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate("/admin/learners")}
          />
          <AdminTypo.H1 px="5">{t("REASSIGN_LEARNERS")}</AdminTypo.H1>
          <Image
            source={{
              uri: "/box.svg",
            }}
            alt=""
            size={"28px"}
            resizeMode="contain"
          />
        </HStack>
      </HStack>

      <ScrollView horizontal={true} mb="2">
        <AdminTypo.H1 px="5">{t("LEARNER_DISTRIBUTION")} : </AdminTypo.H1>
        <HStack pb="2">
          {beneficiaryStatus?.map((item) => {
            return (
              <Text key={item} cursor={"pointer"} mx={2}>
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
        data={duplicateData}
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
