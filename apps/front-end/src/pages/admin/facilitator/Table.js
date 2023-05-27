import {
  IconByName,
  facilitatorRegistryService,
  H1,
  H3,
  t,
  ImageView,
  BlueFillButton,
  AdminTypo
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import Clipboard from "component/Clipboard";
import { Button, HStack, Input, Text, VStack, Modal,Image, Box } from "native-base";
import React from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
const customStyles = {
  rows: {
      style: {
          minHeight: '72px', // override the row height
      },
  },
  headCells: {
      style: {
          background:'#E0E0E0',
          color:'#616161',
          size:'16px'
      },
  },
  cells: {
      style: {
          color:'#616161',
          size:'19px'
      },
  },
};
const columns = (e) => [
  {
    name: t("FIRST_NAME"),
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        {row?.documents?.[0]?.name ? (
          <ImageView
            source={{
              uri: row?.documents?.[0]?.name,
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
        <Text fontSize="16px" bold>{row?.first_name + " " + row.last_name}</Text>
      </HStack>
    ),
    sortable: true,
    attr: "name",
  },
  {
    name: t("User_Id"),
    selector: (row) => row.id,
  },
  {
    name: t("MOBILE_NUMBER"),
    selector: (row) => row?.mobile,
    sortable: true,
    attr: "email",
  },
  {
    name: t("STATUS"),
    selector: (row, index) => <ChipStatus key={index} status={row?.status} />,
    sortable: true,
    attr: "email",
  },
  {
    name: t("GENDER"),
    selector: (row) => row?.gender,
    sortable: true,
    attr: "city",
  },
];

const filters = (data, filter) => {
  return data.filter((item) => {
    for (let key in filter) {
      if (
        item[key] === undefined ||
        !filter[key].includes(
          `${
            item[key] && typeof item[key] === "string"
              ? item[key].trim()
              : item[key]
          }`
        )
      ) {
        return false;
      }
    }

    return true;
  });
};
function getBaseUrl() {
  var re = new RegExp(/^.*\//);
  return re.exec(window.location.href);
}

// Table component
function Table({ facilitator, setadminPage, setadminLimit, admindata }) {
  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [paginationTotalRows, setPaginationTotalRows] = React.useState(0);
  const [filterObj, setFilterObj] = React.useState();
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(async () => {
    setLoading(true);
    const result = await facilitatorRegistryService.filter(filterObj);
    setData(admindata ? admindata : result.data?.data);
    setPaginationTotalRows(result?.totalCount);
    setLoading(false);
  }, [admindata]);

  React.useEffect(() => {
    setFilterObj({ page, limit });
  }, [page, limit]);
 
  return (
    <VStack>
      <DataTable customStyles={customStyles} className="customDataTable"
        columns={[
          ...columns(),
          {
            name: t("ACTION"),
            selector: (row) => (
              <AdminTypo.Secondarybutton
                onPress={() => {
                  navigate(`/admin/view/${row?.id}`);
                }}
              >
               {t("VIEW")}
              </AdminTypo.Secondarybutton>
            ),
          },
        ]}
        data={data}
        subHeader
        persistTableHead
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={(e) => {
          setLimit(e);
          setadminLimit(e);
        }}
        onChangePage={(e) => {
          setPage(e);
          setadminPage(e);
        }}
      />
    </VStack>
  );
}

export default Table;
