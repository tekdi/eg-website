import {
  IconByName,
  ImageView,
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

import React from "react";
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
  facilitaorStatus,
  paginationTotalRows,
  data,
  loading,
  enumOptions,
}) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const columns = React.useCallback(
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

  const handleRowClick = React.useCallback(
    (row) => {
      navigate(`/admin/facilitator/${row?.id}`);
    },
    [navigate]
  );

  const columnsMemoized = React.useMemo(
    () => columns(t, navigate),
    [t, navigate]
  );

  return (
    <VStack>
      <ScrollView horizontal={true} mb="2">
        <HStack pb="2">
          {Array?.isArray(facilitaorStatus) &&
            facilitaorStatus.map((item) => {
              return (
                <AdminTypo.H6
                  key={"table"}
                  color={
                    filter?.status == t(item?.status)
                      ? "textMaroonColor.600"
                      : ""
                  }
                  bold={filter?.status == t(item?.status) ? true : false}
                  cursor={"pointer"}
                  mx={3}
                  onPress={() => {
                    setFilter({ ...filter, status: item?.status, page: 1 });
                  }}
                >
                  {item.status === "all" ? (
                    <AdminTypo.H6
                      bold={filter?.status == t(item?.status) ? true : false}
                    >
                      {t("ALL")}
                    </AdminTypo.H6>
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
                </AdminTypo.H6>
              );
            })}
        </HStack>
      </ScrollView>
      <DataTable
        customStyles={tableCustomStyles}
        columns={columnsMemoized}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        paginationPerPage={filter?.limit ? filter?.limit : 15}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        paginationDefaultPage={filter?.page}
        highlightOnHover
        onChangeRowsPerPage={React.useCallback(
          (e) => {
            setFilter({ ...filter, limit: e, page: 1 });
          },
          [setFilter, filter]
        )}
        onChangePage={React.useCallback(
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

export default React.memo(Table);
