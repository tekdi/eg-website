import {
  IconByName,
  ImageView,
  AdminTypo,
  GetEnumValue,
  tableCustomStyles,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, VStack, Text, ScrollView } from "native-base";

import React from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const columns = (t, navigate) => [
  {
    name: t("NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        {row?.profile_photo_1?.name ? (
          <ImageView
            source={{
              uri: row?.profile_photo_1?.name,
            }}
            // alt="Alternate Text"
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
        <AdminTypo.H5 bold>
          {row?.first_name + " " + row.last_name}
        </AdminTypo.H5>
      </HStack>
    ),
    attr: "name",
  },
  {
    name: t("DISTRICT"),
    selector: (row) => (row?.district ? row?.district : "-"),
  },
  {
    name: t("QUALIFICATION"),
    selector: (row) => row?.qualifications?.qualification_master?.name || "-",
  },
  {
    name: t("MOBILE_NUMBER"),
    selector: (row) => row?.mobile,

    attr: "email",
  },
  {
    name: t("STATUS"),
    selector: (row) => <ChipStatus status={row?.program_faciltators?.status} />,

    wrap: true,
    attr: "email",
  },
  {
    name: t("GENDER"),
    selector: (row) => row?.gender,

    attr: "city",
  },
  {
    name: t("ACTION"),
    selector: (row) => (
      <AdminTypo.Secondarybutton
        my="3"
        onPress={() => {
          navigate(`/admin/view/${row?.id}`);
        }}
      >
        {t("VIEW")}
      </AdminTypo.Secondarybutton>
    ),
  },
];
// Table component
function Table({
  filter,
  setFilter,
  facilitaorStatus,
  paginationTotalRows,
  data,
  loading,
  enumOptions,
  facilitator,
}) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  // {
  //   console.log("facilitator", facilitator);
  // }
  return (
    <VStack>
      <ScrollView horizontal={true} mb="2">
        <HStack pb="2">
          {facilitaorStatus?.map((item) => {
            return (
              <Text
                key={"table"}
                color={filter?.status == t(item?.status) ? "blueText.400" : ""}
                bold={filter?.status == t(item?.status) ? true : false}
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
                {`(${item?.count})`}
              </Text>
            );
          })}
        </HStack>
      </ScrollView>
      <DataTable
        customStyles={tableCustomStyles}
        columns={columns(t, navigate)}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        paginationPerPage={filter?.limit ? filter?.limit : 15}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        paginationDefaultPage={filter?.page}
        onChangeRowsPerPage={(e) => {
          setFilter({ ...filter, limit: e });
        }}
        onChangePage={(e) => {
          setFilter({ ...filter, page: e });
        }}
      />
    </VStack>
  );
}

export default Table;
