import React from "react";
import { HStack, VStack, Text, Box, Button, ArrowBackIcon } from "native-base";
import { IconByName, FrontEndTypo } from "@shiksha/common-lib";

export default function EnrollmentDetailsWarning() {
  const Warning = () => {
    return (
      <Box
        bgColor="boxBackgroundColour.50"
        borderColor="#FFC5C0"
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
            Enrollment Details
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
                      Enrollment Status
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
                    Type of Enrollment
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    New
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Enrollment Status
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    Completed
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Enrollment Board
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    RIOS
                  </FrontEndTypo.H3>
                </VStack>
                <VStack paddingTop="16px">
                  <FrontEndTypo.H5 color="textGreyColor.600" fontWeight="500">
                    Enrollment Number
                  </FrontEndTypo.H5>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    090092111872
                  </FrontEndTypo.H3>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box borderColor="AppliedColor" borderWidth="1px" paddingBottom="24px">
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
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
                      Selected Subjects
                    </FrontEndTypo.H4>
                  </Box>
                  <IconByName
                    color="iconColor.50"
                    name="AddLineIcon"
                    _icon={{ size: "20" }}
                  />
                </HStack>
                <VStack space="12px">
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    Science
                  </FrontEndTypo.H3>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    English
                  </FrontEndTypo.H3>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    Home Science
                  </FrontEndTypo.H3>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    Maths
                  </FrontEndTypo.H3>
                  <FrontEndTypo.H3 color="textGreyColor.450" fontWeight="500">
                    Drawing
                  </FrontEndTypo.H3>
                </VStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <Box borderColor="#E0E0E0" borderWidth="1px" paddingBottom="24px">
          <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
            <Warning />
            <HStack justifyContent="space-between" alignItems="Center">
              <IconByName
                name="UserLineIcon"
                _icon={{ size: "15" }}
                color="iconColor.150"
              />
              <Box width="80%">
                <FrontEndTypo.H4
                  color="textGreyColor.250"
                  bold
                  fontWeight="700"
                >
                  Upload Receipt
                </FrontEndTypo.H4>
              </Box>
              <IconByName
                color="iconColor.50"
                name="AddLineIcon"
                _icon={{ size: "20" }}
              />
            </HStack>
            <Box
              width="full"
              height="172px"
              borderWidth="1px"
              borderColor="worksheetBoxText.100"
              alignSelf="Center"
            />
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
}
