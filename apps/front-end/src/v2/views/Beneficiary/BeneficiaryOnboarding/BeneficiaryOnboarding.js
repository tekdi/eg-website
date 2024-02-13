import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BenificiaryAadhaarDetails from "v2/components/Functional/LearnerOnboardingDetails/BenificiaryAadhaarDetails";
import BenificiaryAddress from "v2/components/Functional/LearnerOnboardingDetails/BenificiaryAddress";
import BenificiaryBasicDetails from "v2/components/Functional/LearnerOnboardingDetails/BenificiaryBasicDetails";
import BenificiaryEducation from "v2/components/Functional/LearnerOnboardingDetails/BenificiaryEducation";
import BenificiaryEnrollment from "v2/components/Functional/LearnerOnboardingDetails/BenificiaryEnrollment";
import BenificiaryJourney from "v2/components/Functional/LearnerOnboardingDetails/BenificiaryJourney";
import LearnerAdhaar from "v2/components/Functional/LearnerOnboardingDetails/LearnerAdhaar";
import LearnerDocsChecklist from "v2/components/Functional/LearnerOnboardingDetails/LearnerDocsChecklist";
import LearnerDuplicate from "v2/components/Functional/LearnerOnboardingDetails/LearnerDuplicate";
import LearnerFormUpdate from "v2/components/Functional/LearnerOnboardingDetails/LearnerFormUpdate";
import PcrDetails from "v2/components/Functional/LearnerOnboardingDetails/PCRDetails/PcrDetails";
import PcrView from "v2/components/Functional/LearnerOnboardingDetails/PCRDetails/PcrView";

export default function BeneficiaryOnboarding({ userTokenInfo, footerLinks }) {
  const { type } = useParams();
  const renderOnboardStep = () => {
    switch (type) {
      case "2":
        return (
          <LearnerFormUpdate
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "3":
        return (
          <LearnerAdhaar
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "4":
        return (
          <LearnerDuplicate
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "docschecklist":
        return (
          <LearnerDocsChecklist
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "basicdetails":
        return (
          <BenificiaryBasicDetails
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "educationdetails":
        return (
          <BenificiaryEducation
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "benificiaryJourney":
        return (
          <BenificiaryJourney
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "enrollmentdetails":
        return (
          <BenificiaryEnrollment
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "aadhaardetails":
        return (
          <BenificiaryAadhaarDetails
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "addressdetails":
        return (
          <BenificiaryAddress
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "pcrdetails":
        return (
          <PcrDetails
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      case "pcrview":
        return (
          <PcrView
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
      default:
        return (
          <LearnerFormUpdate
            userTokenInfo={userTokenInfo}
            footerLinks={footerLinks}
          />
        );
    }
  };

  return <>{renderOnboardStep()}</>;
}
