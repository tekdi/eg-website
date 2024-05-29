import React, { useEffect, useRef, useCallback, useState } from "react";
import PropTypes from "prop-types";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MultiCheck } from "../../../../component/BaseInput";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { CampChipStatus } from "component/Chip";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  HStack,
  ScrollView,
  VStack,
  Input,
  Pressable,
} from "native-base";
import {
  PoAdminLayout,
  AdminTypo,
  IconByName,
  campService,
  useWindowSize,
  geolocationRegistryService,
  enumRegistryService,
  GetEnumValue,
  facilitatorRegistryService,
  tableCustomStyles,
  setFilterLocalStorage,
  getFilterLocalStorage,
  getSelectedProgramId,
} from "@shiksha/common-lib";
import SelectProgramOrganisation from "../IP/component/SelectProgramOrganisation";

const filterName = "camp_filter";

const columns = (t, navigate) => [
  {
    name: t("CAMP_ID"),
    selector: (row) => row?.id,
    sortable: true,
    attr: "CAMP_ID",
  },
  {
    name: t("PRERAK_ID"),
    selector: (row) => row?.faciltator?.user?.faciltator_id || " - ",
    sortable: true,
    attr: "PRERAK_ID",
  },
  {
    name: t("PRERAK"),
    selector: (row) =>
      row?.faciltator?.user?.first_name +
      " " +
      row?.faciltator?.user?.last_name,
    sortable: true,
    attr: "PRERAK",
  },
  {
    name: t("DISTRICT"),
    selector: (row) =>
      row?.properties?.district ? row?.properties?.district : "-",
    sortable: true,
    attr: "DISTRICT",
  },
  {
    name: t("BLOCK"),
    selector: (row) => (row?.properties?.block ? row?.properties?.block : "-"),
    sortable: true,
    attr: "BLOCK",
  },
  {
    name: t("CAMP_STATUS"),
    selector: (row) => (
      <Pressable onPress={() => navigate(`/poadmin/camps/${row.id}`)}>
        <CampChipStatus status={row?.group?.status} />
      </Pressable>
    ),
    sortable: true,
    wrap: true,
    attr: "CAMP_STATUS",
  },
  {
    name: t("ACTION"),
    selector: (row) => (
      <AdminTypo.Secondarybutton
        my="3"
        onPress={() => navigate(`/poadmin/camps/${row.id}`)}
      >
        {t("VIEW")}
      </AdminTypo.Secondarybutton>
    ),
    sortable: true,
    attr: "count",
  },
];

