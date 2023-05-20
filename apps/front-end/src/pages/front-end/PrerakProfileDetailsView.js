import React from "react";
import {
  HStack,
  VStack,
  ArrowBackIcon,
  Text,
  Box,
  Progress,
  ChevronDownIcon,
  Divider,
  iconLeft,
  Button,
  Icon,
  ChevronLeftIcon,
} from "native-base";
import { IconByName, t } from "@shiksha/common-lib";

export default function PrerakProfileDetailsView() {
  return (
    <VStack bg="bgGreyColor.200">
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
            {t("YOUR_PROFILE")}
          </Text>
        </HStack>
      </Box>
      <VStack paddingLeft="16px" paddingRight="16px" space="24px">
        <Text
          fontFamily="Inter"
          fontStyle="normal"
          paddingTop="24px"
          fontSize="18px"
          color="#790000"
          fontWeight="700px"
        >
          Welcome Rachana
        </Text>

        <Box paddingBottom="20px">
          <Text
            fontSize="16px"
            color="#1E1E1E"
            fontWeight="500"
            fontFamily="Inter"
            fontStyle="normal"
          >
            {t("COMPLETE_YOUR_PROFILE")}
          </Text>
          <Text
            fontSize="10px"
            color="#1E1E1E"
            fontWeight="400"
            fontFamily="Inter"
            fontStyle="normal"
          >
            {t("INCREASE_YOUR_CHANCES_OF_GETTING_SELECTED")}
          </Text>
        </Box>
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
              {t("BASIC_DETAILS_(1/3)")}
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
                    {t("ADD_YOUR_PERSONAL_DETAILS")}
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
                    {t("ADD_YOUR_ADDRESS")}
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
                    {t("ADD_IN_SOME_ADDITIONAL_DETAILS")}
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
            <Text
              fontSize="14px"
              color="#212121"
              fontWeight="700"
              fontFamily="Inter"
              fontStyle="normal"
            >
              {" "}
              {t("EDUCATION_AND_WORK_DETAILS")}
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
                    {t("QUALIFICATION_DETAILS")}
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
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
                    {t("ADD_YOUR_ADDRESS")}
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
              <HStack alignItems="Center" justifyContent="space-between">
                <IconByName name="SuitcaseLineIcon" _icon={{ size: "20" }} />
                <Box width="70%">
                  <Text
                    fontSize="14px"
                    color="#212121E"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    {t("WORK_EXPERIENCE")}
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
            <Text
              fontSize="14px"
              color="#212121"
              fontWeight="700"
              fontFamily="Inter"
              fontStyle="normal"
            >
              {" "}
              {t("OTHER_DETAILS")}
            </Text>
            <Box paddingTop="2">
              <Progress value={45} size="xs" colorScheme="info" />
            </Box>
            <VStack space="2" paddingTop="5">
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
                    {t("OTHER_DETAILS")}
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
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
                    {t("REFERENCE_CONTACT_DETAILS")}
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
            <Text
              fontSize="14px"
              color="#212121"
              fontWeight="700"
              fontFamily="Inter"
              fontStyle="normal"
            >
              {" "}
              {t("DOCUMENTS_UPLOAD")}
            </Text>
            <Box paddingTop="2">
              <Progress value={45} size="xs" colorScheme="info" />
            </Box>
            <VStack space="2" paddingTop="5">
              <HStack alignItems="Center" justifyContent="space-between">
                <Box alignItems="left">
                  <Text
                    fontSize="14px"
                    color="#212121E"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    {t("AADHAAR_VERIFICATION")}
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
              <HStack alignItems="Center" justifyContent="space-between">
                <Box justifyContent="left">
                  <Text
                    fontSize="14px"
                    color="#212121E"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    {t("QUALIFICATION_PROOF")}
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
              <HStack alignItems="Center" justifyContent="space-between">
                <Box justifyContent="left">
                  <Text
                    fontSize="14px"
                    color="#212121E"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    {t("WORK_EXPERIENCE_PROOF")}
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
              </HStack>
              <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
              <HStack alignItems="Center" justifyContent="space-between">
                <Box justifyContent="left">
                  <Text
                    fontSize="14px"
                    color="#212121E"
                    fontWeight="400"
                    fontFamily="Inter"
                    fontStyle="normal"
                  >
                    {t("VOLUNTEER_EXPERIENCE_PROOF")}
                  </Text>
                </Box>
                <IconByName name="ArrowRightSLineIcon" color="#790000" />
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
}
