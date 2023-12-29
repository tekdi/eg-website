import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MultiCheck } from "../../../component/BaseInput";

import { useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Button,
  HStack,
  ScrollView,
  VStack,
  Input,
  Pressable,
} from "native-base";
import {
  AdminTypo,
  IconByName,
  AdminLayout as Layout,
  campService,
  t,
  useWindowSize,
  geolocationRegistryService,
  setQueryParameters,
  urlData,
  enumRegistryService,
  GetEnumValue,
  facilitatorRegistryService,
  tableCustomStyles,
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";
import { CampChipStatus } from "component/Chip";
import { debounce } from "lodash";

const columns = (navigate) => [
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
      <Pressable onPress={() => navigate(`/admin/camps/${row.id}`)}>
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
        onPress={() => navigate(`/admin/camps/${row.id}`)}
      >
        {t("VIEW")}
      </AdminTypo.Secondarybutton>
    ),
    sortable: true,
    attr: "count",
  },
];
export default function CampHome({ footerLinks, userTokenInfo }) {
  const [filter, setFilter] = React.useState({});
  const [Width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = React.useState();
  const ref = React.useRef(null);
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [urlFilterApply, setUrlFilterApply] = React.useState(false);
  const [campFilterStatus, setCampFilterStatus] = useState([]);
  const [enumOptions, setEnumOptions] = React.useState({});
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);

  React.useEffect(() => {
    const urlFilter = urlData(["district", "block"]);
    setFilter({ ...filter, ...urlFilter });
    setUrlFilterApply(true);
  }, []);

  React.useEffect(async () => {
    const result = await enumRegistryService.getStatuswiseCount();
    setCampFilterStatus(result);
    const data = await enumRegistryService.listOfEnum();
    setEnumOptions(data?.data ? data?.data : {});
  }, []);

  React.useEffect(async () => {
    if (urlFilterApply) {
      let newFilter = filter;
      if (filter?.status === "all") {
        const { status, ...dataFilter } = filter || {};
        console.log({ dataFilter });
        newFilter = dataFilter;
      }

      const qData = await campService.getCampList(newFilter);
      setData(qData?.camps);
      setPaginationTotalRows(qData?.totalCount ? qData?.totalCount : 0);
    }
  }, [filter]);

  const handleRowClick = (row) => {
    navigate(`/admin/camps/${row.id}`);
  };

  return (
    <Layout
      test={Width}
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
    >
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
              {campFilterStatus?.map((item) => {
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
                      <AdminTypo.H5>{t("ALL")}</AdminTypo.H5>
                    ) : (
                      <GetEnumValue
                        t={t}
                        enumType={"GROUPS_STATUS"}
                        enumOptionValue={item?.status}
                        enumApiData={enumOptions}
                      />
                    )}
                    {filter?.status == t(item?.status)
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
                  setQueryParameters(e);
                }}
                customStyles={tableCustomStyles}
                columns={[...columns(navigate)]}
                persistTableHead
                facilitator={userTokenInfo?.authUser}
                pagination
                paginationTotalRows={paginationTotalRows}
                paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
                defaultSortAsc
                paginationServer
                data={data}
                onChangeRowsPerPage={(e) => {
                  setFilter({ ...filter, limit: e?.toString() });
                }}
                onChangePage={(e) => {
                  setFilter({ ...filter, page: e?.toString() });
                }}
                onRowClicked={handleRowClick}
                dense
                highlightOnHover
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}

export const Filter = ({ filter, setFilter }) => {
  const [getDistrictsAll, setGetDistrictsAll] = React.useState();
  const [getBlocksAll, setGetBlocksAll] = React.useState();
  const [facilitatorFilter, setFacilitatorFilter] = React.useState({});
  const [facilitator, setFacilitator] = React.useState([]);

  const setFilterObject = (data) => {
    if (data?.district) {
      const { district, block } = data;
      setFacilitatorFilter({ ...facilitatorFilter, district, block });
    }
    setFilter(data);
    setQueryParameters(data);
  };

  const handleSearch = (e) => {
    setFacilitatorFilter({
      ...facilitatorFilter,
      search: e.nativeEvent.text,
      page: 1,
    });
  };

  const debouncedHandleSearch = React.useCallback(
    debounce(handleSearch, 1000),
    []
  );

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
  React.useEffect(async () => {
    let name = "RAJASTHAN";
    const getDistricts = await geolocationRegistryService.getDistricts({
      name,
    });
    setGetDistrictsAll(getDistricts?.districts);
  }, []);

  React.useEffect(async () => {
    let blockData = [];
    if (filter?.district?.length > 0) {
      blockData = await geolocationRegistryService.getMultipleBlocks({
        districts: filter?.district,
      });
    }
    setGetBlocksAll(blockData);
  }, [filter?.district]);

  const onChange = async (data) => {
    const { district: newDistrict, block: newBlock } = data?.formData || {};
    const { district, block, ...remainData } = filter;
    setFilterObject({
      ...remainData,
      ...(newDistrict?.length > 0
        ? {
            district: newDistrict,
            ...(newBlock?.length > 0 ? { block: newBlock } : {}),
          }
        : {}),
    });
  };

  const clearFilter = () => {
    setFilter({});
    setFilterObject({});
    setFacilitatorFilter({});
  };
  React.useEffect(async () => {
    const { error, ...result } = await facilitatorRegistryService.searchByCamp(
      facilitatorFilter
    );

    if (!error) {
      let newData;
      if (result) {
        newData = result?.users?.map((e) => ({
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
        <Button variant="link" pt="3" onPress={clearFilter}>
          <AdminTypo.H6 color="blueText.400" underline bold>
            {t("CLEAR_FILTER")}
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
