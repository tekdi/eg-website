import {
  H3,
  H4,
  Heading,
  IconByName,
  Layout,
  t,
  changeLanguage,
  useWindowSize,
  FrontEndTypo,
} from "@shiksha/common-lib";
import {
  Box,
  Button,
  Center,
  HStack,
  VStack,
  Image,
  Stack,
  Text,
  Pressable,
} from "native-base";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "26px",
    color: "#3F8BF1",
    textDecoration: "underline",
  },
  text2: {
    fontFamily: "Inter",
    fontWeight: "500",
    lineHeight: "26px",
    fontSize: "12px",
    color: "#828282",
  },
  ProceedButton: {
    marginTop: "20px",
    alignItems: "center",
    width: "260px",
    background: " #2D142C",
    boxShadow: "1px 3px 0px #C92A42",
    borderRadius: " 100px",
  },
  bgimage: {
    height: "100vh",
    left: "0px",
    backgroundImage: `url(/bgImage.png)`,
  },
  boxContent: {
    borderRadius: " 10px 10px",
    width: "260px",
    // height: "100px",
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

export default function SplashScreen({
  onClick,
  onClickPrerakDuties,
  onPreferedLanguage,
  isBackButton
}) {
  console.log(isBackButton)
  const [page, setPage] = React.useState("screen1");
  const [code, setCode] = React.useState("en");

  const [refAppBar, RefAppBar] = React.useState();
  changeLanguage(localStorage.getItem("lang"));
  React.useEffect(() => {
    //if location is pressed directly setpage screen2
    if (isBackButton === "SplashScreen") {
      isBackButton = ""
      console.log(isBackButton, "1")
      setPage("screen3");

    }
    else {
      const setTime = setTimeout(() => {

        setPage("screen2");
      }, 1000);
      return (e) => {
        clearTimeout(setTime);
      };
    }

  }, []);

  const onShowScreen = (code) => {
    localStorage.setItem("lang", code);
    setCode(code);
    setPage("screen3");
  };
  return (
    <Layout
      getRefAppBar={(e) => RefAppBar(e)}
      isDisabledAppBar={page === "screen1"}
      isCenter={true}
      key={code}
      _appBar={{ onlyIconsShow: ["langBtn"] }}
      _page={{ _scollView: { bg: "white" } }}
    >
      {page === "screen1" ? (
        <Page1 />
      ) : page === "screen3" ? (

        <Page2 {...{ onClick, onClickPrerakDuties, refAppBar, code }} />
      ) : page === "screen2" ? (
        <Page3 onShowScreen={onShowScreen} />
      ) : (
        <React.Fragment />
      )}
    </Layout>
  );
}

const Page1 = () => {
  return (
    <Box>
      <Image
        source={{
          uri: "/splash1.png",
        }}
        alt="Alternate Text"
        size={"2xl"}
        resizeMode="contain"
      />
    </Box>
  );
};

const Page2 = ({ onClick, onClickPrerakDuties }) => {

  changeLanguage(localStorage.getItem("lang"));
  const navigate = useNavigate();

  return (
    <Stack style={stylesheet.bgimage}>
      <FrontEndTypo.H2
        bold
        color="textMaroonColor.400"
        textAlign="center"
        my="4"
      >
        {t("PROJECT_PRAGATI")}
      </FrontEndTypo.H2>
      <FrontEndTypo.H1
        color="textGreyColor.800"
        p={2}
        bold
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
          source={{
            uri: "/images/facilitator-duties/img7.png",
          }}
          alt={"Alternate Text "}
          style={stylesheet.image}
        />
        <Box bg="white" width="100%" px="5">
          <Center my="6">
            <Pressable onPress={onClickPrerakDuties}>
              <FrontEndTypo.H3 style={stylesheet.text1}>
                {" "}
                {t("KNOW_PRERAK_DUTIES")}
              </FrontEndTypo.H3>
            </Pressable>
          </Center>
          <FrontEndTypo.Primarybutton onPress={onClick}>
            {t("APPLY_NOW")}
          </FrontEndTypo.Primarybutton>
        </Box>
        <Center>
          <Pressable
            onPress={() => {
              navigate("/");
            }}
          >
            <Text style={stylesheet.text1}>
              {" "}
              {t("ALREADY_APPLIED_CHECK_STATUS")}
            </Text>
          </Pressable>
        </Center>
      </VStack>
    </Stack>
  );
};

const Page3 = ({ onShowScreen }) => {
  const [code, setCode] = React.useState("hi");

  React.useEffect(() => {
    changeLanguage(code);
  }, [code]);

  return (
    <Stack>
      <Box p="5">
        <FrontEndTypo.H1 pt="24px" bold textAlign={"center"}>
          {t("CHOOSE_LANGUAGE")}
        </FrontEndTypo.H1>
        <FrontEndTypo.H3 pt="5" color="textGreyColor.700" textAlign={"center"}>
          {t("PREFERED_LANGUAGE")}
        </FrontEndTypo.H3>

        <HStack space={3} mt={50}>
          <Button
            flex={1 / 2}
            variant={"secondary"}
            borderRadius={"2px"}
            height={"87.24px"}
            _pressed={{
              bgColor:
                "linear-gradient(81.61deg, #FFFFFF -31.46%, rgba(255, 255, 255, 0) -31.44%, rgba(255, 255, 255, 0.42) -10.63%, #FFFFFF 26.75%, #FFFFFF 70.75%, rgba(255, 255, 255, 0.580654) 108.28%, rgba(255, 255, 255, 0) 127.93%)",
            }}
            onPress={() => {
              setCode("en");
              onShowScreen("en");
            }}
          >
            {t("ENGLISH")}
          </Button>
          <Button
            flex={1 / 2}
            variant={"secondary"}
            borderRadius={"2px"}
            height={"87.24px"}
            onPress={() => {
              setCode("hi");
              onShowScreen("hi");
            }}
          >
            {t("HINDI")}
          </Button>
        </HStack>
      </Box>
    </Stack>
  );
};
