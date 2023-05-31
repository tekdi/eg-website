import Dashboard from "pages/front-end/Dashboard";
import Home from "pages/front-end/Home";
import basicDetails from "../pages/front-end/AGDetails/basicDetails";
import educationDetails from "../pages/front-end/AGDetails/education-details-further-studies/educationDetails";
import chooseSubjects from "../pages/front-end/AGDetails/choose-subjects/subjectDetails";
import Agduplicate from "pages/front-end/ag-form/Agduplicate";
import Agform from "pages/front-end/ag-form/Agform";
import Docschecklist from "pages/front-end/ag-form/Docschecklist";
import LearnerProfile from "pages/front-end/ag-form/LearnerProfile";
import AgLearnerProfileView from "pages/front-end/AgLearnerProfileView";
import PrerakProfileDetailsView from "pages/front-end/PrerakProfileDetailsView";
import AgformUpdate from "pages/front-end/ag-form/Agformupdate";
import Agadhaar from "pages/front-end/ag-form/Agadhaar";

import Success from "pages/front-end/Success";
import Profile from "pages/front-end/PrerakProfileDetailsView";
import FacilitatorListView from "pages/front-end/BenificiaryListView";

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
  { path: "/beneficiary", component: Agform },
  { path: "/beneficiary/2", component: AgformUpdate },
  { path: "/beneficiary/3", component: Agadhaar },
  { path: "/beneficiary/4", component: Agduplicate },
  { path: "/AgSuccess", component: Success },
  { path: "/learnerProfile", component: LearnerProfile },
  { path: "/docschecklist", component: Docschecklist },
  { path: "/profile", component: Profile },
  {
    path: "/beneficiary",
    component: FacilitatorListView,
  },
  { path: "*", component: Dashboard },
];
