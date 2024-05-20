import React from "react";
import { useParams } from "react-router-dom";
import ScholarshipView from "./scholarship/View";
import JobDetails from "./job/JobDetails";
import Details from "./content/Detials";
import Layout from "./Layout";
import { dataConfig } from "./card";

function View() {
  const { type } = useParams();
  const envConfig = dataConfig[type];

  const handleBack = () => {
    navigate(`/${envConfig?.listLink}`);
  };

  if (type == "jobs") {
    return (
      <Layout
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
