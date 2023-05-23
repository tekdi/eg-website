import React from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import "./AadhaarKyc.css";
import { Button, Text } from "native-base";
import { t } from "@shiksha/common-lib";

const AadhaarStartKyc = () => {
  return (
    <div className="adharVerifyStart">
      <div className="content">
        <p>{t("YOUR_APPLICATION_IS_SUBMITTED_SUCCESSFULLY!")}</p>

        <h1>{t("COMPLETE_AADHAAR_CARD_VERIFICATION")}</h1>

        <Button
          variant="outline"
          bg="gray.100"
          borderRadius="full"
          mt="10"
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
        >
          <Text fontSize="md" fontWeight="medium" color="white">{t("MANUAL_AADHAAR_UPLOAD")}</Text>
        </Button>
      </div>

      <div className="bottom">
        <Text textAlign="center" mb="4">{t("WE_HAVE_SENT_YOU_A_TEXT_MESSAGE_WITH_USERNAME_AND_PASSWORD_ON_YOUR_MOBILE_NUMBER")}</Text>
        
        <Button
          variant="outline"
          w="100%"
          borderRadius="full"
        >
         {t("SKIP_TO_LOGIN")}
        </Button>
      </div>
    </div>
  );
};

export default AadhaarStartKyc;
