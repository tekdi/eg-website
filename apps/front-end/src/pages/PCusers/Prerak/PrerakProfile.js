import React from "react";
import { useParams } from "react-router-dom";
import PrerakBasicDetails from "./PrerakBasicDetails";
import PrerakQualification from "./PrerakQualification";

const PrerakProfile = () => {
  const { type, id } = useParams();
  console.log({ type, id });
  if (type === "basicdetails") {
    return <PrerakBasicDetails />;
  } else if (type === "educationdetails") {
    return <PrerakQualification />;
  }
};

export default PrerakProfile;
