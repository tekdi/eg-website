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
  Text,
  Input,
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
  debounce,
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";
import { CampChipStatus } from "component/Chip";

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
    selector: (row) => <CampChipStatus status={row?.group?.status} />,
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
  const [CampFilterStatus, setCampFilterStatus] = useState([]);
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

  return (
    <Layout getRefAppBar={(e) => setRefAppBar(e)} _sidebar={footerLinks}>
      <HStack
        space={[0, 0, "2"]}
        p="2"
        my="1"
        mb="3"
        justifyContent="space-between"
        flexWrap="wrap"
        gridGap="2"
      >
        <HStack
          justifyContent={"space-between"}
          space={"4"}
          alignItems="center"
        >
          <HStack justifyContent="space-between" alignItems="center">
            <IconByName name="GroupLineIcon" size="md" />
            <AdminTypo.H1>{t("ALL_CAMPS")}</AdminTypo.H1>
          </HStack>
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
          >
            {urlFilterApply && <Filter {...{ filter, setFilter }} />}
          </ScrollView>
        </Box>

        <Box flex={[5, 5, 4]}>
          <ScrollView>
            <HStack pb="2">
              {CampFilterStatus?.map((item) => {
                return (
                  <Text
                    key={"table"}
                    color={
                      filter?.status == t(item?.status) ? "blueText.400" : ""
                    }
                    bold={filter?.status == t(item?.status) ? true : false}
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
                  </Text>
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
                customStyles={CustomStyles}
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
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}

export const Filter = ({ filter, setFilter }) => {
  const [getDistrictsAll, setgetDistrictsAll] = React.useState();
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
    setgetDistrictsAll(getDistricts?.districts);
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
  }, [facilitatorFilter, filter]);
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
        onChange={(e) => {
          debounce(
            setFacilitatorFilter({
              ...facilitatorFilter,
              search: e.nativeEvent.text,
              page: 1,
            }),
            3000
          );
        }}
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
