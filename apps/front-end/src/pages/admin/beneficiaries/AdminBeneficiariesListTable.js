import {
  IconByName,
  ImageView,
  AdminTypo,
  enumRegistryService,
  tableCustomStyles,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/BeneficiaryStatus";
import moment from "moment";
import { HStack, VStack, Text, ScrollView, Pressable } from "native-base";
import React, { memo, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useMemo } from "react";

// Table component
function Table({ filter, setFilter, paginationTotalRows, data, loading }) {
  const [beneficiaryStatus, setBeneficiaryStatus] = useState();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = useCallback(
    (t, navigate) => [
      {
        name: t("LEARNERS_ID"),
        selector: (row) => row?.id,
        wrap: true,
        width: "95px",
      },
      {
        name: t("LEARNERS_NAME"),
        selector: (row) => (
          <HStack>
            <Pressable
              onPress={() => navigate(`/admin/beneficiary/${row?.id}`)}
            >
              <HStack alignItems={"center"} space={2}>
                {row?.profile_photo_1?.name ? (
                  <ImageView
                    urlObject={row?.profile_photo_1}
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
                {[
                  "enrolled_ip_verified",
                  "registered_in_camp",
                  "ineligible_for_pragati_camp",
                  "10th_passed",
                  "pragati_syc",
                ].includes(row?.program_beneficiaries?.status) ? (
                  <AdminTypo.H6 bold>
                    {row?.program_beneficiaries?.enrollment_first_name + " "}
                    {row?.program_beneficiaries?.enrollment_last_name
                      ? row?.program_beneficiaries?.enrollment_last_name
                      : ""}
                  </AdminTypo.H6>
                ) : (
                  <AdminTypo.H6 bold>
                    {row?.first_name + " "}
                    {row?.last_name ? row?.last_name : ""}
                  </AdminTypo.H6>
                )}
              </HStack>
            </Pressable>
          </HStack>
        ),
        attr: "name",
        wrap: true,
        width: "250px",
      },
      {
        name: t("LEARNERS_AGE"),
        selector: (row) => {
          if (row?.program_beneficiaries?.status === "enrolled_ip_verified") {
            if (row?.program_beneficiaries?.enrollment_dob) {
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
        selector: (row) => row?.program_beneficiaries?.facilitator_id,
      },
      {
        name: t("PRERAK_NAME"),
        selector: (row) => {
          const {
            program_beneficiaries: {
              facilitator_user: { first_name, last_name },
            },
          } = row;
          return first_name || last_name
            ? `${first_name} ${last_name || ""}`
            : "-";
        },
        wrap: true,
        width: "250px",
      },
      {
        name: t("STATUS"),
        selector: (row, index) => (
          <Pressable onPress={() => navigate(`/admin/beneficiary/${row?.id}`)}>
            <ChipStatus
              key={index}
              is_duplicate={row?.is_duplicate}
              is_deactivated={row?.is_deactivated}
              status={row?.program_beneficiaries?.status}
            />
          </Pressable>
        ),

        attr: "email",
        wrap: true,
        width: "250px",
      },
      {
        name: t("ACTION"),
        selector: (row) => (
          <AdminTypo.Secondarybutton
            my="3"
            onPress={() => {
              navigate(`/admin/beneficiary/${row?.id}`);
            }}
          >
            {t("VIEW")}
          </AdminTypo.Secondarybutton>
        ),
        wrap: true,
      },
    ],
    []
  );

  const fetchEnumRegistry = useCallback(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBeneficiaryStatus(result?.data?.BENEFICIARY_STATUS);
  }, []);

  useEffect(() => {
    fetchEnumRegistry();
  }, [fetchEnumRegistry]);

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/admin/beneficiary/${row?.id}`);
    },
    [navigate]
  );

  const filteredStatusText = useMemo(() => {
    return (
      <Text
        color={!filter?.status ? "textMaroonColor.600" : ""}
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
    );
  }, [filter, paginationTotalRows, setFilter, t]);

  const statusTexts = useMemo(() => {
    return beneficiaryStatus?.map((item) => (
      <Text
        key={item}
        color={filter?.status === t(item?.value) ? "textMaroonColor.600" : ""}
        bold={filter?.status === t(item?.value)}
        cursor={"pointer"}
        mx={3}
        onPress={() => {
          setFilter({ ...filter, status: item?.value, page: 1 });
        }}
      >
        {t(item?.title)}
        {filter?.status === t(item?.value) && `(${paginationTotalRows})`}
      </Text>
    ));
  }, [beneficiaryStatus, filter, paginationTotalRows, setFilter, t]);

  const columnsMemoized = useMemo(() => columns(t, navigate), [t, navigate]);

  return (
    <VStack>
      <ScrollView horizontal={true} mb="2">
        <HStack pb="2">
          {filteredStatusText}
          {statusTexts}
        </HStack>
      </ScrollView>
      <DataTable
        customStyles={tableCustomStyles}
        columns={columnsMemoized}
        data={data}
        persistTableHead
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={paginationTotalRows}
        paginationDefaultPage={filter?.page || 1}
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
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
        highlightOnHover
      />
    </VStack>
  );
}

Table.PropTypes = {
  filter: PropTypes.any,
  setFilter: PropTypes.func,
  paginationTotalRows: PropTypes.any,
  data: PropTypes.any,
  loading: PropTypes.bool,
};
export default memo(Table);
