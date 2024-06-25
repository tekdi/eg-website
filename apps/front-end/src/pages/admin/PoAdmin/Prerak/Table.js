import {
  AdminTypo,
  tableCustomStyles,
  enumRegistryService,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, VStack, Pressable } from "native-base";
import React, { memo, useCallback, useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const pagination = [10, 15, 25, 50, 100];

const columns = (t, navigate) => [
  {
    name: t("PRERAK_ID"),
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
    name: t("DISTRICT"),
    selector: (row) => row?.district || "-",
    compact: true,
  },
  {
    name: t("BLOCK"),
    selector: (row) => row?.block || "-",
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
      <Pressable onPress={() => navigate(`/admin/facilitator/${row?.id}`)}>
        <ChipStatus py="0.5" px="1" status={row?.program_faciltators?.status} />
      </Pressable>
    ),
    wrap: true,
    attr: "status",
    width: "150px",
    compact: true,
  },
  {
    name: (
      <VStack display="inline-block" width={"100%"}>
        {t("OKYC_VERIFICATION")}
      </VStack>
    ),
    wrap: true,
    selector: (row) => {
      return row?.aadhar_verified === "okyc_ip_verified"
        ? t("OKYC_IP_VERIFIED")
        : row?.aadhar_verified === "yes"
        ? t("YES")
        : t("NO");
    },
    compact: true,
    minWidth: "50px",
  },
  {
    minWidth: "140px",
    name: t("ACTION"),
    selector: (row) => (
      <AdminTypo.Secondarybutton
        my="3"
        onPress={() => {
          navigate(`/poadmin/facilitators/${row?.id}`);
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
  const [selectedData, setSelectedData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const result = await enumRegistryService.statuswiseCount();
      setSelectedData(result);
    };
    getData();
  }, []);

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/poadmin/facilitators/${row?.id}`);
    },
    [navigate]
  );

  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  return (
    <VStack>
      <VStack p={2} pt="0">
        <AdminTypo.H5 underline bold color="blueText.400">
          {filter?.status === undefined || filter?.status?.length === 0 ? (
            t("ALL") + `(${paginationTotalRows})`
          ) : filter?.status?.[0] === "all" ? (
            <AdminTypo.H4 bold>
              {t("ALL") + `(${paginationTotalRows})`}
            </AdminTypo.H4>
          ) : (
            filter?.status
              ?.filter((item) => item)
              .map(
                (item) =>
                  t(item).toLowerCase() +
                  `(${
                    selectedData
                      ? selectedData?.find((e) => item === e.status)?.count
                      : 0
                  })`
              )
              .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
              .join(" , ")
          )}
        </AdminTypo.H5>
      </VStack>
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

Table.PropTypes = {
  filter: PropTypes.any,
  setFilter: PropTypes.func,
  paginationTotalRows: PropTypes.any,
  data: PropTypes.any,
  loading: PropTypes.bool,
  height: PropTypes.any,
};
export default memo(Table);
