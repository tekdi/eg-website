import React from "react";
import { BodyMedium, H3, Layout, t, FrontEndTypo } from "@shiksha/common-lib";
import { Button, VStack, Text, Image } from "native-base";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  return (
    <Layout
      _appBar={{ _box: { bg: "white", shadow: "appBarShadow" } }}
      _page={{ _scollView: { bg: "formBg.500" } }}
    >
      <VStack space="30" pt="30" p="5">
        <H3 textAlign={"center"}>
          {t("YOUR_APPLICATION_IS_SUBMITTED_SUCCESSFULLY")}
        </H3>
        <Text fontWeight="700" fontSize="30px" textAlign={"center"}>
          {t("COMPLETE_YOUR_AADHAR_VERIFICATION_NOW")}
        </Text>
        <VStack space={5}>
          <Image
            alignSelf={"center"}
            source={{
              uri: "/Aadhar.png",
            }}
            alt=""
            width="199"
            height="111.63"
          />
          <FrontEndTypo.Primarybutton variant="primary" py="12px" px="20px">
            Aadhaar Number KYC
          </FrontEndTypo.Primarybutton>
          <FrontEndTypo.Secondarybutton
            variant="secondary"
            bg="gray.200"
            py="12px"
            px="20px"
          >
            Scan QR Code
          </FrontEndTypo.Secondarybutton>

          <BodyMedium textAlign={"center"}>
            We have sent you a text message with username and password on your
            mobile number
          </BodyMedium>
          <Button
            variant="link"
            onPress={() => {
              navigate("/dashboard");
            }}
          >
            {t("SKIP_TO_DASHBOARD")}
          </Button>
        </VStack>
      </VStack>
    </Layout>
  );
}
