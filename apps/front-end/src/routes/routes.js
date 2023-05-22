import Dashboard from "pages/front-end/Dashboard";
import Home from "pages/front-end/Home";
import Agduplicate from "pages/front-end/ag-form/Agduplicate";
import Agform from "pages/front-end/ag-form/Agform";
import Docschecklist from "pages/front-end/ag-form/Docschecklist";
import LearnerProfile from "pages/front-end/ag-form/LearnerProfile";

export default [
  { path: "/form", component: Home },
  {
    path: "/facilitator-self-onboarding/:id",
    component: Home,
  },
  { path: "/dashboard", component: Dashboard },
  { path: "/agform", component: Agform },
  { path: "/agduplicate", component: Agduplicate },
  { path: "/learnerProfile", component: LearnerProfile },
  { path: "/docschecklist", component: Docschecklist },
  { path: "/*", component: Dashboard },
];
