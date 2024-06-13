import React, { memo, useCallback, useEffect, useState } from "react";
import {
  AdminTypo,
  AdminLayout,
  CardComponent,
  IconByName,
  organisationService,
  Breadcrumb,
  geolocationRegistryService,
  getSelectedProgramId,
  getSelectedAcademicYear,
  enumRegistryService,
  getOptions,
  setQueryParameters,
  tableCustomStyles,
  cohortService,
} from "@shiksha/common-lib";
import {
  Box,
  Input,
  HStack,
  CheckIcon,
  Stack,
  VStack,
  Menu,
  Button,
  Icon,
  Pressable,
} from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { debounce } from "lodash";
import { MultiCheck } from "../../../component/BaseInput";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

const AssignedList = ({ assignedData }) => {
  console.log({ assignedData });
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSelectable, setIsSelectable] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [addPrerakCount, setAddPrerakCount] = useState(0);
  const [removePrerakCount, setRemovePrerakCount] = useState(0);
  const [isAddingPrerak, setIsAddingPrerak] = useState(true);
  const [isRemovePrerak, setIsRemovePrerak] = useState(true);
  const [isCancelVisible, setIsCancelVisible] = useState(false);
  const [schema, setSchema] = useState();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); // State for dropdown

  const columns = (t) => [
    {
      name: t("ID"),
      sortable: true,
      sortField: "id",
      selector: (row) => row?.id,
      wrap: true,
    },
    {
      name: t("NAME"),
      sortable: true,
      sortField: "first_name",
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          <AdminTypo.H7 bold>
            {row?.first_name + " "}
            {row?.last_name ? row?.last_name : ""}
          </AdminTypo.H7>
        </HStack>
      ),
      wrap: true,
    },
    {
      name: t("USERNAME"),
      selector: (row) => (row?.username ? row?.username : "-"),
      wrap: true,
    },
    {
      name: t("ROLE"),
      selector: (row) =>
        row?.program_users?.[0]?.role_slug
          ? row?.program_users?.[0]?.role_slug
          : "-",
      wrap: true,
    },
    {
      name: t("MOBILE_NO"),
      selector: (row) => (row?.mobile ? row?.mobile : "-"),
      wrap: true,
    },
  ];

  const pagination = [10, 15, 25, 50, 100];

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
          borderBottomWidth: "5px",
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
          borderBottomWidth: "5px",
        },
        items: {
          type: "string",
          enum: [],
        },
        uniqueItems: true,
      },
    },
  };

  const handleSort = (column, sort) => {
    if (column?.sortField) {
      setFilter({
        ...filter,
        order_by: { ...(filter?.order_by || {}), [column?.sortField]: sort },
      });
    }
  };

  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      const data = await cohortService.PcAvailableFacilitator({
        id: id,
        ...filter,
      });

      setPaginationTotalRows(
        data?.data?.totalCount ? data?.data?.totalCount : 0
      );
      setData(assignedData);
      setLoading(false);
    };

    fetchUserList();
  }, [filter, id]);

  console.log({ data });

  useEffect(() => {
    const fetchData = async () => {
      const programResult = await getSelectedProgramId();
      let name = programResult?.state_name;
      const getDistricts = await geolocationRegistryService.getDistricts({
        name,
      });
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

  const handleAddPrerak = () => {
    setIsSelectable(true);
    setIsAddingPrerak(true);
    setIsRemovePrerak(false);
    setIsCancelVisible(true);
  };

  const handleRemovePrerak = () => {
    setIsSelectable(true);
    setIsAddingPrerak(false);
    setIsRemovePrerak(true);
    setIsCancelVisible(true);
  };

  const handleCancel = () => {
    setIsSelectable(false);
    setSelectedRows([]);
    setAddPrerakCount(0);
    setRemovePrerakCount(0);
    setIsAddingPrerak(true);
    setIsRemovePrerak(true);
    setIsCancelVisible(false);
  };

  const handleRowSelected = useCallback(
    (state) => {
      const selected = state?.selectedRows;
      setSelectedRows(selected);

      if (isAddingPrerak) {
        setAddPrerakCount(selected?.length);
      } else {
        setRemovePrerakCount(selected?.length);
      }
    },
    [isAddingPrerak]
  );

  const handleSearch = useCallback(
    (e) => {
      setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
    },
    [filter]
  );
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

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

  const actiondropDown = (triggerProps, t) => {
    return (
      <Pressable
        accessibilityLabel="More options men"
        {...triggerProps}
        onPress={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
      >
        <HStack
          background="white"
          shadow="BlueOutlineShadow"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="blueText.400"
          p="2"
          space={4}
        >
          <AdminTypo.H5>{t("Filter")}</AdminTypo.H5>
          <IconByName pr="0" name="ArrowDownSLineIcon" isDisabled={true} />
        </HStack>
      </Pressable>
    );
  };

  return (
    <Stack backgroundColor={"identifiedColor"} alignContent={"center"}>
      <HStack alignItems={"center"} p={4} justifyContent={"space-between"}>
        <AdminTypo.H6 bold color={"textGreyColor.500"}>
          {t("ASSIGNED_PRERAK_LIST")}
        </AdminTypo.H6>
        <HStack space={4}>
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
            bg={"white"}
            placeholder={t("SEARCH_BY_PRERAK_NAME")}
            variant="outline"
            onChange={debouncedHandleSearch}
          />

          {(isAddingPrerak || isRemovePrerak) && (
            <Menu
              w="190"
              placement="bottom right"
              isOpen={isFilterMenuOpen}
              trigger={(triggerProps) => actiondropDown(triggerProps, t)}
            >
              <Menu.Item>
                <Box>
                  <VStack space={2}>
                    <Form
                      schema={schema || {}}
                      uiSchema={uiSchema}
                      onChange={onChange}
                      validator={validator}
                      formData={filter}
                    >
                      <Button display={"none"} type="submit"></Button>
                    </Form>

                    {(filter?.district || filter?.block) && (
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
                    )}

                    <AdminTypo.Secondarybutton
                      onPress={() => setIsFilterMenuOpen(false)}
                    >
                      <AdminTypo.H6>{t("OK")}</AdminTypo.H6>
                    </AdminTypo.Secondarybutton>
                  </VStack>
                </Box>
              </Menu.Item>
            </Menu>
          )}
        </HStack>
        <HStack space={4}>
          {isCancelVisible && (
            <AdminTypo.Secondarybutton onPress={handleCancel}>
              {t("CANCEL")}
            </AdminTypo.Secondarybutton>
          )}
          {isAddingPrerak && (
            <AdminTypo.Secondarybutton
              icon={
                !addPrerakCount > 0 && (
                  <IconByName
                    name="AddCircleLineIcon"
                    color="black"
                    size="xs"
                  />
                )
              }
              isDisabled={isSelectable && isAddingPrerak}
              onPress={handleAddPrerak}
            >
              {`${t("ADD_PRERAK")}${
                addPrerakCount > 0 ? ` (${addPrerakCount})` : ""
              }`}
            </AdminTypo.Secondarybutton>
          )}
          {isRemovePrerak && (
            <AdminTypo.Secondarybutton
              icon={
                <IconByName
                  name="IndeterminateCircleLineIcon"
                  color="black"
                  size="xs"
                />
              }
              isDisabled={isSelectable && !isAddingPrerak}
              onPress={handleRemovePrerak}
            >
              {`${t("REMOVE_PRERAK")} ${
                removePrerakCount > 0 ? ` (${removePrerakCount})` : ""
              }`}
            </AdminTypo.Secondarybutton>
          )}
        </HStack>
      </HStack>
      <VStack pt={0} p={6}>
        <DataTable
          data={data}
          columns={columns(t)}
          customStyles={tableCustomStyles}
          progressPending={loading}
          pagination
          paginationRowsPerPageOptions={pagination}
          paginationServer
          paginationTotalRows={paginationTotalRows}
          selectableRows={isSelectable}
          clearSelectedRows={isCancelVisible}
          onSelectedRowsChange={handleRowSelected}
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
    </Stack>
  );
};

export default AssignedList;
