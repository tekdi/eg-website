// PageLayout.jsx
import React, { useState } from "react";
import { Center, ScrollView } from "native-base";
import getWindowSize from "v2/utils/Helper/JSHelper";
import PageHeader from "../PageHeader/PageHeader";
import PageFooter from "../PageFooter/PageFooter";

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
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabPress = (index) => {
    setActiveIndex(index);
  };

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

          <PageFooter
            t={t}
            activeIndex={activeIndex}
            onTabPress={handleTabPress}
          />
        </ScrollView>
      )}
    </Center>
  );
}
