import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScholarshipView from "./scholarship/View";
import JobDetails from "./job/JobDetails";
import Details from "./content/Details";
import Layout from "./Layout";
import { dataConfig } from "./card";

const componentMap = {
  jobs: JobDetails,
  scholarship: ScholarshipView,
  learning: Details,
};

function View({ userTokenInfo: { authUser }, footerLinks }) {
  const { type } = useParams();
  const envConfig = dataConfig[type];
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/${envConfig?.listLink}`);
  };

  const SelectedComponent = componentMap[type];

  if (!SelectedComponent) {
    return <div>Not Found</div>;
  }

  return (
    <Layout
      checkUserAccess
      _footer={{ menues: footerLinks }}
      facilitator={{
        ...authUser,
        program_facilitators: authUser?.user_roles?.[0],
      }}
      _appBar={{
        onPressBackButton: handleBack,
      }}
    >
      <SelectedComponent />
    </Layout>
  );
}

export default View;