function CampList({ userTokenInfo }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({ limit: 10 });
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const ref = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [urlFilterApply, setUrlFilterApply] = useState(false);
  const [campFilterStatus, setCampFilterStatus] = useState([]);
  const [enumOptions, setEnumOptions] = useState({});
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [cohortValue, setCohortValue] = useState();

  useEffect(() => {
    const urlFilter = getFilterLocalStorage(filterName);
    setFilter({ ...filter, ...urlFilter });
    setUrlFilterApply(true);
  }, []);

  useEffect(async () => {
    const result = await enumRegistryService.getStatuswiseCount();
    setCampFilterStatus(result);
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, []);

  useEffect(async () => {
    let newFilter = filter;
    if (urlFilterApply) {
      if (filter?.status === "all") {
        const { status, ...dataFilter } = filter || {};
        newFilter = dataFilter;
      }
      const qData = await campService.getCampList(newFilter);
      setData(qData?.camps);
      setPaginationTotalRows(qData?.totalCount ? qData?.totalCount : 0);
    }
  }, [filter, localStorage.getItem("program"), localStorage.getItem("org_id")]);

  const handleRowClick = (row) => {
    navigate(`/poadmin/camps/${row.id}`);
  };
  return (
    <PoAdminLayout getRefAppBar={(e) => setRefAppBar(e)}>
      <HStack
        space={[0, 0, "4"]}
        p="2"
        my="1"
        mb="3"
        justifyContent="space-between"
        flexWrap="wrap"
        gridGap="2"
      >
        <HStack
          justifyContent={"space-between"}
          space={"6"}
          alignItems="center"
        >
          <HStack justifyContent="space-between" alignItems="center" space={2}>
            <IconByName name="GroupLineIcon" size="md" />
            <AdminTypo.H4 bold>{t("ALL_CAMPS")}</AdminTypo.H4>
          </HStack>
        </HStack>
        <SelectProgramOrganisation getValue={(e) => setCohortValue(e)} />
      </HStack>
      <HStack>
        <Box
          flex={[2, 2, 1]}
          style={{ borderRightColor: "dividerColor", borderRightWidth: "2px" }}
        >
          <HStack ref={ref}></HStack>
          <ScrollView
            maxH={
              Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)
            }
            temp={Width}
          >
            {urlFilterApply && <Filter {...{ filter, setFilter }} />}
          </ScrollView>
        </Box>

        <Box flex={[5, 5, 4]}>
          <ScrollView>
            <HStack pb="2">
              {Array?.isArray(campFilterStatus) &&
                campFilterStatus?.map((item) => {
                  return (
                    <AdminTypo.H6
                      key={"table"}
                      color={
                        filter?.status == t(item?.status)
                          ? "textMaroonColor.600"
                          : ""
                      }
                      bold={filter?.status == t(item?.status)}
                      cursor={"pointer"}
                      mx={3}
                      onPress={() => {
                        setFilter({ ...filter, status: item?.status, page: 1 });
                      }}
                    >
                      {item.status === "all" ? (
                        <AdminTypo.H5 bold color={"textMaroonColor.600"}>
                          {`${t("ALL")}(${paginationTotalRows})`}
                        </AdminTypo.H5>
                      ) : (
                        <GetEnumValue
                          t={t}
                          enumType={"GROUPS_STATUS"}
                          enumOptionValue={item?.status}
                          enumApiData={enumOptions}
                        />
                      )}
                      {filter?.status != "all" &&
                      filter?.status == t(item?.status)
                        ? `(${paginationTotalRows})` + " "
                        : " "}
                    </AdminTypo.H6>
                  );
                })}
            </HStack>
            <Box roundedBottom={"2xl"}>
              <DataTable
                filter={filter}
                setFilter={(e) => {
                  setFilter(e);
                  setFilterLocalStorage(filterName, e);
                }}
                customStyles={tableCustomStyles}
                columns={[...columns(t, navigate)]}
                persistTableHead
                facilitator={userTokenInfo?.authUser}
                pagination
                paginationTotalRows={paginationTotalRows}
                paginationDefaultPage={filter?.page || 1}
                paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
                defaultSortAsc
                paginationServer
                data={data}
                onChangeRowsPerPage={React.useCallback(
                  (e) => {
                    setFilter({ ...filter, limit: e, page: 1 });
                  },
                  [setFilter, filter]
                )}
                onChangePage={React.useCallback(
                  (e) => {
                    setFilter({ ...filter, page: e });
                  },
                  [setFilter, filter]
                )}
                onRowClicked={handleRowClick}
                dense
                highlightOnHover
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </PoAdminLayout>
  );
}

CampList.propTypes = {
  userTokenInfo: PropTypes.any,
  _layout: PropTypes.any,
};

