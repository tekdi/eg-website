import React, { useState } from "react";
import { FrontEndTypo, Layout, t } from "@shiksha/common-lib";
import { Box, Image, Stack, VStack } from "native-base";
import PropTypes from "prop-types";
import Home from "../Home";

function PrerakDuties(props) {
  let { imgUrl, title, processedButton, onPress, setPage, page, onSkipPress } =
    props;
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const setBackButton = () => {
    let data = page - 1;
    setPage(data.toString());
  };

  return (
    <Layout
      _appBar={{
        lang,
        setLang,
        exceptIconsShow: [
          "menuBtn",
          "userInfo",
          "helpBtn",
          "loginBtn",
          "notificationBtn",
        ],
        onPressBackButton: (e) => {
          setBackButton();
        },
      }}
      _page={{ _scollView: { bg: "white" } }}
    >
      <Stack bg="bgGreyColor.200">
        <FrontEndTypo.H3 color="textMaroonColor.400" mt="2" textAlign="center">
          {t("PRERAK_DUTIES")}
        </FrontEndTypo.H3>
        <VStack alignItems="center" safeAreaTop>
          <Image
            width="320px"
            height="292px"
            resizeMode="contain"
            source={imgUrl}
            alt={"Alternate Text "}
            //If key is not given image should not be change
            key={imgUrl}
            borderRadius="10px"
          />
          <Box bg="white" mb="5" py="5" px="45px" textAlign="center">
            <FrontEndTypo.H3 color="textGreyColor.800" bold>
              {title}
            </FrontEndTypo.H3>
            <FrontEndTypo.H4 color="textGreyColor.700">
              {t("TO_PURSUE_10_SCHOOL_FROM_OPEN_SCHOOL")}
            </FrontEndTypo.H4>
          </Box>
          <FrontEndTypo.Primarybutton
            width="85%"
            onPress={onPress ? onPress : (e) => {}}
          >
            {processedButton}
          </FrontEndTypo.Primarybutton>
          {onSkipPress && (
            <FrontEndTypo.H3
              color="blueText.400"
              my="5"
              underline
              onPress={onSkipPress ? onSkipPress : (e) => {}}
            >
              {t("SKIP_TO_APPLY")}
            </FrontEndTypo.H3>
          )}
        </VStack>
      </Stack>
    </Layout>
  );
}

export default function SwiperFile({ onClick }) {
  const [page, setPage] = useState("1");
  const getPageView = () => {
    switch (page) {
      case "0":
        return <Home pageInfo={"SplashScreen"} />;
      case "1":
        return (
          <PrerakDuties
            title={t("PRERAK_IDENTIFY_OUT_OF_SCHOOL_GIRLS")}
            imgUrl={`/images/facilitator-duties/img1.png`}
            processedButton={t("PRERAK_PROCEED_BTN")}
            onPress={(e) => setPage("2")}
            setPage={setPage}
            page={page}
            onSkipPress={onClick}
          />
        );
      case "2":
        return (
          <PrerakDuties
            title={t("PRERAK_COUNSEL_PARENTS")}
            imgUrl={`/images/facilitator-duties/img2.png`}
            processedButton={t("PRERAK_PROCEED_BTN")}
            onPress={(e) => setPage("3")}
            page={page}
            setPage={setPage}
            onSkipPress={onClick}
          />
        );
      case "3":
        return (
          <PrerakDuties
            title={t("PRERAK_REGISTER_GIRLS_FOR_EXAMS")}
            imgUrl={`/images/facilitator-duties/img3.png`}
            processedButton={t("PRERAK_PROCEED_BTN")}
            onPress={(e) => setPage("4")}
            page={page}
            setPage={setPage}
            onSkipPress={onClick}
          />
        );
      case "4":
        return (
          <PrerakDuties
            title={t("PRERAK_CONDUCT_CAMPS")}
            imgUrl={`/images/facilitator-duties/img4.png`}
            processedButton={t("PRERAK_PROCEED_BTN")}
            onPress={(e) => setPage("5")}
            page={page}
            setPage={setPage}
            onSkipPress={onClick}
          />
        );
      case "5":
        return (
          <PrerakDuties
            title={t("PRERAK_HELP_GIRLS_ATTEND_EXAMS")}
            imgUrl={`/images/facilitator-duties/img5.png`}
            processedButton={t("PRERAK_PROCEED_BTN")}
            onPress={(e) => setPage("6")}
            page={page}
            setPage={setPage}
            onSkipPress={onClick}
          />
        );
      case "6":
        return (
          <PrerakDuties
            title={t("PRERAK_GUIDE_THEM_TOWARDS_FUTURE_GOALS")}
            imgUrl={"/images/facilitator-duties/img6.png"}
            processedButton={t("APPLY_NOW")}
            page={page}
            setPage={setPage}
            onPress={onClick}
          />
        );
      default:
        return <></>;
    }
  };
  return <Stack>{getPageView()}</Stack>;
}

SwiperFile.propTypes = {
  onClick: PropTypes.func,
};
