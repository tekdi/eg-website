import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FrontEndTypo,
  facilitatorRegistryService,
  setOnboardingURLData,
} from "@shiksha/common-lib";
import Loader from "v2/components/Static/Loader/Loader";
import CenterMessage from "v2/components/Static/CenterMessage/CenterMessage";
import NoInternetScreen from "v2/components/Static/NoInternetScreen/NoInternetScreen";
import ChooseLanguage from "v2/components/Functional/ChooseLanguage/ChooseLanguage";
import PageLayout from "v2/components/Static/PageLayout/PageLayout";
import LogoScreen from "v2/components/Static/LogoScreen/LogoScreen";
import IntroductionPage from "v2/components/Functional/IntroductionPage/IntroductionPage";
import PrerakDutiesSlider from "v2/components/Functional/PrerakDutiesSlider/PrerakDutiesSlider";
import PrerakRegisterDetail from "v2/components/Functional/PrerakRegisterDetail/PrerakRegisterDetail";
function FacilitatorRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);
  //screen variables
  const [activeScreenName, setActiveScreenName] = useState("logoScreen");
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [currentForm, setCurrentForm] = useState(0);
  const [registerFormData, setRegisterFormData] = useState({});

  //data variables
  const [id, setId] = useState("");
  const [ip, setIp] = useState(null);
  const [cohortId, setCohortId] = useState("");
  const [cohortData, setCohortData] = useState(null);
  const [programId, setProgramId] = useState("");
  const [programData, setProgramData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (id !== "") {
        setIsloading(true);
        const data = await facilitatorRegistryService.getOrganization({ id });
        localStorage.setItem("profile_url", data?.documents?.[0]?.name);
        setIp(data);
        if (!data?.name) {
          setIsError(true);
        }
        setIsloading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (cohortId !== "") {
        setIsloading(true);
        const data = await facilitatorRegistryService.getCohort({ cohortId });
        setCohortData(data);
        if (!data?.academic_year_name) {
          setIsError(true);
        }
        setIsloading(false);
      }
    }
    fetchData();
  }, [cohortId]);

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (programId !== "") {
        setIsloading(true);
        const data = await facilitatorRegistryService.getProgram({ programId });
        setProgramData(data[0]);
        if (!data[0]?.program_name) {
          setIsError(true);
        }
        setIsloading(false);
      }
    }
    fetchData();
  }, [programId]);

  //store all API data in localstorage
  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (
        id !== "" &&
        ip !== null &&
        cohortId !== "" &&
        cohortData !== null &&
        programId !== "" &&
        programData !== null
      ) {
        let onboardingURLData = {
          id: id,
          ip: ip,
          cohortId: cohortId,
          cohortData: cohortData,
          programId: programId,
          programData: programData,
        };
        await setOnboardingURLData(onboardingURLData);
      }
    }
    fetchData();
  }, [id, ip, cohortId, cohortData, programId, programData]);

  //screen variables
  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (activeScreenName == "logoScreen") {
        //wait for 1 second
        const delay = 750; // 1 second in milliseconds
        setTimeout(async () => {
          await getURLParameter();
          setActiveScreenName("chooseLangauge");
        }, delay);
      }
      if (activeScreenName == "chooseLangauge") {
      }
    }
    fetchData();
  }, [activeScreenName]);

  const getURLParameter = async () => {
    setIsloading(true);
    //do page load first operation
    // ...async operations
    if (
      searchParams.get("org_id") &&
      searchParams.get("cohort_id") &&
      searchParams.get("program_id")
    ) {
      //check link is valid or not
      const data = await facilitatorRegistryService.checkValidLink({
        program_id: parseInt(searchParams.get("program_id")),
        organisation_id: parseInt(searchParams.get("org_id")),
        academic_year_id: parseInt(searchParams.get("cohort_id")),
      });
      if (!data?.isExist) {
        setIsError(true);
      }
      //assign orgid, cohortid, program id
      if (searchParams.get("org_id")) {
        setId(searchParams.get("org_id"));
      }
      if (searchParams.get("cohort_id")) {
        setCohortId(searchParams.get("cohort_id"));
      }
      if (searchParams.get("program_id")) {
        setProgramId(searchParams.get("program_id"));
      }
    } else {
      setIsError(true);
    }
    setIsloading(false);
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

  const languageChanged = () => {
    setActiveScreenName("introductionOfProject");
  };

  const languageSelect = () => {
    setActiveScreenName("chooseLangauge");
  };

  const funBackButton = () => {
    if (activeScreenName == "introductionOfProject") {
      setCurrentImage(0);
      setActiveScreenName("chooseLangauge");
    }
    if (activeScreenName == "prerakDuties") {
      if (currentImage == 0) {
        setActiveScreenName("introductionOfProject");
      } else {
        setCurrentImage((currentImage) => currentImage - 1);
      }
    }
    if (activeScreenName == "registerForm") {
      setCurrentImage(0);
      if (currentForm == 0) {
        setRegisterFormData({});
        setActiveScreenName("introductionOfProject");
      } else {
        setCurrentForm((currentForm) => currentForm - 1);
      }
    }
  };

  const showPrerakDuties = () => {
    setActiveScreenName("prerakDuties");
  };
  const showIntroductionOfProject = () => {
    setActiveScreenName("introductionOfProject");
  };

  const showApplyNow = () => {
    setActiveScreenName("registerForm");
  };

  const showLogin = () => {
    navigate("/");
  };

  const SelectLanguage = () => {
    return (
      <PageLayout
        t={t}
        // isPageMiddle={true}
        customComponent={
          <ChooseLanguage t={t} languageChanged={languageChanged} />
        }
      />
    );
  };
  const IntroductionPageScreen = () => {
    return (
      <IntroductionPage
        t={t}
        showPrerakDuties={showPrerakDuties}
        showApplyNow={showApplyNow}
        showLogin={showLogin}
      />
      // <PageLayout
      //   t={t}
      //   showAppBar={true}
      //   funBackButton={funBackButton}
      //   showLangChange={true}
      //   funLangChange={languageSelect}
      //   customComponent={
      //     <IntroductionPage
      //       t={t}
      //       showPrerakDuties={showPrerakDuties}
      //       showApplyNow={showApplyNow}
      //       showLogin={showLogin}
      //     />
      //   }
      // />
    );
  };
  const PrerakDutiesScreen = () => {
    return (
      <PageLayout
        t={t}
        showAppBar={true}
        funBackButton={funBackButton}
        showLangChange={true}
        funLangChange={languageSelect}
        customComponent={
          <PrerakDutiesSlider
            t={t}
            currentImage={currentImage}
            setCurrentImage={setCurrentImage}
            showApplyNow={showApplyNow}
          />
        }
      />
    );
  };
  const enterBasicDetails = () => {
    return (
      <PageLayout
        t={t}
        showAppBar={true}
        funBackButton={funBackButton}
        showHelpButton={true}
        customComponent={
          <PrerakRegisterDetail
            t={t}
            currentForm={currentForm}
            setCurrentForm={setCurrentForm}
            registerFormData={registerFormData}
            setRegisterFormData={setRegisterFormData}
            showIntroductionOfProject={showIntroductionOfProject}
            ip={ip}
          />
        }
      />
    );
  };

  const renderRegisterStep = () => {
    switch (activeScreenName) {
      case "logoScreen":
        return (
          <PageLayout
            t={t}
            isPageMiddle={true}
            customComponent={<LogoScreen />}
          />
        );
      case "chooseLangauge":
        return SelectLanguage();
      case "introductionOfProject":
        return IntroductionPageScreen();
      case "prerakDuties":
        return PrerakDutiesScreen();
      case "registerForm":
        return enterBasicDetails();
      default:
        return SelectLanguage();
    }
  };

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
      ) : isError ? (
        <PageLayout
          t={t}
          isPageMiddle={true}
          customComponent={
            <CenterMessage message={t("INVALID_INVITATION_URL")} />
          }
        />
      ) : (
        renderRegisterStep()
      )}
    </>
  );
}
export default FacilitatorRegister;
