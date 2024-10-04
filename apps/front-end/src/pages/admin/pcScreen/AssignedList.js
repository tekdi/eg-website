import { useCallback, useEffect, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  AdminTypo,
  IconByName,
  PcuserService,
  geolocationRegistryService,
  getOptions,
  getSelectedProgramId,
  tableCustomStyles,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import SideColapsable from "component/SideColapsable";
import { debounce } from "lodash";
import { Button, HStack, Input, VStack } from "native-base";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { MultiCheck } from "../../../component/BaseInput";
import PropTypes from "prop-types";

const AssignedList = ({ setPcData }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [isSelectable, setIsSelectable] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [addPrerakCount, setAddPrerakCount] = useState(0);
  const [removePrerakCount, setRemovePrerakCount] = useState(0);
  const [isAddingPrerak, setIsAddingPrerak] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const [isRemovePrerak, setIsRemovePrerak] = useState(true);
  const [isCancelVisible, setIsCancelVisible] = useState(false);
  const [schema, setSchema] = useState();
  const [formData, setFormData] = useState({});

  const columns = (t) => [
    {
      name: t("PRERAK_ID"),
      sortable: true,
      sortField: "id",
      selector: (row) => row?.facilitator_id || row?.user_id,
      wrap: true,
    },
    {
      name: t("NAME"),
      sortable: true,
      sortField: "first_name",
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          <AdminTypo.H7 bold>
            {row?.user?.first_name + " "}
            {row?.user?.last_name ? row?.user?.last_name : ""}
          </AdminTypo.H7>
        </HStack>
      ),
      wrap: true,
    },
    {
      name: t("DISTRICT"),
      selector: (row) => row?.user?.district || "-",
      wrap: true,
    },
    {
      name: t("OKYC_IP_VERIFIED"),
      selector: (row) => row?.user?.aadhar_verified || t("NO"),
      wrap: true,
    },
    {
      name: t("MOBILE_NO"),
      selector: (row) => row?.user?.mobile || "-",
      wrap: true,
    },
    {
      name: t("STATUS"),
      selector: (row) => <ChipStatus status={row?.status} />,
      wrap: true,
    },
    {
      name: t("GENDER"),
      selector: (row) => row?.user?.gender || "-",
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

  const fetchUserList = async () => {
    const Apidata = await PcuserService.pcDetails({
      id: id,
      ...filter,
    });

    setPaginationTotalRows(
      Apidata?.data?.total_count ? Apidata?.data?.total_count : 0,
    );
    setData(Apidata?.data?.facilitators);
    setPcData(Apidata?.data?.users?.[0]);
  };

  const fetchPrerakList = async () => {
    const Apidata = await PcuserService.PcAvailableFacilitator({
      id: id,
      ...filter,
    });
    setPaginationTotalRows(
      Apidata?.data?.total_count ? Apidata?.data?.total_count : 0,
    );
    setData(Apidata?.data?.program_facilitator_data);
  };

  useEffect(() => {
    if (!isSelectable) {
      fetchUserList();
    } else if (isSelectable) {
      fetchPrerakList();
    }
  }, [filter]);

  useEffect(() => {
    getDistrict();
  }, []);

  const getDistrict = async () => {
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

  const AddRemovePrerak = async (action) => {
    const userIds = selectedRows.map(
      (item) => item.user_id || item.facilitator_id,
    );
    const Apidata = await PcuserService.AddRemovePrerak({
      id: id,
      facilitator_id: userIds,
      edit_action:
        action === "add_facilitator" ? "add_facilitator" : "remove_facilitator",
    });
    if (Apidata?.data) {
      setIsSelectable(false);
      setSelectedRows([]);
      setAddPrerakCount(0);
      setRemovePrerakCount(0);
      setIsAddingPrerak(true);
      setIsDisable(false);
      setIsRemovePrerak(true);
      setIsCancelVisible(false);
      clearFilter();
    }
  };

  const handleAddPrerak = async () => {
    await fetchPrerakList();
    setIsSelectable(true);
    setIsRemovePrerak(false);
    setIsDisable(true);
    setIsCancelVisible(true);
    if (selectedRows.length > 0) {
      await AddRemovePrerak("add_facilitator");
    }
  };

  const handleRemovePrerak = async () => {
    await fetchUserList();
    setIsSelectable(true);
    setIsAddingPrerak(false);
    setIsRemovePrerak(true);
    setIsDisable(true);
    setIsCancelVisible(true);
    if (selectedRows.length > 0) {
      await AddRemovePrerak("remove_facilitator");
    }
  };

  const handleCancel = () => {
    setIsSelectable(false);
    setSelectedRows([]);
    setAddPrerakCount(0);
    setRemovePrerakCount(0);
    setIsAddingPrerak(true);
    setIsDisable(false);
    setIsRemovePrerak(true);
    setIsCancelVisible(false);
    clearFilter();
  };

  const handleRowSelected = useCallback(
    (state) => {
      const selected = state?.selectedRows;
      setSelectedRows(selected);

      if (isAddingPrerak) {
        setIsDisable(false);
        setAddPrerakCount(selected?.length);
      } else {
        setRemovePrerakCount(selected?.length);
        setIsDisable(false);
      }
      if (selected?.length === 0) {
        setIsDisable(true);
      }
    },
    [isAddingPrerak],
  );

  const handleSearch = (e) => {
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
  };

  const setBlock = async ({ district }) => {
    let newSchema = schema;
    if (newSchema?.properties?.block && district.length > 0) {
      const qData = await geolocationRegistryService.getMultipleBlocks({
        districts: district,
      });
      if (newSchema?.["properties"]?.["block"]) {
        newSchema = getOptions(newSchema, {
          key: "block",
          arr: qData,
          title: "block_name",
          value: "block_name",
        });
      }

      setSchema(newSchema);
    }
    return newSchema;
  };

  const onChange = async (e, id) => {
    const data = e.formData;
    setFormData(data);
    if (id === "root_district") {
      setFilter({ ...filter, district: data?.district });
      await setBlock({
        district: data?.district,
      });
    }
    if (id === "root_block") {
      setFilter({ ...filter, block: data?.block });
    }
  };

  const clearFilter = useCallback(() => {
    setFilter({});
    setFormData({});
    getDistrict();
  }, []);

  return (
    <SideColapsable
      isActive={filter?.district || filter?.block}
      sideCompoent={
        <VStack space={2}>
          <Form
            {...{
              validator,
              schema: schema || {},
              uiSchema,
              formData,
              onChange,
              //onSubmit,
              //transformErrors,
            }}
          >
            <Button display={"none"} type="submit"></Button>
          </Form>

          {(filter?.district || filter?.block) && (
            <Button variant="link" pt="3" onPress={clearFilter}>
              <AdminTypo.H6 color="blueText.400" underline bold>
                {t("CLEAR_FILTER")}
              </AdminTypo.H6>
            </Button>
          )}
        </VStack>
      }
    >
      <VStack pt={0} p={6} bg={"identifiedColor"} minH="800px">
        <HStack alignItems={"center"} p={4} justifyContent={"space-between"}>
          <AdminTypo.H6 bold color={"textGreyColor.500"}>
            {isAddingPrerak ? t("PRERAK_LIST") : t("ASSIGNED_PRERAK_LIST")}
          </AdminTypo.H6>
          <HStack space={4} alignItems={"center"} justifyContent={"center"}>
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
              onChange={handleSearch}
            />
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
                isDisabled={isDisable}
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
                isDisabled={isDisable}
                onPress={handleRemovePrerak}
              >
                {`${t("REMOVE_PRERAK")} ${
                  removePrerakCount > 0 ? ` (${removePrerakCount})` : ""
                }`}
              </AdminTypo.Secondarybutton>
            )}
          </HStack>
        </HStack>
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
          sortServer
          onChangeRowsPerPage={useCallback(
            (e) => {
              setFilter({ ...filter, limit: e, page: 1 });
              setAddPrerakCount(0);
              setRemovePrerakCount(0);
            },
            [setFilter, filter],
          )}
          onChangePage={useCallback(
            (e) => {
              setFilter({ ...filter, page: e });
            },
            [setFilter, filter],
          )}
        />
      </VStack>
    </SideColapsable>
  );
};

export default AssignedList;

AssignedList.propTypes = {
  setPcData: PropTypes.func,
};
