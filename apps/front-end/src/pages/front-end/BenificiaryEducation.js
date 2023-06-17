import React from "react";
import { HStack, VStack, Box, Progress } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  t,
  Layout,
  enumRegistryService,
  translateEnumOption
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";

export default function BenificiaryEducation() {
  const params = useParams();
  const [benificiary, setbenificiary] = React.useState();
  const [userId, setUserId] = React.useState(params?.id);
  const [previous_school_type, setprevious_school_type] = React.useState();
  const [filteredreason, setfilteredreason] = React.useState();
  const [filteredcareer, setfilteredcareer] = React.useState();
  const navigate = useNavigate();

  React.useEffect(() => {
    benificiaryDetails();
  }, []);

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${userId}`);
  };

  const benificiaryDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(userId);

    setbenificiary(result?.result);
  };

  React.useEffect(async () => {
    const data = await enumRegistryService.listOfEnum();
    const filteredTitles = await translateEnumOption("PREVIOUS_SCHOOL_TYPE", benificiary?.core_beneficiaries?.previous_school_type, data?.data)
    const filteredreason = await translateEnumOption("REASON_OF_LEAVING_EDUCATION", benificiary?.core_beneficiaries?.reason_of_leaving_education, data?.data)
    const filteredcareer = await translateEnumOption("CAREER_ASPIRATION", benificiary?.core_beneficiaries?.career_aspiration, data?.data)
    setprevious_school_type(filteredTitles);
    setfilteredreason(filteredreason);
    setfilteredcareer(filteredcareer);
  }, [benificiary]);
  return (
    <Layout _appBar={{ name: t("EDUCATION_DETAILS"), onPressBackButton }}>
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
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${userId}/education`);
                }}
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
                    ? t(previous_school_type)
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
                    ? t(filteredreason)
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
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 fontWeight="700" bold color="textGreyColor.800">
                {t("CAREER_ASPIRATIONS")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                _icon={{ size: "20" }}
                color="iconColor.100"
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${userId}/future-education`);
                }}
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
                  {t("CAREER_ASPIRATIONS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  {benificiary?.core_beneficiaries?.career_aspiration
                    ? t(filteredcareer)
                    : "-"}
                </FrontEndTypo.H3>
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
                  {t("REMARKS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  {benificiary?.core_beneficiaries?.career_aspiration_details
                    ? benificiary?.core_beneficiaries?.career_aspiration_details
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
                  {t("LEARNING_MOTIVATION")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.program_beneficiaries?.learning_motivation
                    ? benificiary?.program_beneficiaries?.learning_motivation
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>

              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3">
                  {t("SUPPORT_FROM_PRAGATI")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3
                  color="textGreyColor.800"
                  fontWeight="400"
                  flex="0.4"
                >
                  {benificiary?.program_beneficiaries?.type_of_support_needed
                    ? benificiary?.program_beneficiaries?.type_of_support_needed
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
