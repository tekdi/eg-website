import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import Table from "./Table";
import { useTranslation } from "react-i18next";
import { MultiCheck } from "../../../../component/BaseInput";
import { debounce } from "lodash";
import {
  Box,
  HStack,
  VStack,
  ScrollView,
  Button,
  Input,
  Stack,
} from "native-base";
import {
  PoAdminLayout,
  IconByName,
  useWindowSize,
  AdminTypo,
  geolocationRegistryService,
  facilitatorRegistryService,
  enumRegistryService,
  setQueryParameters,
  urlData,
  getOptions,
  getSelectedProgramId,
  getSelectedAcademicYear,
} from "@shiksha/common-lib";
import SelectProgramOrganisation from "../IP/component/SelectProgramOrganisation";

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
  status: {
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
    status: {
      type: "array",
      title: "STATUS",
      grid: 1,
      _hstack: {
        maxH: 130,
        overflowY: "scroll",
      },
      items: {
        type: "string",
      },
      uniqueItems: true,
    },
  },
};

function PrerakList({ userTokenInfo }) {
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [urlFilterApply, setUrlFilterApply] = useState(false);

  const handleOpenButtonClick = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      const programResult = await getSelectedProgramId();
      let name = programResult?.program?.state?.state_name;
      const getDistricts = await geolocationRegistryService.getDistricts({
        name,
      });
      const data = await enumRegistryService.listOfEnum();
      setEnumOptions(data?.data ? data?.data : {});

      let newSchema = getOptions(schemat, {
        key: "status",
        arr: data?.data?.FACILITATOR_STATUS,
        title: "title",
        value: "value",
      });

      newSchema = getOptions(newSchema, {
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
        const result = await facilitatorRegistryService.filter({
          ...filter,
          limit: filter?.limit || 10,
        });

        setData(result.data?.data);
        setPaginationTotalRows(result?.data?.totalCount || 0);

        setTableLoading(false);
      }
    };

    fetchFilteredData();
  }, [filter, localStorage.getItem("program"), localStorage.getItem("org_id")]);

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
    const arr = ["district", "block", "status"];
    const data = urlData(arr);
    if (Object.keys(data).find((e) => arr.includes(e))?.length) setFilter(data);
    setUrlFilterApply(true);
  }, []);

  const onChange = useCallback(
    async (data) => {
      const {
        district: newDistrict,
        block: newBlock,
        status: newStatus,
      } = data?.formData || {};
      const { district, block, status, ...remainData } = filter || {};
      const finalFilter = {
        ...remainData,
        ...(newDistrict && newDistrict?.length > 0
          ? {
              district: newDistrict,
              ...(newBlock?.length > 0 ? { block: newBlock } : {}),
            }
          : {}),
        ...(newStatus && newStatus?.length > 0 ? { status: newStatus } : {}),
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
    <PoAdminLayout _sidebar={setRefAppBar} loading={loading}>
      <HStack p="4" space={4} justifyContent={"space-between"}>
        <HStack justifyContent="start" alignItems="center" space="2">
          <IconByName name="GroupLineIcon" size="md" />
          <AdminTypo.H4 bold>{t("ALL_PRERAKS")}</AdminTypo.H4>
        </HStack>

        <HStack justifyContent="start" alignItems="center" space={"4"}>
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
            placeholder={t("SEARCH_BY_PRERAK_NAME")}
            variant="outline"
            onChange={debouncedHandleSearch}
            textAlign="center"
            mx="auto"
          />
          <SelectProgramOrganisation />
        </HStack>
      </HStack>

      <HStack>
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
            filter?.district || filter?.state || filter?.block || filter?.status
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
              filter?.status
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
    </PoAdminLayout>
  );
}

PrerakList.propTypes = { userTokenInfo: PropTypes.any };

export default PrerakList;
