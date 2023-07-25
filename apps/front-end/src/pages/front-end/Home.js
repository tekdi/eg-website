import React from "react";
import Form from "./Form";
import SplashScreen from "./splash/SplashScreen";
import PrerakDuties from "./splash/PrerakDuties";
import Success from "./Success";
import {
  FrontEndTypo,
  Loading,
  facilitatorRegistryService,
  t,
} from "@shiksha/common-lib";
import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

function Home({ userTokenInfo, pageInfo }) {
  // const { t } = useTranslation();
  const location = useLocation();
  const [page, setPage] = React.useState("SplashScreen");
  const [facilitator, setFacilitator] = React.useState({});
  const [ip, setIp] = React.useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(async () => {
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
  }, []);
  return (
    <>
      {page == "login" ? (
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
      )}
    </>
  );
}
export default Home;
