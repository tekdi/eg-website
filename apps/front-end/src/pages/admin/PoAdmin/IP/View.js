import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  AdminTypo,
  PoAdminLayout,
  CardComponent,
  IconByName,
  organisationService,
} from "@shiksha/common-lib";
import { Box, HStack, Stack, VStack } from "native-base";
import Chip, { ChipStatus } from "component/Chip";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import UserList from "./UserList";
import DataTable from "react-data-table-component";

export const CustomStyles = {
  rows: {
    style: {
      // minHeight: "72px",
    },
  },
  headCells: {
    style: {
      // background: "#BEBEBE",
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
    name: t("ROLE"),
    selector: (row) =>
      row?.program_users?.[0]?.role_slug
        ? row?.program_users?.[0]?.role_slug
        : "-",
    wrap: true,
  },
  {
    name: t("MOBILE"),
    selector: (row) => (row?.mobile ? row?.mobile : "-"),
    wrap: true,
  },
];

function View() {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(async () => {
    const data = await organisationService.getDetailsOfIP({ id });
    setData(data?.data?.[0]);
  }, []);

  return (
    <PoAdminLayout>
      <VStack flex={1} space={"5"} p="2">
        <HStack alignItems={"center"} space="1" pt="3">
          <IconByName name="GroupLineIcon" size="md" />
          <AdminTypo.H4 bold color="Activatedcolor.400">
            {t("ALL_IPS")}
          </AdminTypo.H4>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(`/poadmin/ips`)}
          />
          <AdminTypo.H4
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            bold
          >
            {data?.first_name} {data?.last_name}
          </AdminTypo.H4>
          <IconByName
            size="sm"
            name="ArrowRightSLineIcon"
            onPress={(e) => navigate(`/poadmin/ips`)}
          />
          <Chip textAlign="center" lineHeight="15px" label={data?.id} />
        </HStack>

        <HStack space={4} pl={4}>
          <Box width={"45%"}>
            <CardComponent
              _body={{ bg: "light.100" }}
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              item={{
                ...data,
                full_name: `${data?.first_name}  ${data?.last_name}`,
              }}
              title={t("BASIC_DETAILS")}
              label={[
                "IP_ID",
                "IP_NAME",
                "CONTACT_PERSON",
                "CONTACT_PERSON_MOBILE",
                "EMAIL_ID",
                "IP_ADDRESS",
                "LEARNER_TARGET",
              ]}
              arr={[
                "id",
                "full_name",
                "contact_person",
                "contact_person_mobile",
                "email_id",
                "address",
                "learner_target",
              ]}
            />
          </Box>
          <Box width={"50%"}>
            <CardComponent
              _body={{ bg: "light.100" }}
              _header={{ bg: "light.100" }}
              _vstack={{ space: 0 }}
              _hstack={{ borderBottomWidth: 0, p: 1 }}
              item={data}
              title={t("DOCUMENT_DETAILS")}
              label={["FIRST_NAME", "MIDDLE_NAME", "LAST_NAME", "MOBILE_NO"]}
              arr={["first_name", "middle_name", "last_name", "mobile"]}
              // buttonText={<AdminTypo.H5>User list</AdminTypo.H5>}
              // _buttonStyle={{ py: "2" }}
              // onButtonClick={handleButtonClick}
            />
          </Box>
        </HStack>
        <DataList />
        {/* <UserList /> */}
      </VStack>
    </PoAdminLayout>
  );
}

View.propTypes = {};

export function DataList() {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const { id } = useParams();
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const navigate = useNavigate();

  useEffect(async () => {
    const data = await organisationService.getIpUserList({
      organisation_id: id,
    });
    setPaginationTotalRows(data?.data?.length ? data?.data?.length : 0);
    setData(data?.data);
  }, []);

  const handleRowClick = useCallback(
    (row) => {
      console.log({ row });
      navigate(`/poadmin/ips/${id}/user/${row?.id}`);
    },
    [navigate]
  );

  return (
    <Stack backgroundColor={"identifiedColor"} alignContent={"center"}>
      <HStack alignItems={"center"} p={4} justifyContent={"space-between"}>
        <AdminTypo.H6 bold color={"textGreyColor.500"}>
          {t("IP_TEAM_LIST")}
        </AdminTypo.H6>
        <AdminTypo.Secondarybutton
          onPress={() => navigate(`/poadmin/ips/${id}/user-create`)}
        >
          {t("ADD_NEW_IP_USER")}
        </AdminTypo.Secondarybutton>
      </HStack>
      <Box pt={0} p={6}>
        <DataTable
          data={data}
          columns={columns(t)}
          customStyles={CustomStyles}
          pagination
          paginationServer
          paginationTotalRows={paginationTotalRows}
          paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
          onRowClicked={handleRowClick}
          highlightOnHover
        />
      </Box>
    </Stack>
  );
}

export default View;
