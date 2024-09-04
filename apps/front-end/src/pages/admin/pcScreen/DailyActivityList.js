import React, { useCallback, useEffect, useState } from "react";
import {
  AdminTypo,
  PcuserService,
  tableCustomStyles,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, Stack, VStack } from "native-base";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
const DailyActivityList = ({ setPcData, setassignPrerak }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);

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

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const Apidata = await PcuserService.pcDetails({
        id: 21540,
        ...filter,
      });

      setPaginationTotalRows(
        Apidata?.data?.total_count ? Apidata?.data?.total_count : 0,
      );
      setData(Apidata?.data?.facilitators);
      setPcData(Apidata?.data?.users?.[0]);
      setassignPrerak(Apidata?.data?.preraks_assigned);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [filter]);

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
          clearSelectedRows={false}
          paginationDefaultPage={filter?.page || 1}
          highlightOnHover
          sortServer
          onChangeRowsPerPage={useCallback(
            (e) => {
              setFilter({ ...filter, limit: e, page: 1 });
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
    </Stack>
  );
};

export default DailyActivityList;

DailyActivityList.propTypes = {
  setPcData: PropTypes.func,
  setassignPrerak: PropTypes.func,
};
