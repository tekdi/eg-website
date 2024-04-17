import React, { useEffect } from "react";
import { Box, Center, Stack, ScrollView } from "native-base";
import getWindowSize from "v2/utils/Helper/JSHelper";
import PageHeader from "../PageHeader/PageHeader";
import ReactGA from "react-ga4";
import { useNavigate } from "react-router-dom";
import { setPageTitle } from "@shiksha/common-lib";
export default function PageLayout({
  t,
  isPageMiddle,
  customComponent,
  showAppBar,
  showHelpButton,
  funBackButton,
  showLangChange,
  funLangChange,
  pageTitle,
  stepTitle,
}) {
  const [width, height] = getWindowSize();
  setPageTitle({ pageTitle, stepTitle });

  return (
    <Center>
      {isPageMiddle ? (
        <Center
          _text={{
            color: "white",
            fontWeight: "bold",
          }}
          margin={"auto"}
          height={height}
          width={width}
        >
          {customComponent ? customComponent : <></>}
        </Center>
      ) : (
        <ScrollView minH={height} maxH={height} w={width}>
          {showAppBar ? (
            <PageHeader
              t={t}
              showHelpButton={showHelpButton}
              funBackButton={funBackButton}
              showLangChange={showLangChange}
              funLangChange={funLangChange}
            />
          ) : (
            <></>
          )}
          {customComponent ? customComponent : <></>}
        </ScrollView>
      )}
    </Center>
  );
}
