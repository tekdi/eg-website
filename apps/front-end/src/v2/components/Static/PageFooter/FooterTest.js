import React from "react";
import PageLayout from "../PageLayout/PageLayout";

const FooterTest = ({ menus }) => {
  const handleBackButton = () => {
    console.log("Back button clicked");
  };

  const handleLangChange = () => {
    console.log("Language change clicked");
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

export default FooterTest;
