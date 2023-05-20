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
import { IconByName } from "@shiksha/common-lib";

export default function AgProfileMissingDataWarning() {
  const Warning = () => {
    return (
      <Box
        bgColor="#FDC5C7"
        borderColor="#FFC5C0"
        borderWidth="1px"
        alignItems="Center"
      >
        <HStack alignItems="Center">
          <IconByName
            name="ErrorWarningLineIcon"
            _icon={{ size: "10" }}
            color="#FF2815"
          />
          <Text
            color="#696767"
            fontWeight="500"
            fontSize="12px"
            fontFamily="Inter"
            fontStyle="normal"
          >
            Please Complete this Information
          </Text>
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
            <ArrowBackIcon size="5" color="#696767" />
          </Button>
          <Text
            color="#666666"
            fontWeight="500"
            fontSize="14px"
            fontFamily="Inter"
            fontStyle="normal"
          >
            Basic Details
          </Text>
        </HStack>
      </Box>
      <VStack paddingLeft="16px" paddingRight="16px" space="24px">
        <Center>
          <IconByName
            name="AccountCircleLineIcon"
            color="#666666"
            _icon={{ size: "60" }}
            justifySelf="Center"
          />
        </Center>
        <VStack>
          <HStack justifyContent="space-between" alignItems="Center">
            <Text
              fontFamily="Inter"
              fontSize="20px"
              color="#666666"
              fontWeight="700px"
              justifySelf="left"
            >
              Khushboo M. Verma
            </Text>
            <IconByName
              name="PencilLineIcon"
              color="#757575"
              _icon={{ size: "20" }}
            />
          </HStack>
          <HStack alignItems="Center">
            <IconByName name="Cake2LineIcon" color="#B3B3B3" />
            <Text color="#464646"> 18/07/1998</Text>
          </HStack>
        </VStack>

        <Box
          bg="#FAFAFA"
          borderColor="#E0E0E0"
          borderRadius="10px"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <HStack justifyContent="space-between" alignItems="Center">
              <Text fontSize="14px" fontWeight="700">
                Contact Details (1/3)
              </Text>
              <IconByName name="EditBoxLineIcon" />
            </HStack>
            <Box paddingTop="2">
              <Progress value={45} size="xs" colorScheme="info" />
            </Box>
            <VStack space="2" paddingTop="5">
              <HStack alignItems="Center" justifyContent="space-between">
                <Text
                  fontSize="14px"
                  color="#9E9E9E"
                  fontWeight="400"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  Self
                </Text>
                <Box width="70%">
                  <Text
                    fontSize="14px"
                    color="#212121"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    999987878
                  </Text>
                </Box>
                <IconByName name="CellphoneLineIcon" color="#616161" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
              <HStack alignItems="Center" justifyContent="space-between">
                <Text
                  fontSize="14px"
                  color="#9E9E9E"
                  fontWeight="400"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  Family
                </Text>
                <Box width="70%">
                  <Text
                    fontSize="14px"
                    color="#212121"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    999987878
                  </Text>
                </Box>
                <IconByName name="SmartphoneLineIcon" color="#616161" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
              <HStack alignItems="Center" justifyContent="space-between">
                <Text
                  fontSize="14px"
                  color="#9E9E9E"
                  fontWeight="400"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  Email
                </Text>
                <Box width="70%">
                  <Text
                    fontSize="14px"
                    color="#212121"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    None
                  </Text>
                </Box>
                <IconByName name="MailLineIcon" color="#616161" />
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
              <Text
                fontSize="14px"
                color="#212121"
                fontWeight="700"
                fontFamily="Inter"
                fontStyle="normal"
              >
                {" "}
                Address Details (1/3)
              </Text>
              <IconByName name="EditBoxLineIcon" />
            </HStack>
            <VStack space="2" paddingTop="5">
              <HStack alignItems="Center" space="sm">
                <Text
                  fontSize="14px"
                  color="#9E9E9E"
                  fontWeight="400"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  Home
                </Text>
                <Box width="70%">
                  <Text
                    fontSize="14px"
                    color="#212121"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Alwar,Rajasthan
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </VStack>
        </Box>
        <Box
          bg="bgGreyColor.200"
          borderColor="#E0E0E0"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />

            <HStack space="1">
              <IconByName name="UserLineIcon" _icon={{ size: "15" }} />
              <VStack flex="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Box width="80%">
                    <Text
                      fontSize="12px"
                      color="
                  #696767"
                      fontWeight="700"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      Family Details
                    </Text>
                  </Box>
                  <IconByName
                    color="#0D99FF"
                    name="AddLineIcon"
                    _icon={{ size: "20" }}
                  />
                </HStack>
                <VStack>
                  <Text
                    fontSize="10px"
                    color="#727271"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Fathers Name
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    None
                  </Text>
                </VStack>
                <VStack paddingTop="16px">
                  <Text
                    fontSize="10px"
                    color="#727271"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Mothers Name
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    None
                  </Text>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box
          bg="bgGreyColor.200"
          borderColor="#E0E0E0"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />

            <HStack space="1">
              <IconByName name="UserLineIcon" _icon={{ size: "15" }} />
              <VStack flex="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Box width="80%">
                    <Text
                      fontSize="12px"
                      color="
                  #696767"
                      fontWeight="700"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      Personal Details
                    </Text>
                  </Box>
                  <IconByName
                    color="#0D99FF"
                    name="AddLineIcon"
                    _icon={{ size: "20" }}
                  />
                </HStack>
                <VStack>
                  <Text
                    fontSize="10px"
                    color="#727271"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Social Category
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    None
                  </Text>
                </VStack>
                <VStack paddingTop="16px">
                  <Text
                    fontSize="10px"
                    color="#727271"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Marital Details
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    None
                  </Text>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box
          bg="bgGreyColor.200"
          borderColor="#E0E0E0"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />
            <HStack space="1">
              <IconByName name="UserLineIcon" _icon={{ size: "15" }} />
              <VStack flex="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Box width="80%">
                    <Text
                      fontSize="12px"
                      color="
                  #696767"
                      fontWeight="700"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      Reference Details
                    </Text>
                  </Box>
                  <IconByName
                    color="#0D99FF"
                    name="AddLineIcon"
                    _icon={{ size: "20" }}
                  />
                </HStack>
                <VStack>
                  <Text
                    fontSize="10px"
                    color="#727271"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Name of the Reference
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    None
                  </Text>
                </VStack>
                <VStack paddingTop="16px">
                  <Text
                    fontSize="10px"
                    color="#727271"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    AG Learner's Relationship with the Reference
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    None
                  </Text>
                </VStack>
                <VStack paddingTop="16px">
                  <Text
                    fontSize="10px"
                    color="#727271"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Contact Number
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    None
                  </Text>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
}
