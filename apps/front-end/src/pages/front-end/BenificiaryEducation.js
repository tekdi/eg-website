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
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  t,
  Layout,
} from "@shiksha/common-lib";
import { useParams } from "react-router-dom";

export default function BenificiaryEducation() {
  const params = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [userId, setUserId] = React.useState(params?.id);

  React.useEffect(() => {
    benificiaryDetails();
  }, []);

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(userId);

    setbenificiary(result?.result);
  };
  console.log(benificiary);

  return (
    <Layout _appBar={{ name: t("EDUCATION_DETAILS") }}>
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
                  {t("EDUCATION_DETAILS")}
                </FrontEndTypo.H3>
                <IconByName name="EditBoxLineIcon" color="iconColor.100" />
              </HStack>
              <Box paddingTop="2">
                <Progress
                  value={arrList(benificiary?.core_beneficiaries, [
                    "last_standard_of_education",
                    "last_standard_of_education_year",
                    "previous_school_type",
                    "reason_of_leaving_education",
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
                    {t("LAST_STANDARD_OF_EDUCATION")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries?.last_standard_of_education
                      ? benificiary?.core_beneficiaries
                          ?.last_standard_of_education
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
                    {t("LAST_YEAR_OF_EDUCATION")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries
                      ?.last_standard_of_education_year
                      ? benificiary?.core_beneficiaries
                          ?.last_standard_of_education_year
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
                    {t("PREVIOUS_SCHOOL_TYPE")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries?.previous_school_type
                      ? benificiary?.core_beneficiaries?.previous_school_type
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
                    {t("REASON_FOR_LEAVING")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries
                      ?.reason_of_leaving_education
                      ? benificiary?.core_beneficiaries
                          ?.reason_of_leaving_education
                      : "-"}
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
                  {t("FURTHUR_STUDIES")}
                </FrontEndTypo.H3>
                <IconByName name="EditBoxLineIcon" color="iconColor.100" />
              </HStack>
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
              <VStack space="2" paddingTop="5">
                <HStack alignItems="Center" justifyContent="space-between">
                  <FrontEndTypo.H3
                    color="textGreyColor.50"
                    fontWeight="400"
                    flex="0.3"
                  >
                    {t("CAREER_ASPIRATIONS")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries?.career_aspiration
                      ? benificiary?.core_beneficiaries?.career_aspiration
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
                    {t("REMARKS")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3
                    color="textGreyColor.800"
                    fontWeight="400"
                    flex="0.4"
                  >
                    {benificiary?.core_beneficiaries?.career_aspiration_details
                      ? benificiary?.core_beneficiaries
                          ?.career_aspiration_details
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Layout>
  );
}
