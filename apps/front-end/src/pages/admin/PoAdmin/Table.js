import { IconByName, AdminTypo, tableCustomStyles } from "@shiksha/common-lib";
import { HStack, VStack, Image } from "native-base";
import PropTypes from "prop-types";
import React from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const action = (row, t, navigate) => {
  return (
    <AdminTypo.Secondarybutton
      my="3"
      onPress={() => {
        navigate(`/poadmin/learners/duplicates/${row?.aadhar_no}`);
      }}
    >
      {t("VIEW")}
    </AdminTypo.Secondarybutton>
  );
};

// Table component
function Table({
  paginationTotalRows,
  loading,
  duplicateData,
  setFilter,
  filter,
}) {
  const { t } = useTranslation();
  const columns = (e) => [
    {
      name: t("AADHAAR_NUMBER"),
      selector: (row) => row?.aadhar_no,
      sortable: true,
      attr: "aadhaar",
      wrap: true,
    },
    {
      name: t("COUNT"),
      selector: (row) => row?.count,
      sortable: true,
      attr: "count",
    },
  ];
  const navigate = useNavigate();

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

          <AdminTypo.H1 px="5">
            {t("All_AG_LEARNERS")} {t("DUPLICATE_LIST")}
          </AdminTypo.H1>
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
      <DataTable
        customStyles={tableCustomStyles}
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
          setFilter({ ...filter, limit: e, page: 1 });
        }}
        onChangePage={(e) => {
          setFilter({ ...filter, page: e });
        }}
        dense
      />
    </VStack>
  );
}

Table.PropTypes = {
  filter: PropTypes.any,
  setFilter: PropTypes.func,
  paginationTotalRows: PropTypes.any,
  duplicateData: PropTypes.any,
  loading: PropTypes.bool,
};

export default Table;
