import React from "react";
import { VStack, Text, Image, Box, Button, Stack } from "native-base";
import { AppBar, FrontEndTypo, t, Layout } from "@shiksha/common-lib";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SplashScreen from "../splash/SplashScreen";

const stylesheet = {
  mainBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    color: "#790000",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: "12px",
    marginTop: "37px",
  },
  image: {
    marginTop: "16px",
    borderRadius: "10px",
  },
  text1: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: "22px",
    lineHeight: "26px",
    color: "#212121",
  },
  text2: {
    fontFamily: "Inter",
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
    fontFamily: "Inter",
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
  const location = useLocation()
  let { imgUrl, title, processedButton, onPress, setPage, page, onSkipPress } = props;
  const [lang, setLang] = React.useState(localStorage.getItem("lang"));
  const setBackButton = () => {
    let data = page - 1
    console.log(data)
    if (data === 0) {
      let data = "SplashScreen"
      navigate(-1, { state: data })
    }
    else {
      setPage(data.toString());

    }
  };

  return (
    <React.Fragment>
      <Layout
        _appBar={{
          lang,
          setLang,
          exceptIconsShow:

            ["menuBtn", "userInfo", "helpBtn", "loginBtn", "notificationBtn"],
          onPressBackButton: (e) => {
            setBackButton()

          },
        }}
        _page={{ _scollView: { bg: "white" } }}
      >
        <Stack bg="bgGreyColor.200">
          <FrontEndTypo.H3 color="textMaroonColor.400" my="4" textAlign="center">
            {t("PRERAK_DUTIES")}
          </FrontEndTypo.H3>
          <VStack space={2} alignItems="center" safeAreaTop>
            <Image
              size={"320px"}
              resizeMode="cover"
              source={imgUrl}
              alt={"Alternate Text "}
              //If key is not given image should not be change
              key={imgUrl}
            />
            <Box bg="white" p="10">
              <FrontEndTypo.H1 color="textGreyColor.800" bold>
                {title}
              </FrontEndTypo.H1>
              <FrontEndTypo.H4 color="textGreyColor.700">
                {t("TO_PURSUE_10_SCHOOL_FROM_OPEN_SCHOOL")}
              </FrontEndTypo.H4>
            </Box>
            <FrontEndTypo.Primarybutton
              my="3"
              width="85%"
              onPress={onPress ? onPress : (e) => { }}
            >
              {processedButton}
            </FrontEndTypo.Primarybutton>
            {onSkipPress && (
              <FrontEndTypo.H3
                style={stylesheet.skipText}
                onPress={onSkipPress ? onSkipPress : (e) => { }}
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
      {page === "1" ? (
        <PrerakDuties
          title={"Identify Out-of-School Girls"}
          imgUrl={`/images/facilitator-duties/img1.png`}
          processedButton={"Proceed"}
          onPress={(e) => setPage("2")}
          setPage={setPage}
          page={page}
          onSkipPress={onClick}
        />
      ) : page === "2" ? (
        <PrerakDuties
          title={"Counsel Parents"}
          imgUrl={`/images/facilitator-duties/img2.png`}
          processedButton={"Proceed"}
          onPress={(e) => setPage("3")}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      ) : page === "3" ? (
        <PrerakDuties
          title={"Register Girls for Exams"}
          imgUrl={`/images/facilitator-duties/img3.png`}
          processedButton={"Proceed"}
          onPress={(e) => setPage("4")}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      ) : page === "4" ? (
        <PrerakDuties
          title={"Identify Out-of-School Girls"}
          imgUrl={`/images/facilitator-duties/img4.png`}
          processedButton={"Proceed"}
          onPress={(e) => setPage("5")}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      ) : page === "5" ? (
        <PrerakDuties
          title={"Help Girls Attend Exams"}
          imgUrl={`/images/facilitator-duties/img5.png`}
          processedButton={"Proceed"}
          onPress={(e) => setPage("6")}
          page={page}
          setPage={setPage}
          onSkipPress={onClick}
        />
      ) : page === "6" ? (
        <PrerakDuties
          title={"Identify Out-of-School Girls "}
          imgUrl={"/images/facilitator-duties/img6.png"}
          processedButton={"Apply Now"}
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
