import {
  IconByName,
  ImageView,
  AdminTypo,
  enumRegistryService,
  tableCustomStyles,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";
import { HStack, VStack, Text, ScrollView } from "native-base";
import React from "react";
import DataTable from "react-data-table-component";

import { useTranslation } from "react-i18next";

const columns = (t) => [
  {
    name: t("LEARNERS_ID"),
    selector: (row) => row?.id,
  },
  {
    name: t("LEARNERS_NAME"),
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
        {row?.program_beneficiaries?.status === "enrolled_ip_verified" ? (
          <AdminTypo.H5 bold>
            {row?.program_beneficiaries?.enrollment_first_name + " "}
            {row?.program_beneficiaries?.enrollment_last_name
              ? row?.program_beneficiaries?.enrollment_last_name
              : ""}
          </AdminTypo.H5>
        ) : (
          <AdminTypo.H5 bold>
            {row?.first_name + " "}
            {row?.last_name ? row?.last_name : ""}
          </AdminTypo.H5>
        )}
      </HStack>
    ),
    attr: "name",
    wrap: true,
  },
  {
    name: t("LEARNERS_AGE"),
    selector: (row) => {
      if (row?.program_beneficiaries?.status === "enrolled_ip_verified") {
        if (row?.program_beneficiaries_enrollment_dob) {
          return moment().diff(
            row?.program_beneficiaries.enrollment_dob,
            "years"
          );
        } else {
          return "-";
        }
      } else {
        if (row?.dob) {
          return moment().diff(row?.dob, "years");
        } else {
          return "-";
        }
      }
    },
  },
  {
    name: t("PRERAK_ID"),
    selector: (row) => row?.program_beneficiaries?.id,
  },
  {
    name: t("PRERAK_NAME"),
    selector: (row) => {
      const {
        program_beneficiaries: {
          facilitator_user: { first_name, last_name },
        },
      } = row;
      return first_name || last_name ? `${first_name} ${last_name || ""}` : "-";
    },
    wrap: true,
  },
  {
    name: t("STATUS"),
    selector: (row, index) => (
      <ChipStatus
        key={index}
        is_duplicate={row?.is_duplicate}
        is_deactivated={row?.is_deactivated}
        status={row?.program_beneficiaries?.status}
      />
    ),

    attr: "email",
    wrap: true,
  },
];

// Table component
function Table({ filter, setFilter, paginationTotalRows, data, loading }) {
  const [beneficiaryStatus, setBeneficiaryStatus] = React.useState();

  const { t } = useTranslation();

  React.useEffect(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBeneficiaryStatus(result?.data?.BENEFICIARY_STATUS);
  }, []);

  return (
    <VStack>
      <ScrollView horizontal={true} mb="2">
        <HStack pb="2">
          <Text
            color={!filter?.status ? "blueText.400" : ""}
            bold={!filter?.status}
            cursor={"pointer"}
            mx={3}
            onPress={() => {
              const { status, ...newFilter } = filter;
              setFilter(newFilter);
            }}
          >
            {t("BENEFICIARY_ALL")}
            {!filter?.status && `(${paginationTotalRows})`}
          </Text>
          {beneficiaryStatus?.map((item) => {
            return (
              <Text
                key={item}
                color={filter?.status == t(item?.value) ? "blueText.400" : ""}
                bold={filter?.status == t(item?.value)}
                cursor={"pointer"}
                mx={3}
                onPress={() => {
                  setFilter({ ...filter, status: item?.value, page: 1 });
                }}
              >
                {t(item?.title)}
                {filter?.status == t(item?.value) && `(${paginationTotalRows})`}
              </Text>
            );
          })}
        </HStack>
      </ScrollView>
      <DataTable
        customStyles={tableCustomStyles}
        columns={[...columns(t)]}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={(e) => {
          setFilter({ ...filter, limit: e, page: 1 });
        }}
        onChangePage={(e) => {
          setFilter({ ...filter, page: e });
        }}
      />
    </VStack>
  );
}

export default Table;
