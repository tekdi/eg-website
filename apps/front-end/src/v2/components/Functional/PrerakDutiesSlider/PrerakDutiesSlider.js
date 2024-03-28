import {
  Center,
  VStack,
  Image,
  HStack,
  Text,
  Input,
  Stack,
  Box,
  Button,
  Pressable,
  Heading,
  Flex,
} from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { FrontEndTypo } from "@shiksha/common-lib";

import Logo from "../../../assets/Images/Logo/Logo.png";
import prerakDutiesImage1 from "../../../assets/Images/PrerakDuties/img1.png";
import CarouselBG from "../../../assets/Images/PrerakDuties/CarouselBG.svg";
import prerakDutiesImage2 from "../../../assets/Images/PrerakDuties/img2.png";
import prerakDutiesImage3 from "../../../assets/Images/PrerakDuties/img3.png";
import prerakDutiesImage4 from "../../../assets/Images/PrerakDuties/img4.png";
import prerakDutiesImage5 from "../../../assets/Images/PrerakDuties/img5.png";
import prerakDutiesImage6 from "../../../assets/Images/PrerakDuties/img6.png";
import { stylesheet } from "./PrerakDutiesSlider.Styles";
import { head } from "lodash";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImageBackground } from "react-native-web";

const header = [
  { text: "PRERAK_IDENTIFY_OUT_OF_SCHOOL_GIRLS", uri: prerakDutiesImage1 },
  { text: "PRERAK_COUNSEL_PARENTS", uri: prerakDutiesImage2 },
  { text: "PRERAK_REGISTER_GIRLS_FOR_EXAMS", uri: prerakDutiesImage3 },
  { text: "PRERAK_CONDUCT_CAMPS", uri: prerakDutiesImage4 },
  { text: "PRERAK_HELP_GIRLS_ATTEND_EXAMS", uri: prerakDutiesImage5 },
  {
    text: "PRERAK_GUIDE_THEM_TOWARDS_FUTURE_GOALS",
    uri: prerakDutiesImage6,
  },
];

export default function PrerakDutiesSlider({
  t,
  currentImage,
  setCurrentImage,
  showApplyNow,
}) {
  let sliderRef = useRef(null);
  useEffect(() => {
    sliderRef?.slickGoTo(currentImage);
  }, [currentImage]);

  const next = () => {
    setCurrentImage((e) => e + 1);
  };
  const handleAfterChange = (index) => {
    setCurrentImage(index);
    console.log(index);
  };
  const settings = {
    customPaging: function (index) {
      return (
        <HStack
          my="4"
          key={index}
          borderRadius={20}
          w={index === currentImage ? "25px" : "12px"}
          h="1"
          bg={
            index === currentImage
              ? "floatingLabelColor.500"
              : "SlickDotsBg.500"
          }
        />
      );
    },
    appendDots: (dots) => {
      return (
        <HStack space={4} alignItems={"center"} justifyContent={"center"}>
          {dots.map((e) => ({
            ...e,
            props: { ...e.props, style: { listStyleType: "none" } },
          }))}
        </HStack>
      );
    },
    dots: true,
    className: "center",
    centerMode: true,
    afterChange: handleAfterChange,
    infinite: false,
    centerPadding: "30px",
    slidesToShow: 1,
    speed: 500,
  };
  return (
    <VStack space={4} mb={6}>
      <FrontEndTypo.H3 color="textMaroonColor.400" mt="52" textAlign="center">
        {t("PRERAK_DUTIES")}
      </FrontEndTypo.H3>
      <ImageBackground
        position={"absolute"}
        source={{ uri: CarouselBG }}
        width={"100%"}
        height={"450px"}
      >
        <Slider
          ref={(slider) => {
            sliderRef = slider;
          }}
          {...settings}
        >
          {header.map((item) => {
            return (
              <HStack>
                <VStack
                  mx={"auto"}
                  maxW={"317px"}
                  key={item}
                  px="4"
                  minH={"410px"}
                  maxH={"410px"}
                >
                  <Image
                    minHeight="235px"
                    W="285px"
                    // resizeMode="cover"
                    borderTopRadius={"10px"}
                    source={{ uri: item.uri }}
                    alt={item.text}
                    key={item.uri}
                  />
                  <Box
                    bg={"white"}
                    px={4}
                    minH={"165px"}
                    py={6}
                    shadow={"SliderCardShadow"}
                    borderBottomRadius={"10px"}
                  >
                    <Text mb={2} style={stylesheet.headerText}>
                      {t(item.text)}
                    </Text>
                    <Text
                      fontSize={"12px"}
                      fontWeight={500}
                      lineHeight={"14.52px"}
                      color={"textGreyColor.700"}
                    >
                      {t("TO_PURSUE_10_SCHOOL_FROM_OPEN_SCHOOL")}
                    </Text>
                  </Box>
                </VStack>
              </HStack>
            );
          })}
        </Slider>
      </ImageBackground>
      <VStack alignItems={"center"}>
        {currentImage === header.length - 1 ? (
          <FrontEndTypo.Primarybutton
            w="60%"
            justifyContent={"center"}
            onPress={() => showApplyNow()}
          >
            {t("APPLY_NOW")}
          </FrontEndTypo.Primarybutton>
        ) : (
          <>
            <FrontEndTypo.Primarybutton w="60%" onPress={(e) => next()}>
              {t("PRERAK_PROCEED_BTN")}
            </FrontEndTypo.Primarybutton>
            <FrontEndTypo.H3
              color="var(--Gray-3, #828282);"
              py="6"
              underline
              onPress={() => showApplyNow()}
            >
              {t("SKIP_TO_APPLY")}
            </FrontEndTypo.H3>
          </>
        )}
      </VStack>
    </VStack>
  );
}
