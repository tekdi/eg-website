import { FrontEndTypo, Layout, t } from "@shiksha/common-lib";
import { get, set } from "idb-keyval";
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import {
  templates,
  FieldTemplate,
  CustomOTPBox,
} from "../../../../component/BaseInput";

import Form from "@rjsf/core";
import aadharImage from "../../../../assets/images/facilitator-duties/Aadhaar2.png";
import introductionImage from "../../../../assets/images/facilitator-duties/img7.png";
import prerakDutiesImage1 from "../../../../assets/images/facilitator-duties/img1.png";
import prerakDutiesImage2 from "../../../../assets/images/facilitator-duties/img2.png";
import prerakDutiesImage3 from "../../../../assets/images/facilitator-duties/img3.png";
import prerakDutiesImage4 from "../../../../assets/images/facilitator-duties/img4.png";
import prerakDutiesImage5 from "../../../../assets/images/facilitator-duties/img5.png";
import prerakDutiesImage6 from "../../../../assets/images/facilitator-duties/img6.png";

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
  languageButton: {
    width: 150,
    borderRadius: 14,
    backgroundColor: "var(--Gray-10, #FAFAFA)",
    borderWidth: 2,
    borderColor: "var(--Secondary-Blue, #084B82)",
    height: 91,
  },
  languageButtonText: {
    color: "var(--Secondary-Blue, #084B82)",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "normal",
  },

  defaultLanguageButton: {
    width: 150,
    borderRadius: 4,
    backgroundColor: "var(--Gray-10, #FAFAFA)",
    border: " 1px solid var(--Gray-30, #E0E0E0)",
    borderColor: "gray",
    height: 91,
  },

  defaulutLanguageButtonText: {
    color: "var(--Gray-80, #424242)",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "normal",
  },
};

