import {
  AdminTypo,
  IconByName,
  ImageView,
  facilitatorRegistryService,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import { HStack, Modal, Text } from "native-base";
import React from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

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
  const [limit] = React.useState(100);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const { t } = useTranslation();

  const columns = (e) => [
    {
      name: t("NAME"),
      selector: (row) => (
        <HStack alignItems={"center"} space="2">
          {row?.profile_photo_1?.id ? (
            <ImageView
              source={{
                document_id: row?.profile_photo_1.id,
              }}
              alt={row?.profile_photo_1.id}
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
      name: t("DISTRICT"),
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
      wrap: true,
    },
    {
      name: t("COMMENT"),
      sortable: false,
      attr: "email",
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result =
        await facilitatorRegistryService.getFacilitatorByStatusInOrientation({
          limit: limit,
          page: page,
        });
      setData(result?.data?.data);
      setPaginationTotalRows(result?.totalCount);
      setLoading(false);
    };

    fetchData();
  }, [limit, page, isOpen]);

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
    <Modal
      isOpen={isOpen}
      onClose={(e) => {
        setIsOpen(false);
        setUserIds({});
      }}
      safeAreaTop={true}
    >
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
            clearSelectedRows={Object.keys(userIds).length === 0}
            // onChangeRowsPerPage={(e) => setLimit(e)}
            // onChangePage={(e) => setPage(e)}
          />
        </Modal.Body>

        <Modal.Footer justifyContent={"space-between"}>
          <AdminTypo.Secondarybutton
            px="5"
            py="1"
            shadow="BlueOutlineShadow"
            onPress={(e) => {
              setIsOpen(false);
              setUserIds({});
            }}
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
OrientationScreen.propTypes = {
  isOpen: PropTypes.any,
  setIsOpen: PropTypes.any,
  userIds: PropTypes.any,
  setUserIds: PropTypes.any,
};
