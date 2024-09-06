import React from "react";
import { useParams } from "react-router-dom";
import PrerakBasicDetails from "./PrerakBasicDetails";
import PrerakQualification from "./PrerakQualification";
import PropTypes from "prop-types";

const PrerakProfile = ({ userTokenInfo }) => {
  const { type } = useParams();
  if (type === "basicdetails") {
    return <PrerakBasicDetails userTokenInfo={userTokenInfo} />;
  } else if (type === "educationdetails") {
    return <PrerakQualification userTokenInfo={userTokenInfo} />;
  }
};

export default PrerakProfile;

PrerakProfile.propTypes = {
  userTokenInfo: PropTypes.any,
};
