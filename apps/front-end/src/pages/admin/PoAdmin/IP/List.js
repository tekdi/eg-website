import {
  AdminTypo,
  IconByName,
  PoAdminLayout,
  organisationService,
  tableCustomStyles,
} from "@shiksha/common-lib";
import { HStack, Input, VStack } from "native-base";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const columns = (t, navigate) => [
  {
    name: t("IP_ID"),
    selector: (row) => row?.id,
    sortable: true,
    sortField: "id",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("NAME"),
    selector: (row) => row?.name,
    sortable: true,
    sortField: "name",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },

  {
    name: t("MOBILE_NUMBER"),
    selector: (row) => row?.mobile || "-",
    attr: "mobile",
    wrap: true,
    compact: true,
  },
  {
    name: t("CONTACT_PERSON"),
    selector: (row) => row?.contact_person || "-",
    compact: true,
  },
  {
    minWidth: "140px",
    name: t("ACTION"),
    selector: (row) => (
      <AdminTypo.Secondarybutton
        background="white"
        px="1.5"
        my="1"
        h="6"
        onPress={() => {
          navigate(`/poadmin/ips/${row?.id}`);
        }}
      >
        {t("VIEW")}
      </AdminTypo.Secondarybutton>
    ),
    center: true,
  },
];
const pagination = [10, 15, 25, 50, 100];

export default function List() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [paginationTotalRows, setPaginationTotalRows] = useState();
  const [organisations, setOrganisations] = useState();
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const ref = useRef(null);

  const navigate = useNavigate();

  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  useEffect(
    (e) => {
      const fetch = async () => {
        const data = await organisationService.getList({
          order_by: { id: "asc" },
          ...filter,
        });
        setOrganisations(data.data);
        setPaginationTotalRows(
          data?.data?.totalCount ? data?.data?.totalCount : 0
        );
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
        order_by: { ...(filter?.order_by || {}), [column?.sortField]: sort },
      });
    }
  };

  return (
    <PoAdminLayout {...{ loading }}>
      <VStack p="4" space={4}>
        <HStack
          space={[0, 0, "2"]}
          p="2"
          justifyContent="space-between"
          flexWrap="wrap"
          gridGap="2"
          ref={ref}
        >
          <HStack
            justifyContent={"space-between"}
            space={"4"}
            alignItems="center"
          >
            <HStack
              justifyContent="space-between"
              alignItems="center"
              space="2"
            >
              <IconByName name="GroupLineIcon" size="md" />
              <AdminTypo.H4 bold> {t("ALL_IPS")}</AdminTypo.H4>
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
            placeholder={t("SEARCH_BY_IP_NAME")}
            variant="outline"
            //   onChange={debouncedHandleSearch}
          />
        </HStack>
        <DataTable
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
          data={organisations || []}
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
        />
      </VStack>
    </PoAdminLayout>
  );
}
