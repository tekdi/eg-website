import React from "react";
import { HStack, VStack, Box, Progress, Image } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  t,
  Layout,
  ImageView,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";

export default function BenificiaryAadhaarDetails() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = React.useState();
  let aadharFront;
  let aadharBack;
  benificiary?.documents.forEach((element) => {
    if (element?.document_sub_type == "aadhaar_front") {
      aadharFront = element?.id;
    }
    if (element?.document_sub_type == "aadhaar_back") {
      aadharBack = element?.id;
    }
  });

  const navigate = useNavigate();

  const onPressBackButton = async () => {
    navigate(`/beneficiary/profile/${id}`);
  };

  const aadhar_verified = benificiary?.aadhar_verified;
  React.useEffect(() => {
    agDetails();
  }, [id]);

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setbenificiary(result?.result);
  };

  return (
    <Layout
      _appBar={{
        exceptIconsShow: ["menuBtn", "userInfo"],
        leftIcon: <FrontEndTypo.H2>{t("AADHAAR_DETAILS")}</FrontEndTypo.H2>,
        onPressBackButton,
      }}
    >
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
                {t("AADHAAR_DETAILS")}
              </FrontEndTypo.H3>
              {!benificiary?.aadhar_no &&
                benificiary?.program_beneficiaries?.status !==
                  "enrolled_ip_verified" && (
                  <IconByName
                    name="EditBoxLineIcon"
                    _icon={{ size: "20" }}
                    color="iconColor.100"
                    onPress={(e) => {
                      navigate(`/beneficiary/${id}/3`, {
                        state: { route: true },
                      });
                    }}
                  />
                )}
            </HStack>
            <Box>
              <Progress
                value={arrList(benificiary, [
                  "aadhar_no",
                  "aadhar_verified",
                  "aadhaar_verification_mode",
                ])}
                size="xs"
                colorScheme="red"
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
                  {benificiary?.aadhar_no ? benificiary?.aadhar_no : "-"}
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
                  {benificiary?.aadhaar_verification_mode
                    ? benificiary?.aadhaar_verification_mode
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
                  {benificiary?.aadhar_verified
                    ? benificiary?.aadhar_verified
                    : "-"}
                </FrontEndTypo.H3>
              </HStack>
            </VStack>
          </VStack>

          {(benificiary?.aadhar_verified !== "yes" ||
            benificiary?.aadhaar_verification_mode === "upload") && (
            <VStack
              px="5"
              pb="3"
              pt="2"
              borderRadius="10px"
              borderWidth="1px"
              bg="white"
              borderColor="appliedColor"
            >
              {!["yes", "in_progress"].includes(benificiary?.aadhar_verified) &&
                benificiary?.aadhar_no !== "" &&
                benificiary?.aadhar_no !== null &&
                benificiary?.aadhar_no !== undefined && (
                  <VStack space={"4"}>
                    <FrontEndTypo.H2 bold color="textMaroonColor.400" py="5">
                      {t("COMPLETE_AADHAAR_VERIFICATION")}
                    </FrontEndTypo.H2>
                    {/* <FrontEndTypo.Primarybutton
                      onPress={() => {
                        navigate(`/aadhaar-kyc/${id}/okyc2`);
                      }}
                    >
                      {t("AADHAAR_NUMBER_KYC")}
                    </FrontEndTypo.Primarybutton> 
                    <FrontEndTypo.Secondarybutton
                    my="4"
                    onPress={() => {
                      navigate(`/aadhaar-kyc/${id}/QR`);
                    }}
                  >
                    {t("SCAN_QR_CODE")}
                  </FrontEndTypo.Secondarybutton> 
                   <FrontEndTypo.Primarybutton
                      mt="10"
                      onPress={() => {
                        navigate(`/aadhaar-kyc/${id}/upload`, {
                          state: `/beneficiary/${id}/aadhaardetails`,
                        });
                      }}
                    >
                      {t("AADHAR_UPLOAD_KYC")}
                    </FrontEndTypo.Primarybutton> */}
                  </VStack>
                )}
              {benificiary?.aadhaar_verification_mode === "upload" && (
                <VStack space="5">
                  <FrontEndTypo.H2 bold color="textMaroonColor.400">
                    {t("HAVE_YOU_UPDATED_AADHAAR_CARD")}
                  </FrontEndTypo.H2>
                  <FrontEndTypo.H3 color="textGreyColor.100">
                    {t("REVERIFY_TO_MATCH_THE_AADHAAR_YOU_USED_FOR_ENROLLMENT")}
                  </FrontEndTypo.H3>

                  <FrontEndTypo.H2>{t("FRONT_VIEW")}</FrontEndTypo.H2>
                  {aadharFront ? (
                    <ImageView
                      source={{ document_id: aadharFront }}
                      alt="aadhaar_front"
                      width="full"
                      height="172px"
                      borderRadius="5px"
                      borderWidth="1px"
                      borderColor="worksheetBoxText.100"
                      alignSelf="Center"
                    />
                  ) : null}

                  <FrontEndTypo.H2>{t("BACK_VIEW")}</FrontEndTypo.H2>
                  {aadharBack ? (
                    <ImageView
                      source={{ document_id: aadharBack }}
                      alt="aadhaar_back"
                      width="full"
                      height="172px"
                      borderRadius="5px"
                      borderWidth="1px"
                      borderColor="worksheetBoxText.100"
                      alignSelf="Center"
                    />
                  ) : null}
                </VStack>
              )}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
}
