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
    <VStack space={1} pb={3}>
      <FrontEndTypo.H3 mb="35px">{ConsentJson?.TITLE}</FrontEndTypo.H3>
      <FrontEndTypo.H3 lineHeight="17.07px">
        {ConsentJson?.TEXT_1}
      </FrontEndTypo.H3>
      <FrontEndTypo.H3>{ConsentJson?.TEXT_2}</FrontEndTypo.H3>
      <FrontEndTypo.H3>{ConsentJson?.TEXT_3}</FrontEndTypo.H3>
      <FrontEndTypo.H3 lineHeight="17.07px" mb="25px">
        {ConsentJson?.TEXT_4}
      </FrontEndTypo.H3>
    </VStack>
  );
};

export default SetConsentLang;

SetConsentLang.propTypes = {};
