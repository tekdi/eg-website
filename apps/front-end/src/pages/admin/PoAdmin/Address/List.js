import {
  AdminTypo,
  IconByName,
  PoAdminLayout,
  eventService,
} from "@shiksha/common-lib";
import { Button, HStack, Input, VStack, Menu } from "native-base";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
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

const columns = (t, navigate) => [
  {
    name: t("ID"),
    selector: (row) => row?.id,
    sortable: true,
    sortField: "id",
    width: "100px",
    compact: true,
  },
  {
    name: t("STATE_NAME"),
    selector: (row) => row?.state_name || "-",
    sortable: true,
    sortField: "state_name",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("STATE_CD"),
    selector: (row) => row?.state_cd || "-",
    sortable: true,
    sortField: "state_cd",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("DISTRICT_NAME"),
    selector: (row) => row?.district_name || "-",
    wrap: true,
    left: true,
    compact: true,
    sortable: true,
    sortField: "district_name",
  },
  {
    name: t("DISTRICT_CD"),
    selector: (row) => row?.district_cd || "-",
    wrap: true,
    left: true,
    compact: true,
    sortable: true,
    sortField: "district_cd",
  },

  {
    name: t("UDISE_BLOCK_CODE"),
    selector: (row) => row?.udise_block_code || "-",
    attr: "udise_block_code",
    wrap: true,
    compact: true,
    sortable: true,
    sortField: "udise_block_code",
  },
  {
    name: t("BLOCK_NAME"),
    selector: (row) => row?.block_name || "-",
    sortable: true,
    sortField: "block_name",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("GRAMPANCHAYAT_CD"),
    selector: (row) => row?.grampanchayat_cd || "-",
    sortable: true,
    sortField: "grampanchayat_cd",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("GRAMPANCHAYAT_NAME"),
    selector: (row) => row?.grampanchayat_name || "-",
    sortable: true,
    sortField: "grampanchayat_name",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("VILLAGE_WARD_CD"),
    selector: (row) => row?.vill_ward_cd || "-",
    sortable: true,
    sortField: "vill_ward_cd",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("VILLAGE_WARD_NAME"),
    selector: (row) => row?.village_ward_name || "-",
    sortable: true,
    sortField: "village_ward_name",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("SCHOOL_NAME"),
    selector: (row) => row?.school_name || "-",
    sortable: true,
    sortField: "school_name",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("UDISE_SCH_CODE"),
    selector: (row) => row?.udise_sch_code || "-",
    sortable: true,
    sortField: "udise_sch_code",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("SCH_CATEGORY_ID"),
    selector: (row) => row?.sch_category_id || "-",
    sortable: true,
    sortField: "sch_category_id",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("SCH_MANAGEMENT_ID"),
    selector: (row) => row?.nsch_mgmt_idame || "-",
    sortable: true,
    sortField: "sch_mgmt_id ",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("OPEN_SCHOOL_TYPE"),
    selector: (row) => row?.open_school_type || "-",
    sortable: true,
    sortField: "open_school_type",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("NODAL_CODE"),
    selector: (row) => row?.nodal_code || "-",
    sortable: true,
    sortField: "nodal_code",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
];
const pagination = [10, 15, 25, 50, 100];

export default function List() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [paginationTotalRows, setPaginationTotalRows] = useState();
  const [address, setAddress] = useState();
  const [programList, setProgramList] = useState();
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const navigate = useNavigate();
  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  useEffect(
    (e) => {
      const fetch = async () => {
        const data = await eventService.getAllAddressList({
          order_by: { id: "asc" },
          ...filter,
        });
        setAddress(data?.data);
        setPaginationTotalRows(data?.totalCount ? data?.totalCount : 0);
        setLoading(false);
      };
      fetch();
    },
    [filter]
  );

  const handleSort = (column, sort) => {
    if (column?.sortField) {
      setFilter({
        ...filter,
        order_by: { [column?.sortField]: sort },
      });
    }
  };
  const handleSearch = (e) => {
    console.log("e", e);
    setFilter((item) => ({
      ...item,
      filters: { state_name: e.nativeEvent.text },
      page: 1,
    }));
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/poadmin/address/${row?.id}`);
    },
    [navigate]
  );

  return (
    <PoAdminLayout {...{ loading }}>
      <VStack p="4" space={4}>
        <HStack
          space={[0, 0, "2"]}
          p="2"
          justifyContent="space-between"
          flexWrap="wrap"
          gridGap="2"
        >
          <HStack
            justifyContent={"space-between"}
            alignItems="center"
            space="2"
          >
            <HStack
              justifyContent="space-between"
              alignItems="center"
              space="2"
            >
              <IconByName name="GroupLineIcon" size="md" />
              <AdminTypo.H4 bold> {t("ALL_ADDRESSES")}</AdminTypo.H4>
            </HStack>
          </HStack>
          <Input
            size={"xs"}
            minH="40px"
            maxH="40px"
            onScroll={false}
            InputLeftElement={
              <IconByName
                color="coolGray.500"
                name="SearchLineIcon"
                isDisabled
                pl="2"
              />
            }
            placeholder={t("SEARCH")}
            variant="outline"
            onChange={debouncedHandleSearch}
          />
          {/* <Menu
            w="160"
            trigger={(triggerProps) => (
              <Button
                {...triggerProps}
                background="white"
                shadow="RedOutlineShadow"
                borderRadius="100px"
                borderColor="textMaroonColor.400"
                borderWidth="1"
                py="6px"
                rounded="full"
                _text={{
                  color: "textGreyColor.900",
                  fontSize: "14px",
                }}
                rightIcon={
                  <IconByName
                    color="black"
                    _icon={{ size: "18px" }}
                    name="AddLineIcon"
                  />
                }
                onPress={(e) => navigate("/poadmin/address/create")}
              >
                {t("ADD_AN_ADDRESS")}
              </Button>
            )}
          ></Menu> */}
        </HStack>
        <DataTable
          customStyles={{
            ...CustomStyles,
            rows: {
              style: {
                minHeight: "50px", // override the row height
                cursor: "pointer",
              },
            },
            pagination: { style: { margin: "5px 0 5px 0" } },
          }}
          columns={columnsMemoized}
          data={address || []}
          progressPending={loading}
          pagination
          paginationRowsPerPageOptions={pagination}
          paginationServer
          paginationTotalRows={paginationTotalRows}
          paginationDefaultPage={filter?.page || 1}
          highlightOnHover
          onSort={handleSort}
          sortServer
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
    </PoAdminLayout>
  );
}
