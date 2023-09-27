import { IconByName, AdminTypo } from "@shiksha/common-lib";
import { HStack, VStack, Image, Text } from "native-base";

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
        navigate(`/admin/learners/duplicates/${row?.aadhar_no}`);
      }}
    >
      {t("VIEW")}
    </AdminTypo.Secondarybutton>
  );
};

const District = (row) => {
  const districtsString = row?.districts;
  const districtsArray = districtsString
    .split(",")
    .map((districts) => districts.trim());
  const uniqueDistrictsArray = [...new Set(districtsArray)];
  return (
    <VStack alignItems={"center"} space="2">
      {uniqueDistrictsArray.map((item) => {
        return (
          <AdminTypo.TableText key={item}>{item || ""}</AdminTypo.TableText>
        );
      })}
    </VStack>
  );
};

const Block = (row) => {
  const blockString = row?.block;
  const blockArray = blockString.split(",").map((block) => block.trim());
  const uniqueblockArray = [...new Set(blockArray)];
  return (
    <VStack alignItems={"center"} space="2">
      {uniqueblockArray.map((item) => {
        return (
          <AdminTypo.TableText key={item}>{item || ""}</AdminTypo.TableText>
        );
      })}
    </VStack>
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
  const columns = (e) => [
    {
      name: t("AADHAAR_NUMBER"),
      selector: (row) => row?.aadhar_no,
      sortable: true,
      attr: "aadhaar",
      wrap: true,
    },
    {
      name: t("DISTRICT"),
      selector: (row) => District(row),

      attr: "name",
      wrap: true,
    },
    {
      name: t("BLOCK"),
      selector: (row) => Block(row),

      attr: "name",
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
          <AdminTypo.H1 color="Activatedcolor.400">
            {t("All_AG_LEARNERS")}
          </AdminTypo.H1>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate("/admin/learners")}
          />
          <AdminTypo.H1 px="5">{t("DUPLICATE_LIST")}</AdminTypo.H1>
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
