import React from "react";
import { useParams } from "react-router-dom";
import ScholarshipForm from "./scholarship/AutomatedForm";
import JobForm from "./job/AutomatedForm";

function View() {
  const { type } = useParams();

  if (type == "jobs") {
    return <JobForm />;
  } else if (type == "scholarship") {
    return <ScholarshipForm />;
  }

  return <div>Not Found</div>;
}

export default View;
