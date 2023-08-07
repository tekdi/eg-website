import { IconByName, AdminTypo, tableCustomStyles } from "@shiksha/common-lib";
import { HStack, VStack, Image } from "native-base";

import React from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Table component
function Table({
  facilitator,
  paginationTotalRows,
  loading,
  duplicateData,
  setFilter,
  Filter,
}) {
  const { t } = useTranslation();
  const columns = (e) => [
    {
      name: t("AADHAAR_NUMBER"),
      selector: (row) => row?.aadhar_no,

      sortable: true,
      attr: "aadhaar ",
    },
    {
      name: t("COUNT"),
      selector: (row) => row?.count,
      sortable: true,
      attr: "Count",
    },
  ];
  const navigate = useNavigate();

  return (
    <VStack>
      <HStack my="1" mb="3" justifyContent="space-between">
        <HStack justifyContent="space-between" alignItems="center">
          <Image
            source={{
              uri: "/profile.svg",
            }}
            alt=""
            size={"xs"}
            resizeMode="contain"
          />
          <AdminTypo.H1 color="Activatedcolor.400">
            {" "}
            {t("LEARNERS")}
          </AdminTypo.H1>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate("/admin/learner")}
          />
          <AdminTypo.H1 px="5">{t("DUPLICATE_LIST")}</AdminTypo.H1>
          <Image
            source={{
              uri: "/box.svg",
            }}
            alt=""
            size={"28px"}
            resizeMode="contain"
          />
        </HStack>
      </HStack>
      <DataTable
        customStyles={tableCustomStyles}
        columns={[
          ...columns(),
          {
            name: t("ACTION"),
            selector: (row) => (
              <AdminTypo.Secondarybutton
                my="3"
                onPress={() => {
                  navigate(`/admin/view/duplicate/${row?.aadhar_no}`);
                }}
              >
                {t("VIEW")}
              </AdminTypo.Secondarybutton>
            ),
          },
        ]}
        data={duplicateData}
        persistTableHead
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
        paginationServer
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={(e) => {
          setFilter({ ...Filter, limit: e });
        }}
        onChangePage={(e) => {
          setFilter({ ...Filter, page: e });
        }}
      />
    </VStack>
  );
}

export default Table;
