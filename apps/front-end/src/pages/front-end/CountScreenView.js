import {
  H2,
  t,
  IconByName,
  Layout,
  benificiaryRegistoryService,
  statusWiseCountService,
} from "@shiksha/common-lib";
import Chip, { ChipStatus } from "component/Chip";
import { HStack, VStack, Box, Text, Container } from "native-base";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TableView() {
  React.useEffect(() => {
    const getData = async () => {
      let data = await statusWiseCountService.getStatusWiseCount();
      setStatuswiseCount(data);
    };

    getData();
  }, []);
  const [statuswiseCount, setStatuswiseCount] = React.useState({});

  return (
    <VStack space="15" paddingLeft="4%" paddingTop="10%" paddingRight="4%">
      <Container>
        <Box
          borderWidth={1}
          borderColor="gray.300"
          borderRadius={4}
          overflow="hidden"
        >
          <Box
            flexDirection="row"
            borderBottomWidth={1}
            borderBottomColor="gray.300"
            bg="gray.100"
            p={2}
          >
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text fontWeight="bold">Status</Text>
            </Box>
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text fontWeight="bold">Count</Text>
            </Box>
          </Box>
          {statuswiseCount?.data?.map((item) => (
            <Box flexDirection="row" p={2}>
              <Box flex={1}>
                <Text>{`${t(item.status)}`}</Text>
              </Box>
              <Box flex={1} justifyContent="center" alignItems="center">
                <Text>{item.count}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </VStack>
  );
}
