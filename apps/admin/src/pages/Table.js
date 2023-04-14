import { IconByName, get } from "@shiksha/common-lib";
import { Box, Button, HStack, Heading, Input, Text } from "native-base";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const status = [
  "Selected",
  "Shortlisted",
  "UnderReview",
  "Appiled",
  "Rejected",
];

const colors = ["red.300", "green.300", "info.300", "gray.300", "red.300"];
const columns = [
  {
    name: " First Name",
    selector: (row) => (
      <Text>
        <IconByName size="lg" name="AccountCircleLineIcon" />
        {row?.first_name + " " + row.last_name}
      </Text>
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
    selector: (row) => (
      <Box
        rounded={5}
        bg="red.300"
        p="1"
        bgColor={colors[(row.id % 5 === 0 ? 5 : row.id % 5) - 1]}
      >
        {status[(row.id % 5 === 0 ? 5 : row.id % 5) - 1]}
      </Box>
    ),
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

function Table() {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterInputs, setFilterInputs] = useState([]);
  const [filterObj, setFilterObj] = useState([]);

  const url = "http://localhost:4002/users/list";
  useEffect(async () => {
    const result = await get(url);
    console.log(result.data);

    setData(result.data);
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
    <div>
      <HStack alignSelf="center" space="1/6">
        <Heading fontSize="lg">All Prerak</Heading>
        <Input
          placeholder="Search By Name"
          borderRadius="4"
          py="3"
          px="5"
          fontSize="14"
          height="Hug(45px)"
          width="310px"
          InputLeftElement={
            <IconByName
              name="SearchLineIcon"
              m="2"
              ml="3"
              size="4"
              color="gray.400"
            />
          }
        />
        <HStack
          width={"167px"}
          borderRadius={"100px"}
          height={"40px"}
          space={4}
        >
          <Button colorScheme={"#FFFFFF"} backgroundColor={"#666666"}>
            Register prerak
          </Button>
          <Button colorScheme={"#FFFFFF"} backgroundColor={"#666666"}>
            Send an invite
          </Button>
          <Button backgroundColor={"#666666"}>
            <IconByName name="FileCopyLineIcon" />
          </Button>
        </HStack>
      </HStack>

      <DataTable
        columns={columns}
        data={filterData}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />
    </div>
  );
}

export default Table;
