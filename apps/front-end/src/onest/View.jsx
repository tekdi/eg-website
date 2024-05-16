import React from "react";
import { useParams } from "react-router-dom";
import ScholarshipView from "./scholarship/View";
import JobDetails from "./job/JobDetails";
import Details from "./content/Detials";
import Layout from "./Layout";

function View() {
  const { type } = useParams();

  if (type == "jobs") {
    return (
      <Layout>
        <JobDetails />
      </Layout>
    );
  } else if (type == "scholarship") {
    return (
      <Layout>
        <ScholarshipView />
      </Layout>
    );
  } else if (type == "learning") {
    return (
      <Layout>
        <Details />
      </Layout>
    );
  }

  return <div>Not Found</div>;
}

export default View;
