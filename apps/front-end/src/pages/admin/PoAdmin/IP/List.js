import {
  AdminTypo,
  IconByName,
  PoAdminLayout,
  cohortService,
  getSelectedProgramId,
  organisationService,
  setSelectedProgramId,
} from "@shiksha/common-lib";
import { Button, HStack, Input, Select, VStack, Menu } from "native-base";
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
    name: t("IP_ID"),
    selector: (row) => row?.id,
    sortable: true,
    sortField: "id",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("IP_NAME"),
    selector: (row) => row?.name,
    sortable: true,
    sortField: "name",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("ORGANISATION_EMAIL"),
    selector: (row) => row?.email_id || "-",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("LEARNER_TARGET"),
    selector: (row) => row?.program_organisations?.[0]?.learner_target || "-",
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
  // {
  //   minWidth: "140px",
  //   name: t("ACTION"),
  //   selector: (row) => (
  //     <AdminTypo.Secondarybutton
  //       background="white"
  //       px="3"
  //       my="2"
  //       h="8"
  //       onPress={() => {
  //         navigate(`/poadmin/ips/${row?.id}`);
  //       }}
  //     >
  //       {t("VIEW")}
  //     </AdminTypo.Secondarybutton>
  //   ),
  //   center: true,
  // },
];
const pagination = [10, 15, 25, 50, 100];

export default function List() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [paginationTotalRows, setPaginationTotalRows] = useState();
  const [organisations, setOrganisations] = useState();
  const [programList, setProgramList] = useState();
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
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
        setPaginationTotalRows(data?.totalCount ? data?.totalCount : 0);
        setLoading(false);
      };
      fetch();
    },
    [filter]
  );

  useEffect(async () => {
    const data = await cohortService.getProgramList();
    setProgramList(data?.data);
    const localData = await getSelectedProgramId();
    if (localData === null) {
      const obj = data?.data?.[0];
      const defaultData = {
        program_id: obj?.id,
        name: obj?.name,
        state_name: obj?.state?.state_name,
      };
      setSelectedProgramId(defaultData);
      setFilter({ ...filter, program_id: obj?.id });
    } else {
      setFilter({ ...filter, program_id: localData?.program_id });
    }
  }, []);

  const handleSort = (column, sort) => {
    if (column?.sortField) {
      setFilter({
        ...filter,
        order_by: { ...(filter?.order_by || {}), [column?.sortField]: sort },
      });
    }
  };

  const handleSearch = (e) => {
    setFilter((item) => ({ ...item, search: e.nativeEvent.text, page: 1 }));
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/poadmin/ips/${row?.id}`);
    },
    [navigate]
  );

  const handleProgramChange = async (selectedItem) => {
    const data = programList.find((e) => e.id == selectedItem);
    await setSelectedProgramId({
      program_id: data?.id,
      program_name: data?.name,
      state_name: data?.state?.state_name,
    });
    setFilter({ ...filter, program_id: selectedItem });
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
            onChange={debouncedHandleSearch}
          />
          <Menu
            w="160"
            trigger={(triggerProps) => (
              <Button
                {...triggerProps}
                borderRadius="100px"
                background="Darkmaroonprimarybutton.400"
                shadow="RedFillShadow"
                rounded="full"
                py="10px"
                color="white"
                _text={{
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {t("ADD_A_IP")}
              </Button>
            )}
          >
            <Menu.Item onPress={(e) => navigate("/poadmin/ips/create")}>
              {t("ADD_NEW_IP_USER")}
            </Menu.Item>
            <Menu.Item onPress={(e) => navigate("/poadmin/ips/exist/create")}>
              {t("EXISTING_IP_USER")}
            </Menu.Item>
          </Menu>
          <Select
            minH="40px"
            maxH="40px"
            selectedValue={`${filter?.program_id}`}
            minWidth="200"
            accessibilityLabel="Choose Service"
            placeholder={t("SELECT")}
            mt={1}
            onValueChange={handleProgramChange}
          >
            {programList?.map((item) => (
              <Select.Item
                key={item?.id}
                label={item?.state?.state_name}
                value={`${item?.id}`}
              />
            ))}
          </Select>
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
          onRowClicked={handleRowClick}
        />
      </VStack>
    </PoAdminLayout>
  );
}
