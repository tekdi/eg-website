import React from "react";
import { Box, Center, Stack, ScrollView } from "native-base";
import getWindowSize from "v2/utils/Helper/JSHelper";
import PageHeader from "../PageHeader/PageHeader";

export default function PageLayout({
  t,
  isPageMiddle,
  customComponent,
  showAppBar,
  showHelpButton,
  funBackButton,
  showLangChange,
  funLangChange,
}) {
  const [width, height] = getWindowSize();
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
