import React from "react";
import {
  Box,
  HStack,
  Select,
  CheckIcon,
  Text,
  Checkbox,
  Button,
  VStack,
  ScrollView,
} from "native-base";
import {
  capture,
  IconByName,
  AdminLayout as Layout,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "../App.css";
import Table from "./Table";

function Home({ footerLinks, appName }) {
  const { t } = useTranslation();

  React.useEffect(() => {
    capture("PAGE");
  }, []);

  return (
    <Layout
      _appBar={{
        isShowNotificationButton: true,
      }}
      _subHeader={{
        bg: "white",
        pt: "30px",
        pb: "0px",
      }}
      _sidebar={footerLinks}
    >
      <HStack>
        <Box flex={0.2}>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              padding: "10px",
              gap: "10px",
              width: "278px",
              height: "44px",
              background: "#696767",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter",
                fontSize: "20px",
                fontWeight: "500",
                lineHeight: "24px",
                letterSpacing: "0em",
                textAlign: "left",
              }}
              color="#FFFFFF"
            >
              My Preraks
            </Text>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "0px",
              gap: "36px",
              width: "200px",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                gap: "20px",
                width: "200px",
                height: "88px",
              }}
            >
              <HStack alignItems="center" space={1} width="200px" height="24px">
                <IconByName name="FilterLineIcon" />
                <Text>Sort by</Text>
              </HStack>

              <Box maxW="350">
                <Select
                  minWidth="20"
                  placeholder="Recent"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => setService(itemValue)}
                >
                  <Select.Item label="abc" value="ux" />
                  <Select.Item label="bcd" value="web" />
                  <Select.Item label="efg" value="cross" />
                  <Select.Item label="hij" value="ui" />
                </Select>
              </Box>

              <Box>
                <HStack alignItems="center">
                  <IconByName name="FilterLineIcon" />
                  <Text>Filters</Text>
                </HStack>
                <Box paddingBottom={3}>
                  <HStack alignItems="center">
                    <IconByName name="MapPinLineIcon" />
                    <Text>District</Text>
                  </HStack>
                  <ScrollView>
                    <Checkbox colorScheme="green">All</Checkbox>
                    <Checkbox colorScheme="green">Ajmer</Checkbox>
                    <Checkbox colorScheme="green">Alwar</Checkbox>
                    <Checkbox colorScheme="green">Bikaner</Checkbox>
                    <Checkbox colorScheme="green">Banswara</Checkbox>
                    <Checkbox colorScheme="green">Baran</Checkbox>
                    <Checkbox colorScheme="green">Barmer</Checkbox>
                  </ScrollView>
                </Box>
                <Box paddingBottom={3}>
                  <HStack alignItems="center">
                    <IconByName name="MapPinLineIcon" />
                    <Text>Qualification</Text>
                  </HStack>
                  <Checkbox colorScheme="green">All</Checkbox>
                  <Checkbox colorScheme="green">12th</Checkbox>
                  <Checkbox colorScheme="green">Graduate</Checkbox>
                  <Checkbox colorScheme="green">Post Graduate</Checkbox>
                  <Checkbox colorScheme="green">Diploma</Checkbox>
                </Box>
                <Box>
                  <HStack alignItems="center" paddingBottom={1}>
                    <IconByName name="MapPinLineIcon" />
                    <Text>Work Experience</Text>
                  </HStack>
                  <VStack space={4}>
                    <HStack space={5}>
                      <Button background="#E6E6E6">All</Button>
                      <Button background="#E6E6E6">0yrs</Button>
                      <Button background="#E6E6E6">1yrs</Button>
                    </HStack>
                    <HStack space={5}>
                      <Button background="#E6E6E6">2yrs</Button>
                      <Button background="#E6E6E6">3yrs</Button>
                      <Button background="#E6E6E6">4yrs</Button>
                    </HStack>
                    <HStack space={5}>
                      <Button background="#E6E6E6">5yrs</Button>
                      <Button background="#E6E6E6">5+yrs</Button>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box flex={0.8} bg="white" roundedBottom={"2xl"} py={6} px={4} mb={5}>
          <Table />
        </Box>
      </HStack>
    </Layout>
  );
}
export default Home;
