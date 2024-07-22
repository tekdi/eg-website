import React, { useEffect, useState } from "react";
import {
  AdminTypo,
  IconByName,
  PoAdminLayout,
  organisationService,
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { HStack, VStack } from "native-base";
import { useNavigate, useParams } from "react-router-dom";

export const CustomStyles = {
  rows: {
    style: {
      minHeight: "72px",
    },
  },
  headCells: {
    style: {
      background: "#E0E0E0",
      color: "#616161",
      size: "16px",
      justifyContent: "center", // override the alignment of columns
    },
  },
  cells: {
    style: {
      color: "#616161",
      size: "19px",
      justifyContent: "center", // override the alignment of columns
    },
  },
};

const columns = (t) => [
  {
    name: t("ID"),
    selector: (row) => row?.id,
    wrap: true,
  },
  {
    name: t("NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        <AdminTypo.H7 bold>
          {row?.first_name + " "}
          {row?.last_name ? row?.last_name : ""}
        </AdminTypo.H7>
      </HStack>
    ),
    wrap: true,
  },
  {
    name: t("MOBILE"),
    selector: (row) => (row?.mobile ? row?.mobile : "-"),
    wrap: true,
  },
];

function UserList() {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const { id } = useParams();
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const navigate = useNavigate();

  useEffect(async () => {
    const data = await organisationService.getIpUserList();
    setPaginationTotalRows(data?.data?.length ? data?.data?.length : 0);
    setData(data?.data);
  }, []);

  return (
    <PoAdminLayout>
      <VStack p={3}>
        <HStack alignItems={"center"} space="1" pt="3">
          <IconByName name="UserLineIcon" size="md" />
          <AdminTypo.H4 bold color="Activatedcolor.400">
            {t("ALL_IPS")}
          </AdminTypo.H4>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(`/poadmin/ips/${id}`)}
          />
        </HStack>
        <VStack p={4}>
          <DataTable
            data={data}
            columns={columns(t)}
            customStyles={CustomStyles}
            pagination
            paginationServer
            paginationTotalRows={paginationTotalRows}
            paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
          />
        </VStack>
      </VStack>
    </PoAdminLayout>
  );
}

export default UserList;