export const Filter = ({ filter, setFilter }) => {
  const { t } = useTranslation();
  const [getDistrictsAll, setGetDistrictsAll] = useState();
  const [getBlocksAll, setGetBlocksAll] = useState();
  const [facilitatorFilter, setFacilitatorFilter] = useState({});
  const [facilitator, setFacilitator] = useState([]);

  const setFilterObject = (data) => {
    const { facilitator: newFacilitator, ...otherData } = data;
    const facilitator =
      newFacilitator?.length > 0 ? { facilitator: newFacilitator } : {};

    if (data?.district) {
      const { district, block } = data;
      setFacilitatorFilter({
        ...facilitatorFilter,
        district,
        block,
      });
    }
    setFilter({ ...otherData, ...facilitator });
    setFilterLocalStorage(filterName, data);
  };

  const handleSearch = (e) => {
    setFacilitatorFilter({
      ...facilitatorFilter,
      search: e.nativeEvent.text,
      page: 1,
    });
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const schema = {
    type: "object",
    properties: {
      district: {
        type: "array",
        title: t("DISTRICT"),
        grid: 1,
        _hstack: { maxH: 135, overflowY: "scroll" },
        items: {
          type: "string",
          enum: getDistrictsAll?.map((item, i) => item?.district_name),
        },
        uniqueItems: true,
      },
      block: {
        type: "array",
        title: t("BLOCKS"),
        grid: 1,
        _hstack: {
          maxH: 130,
          overflowY: "scroll",
        },
        items: {
          type: "string",
          enumNames: getBlocksAll?.map((item, i) => {
            return item?.block_name;
          }),
          enum: getBlocksAll?.map((item, i) => {
            return item?.block_name;
          }),
        },
        uniqueItems: true,
      },
    },
  };

  const uiSchema = {
    district: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
    block: {
      "ui:widget": MultiCheck,
      "ui:options": {},
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const programResult = await getSelectedProgramId();
      let name = programResult?.state_name;
      const getDistricts = await geolocationRegistryService.getDistricts({
        name,
      });

      if (Array.isArray(getDistricts?.districts)) {
        setGetDistrictsAll(getDistricts?.districts);
      }
    };
    fetchData();
  }, []);

  useEffect(async () => {
    let blockData = [];
    if (filter?.district?.length > 0) {
      blockData = await geolocationRegistryService.getMultipleBlocks({
        districts: filter?.district,
      });
    }
    setGetBlocksAll(blockData);
  }, [filter?.district]);

  const onChange = useCallback(
    async (data) => {
      const { district: newDistrict, block: newBlock } = data?.formData || {};
      const { district, block, ...remainData } = filter || {};
      setFilterObject({
        ...remainData,
        ...(newDistrict && newDistrict?.length > 0
          ? {
              district: newDistrict,
              ...(newBlock?.length > 0 ? { block: newBlock } : {}),
            }
          : {}),
      });
    },
    [filter, setFilterObject]
  );

  const clearFilter = () => {
    setFilter({});
    setFilterObject({});
    setFacilitatorFilter({});
  };
  useEffect(async () => {
    const { error, ...result } = await facilitatorRegistryService.searchByCamp(
      facilitatorFilter
    );

    if (!error) {
      let newData;
      if (result) {
        newData = result?.data?.map((e) => ({
          value: e?.id,
          label: `${e?.first_name} ${e?.last_name ? e?.last_name : ""}`,
        }));
      }
      setFacilitator(newData);
    }
  }, [facilitatorFilter]);

  return (
    <VStack space={3}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth="2"
        borderColor="#eee"
        flexWrap="wrap"
        Width
      >
        <HStack>
          <IconByName isDisabled name="FilterLineIcon" />
          <AdminTypo.H5 bold>{t("FILTERS")}</AdminTypo.H5>
        </HStack>
        <Button variant="link" p="0" onPress={clearFilter}>
          <AdminTypo.H6 color="blueText.400" underline bold key={filter}>
            {t("CLEAR_FILTER")}(
            {
              Object.keys(filter || {}).filter(
                (e) => !["limit", "page"].includes(e)
              ).length
            }
            )
          </AdminTypo.H6>
        </Button>
      </HStack>
      <Box p={[0, 0, 3]} pr="3">
        <Form
          schema={schema}
          uiSchema={uiSchema}
          onChange={onChange}
          validator={validator}
          formData={filter}
        >
          <Button display={"none"} type="submit"></Button>
        </Form>
      </Box>
      <AdminTypo.H5>{t("PRERAK")}</AdminTypo.H5>
      <Input
        w="100%"
        height="32px"
        placeholder={t("SEARCH")}
        variant="outline"
        onChange={debouncedHandleSearch}
      />

      <MultiCheck
        value={filter?.facilitator ? filter?.facilitator : []}
        onChange={(e) => {
          setFilterObject({ ...filter, facilitator: e });
        }}
        schema={{
          grid: 1,
          _hstack: {
            maxH: 130,
            overflowY: "scroll",
          },
        }}
        options={{
          enumOptions: facilitator,
        }}
      />
    </VStack>
  );
};

Filter.propTypes = {
  filter: PropTypes.any,
  setFilter: PropTypes.any,
};
export default CampList;
