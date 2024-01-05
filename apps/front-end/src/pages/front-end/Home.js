import React, { useState, useEffect } from "react";
import Form from "./Form";
import SplashScreen from "./splash/SplashScreen";
import PrerakDuties from "./splash/PrerakDuties";
import Success from "./Success";
import {
  FrontEndTypo,
  Loading,
  facilitatorRegistryService,
  setOnboardingURLData,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

function Home({ userTokenInfo, pageInfo }) {
  const [page, setPage] = React.useState("SplashScreen");
  const [facilitator, setFacilitator] = React.useState({});
  const [id, setId] = useState("");
  const [ip, setIp] = React.useState(null);
  const [cohortId, setCohortId] = useState("");
  const [cohortData, setCohortData] = React.useState(null);
  const [programId, setProgramId] = useState("");
  const [programData, setProgramData] = React.useState(null);
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(true);

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
        //do page load first operation
        if (searchParams.get("org_id")) {
          setId(searchParams.get("org_id"));
        }
        if (searchParams.get("cohort_id")) {
          setCohortId(searchParams.get("cohort_id"));
        }
        if (searchParams.get("program_id")) {
          setProgramId(searchParams.get("program_id"));
        }
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
        if (userTokenInfo) {
          const fa_data = userTokenInfo.authUser;
          localStorage.setItem("profile_url", fa_data?.documents?.[0]?.name);
          setFacilitator(fa_data);
          if (fa_data?.program_faciltators?.parent_ip) {
            const ip_id = fa_data?.program_faciltators?.parent_ip;
            const data = await facilitatorRegistryService.getOrganization({
              id: ip_id,
            });
            setIp(data);
          }
          setPage("Form");
        } else {
          const data = await facilitatorRegistryService.getOrganization({ id });
          localStorage.setItem("profile_url", data?.documents?.[0]?.name);

          setIp(data);
          if (!data?.name) {
            setPage("login");
          }
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);
  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (cohortId !== "") {
        const data = await facilitatorRegistryService.getCohort({ cohortId });
        setCohortData(data);
        if (!data?.academic_year_name) {
          setPage("login");
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [cohortId]);
  useEffect(() => {
    async function fetchData() {
      // ...async operations
      if (programId !== "") {
        const data = await facilitatorRegistryService.getProgram({ programId });
        setProgramData(data[0]);
        if (!data[0]?.program_name) {
          setPage("login");
        }
        setLoading(false);
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

  if (loading) {
    return <Loading />;
  }

  return page == "login" ? (
    <Loading
      customComponent={
        <FrontEndTypo.H1>{t("INVALID_INVITATION_URL")}</FrontEndTypo.H1>
      }
    />
  ) : page === "success" ? (
    <Success {...{ facilitator }} />
  ) : page === "SplashScreen" ? (
    <SplashScreen
      page={page}
      onClick={() => setPage("Form")}
      onClickPrerakDuties={() => setPage("Prerak_Duties")}
      onPreferedLanguage={() => setPage("Prerak_Duties")}
      isBackButton={pageInfo ? pageInfo : ""}
    />
  ) : page === "Prerak_Duties" ? (
    <PrerakDuties page={page} onClick={() => setPage("Form")} />
  ) : (
    <Form {...{ ip, facilitator }} onClick={(e) => setPage(e)} />
  );
}
export default Home;
