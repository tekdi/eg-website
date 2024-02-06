import React from "react";
import { getLanguage } from "v2/utils/Helper/JSHelper";
import ConsentLang from "./ConsentLang.json";
import { VStack } from "native-base";
import { FrontEndTypo } from "@shiksha/common-lib";
import PropTypes from "prop-types";

const SetConsentLang = () => {
  const lang = getLanguage();

  const ConsentJson = ConsentLang[lang || "en"];

  return (
    <VStack space={2} pb={3} textAlign={"center"}>
      <FrontEndTypo.H4 lineHeight={"24px"}>
        {ConsentJson?.TEXT_1}
      </FrontEndTypo.H4>
      <FrontEndTypo.H4>{ConsentJson?.TEXT_2}</FrontEndTypo.H4>
      <FrontEndTypo.H4>{ConsentJson?.TEXT_3}</FrontEndTypo.H4>
      <FrontEndTypo.H3 textAlign={"center"}>
        {ConsentJson?.TEXT_4}
      </FrontEndTypo.H3>
    </VStack>
  );
};

export default SetConsentLang;

SetConsentLang.propTypes = {};
