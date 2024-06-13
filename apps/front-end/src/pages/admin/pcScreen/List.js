import React, {
  memo,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import PropTypes from "prop-types";
import {
  Box,
  HStack,
  VStack,
  ScrollView,
  Button,
  Input,
  Modal,
  Stack,
  Pressable,
  Menu,
} from "native-base";
import {
  getSelectedAcademicYear,
  IconByName,
  AdminLayout as Layout,
  useWindowSize,
  AdminTypo,
  geolocationRegistryService,
  facilitatorRegistryService,
  enumRegistryService,
  setQueryParameters,
  urlData,
  getOptions,
  getSelectedProgramId,
  tableCustomStyles,
  cohortService,
} from "@shiksha/common-lib";
// import Table from "./Table";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "../../../component/BaseInput";
import Clipboard from "component/Clipboard";
import { debounce } from "lodash";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { ChipStatus } from "component/Chip";

const uiSchema = {
  district: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },
  qualificationIds: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },

  block: {
    "ui:widget": MultiCheck,
    "ui:options": {},
  },
};

const schemat = {
  type: "object",
  properties: {
    district: {
      type: "array",
      title: "DISTRICT",
      grid: 1,
      _hstack: {
        maxH: 135,
        overflowY: "scroll",
        borderBottomColor: "bgGreyColor.200",
        borderBottomWidth: "2px",
      },
      items: {
        type: "string",
      },
      uniqueItems: true,
    },
    block: {
      type: "array",
      title: "BLOCKS",
      grid: 1,
      _hstack: {
        maxH: 130,
        overflowY: "scroll",
        borderBottomColor: "bgGreyColor.200",
        borderBottomWidth: "2px",
      },
      items: {
        type: "string",
        enum: [],
      },
      uniqueItems: true,
    },
  },
};
export default function List({ footerLinks, userTokenInfo }) {
  const { t } = useTranslation();
  const [width, Height] = useWindowSize();
  const [refAppBar, setRefAppBar] = useState();
  const ref = useRef(null);
  const [schema, setSchema] = useState();
  const [filter, setFilter] = useState({});
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [enumOptions, setEnumOptions] = useState({});
  const [program, setProgram] = useState();
  const [academicYear, setAcademicYear] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [urlFilterApply, setUrlFilterApply] = useState(false);
  const navigate = useNavigate();

  const handleOpenButtonClick = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      const programResult = await getSelectedProgramId();
      let academic_Id = await getSelectedAcademicYear();
      setAcademicYear(academic_Id);
      setProgram(programResult);
      let name = programResult?.state_name;
      const getDistricts = await geolocationRegistryService.getDistricts({
        name,
      });
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data : {});

      let newSchema = getOptions(schemat, {
        key: "district",
        arr: getDistricts?.districts,
        title: "district_name",
        value: "district_name",
      });
      setSchema(newSchema);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchBlocks = useCallback(async () => {
    if (schema) {
      if (filter?.district?.length > 0) {
        const blockData = await geolocationRegistryService.getMultipleBlocks({
          districts: filter?.district,
        });
        let newSchema = getOptions(schema, {
          key: "block",
          arr: blockData,
          title: "block_name",
          value: "block_name",
        });
        setSchema(newSchema);
      } else {
        const newSchema = {
          ...schema,
          properties: {
            ...schema.properties,
            block: schemat?.properties?.block || {},
          },
        };
        setSchema(newSchema);
      }
    }
  }, [filter?.district]);

  useEffect(() => {
    fetchBlocks();
  }, [filter?.district]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (urlFilterApply) {
        setTableLoading(true);
        const result = await cohortService.Pclist({
          ...filter,
          limit: filter?.limit || 10,
        });
        setData(result.data);

        setPaginationTotalRows(result?.data?.total_count || 0);

        setTableLoading(false);
      }
    };

    fetchFilteredData();
  }, [filter]);

  const setFilterObject = useCallback(
    (data) => {
      setFilter((prevFilter) => {
        if (prevFilter?.length > 0) {
          return prevFilter;
        } else {
          return data;
        }
      });
      setQueryParameters(data);
    },
    [setFilter, setQueryParameters]
  );

  useEffect(() => {
    const arr = ["district", "block"];
    const data = urlData(arr);
    if (Object.keys(data).find((e) => arr.includes(e))?.length) setFilter(data);
    setUrlFilterApply(true);
  }, []);

  const onChange = useCallback(
    async (data) => {
      const { district: newDistrict, block: newBlock } = data?.formData || {};
      const { district, block, ...remainData } = filter || {};
      const finalFilter = {
        ...remainData,
        ...(newDistrict && newDistrict?.length > 0
          ? {
              district: newDistrict,
              ...(newBlock?.length > 0 ? { block: newBlock } : {}),
            }
          : {}),
        // ...(newStatus && newStatus?.length > 0 ? { status: newStatus } : {}),
      };
      setFilterObject(finalFilter);
    },
    [filter]
  );

  const clearFilter = useCallback(() => {
    setFilter({});
    setFilterObject({});
  }, [setFilterObject]);

  const handleSearch = useCallback(
    (e) => {
      setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
    },
    [filter]
  );
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  return (
    <Layout
      widthApp={width}
      getRefAppBar={(e) => setRefAppBar(e)}
      _sidebar={footerLinks}
      loading={loading}
    >
      <HStack
        space={[0, 0, "2"]}
        p="4"
        justifyContent="space-between"
        flexWrap="wrap"
        gridGap="2"
        ref={ref}
      >
        <HStack
          justifyContent={"space-between"}
          space={"4"}
          alignItems="center"
          p={2}
        >
          <HStack justifyContent="space-between" alignItems="center" space="2">
            <IconByName name="TeamFillIcon" size="md" />
            <AdminTypo.H4 bold> {t("ALL_PRAGATI_COORDINATOR")}</AdminTypo.H4>
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
          placeholder={t("SEARCH_BY_PC_NAME")}
          variant="outline"
          onChange={debouncedHandleSearch}
        />

        <HStack height={"5vh"} space={2}>
          <AdminTypo.Secondarybutton
            onPress={() => navigate("/admin/addpcuser")}
            rightIcon={
              <IconByName
                color="#084B82"
                _icon={{}}
                size="15px"
                name="ShareLineIcon"
              />
            }
          >
            {t("ADD_PC")}
          </AdminTypo.Secondarybutton>
        </HStack>
      </HStack>
      <HStack ml="-1">
        <Stack style={{ position: "relative", overflowX: "hidden" }}>
          <Stack
            style={{
              position: "absolute",
              top: 0,
              left: "0",
              transition: "left 0.3s ease",
              width: "250px",
              height: "100%",
              background: "white",
              zIndex: 1,
            }}
          >
            <Box
              flex={[2, 2, 1]}
              style={{
                borderRightColor: "dividerColor",
                borderRightWidth: "2px",
              }}
            >
              <ScrollView
                maxH={
                  Height -
                  (refAppBar?.clientHeight + ref?.current?.clientHeight)
                }
              >
                <VStack space={3} py="5">
                  <HStack
                    alignItems="center"
                    justifyContent="space-between"
                    borderBottomWidth="2"
                    borderColor="#eee"
                    flexWrap="wrap"
                  >
                    <HStack>
                      {/* <IconByName isDisabled name="FilterLineIcon" /> */}
                      <AdminTypo.H5 bold>{t("FILTERS")}</AdminTypo.H5>
                    </HStack>
                    <Button variant="link" pt="3" onPress={clearFilter}>
                      <AdminTypo.H6 color="blueText.400" underline bold>
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
                      schema={schema || {}}
                      uiSchema={uiSchema}
                      onChange={onChange}
                      validator={validator}
                      formData={filter}
                    >
                      <Button display={"none"} type="submit"></Button>
                    </Form>
                  </Box>
                </VStack>
              </ScrollView>
            </Box>
          </Stack>

          <Stack
            style={{
              marginLeft: isDrawerOpen ? "250px" : "0",
              transition: "margin-left 0.3s ease",
            }}
          />
        </Stack>
        <VStack
          ml={"-1"}
          rounded={"xs"}
          height={"50px"}
          bg={
            filter?.district || filter?.state || filter?.block
              ? "textRed.400"
              : "#E0E0E0"
          }
          justifyContent="center"
          onClick={handleOpenButtonClick}
        >
          <IconByName
            name={isDrawerOpen ? "ArrowLeftSLineIcon" : "FilterLineIcon"}
            color={
              filter?.state || filter?.district || filter?.block
                ? "white"
                : "black"
            }
            _icon={{ size: "30px" }}
          />
        </VStack>

        <Box flex={[5, 5, 4]}>
          <ScrollView
            maxH={Height - refAppBar?.clientHeight - 72}
            minH={Height - refAppBar?.clientHeight - 72}
          >
            <Box roundedBottom={"2xl"} pl="0" px={4}>
              <Table
                height={Height - refAppBar?.clientHeight}
                filter={filter}
                setFilter={setFilterObject}
                facilitator={userTokenInfo?.authUser}
                paginationTotalRows={paginationTotalRows}
                data={data}
                loading={tableLoading}
                enumOptions={enumOptions}
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
    </Layout>
  );
}

