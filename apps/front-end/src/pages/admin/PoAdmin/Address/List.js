import {
  AdminTypo,
  IconByName,
  PoAdminLayout,
  eventService,
} from "@shiksha/common-lib";
import { HStack, Input, VStack } from "native-base";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CustomStyles } from "../CommonStyles";
import { columns } from "./Column";

const pagination = [10, 15, 25, 50, 100];

export default function List() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [paginationTotalRows, setPaginationTotalRows] = useState();
  const [address, setAddress] = useState();
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const navigate = useNavigate();
  const columnsMemoized = useMemo(() => columns(t), [t, navigate]);

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
    [filter],
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
    [navigate],
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
            [setFilter, filter],
          )}
          onChangePage={useCallback(
            (e) => {
              setFilter({ ...filter, page: e });
            },
            [setFilter, filter],
          )}
          onRowClicked={handleRowClick}
        />
      </VStack>
    </PoAdminLayout>
  );
}
