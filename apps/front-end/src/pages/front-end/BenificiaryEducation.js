import React from "react";
import { HStack, VStack, Box, Progress } from "native-base";
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
      <VStack bg="bgGreyColor.200">
        <VStack px="5" pt="3">
          <VStack
            px="5"
            py="4"
            mb="3"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 fontWeight="700" bold color="textGreyColor.800">
                {t("EDUCATION_DETAILS")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                _icon={{ size: "20" }}
                color="iconColor.100"
              />
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
              <HStack
                alignItems="Center"
                justifyContent="space-between"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.3"
                  pb="2"
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
                <IconByName name="EditBoxLineIcon" color="iconColor.100" />
              </HStack>

              <HStack
                alignItems="Center"
                justifyContent="space-between"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3
                  color="textGreyColor.50"
                  fontWeight="400"
                  flex="0.3"
                  pb="2"
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

              <HStack
                alignItems="Center"
                justifyContent="space-between"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                  {t("PREVIOUS_SCHOOL_TYPE")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.core_beneficiaries?.previous_school_type
                    ? benificiary?.core_beneficiaries?.previous_school_type
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>

              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3">
                  {t("REASON_FOR_LEAVING")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  {benificiary?.core_beneficiaries?.reason_of_leaving_education
                    ? benificiary?.core_beneficiaries
                        ?.reason_of_leaving_education
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>

          <VStack
            px="5"
            py="4"
            mb="3"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack
              justifyContent="space-between"
              alignItems="Center"
              borderBottomWidth="1px"
              borderBottomColor="appliedColor"
            >
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("FURTHUR_STUDIES")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                _icon={{ size: "20" }}
                color="iconColor.100"
              />
            </HStack>
            <Box>
              <Progress
                value={arrList(benificiary?.core_beneficiaries, [
                  "career_aspiration",
                  "career_aspiration_details",
                ])}
                size="xs"
                colorScheme="info"
              />
            </Box>
            <VStack space="2" pt="5">
              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                  {t("CAREER_ASPIRATIONS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.core_beneficiaries?.career_aspiration
                    ? benificiary?.core_beneficiaries?.career_aspiration
                    : "-"}
                </FrontEndTypo.H3>
                <IconByName name="EditBoxLineIcon" color="iconColor.100" />
              </HStack>

              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3">
                  {t("REMARKS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.core_beneficiaries?.career_aspiration_details
                    ? benificiary?.core_beneficiaries?.career_aspiration_details
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
