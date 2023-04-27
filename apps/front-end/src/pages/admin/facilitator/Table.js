import {
  IconByName,
  facilitatorRegistryService,
  get,
  post,
  H1,
  H3,
} from "@shiksha/common-lib";
import { ChipStatus } from "component/Chip";
import Clipboard from "component/Clipboard";
import {
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
  Modal,
} from "native-base";
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

// Table component
function Table() {
  const [data, setData] = React.useState([]);
  const [filterData, setFilterData] = React.useState([]);
  const [filterInputs, setFilterInputs] = React.useState([]);
  const [filterObj, setFilterObj] = React.useState([]);
  const [modal, setModal] = React.useState(false);
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
          <Button
            variant={"primary"}
            onPress={(e) => navigate("/admin/facilitator-onbording")}
          >
            Register prerak
          </Button>

          <Button variant={"primary"} onPress={() => setModal(true)}>
            Send an invite
          </Button>
          <Modal
            isOpen={modal}
            onClose={() => setModal(false)}
            safeAreaTop={true}
            size="xl"
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header p="5" borderBottomWidth="0">
                <H1 textAlign="center">Send an invite</H1>
              </Modal.Header>
              <Modal.Body p="5" pb="10">
                <VStack space="5">
                  <HStack
                    space="5"
                    borderBottomWidth={1}
                    borderBottomColor="gray.300"
                    pb="5"
                  >
                    <H3>INVITATION LINK</H3>
                    <Clipboard
                      text={`${getBaseUrl()}facilitator-self-onbording/1`}
                    >
                      <HStack space="3">
                        <IconByName
                          name="FileCopyLineIcon"
                          isDisabled
                          rounded="full"
                          color="blue.300"
                        />
                        <H3 color="blue.300">Click here to copy the link</H3>
                      </HStack>
                    </Clipboard>
                  </HStack>
                  <HStack space="5" pt="5">
                    <Input
                      flex={0.7}
                      placeholder="Email ID or Phone Numbers"
                      variant="underlined"
                    />
                    <Button flex={0.3} variant="primary">
                      Send
                    </Button>
                  </HStack>
                </VStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>
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
