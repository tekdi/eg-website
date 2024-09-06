import React, { useCallback, useEffect, useState } from "react";
import {
  AdminTypo,
  geolocationRegistryService,
  getSelectedProgramId,
  getOptions,
  tableCustomStyles,
  cohortService,
  PcuserService,
} from "@shiksha/common-lib";
import { HStack, Stack, VStack, Input, Box } from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { debounce } from "lodash";
import { MultiCheck } from "../../../component/BaseInput";

const DailyActivityList = ({ setPcData, setassignPrerak }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  //   const navigate = useNavigate();
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
      name: t("TITLE"),
      sortField: "title",
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
      name: t("DETAILS"),
      selector: (row) => row?.user?.details || "---",
      wrap: true,
    },
    {
      name: t("DURATION"),
      selector: (row) => row?.user?.mobile || "-",
      wrap: true,
    },
    {
      name: t("STATUS"),
      selector: (row) => <ChipStatus status={row?.status} />,
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
        title: "TITLE",
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
        title: "DETAILS",
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
      id: 21540,
      ...filter,
    });

    setPaginationTotalRows(
      Apidata?.data?.total_count ? Apidata?.data?.total_count : 0
    );
    setData(Apidata?.data?.facilitators);
    setPcData(Apidata?.data?.users?.[0]);
    setassignPrerak(Apidata?.data?.preraks_assigned);
  };

  const fetchPrerakList = async () => {
    const Apidata = await cohortService.PcAvailableFacilitator({
      id: 21540,
      ...filter,
    });
    setPaginationTotalRows(
      Apidata?.data?.total_count ? Apidata?.data?.total_count : 0
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
    [isAddingPrerak]
  );

  const handleSearch = (e) => {
    setFilter({ ...filter, search: e.nativeEvent.text, page: 1 });
  };

  return (
    <Stack backgroundColor={"identifiedColor"} alignContent={"center"}>
      <AdminTypo.H6 bold color={"textGreyColor.500"}>
        {t("PC_ACTIVITIES")}
      </AdminTypo.H6>

      <HStack
        alignItems={"center"}
        p={4}
        justifyContent={"space-between"}
      ></HStack>
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

export default DailyActivityList;
