import {
  IconByName,
  AdminTypo,
  tableCustomStyles,
  enumRegistryService,
} from "@shiksha/common-lib";
import { HStack, VStack, Pressable, Button, Menu } from "native-base";
import { ChipStatus } from "./ChipStatus";
import React, { memo, useCallback, useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const dropDown = (triggerProps, t) => {
  return (
    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
      <IconByName name="ArrowDownSLineIcon" isDisabled={true} px="1.5" />
    </Pressable>
  );
};

const pagination = [10, 15, 25, 50, 100];

const columns = (t, navigate) => [
  {
    name: t("VOLUNTEER_ID"),
    selector: (row) => row?.id,
    sortable: true,
    attr: "id",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("NAME"),
    selector: (row) => (
      <HStack display="inline-block" width={"100%"}>
        <Pressable
          style={{ flexDirection: "row", justifyContent: "space-between" }}
          onPress={() => navigate(`/admin/facilitator/${row?.id}`)}
        >
          {/* <HStack alignItems={"center"}> */}
          {/* {row?.profile_photo_1?.name ? (
                <ImageView
                  urlObject={row?.profile_photo_1}
                  alt="Alternate Text"
                  width={"35px"}
                  height={"35px"}
                />
              ) : (
                <IconByName
                  isDisabled
                  name="AccountCircleLineIcon"
                  color="gray.300"
                  _icon={{ size: "35" }}
                />
              )} */}
          <AdminTypo.H6 bold word-wrap="break-word">
            {`${row?.first_name} ${row?.last_name || ""}`}
          </AdminTypo.H6>
          {/* </HStack> */}
        </Pressable>
      </HStack>
    ),
    attr: "name",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("STATE"),
    selector: (row) => row?.state || "-",
    compact: true,
  },
  {
    name: t("EMAIL"),
    selector: (row) => row?.email_id || "-",
    compact: true,
  },

  {
    name: t("MOBILE_NUMBER"),
    selector: (row) => row?.mobile,
    attr: "mobile",
    wrap: true,
    compact: true,
  },
  {
    name: t("STATUS"),
    selector: (row) => (
      <ChipStatus py="0.5" px="1" status={row?.program_faciltators?.status} />
    ),
    wrap: true,
    attr: "status",
    width: "150px",
    compact: true,
  },

  {
    minWidth: "140px",
    name: t("ACTION"),
    selector: (row) => (
      <AdminTypo.Secondarybutton
        h="6"
        my="3"
        onPress={() => {
          navigate(`/admin-volunteer/volunteers/${row?.id}`);
        }}
      >
        {t("VIEW")}
      </AdminTypo.Secondarybutton>
    ),
    center: true,
  },
];

// Table component
function Table({
  filter,
  setFilter,
  paginationTotalRows,
  data,
  loading,
  height,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/admin/facilitator/${row?.id}`);
    },
    [navigate]
  );

  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  return (
    <VStack p={"4"}>
      <DataTable
        fixedHeader={true}
        fixedHeaderScrollHeight={`${height - 160}px`}
        customStyles={{
          ...tableCustomStyles,
          rows: {
            style: {
              minHeight: "20px", // override the row height
              cursor: "pointer",
            },
          },
          pagination: { style: { margin: "5px 0 5px 0" } },
        }}
        columns={columnsMemoized}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={pagination}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        paginationDefaultPage={filter?.page || 1}
        highlightOnHover
        onChangeRowsPerPage={useCallback(
          (e) => {
            setFilter({ ...filter, limit: e, page: 1 });
          },
          [setFilter, filter]
        )}
        onChangePage={useCallback(
          (e) => {
            setFilter({ ...filter, page: e });
          },
          [setFilter, filter]
        )}
        onRowClicked={handleRowClick}
      />
    </VStack>
  );
}

export default memo(Table);