List.propTypes = { footerLinks: PropTypes.any, userTokenInfo: PropTypes.any };

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
    name: t("USER_ID"),
    selector: (row) => row?.user_id,
    sortable: true,
    attr: "id",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("COORDINATORS_NAME"),
    selector: (row) => (
      <HStack display="inline-block" width={"100%"}>
        <Pressable
          style={{ flexDirection: "row", justifyContent: "space-between" }}
          onPress={() => navigate(`/admin/facilitator/${row?.user_id}`)}
        >
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
    name: t("CONTACT"),
    selector: (row) => row?.mobile || "-",
    compact: true,
  },
  {
    name: t("EMAIL_ID"),
    selector: (row) => row?.email_id || "-",
    compact: true,
  },
  {
    name: t("STATE"),
    selector: (row) => row?.state || "-",
    compact: true,
  },
  {
    name: t("DISTRICT"),
    selector: (row) => row?.district || "-",
    compact: true,
  },

  {
    name: t("ACTION"),
    selector: (row) => (
      <AdminTypo.Secondarybutton
        my="3"
        onPress={() => navigate(`/admin/pc/${row?.user_id}`)}
      >
        {t("ASSIGN_PRERAKS")}
      </AdminTypo.Secondarybutton>
    ),
    sortable: true,
    attr: "count",
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

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/admin/pc/${row?.user_id}`);
    },
    [navigate]
  );

  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  return (
    <VStack>
      <DataTable
        fixedHeader={true}
        customStyles={tableCustomStyles}
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
