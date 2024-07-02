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
import React from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// Table component
function Table({ filter, setFilter, paginationTotalRows, data, loading }) {
  const [beneficiaryStatus, setBeneficiaryStatus] = React.useState();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = React.useCallback(
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
            <Pressable onPress={() => navigate(`/poadmin/learners/${row?.id}`)}>
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
                {row?.program_beneficiaries?.status ===
                "enrolled_ip_verified" ? (
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
          <Pressable onPress={() => navigate(`/poadmin/learners/${row?.id}`)}>
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
              navigate(`/poadmin/learners/${row?.id}`);
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

  const fetchEnumRegistry = React.useCallback(async () => {
    const result = await enumRegistryService.listOfEnum();
    setBeneficiaryStatus(result?.data?.BENEFICIARY_STATUS);
  }, []);

  React.useEffect(() => {
    fetchEnumRegistry();
  }, [fetchEnumRegistry]);

  const handleRowClick = React.useCallback(
    (row) => {
      navigate(`/poadmin/learners/${row?.id}`);
    },
    [navigate]
  );

  const filteredStatusText = React.useMemo(() => {
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

  const statusTexts = React.useMemo(() => {
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

  const columnsMemoized = React.useMemo(
    () => columns(t, navigate),
    [t, navigate]
  );

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
        highlightOnHover
      />
    </VStack>
  );
}

Table.PropTypes = {
  filter: PropTypes.any,
  setFilter: PropTypes.any,
  paginationTotalRows: PropTypes.any,
  data: PropTypes.any,
  loading: PropTypes.bool,
};

export default React.memo(Table);
