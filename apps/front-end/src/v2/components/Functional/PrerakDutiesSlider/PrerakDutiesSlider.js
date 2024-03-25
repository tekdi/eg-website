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
} from "native-base";
import React, { useEffect, useState } from "react";
import { FrontEndTypo } from "@shiksha/common-lib";

import Logo from "../../../assets/Images/Logo/Logo.png";
import prerakDutiesImage1 from "../../../assets/Images/PrerakDuties/img1.png";
import prerakDutiesImage2 from "../../../assets/Images/PrerakDuties/img2.png";
import prerakDutiesImage3 from "../../../assets/Images/PrerakDuties/img3.png";
import prerakDutiesImage4 from "../../../assets/Images/PrerakDuties/img4.png";
import prerakDutiesImage5 from "../../../assets/Images/PrerakDuties/img5.png";
import prerakDutiesImage6 from "../../../assets/Images/PrerakDuties/img6.png";
import { stylesheet } from "./PrerakDutiesSlider.Styles";

export default function PrerakDutiesSlider({
  t,
  currentImage,
  setCurrentImage,
  showApplyNow,
}) {
  const [header, setHeader] = useState([
    { text: t("PRERAK_IDENTIFY_OUT_OF_SCHOOL_GIRLS") },
    { text: t("PRERAK_COUNSEL_PARENTS") },
    { text: t("PRERAK_REGISTER_GIRLS_FOR_EXAMS") },
    { text: t("PRERAK_CONDUCT_CAMPS") },
    { text: t("PRERAK_HELP_GIRLS_ATTEND_EXAMS") },
    { text: t("PRERAK_GUIDE_THEM_TOWARDS_FUTURE_GOALS") },
  ]);

  const [images, setImages] = useState([
    { uri: prerakDutiesImage1 },
    { uri: prerakDutiesImage2 },
    { uri: prerakDutiesImage3 },
    { uri: prerakDutiesImage4 },
    { uri: prerakDutiesImage5 },
    { uri: prerakDutiesImage6 },
  ]);

  const onPressButton = () => {
    setCurrentImage((currentImage) =>
      currentImage < images.length - 1 ? currentImage + 1 : 0
    );
  };
  return (
    <VStack alignItems={"center"}>
      <FrontEndTypo.H3
        color="textMaroonColor.400"
        my="4"
        mt="4"
        textAlign="center"
      >
        {t("PRERAK_DUTIES")}
      </FrontEndTypo.H3>
      <VStack alignItems="center" safeAreaTop>
        <Image
          width="320px"
          height="292px"
          resizeMode="contain"
          source={{ uri: images[currentImage].uri }}
          alt={"Alternate Text "}
          key={images[currentImage].uri}
          borderTopRadius="10px"
        />
        <Box
          padding={4}
          backgroundColor="white"
          borderRadius={8}
          // shadow={5}
          bg="white"
          mb="5"
          py="5"
          px="10px"
          width="100%"
          borderBottomRadius="10px"
          flexDirection="column"
          alignItems="left"
        >
          <Text style={stylesheet.headerText}>{header[currentImage].text}</Text>
          <Text color={"textGreyColor.700"} mb={2}>
            {t("TO_PURSUE_10_SCHOOL_FROM_OPEN_SCHOOL")}
          </Text>
        </Box>
      </VStack>
      <HStack justifyContent={"center"} mt={5} mb={5} space={2}>
        {images.map((_, index) => (
          <Box
            key={index}
            borderRadius={20}
            w={index === currentImage ? "36px" : "12px"}
            h="1"
            bg={
              index === currentImage
                ? "var(--Secondary-Blue, #084B82);"
                : "gray.300"
            }
          />
        ))}
      </HStack>
      {currentImage === images.length - 1 ? (
        <FrontEndTypo.Primarybutton
          justifyContent={"center"}
          width="60%"
          onPress={() => showApplyNow()}
          my="4"
        >
          {t("APPLY_NOW")}
        </FrontEndTypo.Primarybutton>
      ) : (
        <>
          <FrontEndTypo.Primarybutton
            justifyContent={"center"}
            width="60%"
            onPress={onPressButton}
          >
            {t("PRERAK_PROCEED_BTN")}
          </FrontEndTypo.Primarybutton>
          <FrontEndTypo.H3
            color="var(--Gray-3, #828282);"
            my="5"
            underline
            onPress={() => showApplyNow()}
          >
            {t("SKIP_TO_APPLY")}
          </FrontEndTypo.H3>
        </>
      )}
    </VStack>
  );
}
