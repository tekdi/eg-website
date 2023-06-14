import React from "react";
import { HStack, VStack, Box, Progress, Image } from "native-base";
import {
  arrList,
  IconByName,
  FrontEndTypo,
  benificiaryRegistoryService,
  t,
  Layout,
} from "@shiksha/common-lib";
import { useNavigate, useParams } from "react-router-dom";

export default function BenificiaryAadhaarDetails() {
  const { id } = useParams();
  const [benificiary, setbenificiary] = React.useState();

  const navigate = useNavigate();
  const aadhar_verified = "Pending";

  React.useEffect(() => {
    agDetails();
  }, [id]);

  const agDetails = async () => {
    const result = await benificiaryRegistoryService.getOne(id);
    setbenificiary(result?.result);
  };

  return (
    <Layout _appBar={{ name: t("AADHAAR_DETAILS") }}>
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
            </HStack>
            <Box>
              <Progress
                value={arrList(benificiary, [
                  "aadhar_token",
                  "aadhar_verified",
                  "aadhaar_verification_mode",
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
                  {t("AADHAAR_NUMBER")}
                </FrontEndTypo.H3>

                <FrontEndTypo.H3 color="textGreyColor.800" flex="0.4">
                  {benificiary?.aadhar_token ? benificiary?.aadhar_token : "-"}
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

          <VStack
            px="5"
            pb="3"
            pt="2"
            borderRadius="10px"
            borderWidth="1px"
            bg="white"
            borderColor="appliedColor"
          >
            {aadhar_verified === "Pending" ? (
              <FrontEndTypo.H2 bold color="textMaroonColor.400" py="5">
                {t("COMPLETE_AADHAAR_VERIFICATION")}
              </FrontEndTypo.H2>
            ) : (
              <VStack>
                <FrontEndTypo.H2 bold color="textMaroonColor.400" py="5">
                  {t("HAVE_YOU_UPDATED_AADHAAR_CARD?")}
                </FrontEndTypo.H2>
                <FrontEndTypo.H3 color="textGreyColor.100" py="5">
                  {t("REVERIFY_TO_MATCH_THE_AADHAAR_YOU_USED_FOR_ENROLLMENT")}
                </FrontEndTypo.H3>
              </VStack>
            )}

            <FrontEndTypo.Primarybutton
              mt="10"
              onPress={() => {
                alert("Aadhaar KYC Page");
              }}
            >
              {t("AADHAAR_NUMBER_KYC")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.Secondarybutton
              my="4"
              onPress={() => {
                alert("QR Scanner");
              }}
            >
              {t("SCAN_QR_CODE")}
            </FrontEndTypo.Secondarybutton>
          </VStack>
          <VStack py="5">
            <FrontEndTypo.H2 pb="5">{t("FRONT_VIEW")}</FrontEndTypo.H2>
            <Image
              borderWidth="1px"
              borderColor="textGreyColor.50"
              alignSelf={"center"}
              source={{
                uri: "/Aadhar.png",
              }}
              width="full"
              height="178"
            />
            <FrontEndTypo.H2 py="5">{t("BACK_VIEW")}</FrontEndTypo.H2>
            <Image
              borderWidth="1px"
              borderColor="textGreyColor.50"
              alignSelf={"center"}
              source={{
                uri: "/AadhaarBack.png",
              }}
              width="full"
              height="178"
            />
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
