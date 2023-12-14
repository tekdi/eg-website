import {
  FloatingInput,
  FrontEndTypo,
  Layout,
  MobileNumber,
} from "@shiksha/common-lib";
import { VStack, Text, Input, HStack, Button, Pressable } from "native-base";
import React, { useState } from "react";

const FacilitatorOnboarding = () => {
  const [disable, setDisable] = useState(true);
  const [showOtpBoxes, setShowOtpBoxes] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mobileNumber, setMobileNumber] = useState("");

  const handleInputChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  };

  const handleMobileNumberChange = (value) => {
    setMobileNumber(value);
  };

  const handleNextPress = () => {
    if (mobileNumber && mobileNumber.length === 10) {
      setShowOtpBoxes(true);
    } else {
      console.log("Invalid mobile number");
    }
  };

  return (
    <Layout>
      <VStack flex={2} padding={4} space={6}>
        <FrontEndTypo.H2 bold>Sign Up in three simple steps!</FrontEndTypo.H2>
        <Text bold fontWeight={600} color={"#790000"}>
          Tell us your name
        </Text>
        <Text color={"rgba(121, 0, 0, 1)"}>(As per your Aadhaar Card)</Text>
        <FloatingInput onChange={""} placeholder={"First Name"} />
        <FloatingInput onChange={""} placeholder={"Last Name"} />

        <FrontEndTypo.H2 color={"#790000"}>
          How can we Contact You?
        </FrontEndTypo.H2>
        <Text color={"#790000"}>(Please Enter Mobile Number)</Text>
        <Input
          placeholder="Enter your mobile number"
          type="mobile"
          onChange={handleMobileNumberChange}
        ></Input>

        <Pressable onPress={handleNextPress}>
          <FrontEndTypo.Primarybutton>Next</FrontEndTypo.Primarybutton>
        </Pressable>
      </VStack>
    </Layout>
  );
};

export default FacilitatorOnboarding;
