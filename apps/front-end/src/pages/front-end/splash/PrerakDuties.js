import { H3, IconByName, Layout, t, useWindowSize } from "@shiksha/common-lib";
import { Box, Button, Center, HStack, Image, Stack, Text } from "native-base";
import React from "react";

export default function PrerakDuties({ onClick }) {
  const [page, setPage] = React.useState("screen1");
  const [refAppBar, RefAppBar] = React.useState();

  React.useEffect(() => {
    setTimeout(() => {
      setPage("screen2");
    }, 1000);
  }, []);

  return (
    <Layout
      getRefAppBar={(e) => RefAppBar(e)}
      isDisabledAppBar={page === "screen1"}
      isCenter={page === "screen1"}
      _appBar={{ onlyIconsShow: ["langBtn"] }}
      _page={{ _scollView: { bg: "white" } }}
    >
      {page === "screen1" ? (
        <Page1 {...{ onClick, refAppBar }} />
      ) : page === "screen2" ? (
        <Page1 {...{ onClick, refAppBar }} />
      ) : (
        <React.Fragment />
      )}
    </Layout>
  );
}

const Page1 = ({ onClick, refAppBar }) => {
  const ref = React.useRef(null);
  const [width, Height] = useWindowSize();
  return (
    <Stack>
      <Center p="5" ref={ref}>
        <Image
          source={{
            uri: "/splash.png",
          }}
          alt="Alternate Text"
          width={"225px"}
          height={"263px"}
        />
      </Center>
      <Box
        p="5"
        roundedTopRight={60}
        bg="gray.200"
        minH={Height - (refAppBar?.clientHeight + ref?.current?.clientHeight)}
      >
        <H3 pt="4">{t("PROJECT_PRAGATI")}</H3>
        <Text fontSize={32} fontWeight="700" pt="24px">
          {t("SPLASHSCREEN_1")}
        </Text>
        <HStack space={3}>
          <Button flex={1 / 2} variant={"secondary"}>
            {t("PRERAK_DUTIES")}
          </Button>
          <Button
            flex={1}
            variant={"primary"}
            onPress={onClick}
            rightIcon={
              <IconByName
                name="ArrowRightSLineIcon"
                isDisabled
                _icon={{ color: "#BFBFBF" }}
              />
            }
          >
            {t("APPLY_NOW")}
          </Button>
        </HStack>
        <H3 pt="5">{t("ALREADY_APPLIED_CHECK_STATUS")}</H3>
      </Box>
    </Stack>
  );
};
