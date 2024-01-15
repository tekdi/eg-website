import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  FrontEndTypo,
  facilitatorRegistryService,
  setOnboardingURLData,
} from "@shiksha/common-lib";
import Loader from "v2/components/Loader/Loader";
import CenterMessage from "v2/components/CenterMessage/CenterMessage";
import NoInternetScreen from "v2/components/NoInternetScreen/NoInternetScreen";
function FacilitatorRegister() {
  const { t } = useTranslation();
  const [isLoading, setIsloading] = useState(true);
  const [isError, setIsError] = useState(false);
  //screen variables
  const [activeScreenName, setActiveScreenName] = useState("");
  //data variables
  const [id, setId] = useState("");
  const [ip, setIp] = useState(null);
  const [cohortId, setCohortId] = useState("");
  const [cohortData, setCohortData] = useState(null);
  const [programId, setProgramId] = useState("");
  const [programData, setProgramData] = useState(null);
  //fetch URL data and store fix for 2 times render useEffect call
  const [countLoad, setCountLoad] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (countLoad == 0) {
        setCountLoad(1);
      }
      if (countLoad == 1) {
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
        //end do page load first operation
        setCountLoad(2);
      } else if (countLoad == 2) {
        setCountLoad(3);
      }
    }
    fetchData();
  }, [countLoad]);

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

  //online offline detect
  const [isOnline, setIsOnline] = useState(
    window ? window.navigator.onLine : false
  );
  /*useEffect(() => {
    setIsOnline(window ? window.navigator.onLine : false);
  }, [window.navigator.onLine]);*/

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

  /*const renderSwitchCase = () => {
    switch (activeScreenName) {
      case "chooseLangauge":
        return isOnline ? chooseLangauge() : offlineStatusScreen();
      case "introductionOfProject":
        return isOnline ? introductionOfProject() : offlineStatusScreen();
      case "prerakDuties":
        return isOnline ? prerakDuties() : offlineStatusScreen();
      case "enterBasicDetails":
        return isOnline ? enterBasicDetails() : offlineStatusScreen();
      case "contactDetails":
        return isOnline ? contactDetails() : offlineStatusScreen();
      default:
        return isOnline ? chooseLangauge() : offlineStatusScreen();
    }
  };*/

  return (
    <>
      {!isOnline ? (
        <NoInternetScreen t={t} />
      ) : isLoading ? (
        <Loader />
      ) : isError ? (
        <CenterMessage message={t("INVALID_INVITATION_URL")} />
      ) : (
        <h1>Hello</h1>
      )}
    </>
  );
}
export default FacilitatorRegister;
