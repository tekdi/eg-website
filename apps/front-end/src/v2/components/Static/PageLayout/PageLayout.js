import React, { useEffect } from "react";
import { Center, ScrollView } from "native-base";
import useWindowSize from "v2/utils/Helper/JSHelper";
import PageHeader from "../PageHeader/PageHeader";
import { GATrackPageView } from "@shiksha/common-lib";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

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
  const [width, height] = useWindowSize();
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
          {customComponent || <></>}
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
          {customComponent || <></>}
        </ScrollView>
      )}
    </Center>
  );
}

PageLayout.propTypes = {
  t: PropTypes.any,
  isPageMiddle: PropTypes.bool,
  customComponent: PropTypes.any,
  showAppBar: PropTypes.bool,
  showHelpButton: PropTypes.bool,
  funBackButton: PropTypes.func,
  showLangChange: PropTypes.bool,
  funLangChange: PropTypes.func,
  stepTitle: PropTypes.string,
  pageTitle: PropTypes.string,
  analyticsPageTitle: PropTypes.string,
};
