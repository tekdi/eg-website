import React from "react";
import { H3, Layout, t } from "@shiksha/common-lib";
import { Button, VStack } from "native-base";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  return (
    <Layout isDisabledAppBar isCenter _page={{ _scollView: { bg: "white" } }}>
      <VStack space="60" pt="60" p="5">
        <H3 textAlign={"center"}>
          {t("YOUR_APPLICATION_IS_SUBMITTED_SUCCESSFULLY")}
        </H3>
        {/* <Box>
          <Text fontWeight="700" fontSize="30px" textAlign={"center"}>
            Complete Aadhar Card Verification
          </Text>
        </Box> */}
        <VStack space={5}>
          {/* <Button variant="primary" py="12px" px="20px">
            Aadhaar Number KYC
          </Button>
          <Button variant="secondary" bg="gray.200" py="12px" px="20px">
            Scan QR Code
          </Button>
          <Image
            alignSelf={"center"}
            source={{
              uri: "/Aadhar.png",
            }}
            alt=""
            width="292"
            height="164"
          />
          <BodyMedium textAlign={"center"}>
            We have sent you a text message with username and password on your
            mobile number
          </BodyMedium> */}
          <Button
            variant="secondary"
            bg="gray.200"
            py="12px"
            px="20px"
            onPress={() => {
              navigate("/dashboard");
            }}
          >
            {t("DASHBOARD")}
          </Button>
        </VStack>
      </VStack>
    </Layout>
  );
}
