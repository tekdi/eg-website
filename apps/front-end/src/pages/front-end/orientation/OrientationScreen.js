import {
  IconByName,
  facilitatorRegistryService,
  AdminTypo,
} from "@shiksha/common-lib";
import DataTable from "react-data-table-component";
import { ChipStatus } from "component/Chip";
import { HStack, Text, Avatar, Modal, Switch } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
let switchAttendance = false;

const stylesheet = {
  modalxxl: {
    maxWidth: "950px",
    width: "100%",
    height: "100%",
  },
};
const customStyles = {
  headCells: {
    style: {
      background: "#E0E0E0",
      fontSize: "14px",
      color: "#616161",
    },
  },
  cells: {
    style: {
      padding: "15px 0",
    },
  },
};

export default function OrientationScreen({
  isOpen,
  setIsOpen,
  userIds,
  setUserIds,
}) {
  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(100);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const { t } = useTranslation();

  const columns = (e) => [
    {
      name: t("NAME"),
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          {row?.profile_url ? (
            <Avatar
              source={{
                uri: row?.profile_url,
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
          <Text textOverflow="ellipsis">
            {row?.first_name + " " + row?.last_name}
          </Text>
        </HStack>
      ),
      sortable: false,
      attr: "name",
    },
    {
      name: t("QUALIFICATION"),
      selector: (row) => row?.qualifications?.qualification_master?.name,
      sortable: false,
      attr: "qualification",
    },
    {
      name: t("REGION"),
      selector: (row) => (row?.district ? row?.district : ""),
      sortable: false,
      attr: "city",
    },
    {
      name: t("STATUS"),
      selector: (row, index) => (
        <ChipStatus key={index} status={row?.program_faciltators?.status} />
      ),
      sortable: false,
      attr: "email",
    },
    {
      name: t("COMMENT"),
      sortable: false,
      attr: "email",
    },
  ];

  const scheduleCandidates = (e) => [
    {
      name: t("NAME"),
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          {row?.profile_url ? (
            <Avatar
              source={{
                uri: row?.profile_url,
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
          <Text>{row?.first_name + " " + row.last_name}</Text>
        </HStack>
      ),
      sortable: false,
      attr: "name",
    },
    {
      name: t("INVITE_STATUS"),
      selector: (row) => <Text color={"#00D790"}>Accepted</Text>,
      sortable: false,
      attr: "email",
    },
    {
      name: t("MARK_ATTENDANCE"),
      selector: (row) => (
        <>
          <HStack space={"2"}>
            <Text>Present</Text>
            <Switch
              offTrackColor="#00D790"
              onTrackColor="#DC2626"
              onThumbColor="#E0E0E0"
              offThumbColor="#E0E0E0"
              value={switchAttendance}
              onValueChange={!switchAttendance}
            />
          </HStack>
        </>
      ),
      sortable: false,
      attr: "email",
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await facilitatorRegistryService.getFacilitatorByStatus({
        limit: limit,
        page: page,
        status: "shortlisted_for_orientation",
      });
      setData(result?.data?.data);
      setPaginationTotalRows(result?.totalCount);
      setLoading(false);
    };

    fetchData();
  }, [limit, page]);

  const handleSelectRow = (state) => {
    const arr = state?.selectedRows;
    let newObj = {};
    arr.forEach((e) => {
      newObj = { ...newObj, [e.id]: e };
    });
    setUserIds({ ...newObj });
  };
  const handlePageChange = (page) => {
    setPage(page);
  };
  return (
    <Modal isOpen={isOpen} onClose={(e) => setIsOpen(false)} safeAreaTop={true}>
      <Modal.Content {...stylesheet.modalxxl}>
        <Modal.CloseButton />
        <Modal.Header p="5" borderBottomWidth="0">
          <HStack justifyContent={"center"}>
            <AdminTypo.H2 color="textGreyColor.500" bold>
              {t("SELECT_CANDIDATE")}
            </AdminTypo.H2>
          </HStack>
        </Modal.Header>
        <Modal.Body p="5" pb="10">
          <DataTable
            columns={[...columns()]}
            data={data}
            customStyles={customStyles}
            subHeader
            persistTableHead
            selectableRows
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={paginationTotalRows}
            onChangePage={handlePageChange}
            onSelectedRowsChange={handleSelectRow}
            clearSelectedRows={Object.keys(userIds).length === 0 ? true : false}
            // onChangeRowsPerPage={(e) => setLimit(e)}
            // onChangePage={(e) => setPage(e)}
          />
        </Modal.Body>

        <Modal.Footer justifyContent={"space-between"}>
          <AdminTypo.Secondarybutton
            px="5"
            py="1"
            shadow="BlueOutlineShadow"
            onPress={(e) => setIsOpen(false)}
          >
            {t("CANCEL")}
          </AdminTypo.Secondarybutton>

          <AdminTypo.PrimaryButton
            onPress={(e) => setIsOpen(false)}
            shadow="BlueFillShadow"
            endIcon={
              <IconByName
                isDisabled
                name="ArrowRightSLineIcon"
                color="gray.300"
                _icon={{ size: "15" }}
              />
            }
          >
            {t("SELECT_CANDIDATE")}
          </AdminTypo.PrimaryButton>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
