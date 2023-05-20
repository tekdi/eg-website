import React from "react";
import { HStack, VStack, Text, Box, Button, ArrowBackIcon } from "native-base";
import { IconByName } from "@shiksha/common-lib";

export default function EnrollmentDetailsWarning() {
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
    <VStack paddingBottom="64px">
      <Box
        height="56px"
        justifyContent="Center"
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
            Enrollment Details
          </Text>
        </HStack>
      </Box>
      <VStack
        paddingLeft="16px"
        paddingRight="16px"
        space="24px"
        paddingTop="40px"
      >
        <Box borderColor="#E0E0E0" borderWidth="1px" paddingBottom="24px">
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <HStack flex="1">
              <IconByName name="UserLineIcon" _icon={{ size: "15" }} />
              <VStack flex="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Box width="80%">
                    <Text
                      fontSize="12px"
                      color="#696767"
                      fontWeight="700"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      Enrollment Status
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
                    Type of Enrollment
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    New
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
                    Enrollment Status
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Completed
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
                    Enrollment Board
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    RIOS
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
                    Enrollment Number
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    090092111872
                  </Text>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box borderColor="#E0E0E0" borderWidth="1px" paddingBottom="24px">
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <HStack flex="1">
              <IconByName name="UserLineIcon" _icon={{ size: "15" }} />
              <VStack flex="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Box width="80%">
                    <Text
                      fontSize="12px"
                      color="#666666"
                      fontWeight="700"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      Selected Subjects
                    </Text>
                  </Box>
                  <IconByName
                    color="#0D99FF"
                    name="AddLineIcon"
                    _icon={{ size: "20" }}
                  />
                </HStack>
                <VStack space="12px">
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Science
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    English
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Home Science
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Maths
                  </Text>
                  <Text
                    fontSize="14px"
                    color="#464646"
                    fontWeight="500"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Drawing
                  </Text>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box borderColor="#E0E0E0" borderWidth="1px" paddingBottom="24px">
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />
            <HStack justifyContent="space-between" alignItems="Center">
              <IconByName name="UserLineIcon" _icon={{ size: "15" }} />
              <Box width="80%">
                <Text
                  fontSize="12px"
                  color="#696767"
                  fontWeight="700"
                  fontFamily="Inter"
                  fontStyle="normal"
                >
                  Upload Receipt
                </Text>
              </Box>
              <IconByName
                color="#0D99FF"
                name="AddLineIcon"
                _icon={{ size: "20" }}
              />
            </HStack>
            <Box
              width="full"
              height="172px"
              borderWidth="1px"
              borderColor="#333333"
              alignSelf="Center"
            />
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
}
