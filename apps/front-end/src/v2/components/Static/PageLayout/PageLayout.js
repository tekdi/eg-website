import React, { useEffect } from "react";
import { Center } from "native-base"; // Removed ScrollView from native-base
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
          {customComponent && <></>}
        </Center>
      ) : (
        <div
          style={{
            minHeight: height,
            maxHeight: height,
            width: width,
            overflowY: "auto", // Add scroll behavior
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Equivalent to shadow={4}
          }}
        >
          {showAppBar ? (
            <PageHeader
              t={t}
              showHelpButton={showHelpButton}
              funBackButton={funBackButton}
              showLangChange={showLangChange}
              funLangChange={funLangChange}
            />
          ) : null}
          {customComponent && <></>}
        </div>
      )}
    </Center>
  );
}

PageLayout.propTypes = {
  t: PropTypes.func,
  isPageMiddle: PropTypes.bool,
  customComponent: PropTypes.element,
  showAppBar: PropTypes.bool,
  showHelpButton: PropTypes.bool,
  funBackButton: PropTypes.func,
  showLangChange: PropTypes.bool,
  funLangChange: PropTypes.func,
  stepTitle: PropTypes.string,
  pageTitle: PropTypes.string,
  analyticsPageTitle: PropTypes.string,
};
