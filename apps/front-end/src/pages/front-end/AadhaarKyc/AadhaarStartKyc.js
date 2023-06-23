import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, Text, Image, HStack } from "native-base";
import { FrontEndTypo, IconByName, Layout, t } from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";

const AadhaarStartKyc = () => {
  const navigate = useNavigate();

  return (
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn"],
        _box: { bg: "white", shadow: "appBarShadow" },
        _backBtn: { borderWidth: 1, p: 0, borderColor: "btnGray.100" },
      }}
    >
      <Box className="adharVerifyStart" w="full" minH="100vh">
        <Box className="content" p="4" flexGrow="1" w="full">
          {/* <Text textAlign="center" fontSize="lg" px="20px">
          {t("YOUR_APPLICATION_IS_SUBMITTED_SUCCESSFULLY")}
        </Text>

        <Text textAlign="center" color="black:alpha.70">
          {t("COMPLETE_AADHAAR_CARD_VERIFICATION")}
        </Text> */}
          <FrontEndTypo.H3 textAlign="center">
            {t("OFFLINE_KYC_MESSAGE")}
          </FrontEndTypo.H3>
          <FrontEndTypo.Primarybutton
            mt="10"
            onPress={() => {
              navigate("/admin/aadhaarNumber");
            }}
          >
            {t("AADHAAR_NUMBER_KYC")}
          </FrontEndTypo.Primarybutton>
          <HStack alignItems="center">
            <IconByName
              name="ErrorWarningLineIcon"
              size="13px"
              mr="2"
              color="red.600"
            />
            <FrontEndTypo.H5 alignItems="center" color="red.600" py="2">
              {t("MOBILE_NUMBER_IS_NOT_LINKED_TO_AADHAAR_CARD")}
            </FrontEndTypo.H5>
          </HStack>

          <FrontEndTypo.H1 textAlign="center" color="textGreyColor.500">
            OR
          </FrontEndTypo.H1>
          <HStack justifyContent="center">
            <Image
              source={{
                uri: "/aadhar.svg",
              }}
              alt="Aadhar"
              size={"200px"}
              resizeMode="contain"
            />
          </HStack>
          <FrontEndTypo.H3 textAlign="center">
            {t("COMPLETE_AADHAR_VERIFICATION_MESSAGE")}
          </FrontEndTypo.H3>
          <FrontEndTypo.Secondarybutton
            my="4"
            onPress={() => {
              navigate("/admin/aadhaarQrScanner");
            }}
          >
            {t("SCAN_QR_CODE")}
          </FrontEndTypo.Secondarybutton>

          <Text
            color="red.600"
            display="flex"
            alignItems="center"
            gap="1"
            mt="2"
          >
            <ErrorOutlineIcon fontSize="small" />
            <span style={{ fontSize: "13px" }}>
              {t("UNABLE_TO_SCAN_THE_QR_CODE")}
            </span>
          </Text>

          <FrontEndTypo.Secondarybutton
            mt="8"
            py="3"
            onPress={() => {
              navigate("/admin/aadhaarManualUpload");
            }}
          >
            {t("MANUAL_AADHAAR_UPLOAD")}
          </FrontEndTypo.Secondarybutton>
        </Box>

        <Box
          className="bottom"
          w="full"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="20px"
        >
          <Text textAlign="center" mb="4">
            {t(
              "WE_HAVE_SENT_YOU_A_TEXT_MESSAGE_WITH_USERNAME_AND_PASSWORD_ON_YOUR_MOBILE_NUMBER"
            )}
          </Text>

          <Button variant="outline" w="100%" borderRadius="full">
            {t("SKIP_TO_LOGIN")}
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default AadhaarStartKyc;
