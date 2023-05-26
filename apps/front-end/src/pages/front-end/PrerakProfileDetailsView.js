import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
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
import {
  IconByName,
  arrList,
  facilitatorRegistryService,
  t,
  Layout,
} from "@shiksha/common-lib";

export default function PrerakProfileDetailsView({
  userTokenInfo,
  footerLinks,
}) {
  const [prerak, SetPrerak] = useState(userTokenInfo?.authUser);

  return (
    <Layout
      _appBar={{ name: t("YOUR_PROFILE") }}
      _footer={{ menues: footerLinks }}
    >
      <VStack bg="bgGreyColor.200">
        <VStack paddingLeft="16px" paddingRight="16px" space="24px">
          <Text
            fontFamily="Inter"
            fontStyle="normal"
            paddingTop="24px"
            fontSize="18px"
            color="#790000"
            fontWeight="700px"
          >
            Welcome {prerak?.first_name}
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
                {t("BASIC_DETAILS")}
              </Text>
              <Box paddingTop="2">
                <Progress
                  value={arrList(prerak, [
                    "first_name",
                    "email_id",
                    "last_name",
                    "middle_name",
                    "dob",
                    "mobile",
                    "alternate_mobile",
                    "address",
                    "district",
                    "block",
                    "village",
                    "grampanchayat",
                    "gender",
                    "marital_status",
                    "social_category",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="UserLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("ADD_YOUR_PERSONAL_DETAILS")}
                    </Text>
                  </HStack>

                  <IconByName name="ArrowRightSLineIcon" color="#790000" />
                </HStack>
                <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="MapPinLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("ADD_YOUR_ADDRESS")}
                    </Text>
                  </HStack>
                  <IconByName name="ArrowRightSLineIcon" color="#790000" />
                </HStack>
                <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="AddLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("ADD_IN_SOME_ADDITIONAL_DETAILS")}
                    </Text>
                  </HStack>

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
                {t("EDUCATION_AND_WORK_DETAILS")}
              </Text>
              <Box paddingTop="2">
                <Progress value={45} size="xs" colorScheme="info" />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="UserLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("QUALIFICATION_DETAILS")}
                    </Text>
                  </HStack>
                  <IconByName name="ArrowRightSLineIcon" color="#790000" />
                </HStack>
                <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="HeartLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("VOLUNTEER_EXPERIENCE")}
                    </Text>
                  </HStack>
                  <IconByName name="ArrowRightSLineIcon" color="#790000" />
                </HStack>
                <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName
                      name="SuitcaseLineIcon"
                      _icon={{ size: "20" }}
                    />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("WORK_EXPERIENCE")}
                    </Text>
                  </HStack>
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
                {t("OTHER_DETAILS")}
              </Text>
              <Box paddingTop="2">
                <Progress value={45} size="xs" colorScheme="info" />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="AddLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("OTHER_DETAILS")}
                    </Text>
                  </HStack>
                  <IconByName name="ArrowRightSLineIcon" color="#790000" />
                </HStack>
                <Divider orientation="horizontal" bg="#E0E0E0" thickness="1" />
                <HStack alignItems="Center" justifyContent="space-between">
                  <HStack alignItems="Center" space="md">
                    <IconByName name="UserLineIcon" _icon={{ size: "20" }} />

                    <Text
                      fontSize="14px"
                      color="#212121E"
                      fontWeight="400"
                      fontFamily="Inter"
                      fontStyle="normal"
                    >
                      {t("REFERENCE_CONTACT_DETAILS")}
                    </Text>
                  </HStack>
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
    </Layout>
  );
}
