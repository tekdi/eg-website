import React from "react";
import Form from "./Form";
import SplashScreen from "./splash/SplashScreen";
import PrerakDuties from "./splash/PrerakDuties";
import Success from "./Success";
import { facilitatorRegistryService } from "@shiksha/common-lib";
import { useParams } from "react-router-dom";

function Home({ footerLinks, appName }) {
  const [page, setPage] = React.useState("SplashScreen");
  const [facilitator, setFacilitator] = React.useState({});
  const { id } = useParams();

  React.useEffect(async () => {
    const data = await facilitatorRegistryService.getOne({ id });
    setFacilitator(data);
  }, []);

  return page === "success" ? (
    <Success {...{ facilitator }} />
  ) : page === "SplashScreen" ? (
    <SplashScreen
      page={page}
      onClick={() => setPage("Form")}
      onClickPrerakDuties={() => setPage("Prerak_Duties")}
    />
  ) : page === "Prerak_Duties" ? (
    <PrerakDuties page={page} onClick={() => setPage("Form")} />
  ) : (
    <Form {...{ facilitator }} onClick={() => setPage("success")} />
  );
}
export default Home;
