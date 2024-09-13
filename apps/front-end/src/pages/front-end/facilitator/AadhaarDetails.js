import React from "react";
import { HStack, VStack, Box, Progress, Alert } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  facilitatorRegistryService,
  t,
  Layout,
  BodyMedium,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";
import AadhaarNumberOKYC from "component/AadhaarNumberOKYC";

export default function AadhaarDetails() {
  const { id } = useParams();
  const [facilitator, setFacilitator] = React.useState();
  const navigate = useNavigate();

  React.useEffect(async () => {
    const result = await facilitatorRegistryService.getOne({ id });
    setFacilitator(result);
  }, [id]);

  return (
    <Layout
      _appBar={{
        exceptIconsShow: ["menuBtn", "userInfo"],
        leftIcon: <FrontEndTypo.H2>{t("AADHAAR_DETAILS")}</FrontEndTypo.H2>,
      }}
      analyticsPageTitle={"FACILITATOR_AADHAAR"}
      pageTitle={t("AADHAAR_DETAILS")}
    >
      {["quit"].includes(facilitator?.status) ? (
        <Alert status="warning" alignItems={"start"} mb="3" mt="4">
          <HStack alignItems="center" space="2" color>
            <Alert.Icon />
            <BodyMedium>{t("PAGE_NOT_ACCESSABLE")}</BodyMedium>
          </HStack>
        </Alert>
      ) : (
        <VStack bg="bgGreyColor.200" pb="5">
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
                  {t("AADHAAR_DETAILS")}
                </FrontEndTypo.H3>
                {!facilitator?.aadhar_no && (
                  <IconByName
                    name="EditBoxLineIcon"
                    _icon={{ size: "20" }}
                    color="iconColor.100"
                    onPress={(e) => {
                      navigate(`/profile/edit/aadhaar_details`, {
                        state: `/beneficiary/${id}/aadhaardetails`,
                      });
                    }}
                  />
                )}
              </HStack>
              <Box>
                <Progress
                  value={arrList(facilitator, [
                    "aadhar_no",
                    "aadhar_verified",
                    "aadhaar_verification_mode",
                  ])}
                  size="xs"
                  colorScheme="textMaroonColor"
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
                    {t("AADHAAR_NUMBER")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                    {facilitator?.aadhar_no ? facilitator?.aadhar_no : "-"}
                  </FrontEndTypo.H3>
                </HStack>

                <HStack
                  alignItems="Center"
                  justifyContent="space-between"
                  borderBottomWidth="1px"
                  borderBottomColor="appliedColor"
                >
                  <FrontEndTypo.H3 color="textGreyColor.50" flex="0.3" pb="2">
                    {t("VERIFICATION_PROCESS")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                    {facilitator?.aadhaar_verification_mode
                      ? facilitator?.aadhaar_verification_mode
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
                    {t("VERIFICATION_STATUS")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                    {facilitator?.aadhar_verified
                      ? facilitator?.aadhar_verified
                      : "-"}
                  </FrontEndTypo.H3>
                </HStack>
              </VStack>
            </VStack>
            {(facilitator?.aadhar_verified !== "yes" ||
              facilitator?.aadhaar_verification_mode === "upload") && (
              <VStack
                px="5"
                pb="3"
                pt="2"
                borderRadius="10px"
                borderWidth="1px"
                bg="white"
                borderColor="appliedColor"
                space="4"
              >
                {!["yes"].includes(facilitator?.aadhar_verified) &&
                  facilitator?.aadhar_no !== "" &&
                  facilitator?.aadhar_no !== null &&
                  facilitator?.aadhar_no !== undefined && (
                    <VStack space="5">
                      <FrontEndTypo.H2 bold color="textMaroonColor.400" pt="5">
                        {t("COMPLETE_AADHAAR_VERIFICATION")}
                      </FrontEndTypo.H2>

                      <AadhaarNumberOKYC
                        {...{
                          user: facilitator,
                        }}
                      />
                    </VStack>
                  )}
              </VStack>
            )}
          </VStack>
        </VStack>
      )}
    </Layout>
  );
}
