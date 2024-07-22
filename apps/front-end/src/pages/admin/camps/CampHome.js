import React, { useCallback, useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { MultiCheck, select } from "../../../component/BaseInput";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  HStack,
  ScrollView,
  VStack,
  Input,
  Pressable,
  Modal,
  Alert,
  useToast,
  Stack,
} from "native-base";
import {
  AdminTypo,
  IconByName,
  AdminLayout as Layout,
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
import DataTable from "react-data-table-component";
import Chip, { CampChipStatus } from "component/Chip";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
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

const closePcrColuman = (t) => [
  {
    name: t("CAMP_ID"),
    selector: (row) => row?.id,
    sortable: true,
    width: "100px",
  },
  {
    name: t("PRERAK_ID"),
    selector: (row) => row?.faciltator?.user?.faciltator_id || " - ",
    sortable: true,
    width: "120px",
  },
  {
    name: t("PRERAK"),
    selector: (row) =>
      row?.faciltator?.user?.first_name +
      " " +
      row?.faciltator?.user?.last_name,
    sortable: true,
  },
  {
    name: t("ADDRESS_DETAILS"),
    selector: (row) =>
      [row?.properties?.district, row?.properties?.block]
        .filter((e) => e)
        .join(", "),
    sortable: true,
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
];

const errorPcrColuman = (t) => [
  {
    name: t("CAMP_ID"),
    selector: (row) => row?.camp_id,
    sortable: false,
    width: "100px",
  },
  {
    name: t("CAMP_INCOMPLETED_SESSIONS"),
    selector: (row) =>
      row?.session?.length > 0 ? (
        <HStack flexWrap={"wrap"}>
          {/* {row?.session?.map((item) => ( */}
          <Chip label={row?.session?.[0]?.ordering} />
          {/* ))} */}
        </HStack>
      ) : (
        t("COMPLETED")
      ),
    sortable: false,
    width: "120px",
  },
  {
    name: t("CAMP_INCOMPLETED_NEEW_ASSESSMENT"),
    selector: (row) =>
      row?.users?.length > 0 ? (
        <HStack flexWrap={"wrap"}>
          {row?.users?.map((item) => (
            <Chip label={item?.id} />
          ))}
        </HStack>
      ) : (
        t("COMPLETED")
      ),
    sortable: false,
  },
];

export default function CampHome({ footerLinks, userTokenInfo }) {
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const toast = useToast();
  const [debounced, setDebounced] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState();

  const handleOpenButtonClick = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const init = useCallback(() => {
    const urlFilter = getFilterLocalStorage(filterName);
    setFilter((prevFilter) => ({ ...prevFilter, ...urlFilter }));
    setUrlFilterApply(true);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    async function fetchData() {
      const result = await enumRegistryService.getStatuswiseCount();
      setCampFilterStatus(result);
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data : {});
    }
    fetchData();
  }, []);

  const getData = useCallback(async () => {
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
  }, [filter, urlFilterApply]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleRowClick = (row) => {
    navigate(`/admin/camps/${row.id}`);
  };
  const handleRowCheck = async ({ selectedRows: row }) => {
    setSelectedRows(row);
  };

  const showToast = (props) => {
    if (!debounced) {
      toast.show({
        title: "Hello, world!",
        status: "info",
        duration: 3000,
        ...props,
        onCloseComplete: () => setDebounced(false),
      });
      setDebounced(true);

      // Set debounced to false after a delay (e.g., 3 seconds) to allow showing the toast again
      setTimeout(() => {
        setDebounced(false);
      }, 3000);
    }
  };

  const handleClosePcr = async () => {
    setIsButtonLoading(true);
    const camp_ids = selectedRows?.map((e) => e?.id);
    const result = await campService?.multipleClosePcr({
      camp_id: camp_ids,
    });

    if (result?.success === true) {
      await getData();
      setSelectedRows([]);
      setModalVisible(false);
      showToast({
        render: () => (
          <Alert status="success" alignItems="start" mb="3" mt="4">
            <HStack alignItems="center" space="2" color>
              <Alert.Icon size={"lg"} />
              <AdminTypo.H4>{result?.message}</AdminTypo.H4>
            </HStack>
          </Alert>
        ),
      });
    } else {
      if (result?.data?.length > 0) {
        setErrors(result?.data);
      } else {
        setModalVisible(false);
        showToast({
          render: () => (
            <Alert status="warning" alignItems="start" mb="3" mt="4">
              <HStack alignItems="center" space="2" color>
                <Alert.Icon size={"lg"} />
                <AdminTypo.H4>{result?.message}</AdminTypo.H4>
              </HStack>
            </Alert>
          ),
        });
      }
    }
    setIsButtonLoading(false);
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
        {filter?.pcr_type === "ready_to_close" && (
          <AdminTypo.Secondarybutton
            onPress={(e) => {
              if (selectedRows?.length > 0) {
                setModalVisible(true);
              } else {
                showToast({
                  render: () => (
                    <Alert status="warning" alignItems="start" mb="3" mt="4">
                      <HStack alignItems="center" space="2" color>
                        <Alert.Icon size={"lg"} />
                        <AdminTypo.H4>{t("PLEASE_SELECT_CAMP")}</AdminTypo.H4>
                      </HStack>
                    </Alert>
                  ),
                });
              }
            }}
          >
            {t("CLOSE_PCR")}
          </AdminTypo.Secondarybutton>
        )}
      </HStack>
      <HStack ml="-1">
        <Stack style={{ position: "relative", overflowX: "hidden" }}>
          <Stack
            style={{
              position: "absolute",
              top: 0,
              left: `0`,
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
                temp={Width}
              >
                {urlFilterApply && <Filter {...{ filter, setFilter }} />}
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
            filter?.district ||
            filter?.state ||
            filter?.block ||
            filter?.status ||
            filter?.pcr_type
              ? "textRed.400"
              : "#E0E0E0"
          }
          justifyContent="center"
          onClick={handleOpenButtonClick}
        >
          <IconByName
            name={isDrawerOpen ? "ArrowLeftSLineIcon" : "FilterLineIcon"}
            color={
              filter?.state ||
              filter?.district ||
              filter?.block ||
              filter?.status ||
              filter?.pcr_type
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
            <HStack pb="2">
              {Array?.isArray(campFilterStatus) &&
                campFilterStatus?.map((item) => {
                  return (
                    <AdminTypo.H6
                      key={"table"}
                      color={
                        (!filter.pcr_type &&
                          !filter?.status &&
                          item?.status == "all") ||
                        filter?.status == t(item?.status)
                          ? "textMaroonColor.600"
                          : ""
                      }
                      bold={
                        (!filter.pcr_type &&
                          !filter?.status &&
                          item?.status == "all") ||
                        filter?.status == t(item?.status)
                      }
                      cursor={"pointer"}
                      mx={3}
                      onPress={() => {
                        setFilter((prevFilter) => {
                          const { pcr_type, ...newFilter } = prevFilter;
                          return {
                            ...newFilter,
                            status: item?.status,
                            page: 1,
                          };
                        });
                      }}
                      alignItems="center"
                    >
                      {item.status === "all" ? (
                        `${t("ALL")}`
                      ) : (
                        <GetEnumValue
                          t={t}
                          enumType={"GROUPS_STATUS"}
                          enumOptionValue={item?.status}
                          enumApiData={enumOptions}
                        />
                      )}
                      {(!filter.pcr_type &&
                        !filter?.status &&
                        item?.status == "all") ||
                      filter?.status == t(item?.status)
                        ? ` (${paginationTotalRows})`
                        : " "}
                    </AdminTypo.H6>
                  );
                })}

              <AdminTypo.H6
                {...(filter.pcr_type === "ready_to_close" &&
                (!filter.status || filter.status == "")
                  ? { bold: true, color: "textMaroonColor.600" }
                  : {})}
                onPress={() => {
                  setFilter((prevFilter) => {
                    const { status, ...newFilter } = prevFilter;
                    return {
                      ...newFilter,
                      pcr_type: "ready_to_close",
                      page: 1,
                    };
                  });
                }}
              >
                {`${t("CAMPS_READY_TO_CLOSE")}${
                  filter.pcr_type === "ready_to_close" &&
                  (!filter.status || filter.status == "")
                    ? ` (${paginationTotalRows})`
                    : ""
                }`}
              </AdminTypo.H6>
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
                selectableRows={filter?.pcr_type === "ready_to_close" && true}
                onSelectedRowsChange={handleRowCheck}
                onRowClicked={handleRowClick}
                dense
                highlightOnHover
              />
            </Box>
          </ScrollView>
        </Box>
      </HStack>
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        // size="lg"
      >
        <Modal.Content maxWidth="90%">
          <Modal.CloseButton />
          <Modal.Header>{t("CONFIRMATION")}</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Alert status="warning" alignItems={"start"}>
                <HStack alignItems={"center"} space="2" color>
                  <Alert.Icon size={"lg"} />
                  <AdminTypo.H6 bold>{t("PCR_CLOSE_MESSAGE")}</AdminTypo.H6>
                </HStack>
              </Alert>
              {errors && errors?.length > 0 && (
                <VStack>
                  <AdminTypo.H2></AdminTypo.H2>
                  <DataTable
                    customStyles={{
                      rows: {
                        style: {
                          background: "lightpink",
                        },
                      },
                    }}
                    columns={[...errorPcrColuman(t)]}
                    data={errors}
                  />
                </VStack>
              )}
              <DataTable
                columns={[...closePcrColuman(t)]}
                defaultSortAsc
                data={selectedRows}
                highlightOnHover
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <HStack justifyContent="space-between" width="100%">
              <AdminTypo.PrimaryButton
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                {t("CANCEL")}
              </AdminTypo.PrimaryButton>
              <AdminTypo.Secondarybutton
                isDisabled={isButtonLoading}
                onPress={() => {
                  handleClosePcr();
                }}
              >
                {t("CONFIRM")}
              </AdminTypo.Secondarybutton>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

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
      type: {
        type: "string",
        title: t("CAMP_TYPE"),
        isHideFloatingLabel: true,
        format: "select",
        enum: ["all", "main", "pcr"],
        enumNames: ["ALL_CAMPS", "MAIN_CAMP", "PCR_CAMP"],
      },
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
      const {
        district: newDistrict,
        block: newBlock,
        type,
      } = data?.formData || {};
      const { district, block, type: atype, ...remainData } = filter || {};

      setFilterObject({
        ...remainData,
        ...(["pcr", "main"].includes(type) ? { type } : {}),
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
          widgets={{ select }}
        >
          <Button display={"none"} type="submit"></Button>
        </Form>
      </Box>
      <AdminTypo.H5>{t("PRERAK")}</AdminTypo.H5>
      <Input
        w="95%"
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
CampHome.propTypes = {
  footerLinks: PropTypes.any,
  userTokenInfo: PropTypes.any,
};
