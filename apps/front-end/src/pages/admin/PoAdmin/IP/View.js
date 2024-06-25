import React, { memo, useCallback, useEffect, useState } from "react";
import {
  AdminTypo,
  PoAdminLayout,
  CardComponent,
  IconByName,
  organisationService,
  Breadcrumb,
} from "@shiksha/common-lib";
import { Button, HStack, Menu, Stack, VStack } from "native-base";
import Chip from "component/Chip";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
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
    sortable: true,
    sortField: "id",
    selector: (row) => row?.id,
    wrap: true,
  },
  {
    name: t("NAME"),
    sortable: true,
    sortField: "first_name",
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
    name: t("USERNAME"),
    selector: (row) => (row?.username ? row?.username : "-"),
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
    name: t("MOBILE_NO"),
    selector: (row) => (row?.mobile ? row?.mobile : "-"),
    wrap: true,
  },
];

function View() {
  const { t } = useTranslation();
  const [organisation, setOrganisation] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(async () => {
    const data = await organisationService.getOne({ id });
    setOrganisation(data?.data);
  }, []);

  const handleEditButton = () => {
    const step = "edit";
    navigate(`/poadmin/ip/${id}/edit`);
  };
  return (
    <PoAdminLayout>
      <VStack flex={1} pt="3" space={4} p="2">
        <Breadcrumb
          drawer={<IconByName size="sm" name="ArrowRightSLineIcon" />}
          data={[
            {
              title: (
                <HStack>
                  <IconByName name="GroupLineIcon" size="md" />
                  <AdminTypo.H4 bold color="Activatedcolor.400">
                    {t("ALL_IPS")}
                  </AdminTypo.H4>
                </HStack>
              ),
              link: "/poadmin/ips",
              icon: "GroupLineIcon",
            },

            <Chip
              key={organisation?.id}
              textAlign="center"
              lineHeight="15px"
              label={organisation?.id}
            />,
          ]}
        />
        <HStack space={4}>
          <CardComponent
            _header={{ bg: "light.100" }}
            _vstack={{ space: 0, flex: 1, bg: "light.100" }}
            _hstack={{ borderBottomWidth: 0, p: 1 }}
            buttonText={<AdminTypo.H5>{t("EDIT")}</AdminTypo.H5>}
            onButtonClick={handleEditButton}
            item={{
              ...organisation,
              learner_target:
                organisation?.program_organisations?.[0]?.learner_target,
              program_id:
                organisation?.program_organisations?.[0]?.program?.state
                  ?.state_name,
            }}
            title={t("BASIC_DETAILS")}
            label={[
              "IP_ID",
              "IP_NAME",
              "CONTACT_PERSON",
              "CONTACT_PERSON_MOBILE",
              "EMAIL_ID",
              "IP_ADDRESS",
              "STATE",
              "LEARNER_TARGET",
            ]}
            arr={[
              "id",
              "name",
              "contact_person",
              "mobile",
              "email_id",
              "address",
              "program_id",
              "learner_target",
            ]}
          />
        </HStack>
        {/* <CardComponent
          _header={{ bg: "light.100" }}
          _vstack={{ space: 0, flex: 1, bg: "light.100" }}
          _hstack={{ borderBottomWidth: 0, p: 1 }}
          item={{
            ...(organisation?.program_organisations?.[0] || {}),
            program_id:
              organisation?.program_organisations?.[0]?.program?.state
                ?.state_name,
          }}
          title={t("DOCUMENT_DETAILS")}
          label={[
            "DUE_DILIGENCE_SIGNED_PROPOSAL",
            "QUARTELY_CA_CERTIFIED",
            "MONTHLY_UTILIZATION",
            "LEARNER_TARGET",
          ]}
          arr={["doc_per_cohort_id", "doc_per_monthly_id", "doc_quarterly_id"]}
          format={{
            doc_per_cohort_id: "file",
            doc_per_monthly_id: "file",
            doc_quarterly_id: "file",
          }}
        /> */}
        <DataList />
        {/* <UserList /> */}
      </VStack>
    </PoAdminLayout>
  );
}

const pagination = [10, 15, 25, 50, 100];

const DataList = memo(() => {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const { id } = useParams();
  const [paginationTotalRows, setPaginationTotalRows] = useState(0);
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleSort = (column, sort) => {
    if (column?.sortField) {
      setFilter({
        ...filter,
        order_by: { ...(filter?.order_by || {}), [column?.sortField]: sort },
      });
    }
  };

  useEffect(async () => {
    const fetch = async () => {
      setLoading(true);

      const data = await organisationService.getIpUserList({
        organisation_id: id,
        ...filter,
      });
      setPaginationTotalRows(
        data?.data?.totalCount ? data?.data?.totalCount : 0
      );
      setData(data?.data);
      setLoading(false);
    };
    fetch();
  }, [filter]);

  const handleRowClick = useCallback(
    (row) => {
      navigate(`/poadmin/ips/user/${row?.id}`);
    },
    [navigate]
  );

  return (
    <Stack backgroundColor={"identifiedColor"} alignContent={"center"}>
      <HStack alignItems={"center"} p={4} justifyContent={"space-between"}>
        <AdminTypo.H6 bold color={"textGreyColor.500"}>
          {t("IP_TEAM_LIST")}
        </AdminTypo.H6>
        <Menu
          w="160"
          trigger={(triggerProps) => (
            <Button
              {...triggerProps}
              background="white"
              shadow="RedOutlineShadow"
              borderRadius="100px"
              borderColor="textMaroonColor.400"
              borderWidth="1"
              py="6px"
              rounded="full"
              _text={{
                color: "textGreyColor.900",
                fontSize: "14px",
              }}
              rightIcon={
                <IconByName
                  color="black"
                  _icon={{ size: "18px" }}
                  name="AddLineIcon"
                />
              }
            >
              {t("ADD_IP_USER")}
            </Button>
          )}
        >
          <Menu.Item
            onPress={(e) => navigate(`/poadmin/ips/${id}/user-create`)}
          >
            {t("ADD_NEW_IP_USER")}
          </Menu.Item>
          <Menu.Item
            onPress={(e) => navigate(`/poadmin/ips/${id}/existing/user-create`)}
          >
            {t("EXISTING_IP_USER")}
          </Menu.Item>
        </Menu>
      </HStack>
      <VStack pt={0} p={6}>
        <DataTable
          data={data}
          columns={columns(t)}
          customStyles={CustomStyles}
          progressPending={loading}
          pagination
          paginationRowsPerPageOptions={pagination}
          paginationServer
          paginationTotalRows={paginationTotalRows}
          paginationDefaultPage={filter?.page || 1}
          highlightOnHover
          onSort={handleSort}
          sortServer
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
    </Stack>
  );
});

export default View;
