import React, { useEffect } from "react";
import { Box, Center, Stack, ScrollView } from "native-base";
import getWindowSize from "v2/utils/Helper/JSHelper";
import PageHeader from "../PageHeader/PageHeader";
import { GATrackPageView } from "@shiksha/common-lib";
import { useLocation } from "react-router-dom";

export default function PageLayout({
  t,
  isPageMiddle,
  customComponent,
  showAppBar,
  showHelpButton,
  funBackButton,
  showLangChange,
  funLangChange,
  stepTitle,
  pageTitle,
  analyticsPageTitle,
}) {
  const [width, height] = getWindowSize();
  const location = useLocation();

  useEffect(() => {
    // Set doc title
    if (pageTitle !== undefined) {
      document.title = stepTitle ? `${pageTitle}/${stepTitle}` : `${pageTitle}`;
    }
    // GATrackPageView
    if (analyticsPageTitle !== undefined) {
      GATrackPageView({ analyticsPageTitle });
    }
  }, [location, analyticsPageTitle, pageTitle, stepTitle]);

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
        <ScrollView minH={height} maxH={height} w={width} shadow={4}>
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
