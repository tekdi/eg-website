import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScholarshipView from "./scholarship/View";
import JobDetails from "./job/JobDetails";
import Details from "./content/Detials";
import Layout from "./Layout";
import { dataConfig } from "./card";

function View({ userTokenInfo: { authUser } }) {
  const { type } = useParams();
  const envConfig = dataConfig[type];
  // navigate
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/${envConfig?.listLink}`);
  };

  if (type == "jobs") {
    return (
      <Layout
        facilitator={{
          ...authUser,
          program_faciltators: authUser?.user_roles?.[0],
        }}
        _appBar={{
          onPressBackButton: handleBack,
        }}
      >
        <JobDetails />
      </Layout>
    );
  } else if (type == "scholarship") {
    return (
      <Layout
        facilitator={{
          ...authUser,
          program_faciltators: authUser?.user_roles?.[0],
        }}
        _appBar={{
          onPressBackButton: handleBack,
        }}
      >
        <ScholarshipView />
      </Layout>
    );
  } else if (type == "learning") {
    return (
      <Layout
        facilitator={{
          ...authUser,
          program_faciltators: authUser?.user_roles?.[0],
        }}
        _appBar={{
          onPressBackButton: handleBack,
        }}
      >
        <Details />
      </Layout>
    );
  }

  return <div>Not Found</div>;
}

export default View;
