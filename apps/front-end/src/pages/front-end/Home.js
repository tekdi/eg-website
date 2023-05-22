import React from "react";
import Form from "./Form";
import SplashScreen from "./splash/SplashScreen";
import PrerakDuties from "./splash/PrerakDuties";
import Success from "./Success";
import {
  facilitatorRegistryService,
  initializeI18n,
} from "@shiksha/common-lib";
import { useParams } from "react-router-dom";

function Home({ userTokenInfo }) {
  const [page, setPage] = React.useState("SplashScreen");
  const [facilitator, setFacilitator] = React.useState({});
  const [ip, setIp] = React.useState({});
  const { id } = useParams();

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_id = localStorage.getItem("id");
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
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
    }
  }, []);

  return page === "success" ? (
    <Success {...{ facilitator }} />
  ) : page === "SplashScreen" ? (
    <SplashScreen
      page={page}
      onClick={() => setPage("Form")}
      onClickPrerakDuties={() => setPage("Prerak_Duties")}
      onPreferedLanguage={() => setPage("Prerak_Duties")}
    />
  ) : page === "Prerak_Duties" ? (
    <PrerakDuties page={page} onClick={() => setPage("Form")} />
  ) : (
    <Form {...{ ip, facilitator }} onClick={(e) => setPage(e)} />
  );
}
export default Home;
