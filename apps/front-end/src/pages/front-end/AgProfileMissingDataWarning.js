import React from "react";
import {
  HStack,
  VStack,
  Text,
  Box,
  Progress,
  Divider,
  Button,
  ChevronLeftIcon,
  Center,
  ArrowBackIcon,
} from "native-base";
import { FrontEndTypo, IconByName } from "@shiksha/common-lib";

export default function AgProfileMissingDataWarning() {
  const Warning = () => {
    return (
      <Box
        bgColor="boxBackgroundColour.50"
        borderColor="  boxBorderColour.50"
        alignItems="Center"
      >
        <HStack alignItems="Center">
          <IconByName
            name="ErrorWarningLineIcon"
            _icon={{ size: "10" }}
            color="iconColor.400"
          />
          <FrontEndTypo.H5 color="textGreyColor.450" fontWeight="500">
            Please Complete this Information
          </FrontEndTypo.H5>
        </HStack>
      </Box>
    );
  };
  return (
    <VStack paddingBottom="64px" bg="bgGreyColor.200">
      <Box
        height="56px"
        justifyContent="Center"
        bg="bgGreyColor.200"
        p="4"
        borderBottomColor="gray.400"
        borderBottomWidth="2"
      >
        <HStack
          paddingLeft="16px"
          paddingRight="16px"
          alignItems="Center"
          space="xl"
        >
          <Button size="xs" variant="outline" colorScheme="gray">
            <ArrowBackIcon size="5" color="iconColor.150" />
          </Button>
          <FrontEndTypo.H3 color="textGreyColor.200" fontWeight="500">
            Basic Details
          </FrontEndTypo.H3>
        </HStack>
      </Box>
      <VStack paddingLeft="16px" paddingRight="16px" space="24px">
        <Center>
          <IconByName
            name="AccountCircleLineIcon"
            color="iconColor.350"
            _icon={{ size: "60" }}
            justifySelf="Center"
          />
        </Center>
        <VStack>
          <HStack justifyContent="space-between" alignItems="Center">
            <FrontEndTypo.H1 color="textGreyColor.200" fontWeight="700">
              Khushboo M. Verma
            </FrontEndTypo.H1>
            <IconByName
              name="PencilLineIcon"
              color="iconColor.200"
              _icon={{ size: "20" }}
            />
          </HStack>
          <HStack alignItems="Center">
            <IconByName name="Cake2LineIcon" color="iconColor.300" />
            <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
              18/07/1998
            </FrontEndTypo.H3>
          </HStack>
        </VStack>

        <Box
          bg="boxBackgroundColour.100"
          borderColor="#E0E0E0"
          borderRadius="10px"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 fontWeight="700" bold color="textGreyColor.800">
                Contact Details
              </FrontEndTypo.H3>
              <IconByName name="EditBoxLineIcon" color="iconColor.100" />
            </HStack>
            <Box paddingTop="2">
              <Progress value={45} size="xs" colorScheme="info" />
            </Box>
            <VStack space="2" paddingTop="5">
              <HStack
                alignItems="Center"
                justifyContent="space-between"
                alignContent="left"
              >
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.3"
                >
                  Self
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  999987878
                </FrontEndTypo.H3>

                <IconByName name="CellphoneLineIcon" color="iconColor.100" />
              </HStack>
              <Divider
                orientation="horizontal"
                bg="AppliedColor"
                thickness="1"
              />
              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.3"
                >
                  Family
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  999987878
                </FrontEndTypo.H3>

                <IconByName name="SmartphoneLineIcon" color="iconColor.100" />
              </HStack>
              <Divider
                orientation="horizontal"
                bg="AppliedColor"
                thickness="1"
              />
              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.3"
                >
                  Family
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  999987878
                </FrontEndTypo.H3>

                <IconByName name="SmartphoneLineIcon" color="iconColor.100" />
              </HStack>
              <Divider
                orientation="horizontal"
                bg="AppliedColor"
                thickness="1"
              />
              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.3"
                >
                  Family
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  999987878
                </FrontEndTypo.H3>

                <IconByName name="SmartphoneLineIcon" color="iconColor.100" />
              </HStack>
              <Divider
                orientation="horizontal"
                bg="AppliedColor"
                thickness="1"
              />
              <HStack
                alignItems="Center"
                justifyContent="space-between"
                alignContent="left"
                position="left"
              >
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.3"
                >
                  Email
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  None
                </FrontEndTypo.H3>

                <IconByName name="MailLineIcon" color="iconColor.100" />
              </HStack>
            </VStack>
          </VStack>
        </Box>

        <Box
          bg="#FAFAFA"
          borderColor="#E0E0E0"
          borderRadius="10px"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 fontWeight="700" bold color="textGreyColor.800">
                Address Details
              </FrontEndTypo.H3>
              <IconByName name="EditBoxLineIcon" color="iconColor.100" />
            </HStack>
            <VStack space="2" paddingTop="5">
              <HStack alignItems="Center" space="xl">
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.3"
                >
                  Home
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  Alwar,Rajasthan
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>
        </Box>
        <Box
          bg="bgGreyColor.200"
          borderColor="AppliedColor"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />

            <HStack space="1">
              <IconByName
                name="UserLineIcon"
                _icon={{ size: "15" }}
                color="iconColor.150"
              />
              <VStack flex="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Box width="80%">
                    <FrontEndTypo.H4
                      color="textGreyColor.250"
                      bold
                      fontWeight="700"
                    >
                      Family Details
                    </FrontEndTypo.H4>
                  </Box>
                  <IconByName
                    color="iconColor.50"
                    name="AddLineIcon"
                    _icon={{ size: "20" }}
                  />
                </HStack>
                <VStack>
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Father's Name
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    None
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Mothers Name
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    None
                  </FrontEndTypo.H3>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box
          bg="bgGreyColor.200"
          borderColor="AppliedColor"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />

            <HStack space="1">
              <IconByName
                name="UserLineIcon"
                _icon={{ size: "15" }}
                color="iconColor.150"
              />
              <VStack flex="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Box width="80%">
                    <FrontEndTypo.H4
                      color="textGreyColor.250"
                      bold
                      fontWeight="700"
                    >
                      Personal Details
                    </FrontEndTypo.H4>
                  </Box>
                  <IconByName
                    color="iconColor.50"
                    name="AddLineIcon"
                    _icon={{ size: "20" }}
                  />
                </HStack>
                <VStack>
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Social Category
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    None
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Marital Details
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    None
                  </FrontEndTypo.H3>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box
          bg="bgGreyColor.200"
          borderColor="AppliedColor"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />
            <HStack space="1">
              <IconByName
                name="UserLineIcon"
                _icon={{ size: "15" }}
                color="iconColor.150"
              />
              <VStack flex="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Box width="80%">
                    <FrontEndTypo.H4
                      color="textGreyColor.250"
                      bold
                      fontWeight="700"
                    >
                      Reference Details
                    </FrontEndTypo.H4>
                  </Box>
                  <IconByName
                    color="iconColor.50"
                    name="AddLineIcon"
                    _icon={{ size: "20" }}
                  />
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
}
