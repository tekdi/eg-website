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
} from "native-base";
import { IconByName } from "@shiksha/common-lib";

export default function AgLearnerProfileView() {
  return (
    <VStack paddingBottom="64px" bg="bgGreyColor.200">
      <Box height="56px" justifyContent="Center" bg="#FFFFFF" p="4" shadow={3}>
        <HStack
          paddingLeft="16px"
          paddingRight="16px"
          alignItems="Center"
          space="xl"
        >
          <Button size="xs" variant="outline" colorScheme="gray">
            <ChevronLeftIcon size="5" />
          </Button>
          <Text
            fontWeight="600"
            fontSize="16px"
            fontFamily="Inter"
            fontStyle="normal"
          >
            AG Learner Profile
          </Text>
        </HStack>
      </Box>
      <VStack paddingLeft="16px" paddingRight="16px" space="24px">
        <VStack alignItems="Center">
          <IconByName
            name="AccountCircleLineIcon"
            color="#666666"
            _icon={{ size: "60" }}
          />
          <Text
            fontFamily="Inter"
            fontStyle="normal"
            fontSize="16px"
            color="#790000"
            fontWeight="600px"
          >
            Khushboo Verma
          </Text>
          <Box>Identified</Box>
        </VStack>

        <Box
          bg="#FAFAFA"
          borderColor="#E0E0E0"
          borderRadius="10px"
          borderWidth="1px"
          paddingBottom="24px"
        >
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Text
              fontSize="14px"
              color="#212121"
              fontWeight="700"
              fontFamily="Inter"
              fontStyle="normal"
            >
              {" "}
              Profile Details (1/3)
            </Text>
            <Box paddingTop="2">
              <Progress value={45} size="xs" colorScheme="info" />
            </Box>
            <VStack space="2" paddingTop="5">
              <HStack alignItems="Center" justifyContent="space-between">
                <IconByName name="UserLineIcon" _icon={{ size: "20" }} />
                <Box width="70%">
                  <Text
                    fontSize="14px"
                    color="#212121E"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Basic Details
                  </Text>
                </Box>
                <IconByName name="CheckboxCircleLineIcon" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
              <HStack alignItems="Center" justifyContent="space-between">
                <IconByName name="MapPinLineIcon" _icon={{ size: "20" }} />
                <Box width="70%">
                  <Text
                    fontSize="14px"
                    color="#212121E"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Add your address
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
              <HStack alignItems="Center" justifyContent="space-between">
                <IconByName name="AddLineIcon" _icon={{ size: "20" }} />
                <Box width="70%">
                  <Text
                    fontSize="14px"
                    color="#212121E"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    Aadhaar Details
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
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
                Documents Checklist
              </Text>
              <IconByName
                name="ArrowRightSLineIcon"
                color="#790000"
                size="sm"
              />
            </HStack>
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
                Enrollment Details
              </Text>
              <IconByName
                name="ArrowRightSLineIcon"
                color="#790000"
                size="sm"
              />
            </HStack>
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
                Camp Details
              </Text>
              <IconByName
                name="ArrowRightSLineIcon"
                color="#790000"
                size="sm"
              />
            </HStack>
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
                Journey in Project Pragati
              </Text>
              <IconByName
                name="ArrowRightSLineIcon"
                color="#790000"
                size="sm"
              />
            </HStack>
          </VStack>
        </Box>
        <Button
          bgColor="white"
          borderColor="#790000"
          borderRadius="100px"
          borderWidth="2px"
        >
          <HStack alignItems="Center">
            <IconByName name="UserUnfollowLineIcon" color="#790000" />
            <Text
              color="#790000"
              fontSize="14px"
              fontWeight="700"
              fontFamily="Inter"
              fontStyle="normal"
            >
              Mark as Dropout
            </Text>
          </HStack>
        </Button>
      </VStack>
    </VStack>
  );
}
