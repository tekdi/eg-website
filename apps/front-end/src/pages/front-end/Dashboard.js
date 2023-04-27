import { facilitatorRegistryService, H1, Layout } from "@shiksha/common-lib";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ userTokenInfo }) {
  const [facilitator, setFacilitator] = React.useState({});
  const navigate = useNavigate();
  const { form_step_number } = facilitator;
  if (form_step_number && parseInt(form_step_number) < 13) {
    navigate("/");
  }

  React.useEffect(async () => {
    if (userTokenInfo) {
      const fa_id = localStorage.getItem("id");
      const fa_data = await facilitatorRegistryService.getOne({ id: fa_id });
      setFacilitator(fa_data);
    }
  }, []);
  return (
    <Layout>
      <H1>
        👋🏻 Welcome, {facilitator?.first_name} {facilitator?.last_name}
      </H1>
    </Layout>
  );
}