const FacilitatorRegistration = () => {
  const navigate = useNavigate();

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
  const [page, setPage] = React.useState(0);

  const [basicDetails, setBasicDetails] = React.useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });

  const [uidVerification, setUIDVerification] = useState({
    aadharName: "",
  });

  const [otpVerification, setOtpVerification] = useState({
    mobile: "",
    otp: "",
  });

  const handleAadharScreen = async () => {
    try {
      await set("aadhar_verification", uidVerification);
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
    setPage((prevPage) => prevPage + 1);
    handleNextScreen("enterBasicDetails");
  };

  const handleBasicDetailsScreen = async () => {
    try {
      await set("basicDetails", basicDetails);
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
    setPage((prevPage) => prevPage + 1);
    handleNextScreen("contactDetails");
  };

  const handleOtpVerificationScreen = async () => {
    try {
      await set("otp_verification", otpVerification);
    } catch (error) {
      console.error("Error storing data in IndexedDB:", error);
    }
    setPage((prevPage) => prevPage + 1);
    handleNextScreen("chooseLangauge");
  };

  const handleInputChange = (value) => {
    setMobileNumber(value);
  };

  const handleNextScreen = (screenName) => {
    setActiveScreenName(screenName);

    navigate(`/offline/facilitator-self-onboarding/${screenName}`);
  };

  //screen1

  const chooseLangauge = () => {
    return (
      <Stack alignItems={"center"}>
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
              style={stylesheet.defaultLanguageButton}
              onPress={() => handleNextScreen("introductionOfProject")}
            >
              <Text style={stylesheet.defaulutLanguageButtonText}>
                {" "}
                {t("ENGLISH")}
              </Text>
            </Button>
            <Button
              style={stylesheet.defaultLanguageButton}
              onPress={() => handleNextScreen("introductionOfProject")}
            >
              <Text style={stylesheet.defaulutLanguageButtonText}>
                {" "}
                {t("HINDI")}
              </Text>
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
      <VStack>
        <FrontEndTypo.H1 bold>
          {t("तीन सरल चरणों में साइन अप करें!")}
        </FrontEndTypo.H1>
        <FrontEndTypo.H3
          bold
          style={{ fontWeight: 600, color: "#790000", marginTop: "20px" }}
        >
          {t("आधार कार्ड विवरण")}
        </FrontEndTypo.H3>{" "}
        <Image
          alignSelf={"center"}
          resizeMode="contain"
          source={{ uri: aadharImage }}
          alt="Alternate Text"
          size="2xl"
        />{" "}
        <Form
          formData={uidVerification}
          onChange={(e) => setUIDVerification(e.formData)}
          onSubmit={handleAadharScreen}
          {...{ templates, FieldTemplate }}
          validator={validator}
          schema={{
            type: "object",
            required: ["aadharName"],
            properties: {
              aadharName: {
                type: "string",
                title: "AADHAR_CARD",
              },
            },
          }}
        >
          <FrontEndTypo.H3 marginTop="20px">
            {t("ENTER_THE_12_DIGIT_AADHAAR_CARD")}
          </FrontEndTypo.H3>

          <FrontEndTypo.Primarybutton
            style={{ background: "#FF0000", space: "20px", top: "35px" }}
            onPress={handleAadharScreen}
            // isDisabled={!mobileNumber}
          >
            {t("NEXT")}
          </FrontEndTypo.Primarybutton>
        </Form>
      </VStack>
    </>
  );
  const enterBasicDetails = () => (
    <>
      <VStack flex={3} space={5}>
        <FrontEndTypo.H1 bold>
          {" "}
          {t("तीन सरल चरणों में साइन अप करें!")}
        </FrontEndTypo.H1>
        <FrontEndTypo.H1 bold fontWeight={600} color={"#790000"}>
          {t("TELL_US_YOUR_NAME")}
        </FrontEndTypo.H1>{" "}
        <FrontEndTypo.H3 color={"#790000"}>
          {t("AS_PER_AADHAAR")}
        </FrontEndTypo.H3>
        <Form
          formData={basicDetails}
          onChange={(e) => setBasicDetails(e.formData)}
          onSubmit={handleBasicDetailsScreen}
          {...{ templates, FieldTemplate }}
          validator={validator}
          schema={{
            type: "object",
            required: ["firstName", "lastName"],
            properties: {
              firstName: {
                type: "string",
                title: "FIRST_NAME",
                regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
              },
              lastName: {
                type: "string",
                title: "LAST_NAME",
                regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
              },
              mobile: {
                label: "HOW_CAN_CONTACT_YOU",
                type: "number",
                title: "MOBILE_NUMBER",
                format: "MobileNumber",
              },
            },
          }}
        >
          <FrontEndTypo.Primarybutton
            style={{ background: "#FF0000", space: "20px", marginTop: "35px" }}
            onPress={handleBasicDetailsScreen}
          >
            {t("NEXT")}
          </FrontEndTypo.Primarybutton>
        </Form>
      </VStack>
    </>
  );
  const contactDetails = () => (
    <>
      <VStack flex={3} space={6}>
        <FrontEndTypo.H1 color={"#790000"}>
          {t("VERIFY_CONTACT_NUMBER")}
        </FrontEndTypo.H1>
        <Text color={"#790000"}>{t("PLEASE_ENTER_OTP")}</Text>
        <Form
          formData={otpVerification}
          onChange={(e) => setOtpVerification(e.formData)}
          onSubmit={handleOtpVerificationScreen}
          {...{ templates, FieldTemplate }}
          validator={validator}
          schema={{
            type: "object",
            required: ["aadharName"],
            properties: {
              mobile: {
                type: "number",
                title: "MOBILE_NUMBER",
              },
            },
          }}
        >
          <Stack top={1}>
            <FrontEndTypo.H3
              style={{
                color: "var(--Gray-70, #616161);",
                fontSize: "12px",
                marginTop: "35px",
              }}
            >
              {t("USER_ENTER_FOUR_DIGIT_OTP")}
            </FrontEndTypo.H3>
          </Stack>
          <Stack top={20}>
            <CustomOTPBox></CustomOTPBox>
          </Stack>

          <FrontEndTypo.Primarybutton
            style={{ background: "#FF0000", marginTop: "40%" }}
            onPress={handleOtpVerificationScreen}
          >
            {t("NEXT")}
          </FrontEndTypo.Primarybutton>
        </Form>
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
    <Layout
      _appBar={{
        onlyIconsShow: ["backBtn", "langBtn"],
      }}
    >
      <VStack flex={2} padding={3} space={3}>
        {renderSwitchCase()}
      </VStack>
    </Layout>
  );
};

export default FacilitatorRegistration;
