import React, { useCallback, useEffect, useState } from "react";
import {
  AdminTypo,
  PoAdminLayout,
  CardComponent,
  IconByName,
  eventService,
  Breadcrumb,
} from "@shiksha/common-lib";
import { HStack, VStack } from "native-base";
import Chip from "component/Chip";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { CustomStyles } from "../CommonStyles";
import { columns } from "./Column";

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
              [setFilter, filter],
            )}
            onChangePage={useCallback(
              (e) => {
                setFilter({ ...filter, page: e });
              },
              [setFilter, filter],
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
