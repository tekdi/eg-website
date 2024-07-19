import React from "react";
import { VStack, Text, Image, Box, Button, Stack } from "native-base";
import { AppBar, FrontEndTypo, t, Layout } from "@shiksha/common-lib";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SplashScreen from "../splash/SplashScreen";
import Home from "../Home";

const stylesheet = {
  mainBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    color: "#790000",
    textAlign: "center",
    fontSize: "12px",
    marginTop: "37px",
  },
  image: {
    marginTop: "16px",
    borderRadius: "10px",
  },
  text1: {
    fontWeight: "700",
    fontSize: "22px",
    lineHeight: "26px",
    color: "#212121",
  },
  text2: {
    fontWeight: "500",
    lineHeight: "26px",
    fontSize: "12px",
    color: "#828282",
  },
  ProceedButton: {
    marginTop: "50px",
    alignItems: "center",
    width: "260px",
    background: " #2D142C",
    boxShadow: "1px 3px 0px #C92A42",
    borderRadius: " 100px",
  },
  bgimage: {
    height: "100vh",
    left: "0px",
    backgroundColor: "#F4F4F7",
    backgroundImage: `url(/bgImage.png)`,
  },
  boxContent: {
    borderRadius: " 10px 10px",
    width: "260px",
    height: "100px",
    padding: "8px",
    justifyContent: "center",
    textAlign: "flex",
  },
  skipText: {
    marginTop: "24px",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "15px",
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#828282",
  },
};

function PrerakDuties(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  let { imgUrl, title, processedButton, onPress, setPage, page, onSkipPress } =
    props;
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  console.log(location);
  const setBackButton = () => {
    let data = page - 1;
    if (data === 0) {
      setPage(data.toString());
    } else {
      setPage(data.toString());
    }
  };

  return (
    <React.Fragment>
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
          <FrontEndTypo.H3
            color="textMaroonColor.400"
            mt="2"
            textAlign="center"
          >
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
    </React.Fragment>
  );
}

export default function SwiperFile({ onClick }) {
  const [page, setPage] = React.useState("1");
  return (
    <Stack>
      {page === "0" ? (
        <Home pageInfo={"SplashScreen"} />
      ) : page === "1" ? (
        <PrerakDuties
          title={t("PRERAK_IDENTIFY_OUT_OF_SCHOOL_GIRLS")}
          imgUrl={`/images/facilitator-duties/img1.png`}
          processedButton={t("PRERAK_PROCEED_BTN")}
          onPress={(e) => setPage("2")}
          setPage={setPage}
          page={page}
          onSkipPress={onClick}
        />
      ) : page === "2" ? (
        <PrerakDuties
          title={t("PRERAK_COUNSEL_PARENTS")}
          imgUrl={`/images/facilitator-duties/img2.png`}
          processedButton={t("PRERAK_PROCEED_BTN")}
          onPress={(e) => setPage("3")}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      ) : page === "3" ? (
        <PrerakDuties
          title={t("PRERAK_REGISTER_GIRLS_FOR_EXAMS")}
          imgUrl={`/images/facilitator-duties/img3.png`}
          processedButton={t("PRERAK_PROCEED_BTN")}
          onPress={(e) => setPage("4")}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      ) : page === "4" ? (
        <PrerakDuties
          title={t("PRERAK_CONDUCT_CAMPS")}
          imgUrl={`/images/facilitator-duties/img4.png`}
          processedButton={t("PRERAK_PROCEED_BTN")}
          onPress={(e) => setPage("5")}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      ) : page === "5" ? (
        <PrerakDuties
          title={t("PRERAK_HELP_GIRLS_ATTEND_EXAMS")}
          imgUrl={`/images/facilitator-duties/img5.png`}
          processedButton={t("PRERAK_PROCEED_BTN")}
          onPress={(e) => setPage("6")}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      ) : page === "6" ? (
        <PrerakDuties
          title={t("PRERAK_GUIDE_THEM_TOWARDS_FUTURE_GOALS")}
          imgUrl={"/images/facilitator-duties/img6.png"}
          processedButton={t("APPLY_NOW")}
          page={page}
          setPage={setPage}
          onPress={onClick}
        />
      ) : (
        <React.Fragment />
      )}
    </Stack>
  );
}
