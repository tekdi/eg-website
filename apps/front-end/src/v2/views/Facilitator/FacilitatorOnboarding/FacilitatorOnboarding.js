import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "v2/components/Static/PageLayout/PageLayout";
import NoInternetScreen from "v2/components/Static/NoInternetScreen/NoInternetScreen";
import Loader from "v2/components/Static/Loader/Loader";
import {
  getTokernUserInfo,
  facilitatorRegistryService,
  logout,
} from "@shiksha/common-lib";
import PrerakOnboardingForm from "v2/components/Functional/PrerakOnboardingDetail/PrerakOnboardingForm";
import PrerakOnboardingArrayForm from "v2/components/Functional/PrerakOnboardingDetail/PrerakOnboardingArrayForm";
function FacilitatorOnboarding() {
  const { step, photoNo } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsloading] = useState(false);
  //screen variables
  const [activeScreenName, setActiveScreenName] = useState(step);

  //form variable
  const token = localStorage.getItem("token");
  const [userTokenInfo, setUserTokenInfo] = useState();
  const [userid, setuserid] = useState();
  //fetch URL data and store fix for 2 times render useEffect call
  const [countLoad, setCountLoad] = useState(0);
  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (countLoad == 0) {
        setCountLoad(1);
      }
      if (countLoad == 1) {
        //do page load first operation
        setIsloading(true);
        if (token) {
          const tokenData = getTokernUserInfo();
          const { hasura } = tokenData?.resource_access || {};
          const { status, ...user } =
            await facilitatorRegistryService.getInfo();
          if (`${status}` === "401") {
            logout();
            window.location.reload();
          }
          setUserTokenInfo({ ...tokenData, authUser: user });
          const { id } = user;
          setuserid(id);
        }
        setIsloading(false);
        //end do page load first operation
        setCountLoad(2);
      } else if (countLoad == 2) {
        setCountLoad(3);
      }
    }
    fetchData();
  }, [countLoad]);

  const funBackButton = () => {
    if (step == "basic_details") {
      setActiveScreenName("");
    }
    if (step == "contact_details") {
      setActiveScreenName("basic_details");
    }
    if (step == "address_details") {
      setActiveScreenName("contact_details");
    }
    if (step == "personal_details") {
      setActiveScreenName("address_details");
    }
    if (step == "reference_details") {
      setActiveScreenName("personal_details");
    }
    if (step == "work_availability_details") {
      setActiveScreenName("reference_details");
    }
    if (step == "vo_experience") {
      setActiveScreenName("work_availability_details");
    }
    if (step == "experience") {
      setActiveScreenName("vo_experience");
    }
    if (step == "qualification_details") {
      setActiveScreenName("experience");
    }
    if (step == "upload" && !photoNo) {
      setActiveScreenName("qualification_details");
    }
    if (step == "upload" && photoNo) {
      setActiveScreenName("upload");
    }
    setCountLoad(1);
    navigate(-1);
  };
  const navigatePage = (link, screenName, state) => {
    setActiveScreenName(screenName);
    if (state) {
      navigate(link, state);
    } else {
      navigate(link);
    }
  };
  const formValue = [
    "basic_details",
    "contact_details",
    "address_details",
    "personal_details",
    "reference_details",
    "work_availability_details",
    "qualification_details",
    "upload",
    "aadhaar_details",
  ];
  const arrayformValue = ["vo_experience", "experience"];

  // Define the footer links
  const footerLinks = [
    { title: "Home", route: "/" },
    { title: "About", route: "/about" },
    // Add more links as needed
  ];
  const Show_Edit_details = () => {
    if (formValue.includes(activeScreenName)) {
      return (
        <PageLayout
          t={t}
          showAppBar={true}
          funBackButton={funBackButton}
          showHelpButton={true}
          _footer={{ menues: footerLinks }}
          customComponent={
            <PrerakOnboardingForm
              userTokenInfo={userTokenInfo}
              userid={userid}
              step={step}
              navigatePage={navigatePage}
            />
          }
        />
      );
    } else if (arrayformValue.includes(activeScreenName)) {
      return (
        <PageLayout
          t={t}
          showAppBar={true}
          funBackButton={funBackButton}
          showHelpButton={true}
          customComponent={
            <PrerakOnboardingArrayForm
              userTokenInfo={userTokenInfo}
              userid={userid}
              type={step}
              navigatePage={navigatePage}
            />
          }
        />
      );
    } else {
      navigate("/");
    }
  };

  //online offline detect
  const [isOnline, setIsOnline] = useState(
    window ? window.navigator.onLine : false
  );

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online, false);
    window.addEventListener("offline", offline, false);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  return (
    <>
      {!isOnline ? (
        <PageLayout
          t={t}
          isPageMiddle={true}
          customComponent={<NoInternetScreen t={t} />}
        />
      ) : isLoading ? (
        <PageLayout t={t} isPageMiddle={true} customComponent={<Loader />} />
      ) : (
        Show_Edit_details()
      )}
    </>
  );
}
export default FacilitatorOnboarding;
