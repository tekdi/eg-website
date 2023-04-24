import {
  IconByName,
  facilitatorRegistryService,
  get,
  post,
  H1,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import Clipboard from "component/Clipboard";
import { Box, Button, HStack, Heading, Input, Text, VStack } from "native-base";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    name: " First Name",
    selector: (row) => (
      <HStack alignItems={"center"} space="2">
        <IconByName
          isDisabled
          name="AccountCircleLineIcon"
          color="#888"
          _icon={{ size: "35" }}
        />
        <Text>{row?.first_name + " " + row.last_name}</Text>
      </HStack>
    ),
    sortable: true,
    attr: "name",
  },
  {
    name: "Email-ID",
    selector: (row) => row?.email_id,
    sortable: true,
    attr: "email",
  },
  {
    name: "Status",
    selector: (row, index) => <ChipStatus status={row?.status} />,
    sortable: true,
    attr: "email",
  },
  {
    name: "Gender",
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
function Table() {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterInputs, setFilterInputs] = useState([]);
  const [filterObj, setFilterObj] = useState([]);
  const navigate = useNavigate();

  useEffect(async () => {
    const result = await facilitatorRegistryService.getAll();
    setData(result);
  }, []);

  useEffect(() => {
    setFilterData(filters(data, filterObj));
  }, [data, filterObj]);

  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const subHeaderComponentMemo = React.useMemo(() => {}, [
    resetPaginationToggle,
    filterInputs,
  ]);

  return (
    <VStack>
      <HStack justifyContent={"space-between"} flexWrap="Wrap">
        <H1>All Prerak</H1>
        <Input
          InputLeftElement={
            <IconByName color="coolGray.500" name="SearchLineIcon" />
          }
          placeholder="search"
          variant="outline"
        />
        <HStack space={2}>
          <Button variant={"primary"}>Register prerak</Button>
          <Button variant={"primary"}>Send an invite</Button>
          <Clipboard text={`${getBaseUrl()}facilitator/1`}>
            <IconByName
              name="FileCopyLineIcon"
              isDisabled
              bg="primary.600"
              p="2.5"
              rounded="full"
              color="white"
            />
          </Clipboard>
        </HStack>
      </HStack>

      <DataTable
        columns={[
          ...columns,
          {
            name: "Action",
            selector: (row) => (
              <Button
                size={"xs"}
                onPress={() => {
                  navigate(`view/${row?.id}`);
                }}
              >
                View
              </Button>
            ),
          },
        ]}
        data={filterData}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />
    </VStack>
  );
}

export default Table;
