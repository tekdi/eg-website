import React from "react";
import {
  HStack,
  VStack,
  Text,
  Box,
  Button,
  ArrowBackIcon,
  Progress,
  Divider,
} from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  t,
  Layout,
} from "@shiksha/common-lib";
import { useParams } from "react-router-dom";

export default function BenificiaryEnrollment() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = React.useState();

  React.useEffect(() => {
    agDetails();
    console.log("Hello");
  }, [id]);

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setbenificiary(result?.result);
  };
  console.log("ben", benificiary);

  return (
    <Layout _appBar={{ name: t("ENROLLMENT_DETAILS") }}>
      <VStack paddingBottom="64px">
        <VStack
          paddingLeft="16px"
          paddingRight="16px"
          space="24px"
          paddingTop="40px"
        >
          <Box
            bg="boxBackgroundColour.100"
            borderColor="#E0E0E0"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {t("ENROLLMENT_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName
                  name="EditBoxLineIcon"
                  color="iconColor.100"
                  onPress={(e) => {
                    navigate(`beneficiary/${id}/edit/enrollment`);
                  }}
                />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(benificiary?.core_beneficiaries, [
                    "type_of_enrollement",
                    "enrollement_status",
                    "enrolled_for_board",
                    "enrollment_number",
                    "subjects",
                  ])}
                  size="xs"
                  colorScheme="info"
                />
              </Box>
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("TYPE_OF_ENROLLMENT")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries?.type_of_enrollement
                      ? benificiary?.core_beneficiaries?.type_of_enrollement
                      : "-"}
                  </FrontEndTypo.H3>
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
                    {t("ENROLLMENT_STATUS")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries?.enrollement_status
                      ? benificiary?.core_beneficiaries?.enrollement_status
                      : "-"}
                  </FrontEndTypo.H3>
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
                    {t("ENROLLMENT_BOARD")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries?.enrolled_for_board
                      ? benificiary?.core_beneficiaries?.enrolled_for_board
                      : "-"}
                  </FrontEndTypo.H3>
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
                    {t("ENROLLMENT_NUMBER")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries?.enrollment_number
                      ? benificiary?.core_beneficiaries?.enrollment_number
                      : "-"}
                  </FrontEndTypo.H3>
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
                    {t("SELECTED_SUBJECTS")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.program_beneficiaries?.subjects &&
                      JSON.parse(
                        benificiary?.program_beneficiaries?.subjects
                      ).map((e) => {
                        return e + "\n";
                      })}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
          <Box
            bg="boxBackgroundColour.100"
            borderColor="#E0E0E0"
            borderRadius="10px"
            borderWidth="1px"
            paddingBottom="24px"
          >
            <VStack paddingLeft="16px" paddingRight="16px" paddingTop="16px">
              <HStack justifyContent="space-between" alignItems="Center">
                <FrontEndTypo.H3
                  fontWeight="700"
                  bold
                  color="textGreyColor.800"
                >
                  {t("UPLOAD_RECEIPT")}
                </FrontEndTypo.H3>
                <IconByName name="EditBoxLineIcon" color="iconColor.100" />
              </HStack>
              <VStack space="5">
                <Box paddingTop="2">
                  <Progress
                    value={arrList(benificiary?.core_beneficiaries, [
                      "career_aspiration",
                      "career_aspiration_details",
                    ])}
                    size="xs"
                    colorScheme="info"
                  />
                </Box>
                <Box
                  paddingTop="10"
                  width="full"
                  height="172px"
                  borderWidth="1px"
                  borderColor="worksheetBoxText.100"
                  alignSelf="Center"
                />
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Layout>
  );
}
