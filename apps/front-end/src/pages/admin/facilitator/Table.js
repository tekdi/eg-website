import {
  IconByName,
  AdminTypo,
  tableCustomStyles,
  enumRegistryService,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, VStack, Pressable, Button, Menu } from "native-base";

import React, { memo, useCallback, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const dropDown = (triggerProps, t) => {
  return (
    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
      <IconByName name="ArrowDownSLineIcon" isDisabled={true} px="1.5" />
    </Pressable>
  );
};

// Table component
function Table({ filter, setFilter, paginationTotalRows, data, loading }) {
  const { t } = useTranslation();
  const [selectedData, setSelectedData] = useState();
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
          <HStack display="inline-block" width={"100%"}>
            <Pressable
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => navigate(`/admin/facilitator/${row?.id}`)}
            >
              {/* <HStack alignItems={"center"}> */}
              {/* {row?.profile_photo_1?.name ? (
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
                )} */}
              <AdminTypo.H6 bold word-wrap="break-word" dispa>
                {`${row?.first_name} ${row?.last_name || ""}`}
              </AdminTypo.H6>
              {/* </HStack> */}
            </Pressable>
          </HStack>
        ),
        attr: "name",
        width: "150px",
        wrap: true,
      },
      {
        name: t("DISTRICT"),
        selector: (row) => row?.district || "-",
      },
      {
        name: t("BLOCK"),
        selector: (row) => row?.block || "-",
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
            <ChipStatus
              py="1"
              px="1"
              status={row?.program_faciltators?.status}
            />
          </Pressable>
        ),
        wrap: true,
        attr: "status",
        width: "150px",
      },
      {
        name: t("OKYC_VERIFICATION"),
        wrap: true,
        selector: (row) => {
          return row?.aadhar_verified === "okyc_ip_verified"
            ? t("OKYC_IP_VERIFIED")
            : row?.aadhar_verified === "yes"
            ? t("YES")
            : t("NO");
        },
      },
      {
        minWidth: "140px",
        name: t("ACTION"),
        selector: (row) => (
          <Button.Group
            isAttached
            divider={<div style={{ background: "#333", padding: "0.5px" }} />}
            my="1"
            h="6"
            rounded={"full"}
            shadow="BlueOutlineShadow"
            borderWidth="1px"
          >
            <Button
              background="white"
              px="1.5"
              _text={{
                color: "blueText.400",
                fontSize: "12px",
                fontWeight: "700",
              }}
              onPress={() => {
                navigate(`/admin/facilitator/${row?.id}`);
              }}
            >
              {t("VIEW")}
            </Button>
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
          {filter?.status === undefined || filter?.status?.length === 0 ? (
            t("ALL") + `(${paginationTotalRows})`
          ) : filter?.status?.[0] === "all" ? (
            <AdminTypo.H4 bold>
              {t("ALL") + `(${paginationTotalRows})`}
            </AdminTypo.H4>
          ) : (
            filter?.status
              ?.filter((item) => item)
              .map(
                (item) =>
                  t(item).toLowerCase() +
                  `(${
                    selectedData
                      ? selectedData?.find((e) => item === e.status)?.count
                      : 0
                  })`
              )
              .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
              .join(" , ")
          )}
        </AdminTypo.H5>
      </VStack>
      <DataTable
        customStyles={{
          ...tableCustomStyles,
          rows: {
            style: {
              minHeight: "20px", // override the row height
              cursor: "pointer",
            },
          },
          cells: { style: { padding: "0" } },
          pagination: { style: { margin: "20px 0" } },
        }}
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
