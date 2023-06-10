import React from "react";
import Form from "./Form";
import SplashScreen from "./splash/SplashScreen";
import PrerakDuties from "./splash/PrerakDuties";
import Success from "./Success";
import { facilitatorRegistryService } from "@shiksha/common-lib";
import { useParams, useLocation } from "react-router-dom";

function Home({ userTokenInfo }) {
  const location = useLocation()
  // console.log(location.state, "location data spalsh")
  const [page, setPage] = React.useState("SplashScreen");
  const [facilitator, setFacilitator] = React.useState({});
  const [ip, setIp] = React.useState({});
  const { id } = useParams();
  /*  React.useEffect(() => {
     console.log("ssq")
 
     if (location.state == "SplashScreen") {
       console.log("ssq")
       setPage("SplashScreen")
     }
   }, [page]) */

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

    }
  }, []);

  // console.log(page)
  return page === "success" ? (
    <Success {...{ facilitator }} />
  ) : page === "SplashScreen" ? (

    <SplashScreen
      page={page}
      onClick={() => setPage("Form")}
      onClickPrerakDuties={() => setPage("Prerak_Duties")}
      onPreferedLanguage={() => setPage("Prerak_Duties")}
    // isBackButton={location.state || ""}
    />
  ) : page === "Prerak_Duties" ? (
    <PrerakDuties page={page} onClick={() => setPage("Form")} />
  ) : (
    <Form {...{ ip, facilitator }} onClick={(e) => setPage(e)} />
  );
}
export default Home;
