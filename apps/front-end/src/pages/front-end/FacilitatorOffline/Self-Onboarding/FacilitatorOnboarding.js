import {
  CustomOTPBox,
  FloatingInput,
  FrontEndTypo,
  Layout,
  MobileNumber,
} from "@shiksha/common-lib";
import { VStack, Text, Input, Image } from "native-base";
import React, { useState, useCallback } from "react";
import aadhar from "./aadhar_illustration.png";
import OfflineSplashScreen from "../splashscreen/OfflineSplashScreen";
import ImageTextCarousel from "../common/ImageTextCarousel";

const FacilitatorOnboarding = () => {
  const [activeScreenName, setActiveScreenName] = useState();
  const [mobileNumber, setMobileNumber] = useState("");

  const handleInputChange = (value) => {
    setMobileNumber(value);
  };

  const handleNextScreen = (screenName) => {
    setActiveScreenName(screenName);
  };

  //screen1
  const idVerification = () => (
    <>
      <FrontEndTypo.H1 bold>1. Basic Details</FrontEndTypo.H1>
      <Text bold fontWeight={600} color={"#790000"}>
        ID Verification
      </Text>{" "}
      <Image
        alignSelf={"center"}
        resizeMode="contain"
        source={{ uri: aadhar }}
        alt="Alternate Text"
        size="2xl"
      />{" "}
      <Input
        type="tel"
        placeholder="Enter mobile number"
        value={mobileNumber}
        onChangeText={handleInputChange}
      />
      <Text>Enter the 12-digit number on your Aadhar Card</Text>
      <FrontEndTypo.Primarybutton
        style={{ background: "#FF0000" }}
        onPress={() => handleNextScreen("enterBasicDetails")}
        isDisabled={!mobileNumber}
      >
        Next
      </FrontEndTypo.Primarybutton>
    </>
  );
  //screen2
  const enterBasicDetails = () => (
    <>
      <VStack flex={3} space={5}>
        <FrontEndTypo.H1 bold>Sign Up in three simple steps!</FrontEndTypo.H1>
        <Text bold fontWeight={600} color={"#790000"}>
          Tell us your name
        </Text>{" "}
        <Text color={"#790000"}>(As per your Aadhar Card)</Text>
        <Input type="text" placeholder="Enter first name" />
        <Input type="text" placeholder="Enter last name" />
        <Text bold fontWeight={600} color={"#790000"}>
          How can we Contact You?
        </Text>{" "}
        <Text color={"#790000"}>(As per your Aadhar Card)</Text>
        <Input
          type="tel"
          placeholder="Enter mobile number"
          value={mobileNumber}
          onChangeText={handleInputChange}
        />
        <FrontEndTypo.Primarybutton
          style={{ background: "#FF0000" }}
          onPress={() => handleNextScreen("contactDetails")}
          isDisabled={!mobileNumber}
        >
          Next
        </FrontEndTypo.Primarybutton>
      </VStack>
    </>
  );
  //screen3
  const contactDetails = () => (
    <>
      <VStack flex={3} space={6}>
        <FrontEndTypo.H1 color={"#790000"}>
          Verify your contact number
        </FrontEndTypo.H1>
        <Text color={"#790000"}>(Please enter the OTP sent to your phone)</Text>
        <Input
          type="tel"
          placeholder="Enter mobile number"
          value={""}
          onChangeText={handleInputChange}
        />
        <Text color={"var(--Gray-70, #616161);"} fontSize={"12px"}>
          Enter the 4 digit OTP sent on the number above
        </Text>
        <CustomOTPBox></CustomOTPBox>
        <FrontEndTypo.Primarybutton
          style={{ background: "#FF0000" }}
          onPress={() => handleNextScreen("idVerification")}
          isDisabled={!mobileNumber}
        >
          Next
        </FrontEndTypo.Primarybutton>
      </VStack>
    </>
  );
  const renderSwitchCase = () => {
    console.log("active screen name", activeScreenName);
    switch (activeScreenName) {
      case "idVerification":
        return idVerification();
      case "enterBasicDetails":
        return enterBasicDetails();
      case "contactDetails":
        return contactDetails();
      default:
        return idVerification();
    }
  };

  return (
    <Layout>
      <VStack flex={2} padding={3} space={3}>
        {renderSwitchCase()}
      </VStack>
    </Layout>
  );
};

export default FacilitatorOnboarding;
