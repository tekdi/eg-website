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
import { useNavigate, useParams } from "react-router-dom";

export default function BenificiaryEnrollment() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = React.useState();

  const navigate = useNavigate();

  React.useEffect(() => {
    agDetails();
  }, [id]);

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setbenificiary(result?.result);
  };

  return (
    <Layout _appBar={{ name: t("ENROLLMENT_DETAILS") }}>
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
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("ENROLLMENT_DETAILS")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                color="iconColor.100"
                _icon={{ size: "20" }}
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/enrollment-details`);
                }}
              />
            </HStack>
            <Box>
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
            <VStack space="2" pt="5">
              <HStack
                alignItems="Center"
                justifyContent="space-between"
                borderBottomWidth="1px"
                borderBottomColor="appliedColor"
              >
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                  {t("TYPE_OF_ENROLLMENT")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.core_beneficiaries?.type_of_enrollement
                    ? benificiary?.core_beneficiaries?.type_of_enrollement
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
                  {t("ENROLLMENT_STATUS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.core_beneficiaries?.enrollement_status
                    ? benificiary?.core_beneficiaries?.enrollement_status
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
                  {t("ENROLLMENT_BOARD")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.core_beneficiaries?.enrolled_for_board
                    ? benificiary?.core_beneficiaries?.enrolled_for_board
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
                  {t("ENROLLMENT_NUMBER")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.core_beneficiaries?.enrollment_number
                    ? benificiary?.core_beneficiaries?.enrollment_number
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>

              <HStack alignItems="Center" justifyContent="space-between">
                <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3">
                  {t("SELECTED_SUBJECTS")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
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

          <VStack
            px="5"
            pb="3"
            pt="2"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            <HStack justifyContent="space-between" alignItems="Center">
              <FrontEndTypo.H3 bold color="textGreyColor.800">
                {t("UPLOAD_RECEIPT")}
              </FrontEndTypo.H3>
              <IconByName
                name="EditBoxLineIcon"
                _icon={{ size: "20" }}
                color="iconColor.100"
                onPress={(e) => {
                  navigate(`/beneficiary/edit/${id}/enrollment-details`);
                }}
              />
            </HStack>
            <VStack space="5">
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
        </VStack>
      </VStack>
    </Layout>
  );
}
