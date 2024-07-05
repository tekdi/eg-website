import React, { useCallback, useEffect, useState } from "react";
import {
  AdminTypo,
  PoAdminLayout,
  CardComponent,
  IconByName,
  eventService,
  Breadcrumb,
} from "@shiksha/common-lib";
import { Box, Button, HStack, Menu, Stack, VStack } from "native-base";
import Chip from "component/Chip";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";

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

const columns = (t, navigate) => [
  {
    name: t("ID"),
    selector: (row) => row?.id,
    sortable: true,
    sortField: "id",
    width: "100px",
    compact: true,
  },
  {
    name: t("STATE_NAME"),
    selector: (row) => row?.state_name || "-",
    sortable: true,
    sortField: "state_name",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("STATE_CD"),
    selector: (row) => row?.state_cd || "-",
    sortable: true,
    sortField: "state_cd",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("DISTRICT_NAME"),
    selector: (row) => row?.district_name || "-",
    wrap: true,
    left: true,
    compact: true,
    sortable: true,
    sortField: "district_name",
  },
  {
    name: t("DISTRICT_CD"),
    selector: (row) => row?.district_cd || "-",
    wrap: true,
    left: true,
    compact: true,
    sortable: true,
    sortField: "district_cd",
  },

  {
    name: t("UDISE_BLOCK_CODE"),
    selector: (row) => row?.udise_block_code || "-",
    attr: "udise_block_code",
    wrap: true,
    compact: true,
    sortable: true,
    sortField: "udise_block_code",
  },
  {
    name: t("BLOCK_NAME"),
    selector: (row) => row?.block_name || "-",
    sortable: true,
    sortField: "block_name",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("GRAMPANCHAYAT_CD"),
    selector: (row) => row?.grampanchayat_cd || "-",
    sortable: true,
    sortField: "grampanchayat_cd",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("GRAMPANCHAYAT_NAME"),
    selector: (row) => row?.grampanchayat_name || "-",
    sortable: true,
    sortField: "grampanchayat_name",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("VILLAGE_WARD_CD"),
    selector: (row) => row?.vill_ward_cd || "-",
    sortable: true,
    sortField: "vill_ward_cd",
    wrap: true,
    width: "100px",
    compact: true,
  },
  {
    name: t("VILLAGE_WARD_NAME"),
    selector: (row) => row?.village_ward_name || "-",
    sortable: true,
    sortField: "village_ward_name",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("SCHOOL_NAME"),
    selector: (row) => row?.school_name || "-",
    sortable: true,
    sortField: "school_name",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("UDISE_SCH_CODE"),
    selector: (row) => row?.udise_sch_code || "-",
    sortable: true,
    sortField: "udise_sch_code",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("SCH_CATEGORY_ID"),
    selector: (row) => row?.sch_category_id || "-",
    sortable: true,
    sortField: "sch_category_id",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("SCH_MANAGEMENT_ID"),
    selector: (row) => row?.nsch_mgmt_idame || "-",
    sortable: true,
    sortField: "sch_mgmt_id ",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("OPEN_SCHOOL_TYPE"),
    selector: (row) => row?.open_school_type || "-",
    sortable: true,
    sortField: "open_school_type",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
  {
    name: t("NODAL_CODE"),
    selector: (row) => row?.nodal_code || "-",
    sortable: true,
    sortField: "nodal_code",
    width: "150px",
    wrap: true,
    left: true,
    compact: true,
  },
];

function View() {
  const { t } = useTranslation();
  const [address, setAddress] = useState();
  const { id } = useParams();

  useEffect(async () => {
    const data = await eventService.getOneAddressDetails(id);
    setAddress(data?.data);
  }, []);

  return (
    <PoAdminLayout>
      <VStack flex={1} pt="3" space={4} p="2">
        <Breadcrumb
          drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
          data={[
            {
              title: (
                <HStack>
                  <IconByName name="GroupLineIcon" size="md" />
                  <AdminTypo.H4 bold color="Activatedcolor.400">
                    {t("ALL_ADDRESSES")}
                  </AdminTypo.H4>
                </HStack>
              ),
              link: "/poadmin/Address",
              icon: "GroupLineIcon",
            },

            <Chip textAlign="center" lineHeight="15px" label={address?.id} />,
          ]}
        />
        <HStack space={4}>
          <CardComponent
            _header={{ bg: "light.100" }}
            _vstack={{ space: 0, flex: 1, bg: "light.100" }}
            _hstack={{ borderBottomWidth: 0, p: 1 }}
            item={{ ...address }}
            title={t("BASIC_DETAILS")}
            label={[
              "STATE_NAME",
              "STATE_CD",
              "DISTRICT_NAME",
              "DISTRICT_CD",
              "UDISE_BLOCK_CODE",
              "BLOCK_NAME",
              "GRAMPANCHAYAT_CD",
              "GRAMPANCHAYAT_NAME",
              "VILLAGE_WARD_CD",
              "VILLAGE_WARD_NAME",
              "SCHOOL_NAME",
              "UDISE_SCH_CODE",
              "SCH_CATEGORY_ID",
              "SCH_MANAGEMENT_ID",
              "OPEN_SCHOOL_TYPE",
              "NODAL_CODE",
            ]}
            arr={[
              "id",
              "state_name",
              "state_cd",
              "district_name",
              "district_cd",
              "udise_block_code",
              "block_name",
              "grampanchayat_cd",
              "grampanchayat_name",
              "vill_ward_cd",
              "village_ward_name",
              "school_name",
              "udise_sch_code",
              "sch_category_id",
              "sch_mgmt_id",
              "open_school_type",
              "nodal_code",
            ]}
          />
        </HStack>
        <VStack pt={0} p={6}>
          <DataTable
            data={data}
            columns={columns(t)}
            customStyles={CustomStyles}
            progressPending={loading}
            pagination
            paginationRowsPerPageOptions={pagination}
            paginationServer
            paginationTotalRows={paginationTotalRows}
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
            onRowClicked={handleRowClick}
          />
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}

View.propTypes = {};
const pagination = [10, 15, 25, 50, 100];

export default View;
