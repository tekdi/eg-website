import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LearnerAdhaar from "v2/components/Functional/LearnerOnboardingDetails/LearnerAdhaar";
import LearnerFormUpdate from "v2/components/Functional/LearnerOnboardingDetails/LearnerFormUpdate";

export default function BeneficiaryOnboarding({ userTokenInfo, footerLinks }) {
  const { number } = useParams();
  const renderOnboardStep = () => {
    switch (number) {
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
