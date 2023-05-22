import React from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import "./AadhaarKyc.css";
import { Button, Text } from "native-base";
import { t } from "@shiksha/common-lib";

const AadhaarStartKyc = () => {
  return (
    <div className="adharVerifyStart">
      <div className="content">
        <p>Your Application is Submitted Successfully!</p>

        <h1>Complete Aadhaar Card Verification</h1>

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
          <span style={{ fontSize: "13px" }}>Mobile Number is not linked to Aadhaar Card</span>
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
          <span style={{ fontSize: "13px" }}>Unable to scan the QR Code</span>
        </Text>

        <Button
          variant="secondary"
          bg="gray.500"
          borderRadius="full"
          mt="8"
          py="3"
        >
          <Text fontSize="md" fontWeight="medium" color="white">Manual Aadhaar Upload</Text>
        </Button>
      </div>

      <div className="bottom">
        <Text textAlign="center" mb="4">We have sent you a text message with username and password on your mobile number</Text>
        
        <Button
          variant="outline"
          w="100%"
          borderRadius="full"
        >
          Skip to Login
        </Button>
      </div>
    </div>
  );
};

export default AadhaarStartKyc;
