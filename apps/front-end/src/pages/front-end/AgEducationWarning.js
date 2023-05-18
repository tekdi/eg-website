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

export default function AgEducationWarning() {
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
            Education Details
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
            <Warning />

            <HStack justifyContent="space-between" alignItems="Center">
              <Text
                fontSize="12px"
                color="#696767"
                fontWeight="700"
                fontFamily="Inter"
                fontStyle="normal"
              >
                Education Details
              </Text>
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
                Last Standard of Education
              </Text>
              <Text
                fontSize="14px"
                color="#464646"
                fontWeight="500"
                fontFamily="Inter"
                fontStyle="normal"
              >
                9th
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
                Last Standard of Education Year
              </Text>
              <Text
                fontSize="14px"
                color="#464646"
                fontWeight="500"
                fontFamily="Inter"
                fontStyle="normal"
              >
                2017
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
                Previous School Type
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
                Reason For Leaving
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
        </Box>
        <Box borderColor="#E0E0E0" borderWidth="1px" paddingBottom="24px">
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />
            <HStack justifyContent="space-between" alignItems="Center">
              <Text
                fontSize="12px"
                color="#666666"
                fontWeight="700"
                fontFamily="Inter"
                fontStyle="normal"
              >
                Furthur Studies
              </Text>
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
                Career Aspirations
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
                Remarks
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
        </Box>
      </VStack>
    </VStack>
  );
}
