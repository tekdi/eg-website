import { CustomOTPBox, FrontEndTypo, Layout, t } from "@shiksha/common-lib";
import {
  VStack,
  Text,
  Input,
  Image,
  HStack,
  Stack,
  Box,
  Button,
  Center,
  Pressable,
} from "native-base";
import React, { useState, useCallback } from "react";
import aadharImage from "./aadhar_illustration.png";
import introductionImage from "../common/Images/Image7.png";
import prerakDutiesImage1 from "../common/Images/Image1.png";
import prerakDutiesImage2 from "../common/Images/Image2.png";
import prerakDutiesImage3 from "../common/Images/Image3.png";
import prerakDutiesImage4 from "../common/Images/Image4.png";
import prerakDutiesImage5 from "../common/Images/Image5.png";
import prerakDutiesImage6 from "../common/Images/Image6.png";

const stylesheet = {
  text1: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "26px",
    color: "#3F8BF1",
    textDecoration: "underline",
  },
  image: {},
  buttonStyle: {
    height: "91px",
    padding: "16px",
  },
  headerText: {
    color: "var(--Gray-90, #212121);",
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: "22px",
  },
};

const FacilitatorOnboarding = () => {
  const [activeScreenName, setActiveScreenName] = useState();
  const [mobileNumber, setMobileNumber] = useState("");

  const [header, setHeader] = useState([
    { text: "Identify Out-of-School Girls" },
    { text: "Counsel Parents" },
    { text: "Register Girls for Exams" },
    { text: "Conduct Camps" },
    { text: "Help Girls Attend Exams" },
    { text: "Guide them towards Future Goals" },
  ]);
  const [caption, setCaption] = useState([
    { showcaption: "To pursue 10th school from open school." },
    { showcaption: "To pursue 10th school from open school." },
    { showcaption: "To pursue 10th school from open school." },
    { showcaption: "To pursue 10th school from open school." },
    { showcaption: "To pursue 10th school from open school." },
    { showcaption: "To pursue 10th school from open school." },
  ]);

  const [images, setImages] = useState([
    { uri: prerakDutiesImage1 },
    { uri: prerakDutiesImage2 },
    { uri: prerakDutiesImage3 },
    { uri: prerakDutiesImage4 },
    { uri: prerakDutiesImage5 },
    { uri: prerakDutiesImage6 },
  ]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const handleInputChange = (value) => {
    setMobileNumber(value);
  };

  const handleNextScreen = (screenName) => {
    setActiveScreenName(screenName);
  };

  //screen1

  const chooseLangauge = () => {
    return (
      <Stack>
        <Box p="5">
          <FrontEndTypo.H1 pt="24px" bold textAlign={"center"}>
            {t("CHOOSE_LANGUAGE")}
          </FrontEndTypo.H1>
          <FrontEndTypo.H3
            pt="5"
            color="textGreyColor.700"
            textAlign={"center"}
          >
            {t("PREFERED_LANGUAGE")}
          </FrontEndTypo.H3>

          <HStack space={3} mt={50}>
            <Button
              color={" var(--Gray-80, #424242)"}
              height={"14vh"}
              width={"40vw"}
              padding={"16px"}
              borderRadius={"4px"}
              border={" 1px solid var(--Gray-30, #E0E0E0)"}
              // background={"var(--Gray-10, #FAFAFA)"}
              onPress={() => handleNextScreen("introductionOfProject")}
            >
              {t("ENGLISH")}
            </Button>
            <Button
              height={"14vh"}
              width={"40vw"}
              padding={"16px"}
              borderRadius={"4px"}
              onPress={() => handleNextScreen("introductionOfProject")}
            >
              {t("HINDI")}
            </Button>
          </HStack>
        </Box>
      </Stack>
    );
  };
  const introductionOfProject = () => (
    <>
      <VStack flex={3} space={5}>
        <Stack>
          <FrontEndTypo.H2 bold color="textMaroonColor.400" textAlign="center">
            {t("PROJECT_PRAGATI")}
          </FrontEndTypo.H2>
          <FrontEndTypo.H1
            color="var(--Grey-900, #212121)"
            p={2}
            fontWeight={800}
            textAlign={"center"}
          >
            {t("SPLASHSCREEN_1")}
          </FrontEndTypo.H1>
          <VStack
            space={2}
            justifyContent="center"
            alignItems="center"
            safeAreaTop
            mb={6}
          >
            <Image
              size={"2xl"}
              resizeMode="cover"
              borderRadius={"10px"}
              source={{
                uri: introductionImage,
              }}
              alt={"Alternate Text "}
              style={""}
            />
            <Box bg="white" width="100%" px="5">
              <Center my="6">
                <Pressable onPress={""}>
                  <FrontEndTypo.H3
                    onPress={() => handleNextScreen("prerakDuties")}
                    style={stylesheet.text1}
                  >
                    {" "}
                    {t("KNOW_PRERAK_DUTIES")}
                  </FrontEndTypo.H3>
                </Pressable>
              </Center>
              <FrontEndTypo.Primarybutton
                onPress={() => handleNextScreen("idVerification")}
              >
                {t("APPLY_NOW")}
              </FrontEndTypo.Primarybutton>
            </Box>
            <Center>
              <Pressable>
                <Text style={stylesheet.text1}>
                  {" "}
                  {t("ALREADY_APPLIED_CHECK_STATUS")}
                </Text>
              </Pressable>
            </Center>
          </VStack>
        </Stack>
      </VStack>
    </>
  );
  const idVerification = () => (
    <>
      <FrontEndTypo.H1 bold>1. {t("BASIC_DETAILS")}</FrontEndTypo.H1>
      <Text bold fontWeight={600} color={"#790000"}>
        {t("ID_VERIFICATION")}
      </Text>{" "}
      <Image
        alignSelf={"center"}
        resizeMode="contain"
        source={{ uri: aadharImage }}
        alt="Alternate Text"
        size="2xl"
      />{" "}
      <Input
        type="tel"
        placeholder="Enter mobile number"
        value={mobileNumber}
        onChangeText={handleInputChange}
      />
      <Text>{t("ENTER_THE_12_DIGIT_AADHAAR_CARD")}</Text>
      <FrontEndTypo.Primarybutton
        style={{ background: "#FF0000" }}
        onPress={() => handleNextScreen("enterBasicDetails")}
        isDisabled={!mobileNumber}
      >
        {t("NEXT")}
      </FrontEndTypo.Primarybutton>
    </>
  );
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
          {t("USER_ENTER_FOUR_DIGIT_OTP")}
        </Text>
        <CustomOTPBox></CustomOTPBox>
        <FrontEndTypo.Primarybutton
          style={{ background: "#FF0000" }}
          onPress={() => handleNextScreen("chooseLangauge")}
        >
          {t("NEXT")}
        </FrontEndTypo.Primarybutton>
      </VStack>
    </>
  );
  const prerakDuties = () => {
    const onPressButton = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );

      setCurrentHeaderIndex((prevIndex) =>
        prevIndex < header.length - 1 ? prevIndex + 1 : 0
      );

      setCurrentCaptionIndex((prevIndex) =>
        prevIndex < caption.length - 1 ? prevIndex + 1 : 0
      );
    };

    return (
      <>
        <VStack alignItems={"center"}>
          <FrontEndTypo.H3
            color="textMaroonColor.400"
            mt="2"
            textAlign="center"
          >
            {t("PRERAK_DUTIES")}
          </FrontEndTypo.H3>
          <Box alignSelf={"center"} width="100%" borderRadius="10px">
            {" "}
            <Image
              size={"2xl"}
              width={"100%"}
              borderTopRadius={"10px"}
              source={{ uri: images[currentImageIndex].uri }}
              alt="Alternate Text"
            />
          </Box>
          <Box
            alignSelf={"center"}
            bg="white"
            width="100%"
            p="4"
            style={{
              shadowColor: "rgba(0, 0, 0, 0.15)",
              shadowOffset: {
                width: 1.95,
                height: 1.95,
              },
              shadowOpacity: 2.6,
              shadowRadius: 2.6,
              elevation: 1,
            }}
            borderBottomRadius="10px"
          >
            <Text style={stylesheet.headerText}>
              {header[currentHeaderIndex].text}
            </Text>
            <Text style={stylesheet.captionText}>
              {caption[currentCaptionIndex].showcaption}
            </Text>
          </Box>
          <HStack justifyContent={"center"} mt={5} mb={5} space={2}>
            {images.map((_, index) => (
              <Box
                key={index}
                borderRadius={20}
                w={index === currentImageIndex ? "36px" : "12px"}
                h="1"
                bg={
                  index === currentImageIndex
                    ? "var(--Secondary-Blue, #084B82);"
                    : "gray.300"
                }
              />
            ))}
          </HStack>
          {currentImageIndex === images.length - 1 ? (
            <FrontEndTypo.Primarybutton
              justifyContent={"center"}
              width="85%"
              onPress={() => handleNextScreen("idVerification")}
            >
              {t("APPLY_NOW")}
            </FrontEndTypo.Primarybutton>
          ) : (
            <FrontEndTypo.Primarybutton
              justifyContent={"center"}
              width="85%"
              onPress={onPressButton}
            >
              {t("PRERAK_PROCEED_BTN")}
            </FrontEndTypo.Primarybutton>
          )}

          <FrontEndTypo.H3
            color="blueText.400"
            my="5"
            underline
            bold
            onPress={() => handleNextScreen("idVerification")}
          >
            {t("SKIP_TO_APPLY")}
          </FrontEndTypo.H3>
        </VStack>
      </>
    );
  };
  const renderSwitchCase = () => {
    console.log("active screen name", activeScreenName);
    switch (activeScreenName) {
      case "chooseLangauge":
        return chooseLangauge();
      case "introductionOfProject":
        return introductionOfProject();
      case "prerakDuties":
        return prerakDuties();
      case "idVerification":
        return idVerification();
      case "enterBasicDetails":
        return enterBasicDetails();
      case "contactDetails":
        return contactDetails();
      default:
        return chooseLangauge();
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
