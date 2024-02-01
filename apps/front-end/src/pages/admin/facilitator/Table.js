import {
  IconByName,
  AdminTypo,
  GetEnumValue,
  tableCustomStyles,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import {
  HStack,
  VStack,
  ScrollView,
  Pressable,
  Button,
  Menu,
} from "native-base";

import React, { memo, useCallback, useMemo } from "react";
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
function Table({
  filter,
  setFilter,
  facilitaorStatus,
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
              <AdminTypo.H6 bold>
                {`${row?.first_name} ${row?.last_name || ""}`}
              </AdminTypo.H6>
              {/* </HStack> */}
            </Pressable>
          </HStack>
        ),
        attr: "name",
        width: "150px",
        wrap: "true",
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
      <ScrollView horizontal={true} mb="2">
        <HStack pb="2">
          {Array?.isArray(facilitaorStatus) &&
            facilitaorStatus.map((item) => {
              return (
                <AdminTypo.H5
                  key={item?.id}
                  color={
                    filter?.status == t(item?.status) ? "blueText.400" : ""
                  }
                  bold={filter?.status == t(item?.status)}
                  cursor={"pointer"}
                  mx={3}
                  onPress={() => {
                    setFilter({ ...filter, status: item?.status, page: 1 });
                  }}
                >
                  {item.status === "all" ? (
                    <AdminTypo.H5>{t("ALL")}</AdminTypo.H5>
                  ) : (
                    <GetEnumValue
                      t={t}
                      enumType={"FACILITATOR_STATUS"}
                      enumOptionValue={item?.status}
                      enumApiData={enumOptions}
                    />
                  )}
                  {filter?.status == t(item?.status)
                    ? `(${paginationTotalRows})` + " "
                    : " "}
                </AdminTypo.H5>
              );
            })}
        </HStack>
      </ScrollView>
      <DataTable
        customStyles={{
          ...tableCustomStyles,
          rows: {
            style: {
              minHeight: "45px", // override the row height
              cursor: "pointer",
            },
          },
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
