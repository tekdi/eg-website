import Dashboard from "pages/front-end/Dashboard";
import Home from "pages/front-end/Home";
import basicDetails from "../pages/front-end/AGDetails/basicDetails";
import educationDetails from "../pages/front-end/AGDetails/education-details-further-studies/educationDetails";
import chooseSubjects from "../pages/front-end/AGDetails/choose-subjects/subjectDetails"
export default [
  { path: "/form", component: Home },
  {
    path: "/facilitator-self-onboarding/:id",
    component: Home,
  },
  { path: "/dashboard", component: Dashboard },
  { path: "/ag/:id", component: basicDetails },
  { path: "/ag/education/:id", component: educationDetails },
  { path: "/ag/subjects/:id", component: chooseSubjects },
  //add a new route /ag/:ID(param), component:basic details
  { path: "/*", component: Dashboard },

];
