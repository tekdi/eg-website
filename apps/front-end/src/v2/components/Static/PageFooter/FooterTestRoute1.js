// FooterTestRoute1.jsx
import React from "react";
import PageLayout from "../PageLayout/PageLayout";
import getWindowSize from "v2/utils/Helper/JSHelper";
import PageFooter from "./PageFooter";

const FooterTestRoute1 = ({ menus }) => {
  const handleBackButton = () => {
    console.log("Back button clicked");
  };

  const handleLangChange = () => {
    console.log("Language change clicked");
  };

  const handleHelpButton = () => {
    console.log("Help button clicked");
  };

  const pageLayoutProps = {
    t: (text) => text,
    isPageMiddle: false,
    showAppBar: true,
    showHelpButton: true,
    funBackButton: handleBackButton,
    showLangChange: true,
    funLangChange: handleLangChange,
    _footer: { menus },
    getRefFoot: (ref) => console.log("Footer reference: ", ref),
  };

  return <PageLayout {...pageLayoutProps}></PageLayout>;
};

export default FooterTestRoute1;
