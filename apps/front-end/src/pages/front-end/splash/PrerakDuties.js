import React, { useState } from "react";
import { FrontEndTypo, Layout, t } from "@shiksha/common-lib";
import { Box, Image, Stack, VStack } from "native-base";
import PropTypes from "prop-types";
import Home from "../Home";

function PrerakDuties(props) {
  let { imgUrl, title, processedButton, onPress, setPage, page, onSkipPress } =
    props;
  const [lang, setLang] = useState(localStorage.getItem("lang"));
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

PrerakDuties.propTypes = {
  imgUrl: PropTypes.string,
  title: PropTypes.string,
  processedButton: PropTypes.string,
  onPress: PropTypes.func,
  setPage: PropTypes.func,
  page: PropTypes.string,
  onSkipPress: PropTypes.func,
};

export default function SwiperFile({ onClick }) {
  const [page, setPage] = useState("1");
  const { t } = useTranslation();
  const getPageView = () => {
    const pagesData = {
      1: {
        titleKey: "PRERAK_IDENTIFY_OUT_OF_SCHOOL_GIRLS",
        imgUrl: "img1.png",
        nextPage: "2",
      },
      2: {
        titleKey: "PRERAK_COUNSEL_PARENTS",
        imgUrl: "img2.png",
        nextPage: "3",
      },
      3: {
        titleKey: "PRERAK_REGISTER_GIRLS_FOR_EXAMS",
        imgUrl: "img3.png",
        nextPage: "4",
      },
      4: {
        titleKey: "PRERAK_CONDUCT_CAMPS",
        imgUrl: "img4.png",
        nextPage: "5",
      },
      5: {
        titleKey: "PRERAK_HELP_GIRLS_ATTEND_EXAMS",
        imgUrl: "img5.png",
        nextPage: "6",
      },
      6: {
        titleKey: "PRERAK_GUIDE_THEM_TOWARDS_FUTURE_GOALS",
        imgUrl: "img6.png",
        buttonLabel: "APPLY_NOW",
      },
    };

    if (page === "0") {
      return <Home pageInfo={"SplashScreen"} />;
    }

    if (pagesData[page]) {
      const {
        titleKey,
        imgUrl,
        nextPage,
        buttonLabel = "PRERAK_PROCEED_BTN",
      } = pagesData[page];

      return (
        <PrerakDuties
          title={t(titleKey)}
          imgUrl={`/images/facilitator-duties/${imgUrl}`}
          processedButton={t(buttonLabel)}
          onPress={nextPage ? () => setPage(nextPage) : onClick}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      );
    }

    return <></>;
  };

  return <Stack>{getPageView()}</Stack>;
}

SwiperFile.propTypes = {
  onClick: PropTypes.func,
};
