import {
  IconByName,
  ImageView,
  AdminTypo,
  tableCustomStyles,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, VStack, Pressable, Button, Menu } from "native-base";

import React, { memo, useCallback, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const dropDown = (triggerProps, t) => {
  return (
    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
      <HStack>
        <IconByName name="ArrowDownSLineIcon" isDisabled={true} />
      </HStack>
    </Pressable>
  );
};

// Table component
function Table({
  filter,
  setFilter,
  paginationTotalRows,
  data,
  loading,
  enumOptions,
}) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const pagination = [10, 15, 25, 50, 100];

  const columns = useCallback(
    (t, navigate) => [
      {
        name: t("PRERAK_ID"),
        selector: (row) => row?.id,
        sortable: true,
        attr: "id",
        wrap: true,
        width: "100px",
      },
      {
        name: t("NAME"),
        selector: (row) => (
          <HStack>
            <Pressable
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => navigate(`/admin/facilitator/${row?.id}`)}
            >
              <HStack alignItems={"center"} space={2}>
                {row?.profile_photo_1?.name ? (
                  <ImageView
                    urlObject={row?.profile_photo_1}
                    alt="Alternate Text"
                    width={"35px"}
                    height={"35px"}
                  />
                ) : (
                  <IconByName
                    isDisabled
                    name="AccountCircleLineIcon"
                    color="gray.300"
                    _icon={{ size: "35" }}
                  />
                )}
                <AdminTypo.H6 bold>
                  {`${row?.first_name} ${row?.last_name || ""}`}
                </AdminTypo.H6>
              </HStack>
            </Pressable>
          </HStack>
        ),
        attr: "name",
        wrap: "true",
        width: "250px",
      },
      {
        name: t("DISTRICT"),
        selector: (row) => (row?.district ? row?.district : "-"),
      },
      {
        name: t("OKYC_VERIFICATION"),
        wrap: true,
        selector: (row) =>
          ["okyc_ip_verified"].includes(row?.aadhar_verified)
            ? t("YES")
            : t("NO"),
      },
      {
        name: t("MOBILE_NUMBER"),
        selector: (row) => row?.mobile,
        attr: "mobile",
        wrap: true,
      },
      {
        name: t("STATUS"),
        selector: (row) => (
          <Pressable onPress={() => navigate(`/admin/facilitator/${row?.id}`)}>
            <ChipStatus status={row?.program_faciltators?.status} />
          </Pressable>
        ),
        wrap: true,
        attr: "status",
        width: "150px",
      },
      {
        name: t("GENDER"),
        selector: (row) => row?.gender,
        attr: "gender",
        width: "100px",
      },
      {
        minWidth: "140px",
        name: t("ACTION"),
        selector: (row) => (
          <Button.Group
            isAttached
            divider={<h3>|</h3>}
            my="3"
            size="sm"
            h="8"
            marginTop="8px"
            borderRadius="full"
            background="white"
            shadow="BlueOutlineShadow"
            borderWidth="1px"
            borderColor="#084B82"
            lineHeight={1}
            _text={{
              color: "blueText.400",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            <Button
              background="white"
              _text={{
                color: "blueText.400",
                fontSize: "14px",
                fontWeight: "700",
              }}
              onPress={() => {
                navigate(`/admin/facilitator/${row?.id}`);
              }}
            >
              {t("VIEW")}
            </Button>
            <Button variant="outline">
              <Menu
                w="190"
                placement="bottom right"
                trigger={(triggerProps) => dropDown(triggerProps, t)}
              >
                <Menu.Item
                  onPress={() => {
                    navigate(`/admin/facilitator/${row?.id}`);
                  }}
                >
                  {t("VIEW")}
                </Menu.Item>
                <Menu.Item
                  onPress={() => {
                    navigate(`/admin/Certification/${row?.id}`);
                  }}
                >
                  {t("DOWNLOAD_CERTIFICATE")}
                </Menu.Item>
              </Menu>
            </Button>
          </Button.Group>
        ),
      },
    ],
    []
  );

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/admin/facilitator/${row?.id}`);
    },
    [navigate]
  );

  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  return (
    <VStack>
      <VStack p={2} pt="0">
        <AdminTypo.H5 underline bold color="blueText.400">
          {filter?.status === undefined ? (
            t("ALL") + `(${paginationTotalRows})`
          ) : filter?.status?.[0] === "all" ? (
            <AdminTypo.H4 bold>
              {t("ALL") + `(${paginationTotalRows})`}
            </AdminTypo.H4>
          ) : (
            filter?.status
              ?.filter((item) => item)
              .map((item) => t(item).toLowerCase())
              .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
              .join(" , ")
            //+
            // `(${paginationTotalRows})` +
            // " "
          )}
        </AdminTypo.H5>
      </VStack>
      <DataTable
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

export default memo(Table);
