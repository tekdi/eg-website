import {
  IconByName,
  facilitatorRegistryService,
  ImageView,
  AdminTypo,
  debounce,
  GetEnumValue,
} from "@shiksha/common-lib";
import {
  HStack,
  VStack,
  Modal,
  Image,
  Text,
  ScrollView,
  Input,
} from "native-base";

import { tableCustomStyles } from "../../../component/BaseInput";

import React from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Table component
function Table({ facilitator, paginationTotalRows, loading, duplicateData }) {
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
          <AdminTypo.H1 px="5">{t("DUPLICATE")}</AdminTypo.H1>
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
      />
    </VStack>
  );
}

export default Table;
