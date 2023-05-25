import React from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Text } from "native-base";
import { t } from "@shiksha/common-lib";
import { useNavigate } from "react-router-dom";

const AadhaarStartKyc = () => {

  const navigate = useNavigate();

  return (
    <Box className="adharVerifyStart" w="full" minH="100vh">
      <Box className="content" p="4" flexGrow="1" w="full">
        <Text textAlign="center" fontSize="lg" px="20px">{t("YOUR_APPLICATION_IS_SUBMITTED_SUCCESSFULLY!")}</Text>

        <Text textAlign="center" color="black:alpha.70">{t("COMPLETE_AADHAAR_CARD_VERIFICATION")}</Text>

        <Button
          variant="outline"
          bg="gray.100"
          borderRadius="full"
          mt="10"
          onPress={() => {
            navigate('/admin/aadhaarNumber')
          }}
        >
          <Text fontSize="md" fontWeight="medium" color="gray.600">Aadhaar Number KYC</Text>
        </Button>

        <Text
          color="red.600"
          display="flex"
          alignItems="center"
          gap="1"
          mt="2"
        >
          <ErrorOutlineIcon fontSize="small" />
          <span style={{ fontSize: "13px" }}>{t("MOBILE_NUMBER_IS_NOT_LINKED_TO_AADHAAR_CARD")}</span>
        </Text>

        <Button
          variant="outline"
          bg="gray.100"
          borderRadius="full"
          mt="8"
          onPress={() => {
            navigate('/admin/aadhaarQrScanner')
          }}
        >
          <Text fontSize="md" fontWeight="medium" color="gray.600">Scan QR Code</Text>
        </Button>

        <Text
          color="red.600"
          display="flex"
          alignItems="center"
          gap="1"
          mt="2"
        >
          <ErrorOutlineIcon fontSize="small" />
          <span style={{ fontSize: "13px" }}>{t("UNABLE_TO_SCAN_THE_QR_CODE")}</span>
        </Text>

        <Button
          variant="secondary"
          bg="gray.500"
          borderRadius="full"
          mt="8"
          py="3"
          onPress={() => {
            navigate('/admin/aadhaarManualUpload')
          }}
        >
          <Text fontSize="md" fontWeight="medium" color="white">{t("MANUAL_AADHAAR_UPLOAD")}</Text>
        </Button>
      </Box>

      <Box className="bottom" w="full" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p="20px">
        <Text textAlign="center" mb="4">{t("WE_HAVE_SENT_YOU_A_TEXT_MESSAGE_WITH_USERNAME_AND_PASSWORD_ON_YOUR_MOBILE_NUMBER")}</Text>
        
        <Button
          variant="outline"
          w="100%"
          borderRadius="full"
        >
         {t("SKIP_TO_LOGIN")}
        </Button>
      </Box>
    </Box>
  );
};

export default AadhaarStartKyc;
