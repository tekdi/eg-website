import React from "react";
import {
  capture,
  IconByName,
  AdminLayout as Layout,
  ProgressBar,
} from "@shiksha/common-lib";

import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  Button,
  Center,
  ChevronLeftIcon,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  Box,
  IconButton,
  Image,
  ChevronRightIcon,
} from "native-base";

export default function App({ footerLinks }) {
  const { t } = useTranslation();
  return (
    <>
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
          <VStack flex={0.85} space={1}>
            <HStack>
              <IconByName size="sm" name="ArrowLeftSLineIcon" />
              <Text paddingTop={"1"}> Prerak Bio</Text>
            </HStack>
            <HStack alignItems={Center} space="9" p="5">
              <VStack flex={1 / 3}>
                <HStack space="15%">
                  <IconByName size="sm" name="UserLineIcon" paddingTop="20px" />

                  <VStack>
                    <Heading fontSize="24px"> Rachana Bhave</Heading>
                    <HStack>
                      <IconByName size="sm" name="CellphoneLineIcon" />
                      <Text fontSize="18px"> 9999991282</Text>
                    </HStack>
                    <HStack>
                      <IconByName size="sm" name="MapPinLineIcon" />
                      <Text fontSize="18px"> Alwar</Text>
                    </HStack>
                  </VStack>
                </HStack>
                <Button
                  variant="outline"
                  borderRadius="100px"
                  bgColor="white"
                  borderStyle="solid"
                  borderColor="black"
                  marginTop="10px"
                >
                  Send Message
                </Button>
              </VStack>
              <VStack flex={1 / 3}>
                <Heading fontSize="16px"> Eligibility Criteria</Heading>
                <Text> Diagram</Text>
              </VStack>
              <VStack flex={1 / 2}>
                <HStack alignItems={"center"} space={"2"}>
                  <Heading fontSize="12px" height="15px">
                    Qualification
                  </Heading>
                  <ProgressBar
                    flex="1"
                    isLabelCountHide
                    data={[
                      { name: "Qualification", value: 135, color: "gray.500" },
                      { name: "Qualification", value: 80, color: "gray.300" },
                    ]}
                  />
                </HStack>
                <HStack alignItems={"center"} space={"2"}>
                  <Heading fontSize="12px" height="15px">
                    Work Experience
                  </Heading>
                  <ProgressBar
                    flex="1"
                    isLabelCountHide
                    data={[
                      { name: "Qualification", value: 25, color: "gray.500" },
                      { name: "Qualification", value: 75, color: "gray.300" },
                    ]}
                  />
                </HStack>
                <HStack alignItems={"center"} space={"2"}>
                  <Heading fontSize="12px" height="15px">
                    Voulinteer Experience
                  </Heading>
                  <ProgressBar
                    flex="1"
                    isLabelCountHide
                    data={[
                      { name: "Qualification", value: 25, color: "gray.500" },
                      { name: "Qualification", value: 75, color: "gray.300" },
                    ]}
                  />
                </HStack>
                <HStack alignItems={"center"} space={"2"}>
                  <Heading fontSize="12px" height="15px">
                    Availability
                  </Heading>
                  <ProgressBar
                    flex="1"
                    isLabelCountHide
                    data={[
                      { name: "Qualification", value: 25, color: "gray.500" },
                      { name: "Qualification", value: 75, color: "gray.300" },
                    ]}
                  />
                </HStack>
              </VStack>
            </HStack>

            <Box
              borderWidth="1"
              width="container"
              paddingTop="40px"
              marginTop="20px"
            >
              <Text
                paddingLeft="20px"
                fontWeight="700"
                fontSize="16px"
                marginTop="10px"
              >
                Application Form
              </Text>

              <HStack
                space="1/4"
                paddingLeft="20px"
                paddingRight="40px"
                paddingBottom="20px"
                paddingTop="60px"
              >
                <VStack display="Flex" flexDirection="column" space="20px">
                  <Heading fontSize="16px">Basic Details</Heading>
                  <VStack>
                    <Text color="#AFB1B6">First Name</Text>
                    <Text>Rachana</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Last Name</Text>
                    <Text>Bhave</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Mobile No</Text>
                    <Text>9999991282</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Date of Birth</Text>
                    <Text>09/01/1999</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Gender</Text>
                    <Text>Female</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Address</Text>
                    <Text>Alwar</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Aadhar No</Text>
                    <Text>0000 0000 0000</Text>
                  </VStack>
                </VStack>
                <VStack display="Flex" flexDirection="column" space="20px">
                  <Heading fontSize="16px">Education </Heading>

                  <VStack>
                    <Text color="#AFB1B6">Qualification</Text>
                    <Text>Batchelors</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Work Experience</Text>
                    <Text>Teacher Deenanath School, Alwar 2 years</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Volunteer Experience</Text>
                    <Text>Milan Sabha NGO 2 years</Text>
                  </VStack>
                </VStack>
                <VStack display="Flex" flexDirection="column" space="20px">
                  <Heading fontSize="16px">Other Details</Heading>

                  <VStack>
                    <Text color="#AFB1B6">Availability</Text>
                    <Text>Full Time</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Device Ownership</Text>
                    <Text>Self</Text>
                  </VStack>

                  <VStack>
                    <Text color="#AFB1B6">Type of Device</Text>
                    <Text>Android</Text>
                  </VStack>
                </VStack>
              </HStack>
              <HStack space="1/6" paddingBottom="40px" paddingLeft="20px">
                <Button backgroundColor="green.200">
                  Application Approved
                </Button>
                <Button backgroundColor="red.200">Reject Application</Button>
                <Button backgroundColor="yellow.200">Mark for Review </Button>
                <Button backgroundColor="gray.200">Schedule Interview</Button>
              </HStack>
            </Box>
          </VStack>
          <VStack
            flex={0.15}
            bgColor="gray.300"
            space="20px"
            paddingLeft="10px"
          >
            <HStack justifyContent="space-between">
              <IconByName size="sm" name="EditBoxLineIcon" />
              <Text justifyItems="Center" paddingTop="10px">
                Comment Section
              </Text>
              <ChevronRightIcon />
            </HStack>
            <HStack>
              <IconByName size="sm" name="UserLineIcon" paddingTop="20px" />
              <Text textAlign="left" paddingTop="20px">
                You
              </Text>
            </HStack>
            <Box
              backgroundColor="gray.200"
              width="250px"
              height="50px"
              alignSelf="center"
            >
              <Text textAlign="left" paddingLeft="20px" paddingTop="0.5">
                Profile needs to be completed
              </Text>
            </Box>

            <HStack>
              <IconByName size="sm" name="UserLineIcon" paddingTop="20px" />
              <Text textAlign="left" paddingTop="20px">
                {" "}
                PO{" "}
              </Text>
            </HStack>
            <Box
              backgroundColor="gray.200"
              width="250px"
              height="50px"
              alignSelf="center"
            >
              <Text textAlign="left" paddingLeft="20px" paddingTop="0.5">
                Profile needs to be completed
              </Text>
            </Box>
          </VStack>
        </HStack>
      </Layout>
    </>
  );
}
