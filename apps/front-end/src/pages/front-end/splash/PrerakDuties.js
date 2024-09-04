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
  const { t } = useTranslation();
  const getPageView = () => {
    const prerakDutiesProps = (
      page,
      titleKey,
      imgUrl,
      buttonLabel,
      nextPage,
    ) => ({
      title: t(titleKey),
      imgUrl: `/images/facilitator-duties/${imgUrl}`,
      processedButton: t(buttonLabel),
      onPress: nextPage ? () => setPage(nextPage) : onClick,
      page,
      setPage,
      onSkipPress: onClick,
    });

    switch (page) {
      case "0":
        return <Home pageInfo={"SplashScreen"} />;
      case "1":
        return (
          <PrerakDuties
            {...prerakDutiesProps(
              "1",
              "PRERAK_IDENTIFY_OUT_OF_SCHOOL_GIRLS",
              "img1.png",
              "PRERAK_PROCEED_BTN",
              "2",
            )}
          />
        );
      case "2":
        return (
          <PrerakDuties
            {...prerakDutiesProps(
              "2",
              "PRERAK_COUNSEL_PARENTS",
              "img2.png",
              "PRERAK_PROCEED_BTN",
              "3",
            )}
          />
        );
      case "3":
        return (
          <PrerakDuties
            {...prerakDutiesProps(
              "3",
              "PRERAK_REGISTER_GIRLS_FOR_EXAMS",
              "img3.png",
              "PRERAK_PROCEED_BTN",
              "4",
            )}
          />
        );
      case "4":
        return (
          <PrerakDuties
            {...prerakDutiesProps(
              "4",
              "PRERAK_CONDUCT_CAMPS",
              "img4.png",
              "PRERAK_PROCEED_BTN",
              "5",
            )}
          />
        );
      case "5":
        return (
          <PrerakDuties
            {...prerakDutiesProps(
              "5",
              "PRERAK_HELP_GIRLS_ATTEND_EXAMS",
              "img5.png",
              "PRERAK_PROCEED_BTN",
              "6",
            )}
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
