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
import { IconByName, FrontEndTypo } from "@shiksha/common-lib";

export default function AgEducationWarning() {
  const Warning = () => {
    return (
      <Box
        bgColor="boxBackgroundColour.50"
        borderColor="boxBorderColour.50"
        borderWidth="1px"
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
            <ArrowBackIcon size="5" color="iconColor.150" />
          </Button>
          <FrontEndTypo.H3 color="textGreyColor.200" fontWeight="500">
            Education Details
          </FrontEndTypo.H3>
        </HStack>
      </Box>
      <VStack
        paddingLeft="16px"
        paddingRight="16px"
        space="24px"
        paddingTop="40px"
      >
        <Box borderColor="AppliedColor" borderWidth="1px" paddingBottom="24px">
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />

            <HStack flex="1">
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
                      Education Details
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
                    Last Standard of Education
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    9th
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Last Standard of Education Year
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    2017
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Previous School Type
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    None
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Reason For Leaving
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    None
                  </FrontEndTypo.H3>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box borderColor="AppliedColor" borderWidth="1px" paddingBottom="24px">
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />
            <HStack flex="1">
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
                      Furthur Studies
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
                    Career Aspirations
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    None
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Remarks
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    None
                  </FrontEndTypo.H3>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
}
