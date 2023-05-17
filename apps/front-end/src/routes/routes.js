import Dashboard from "pages/front-end/Dashboard";
import Home from "pages/front-end/Home";
import Agform from "pages/front-end/ag-form/Agform";

export default [
  { path: "/form", component: Home },
  {
    path: "/facilitator-self-onboarding/:id",
    component: Home,
  },
  { path: "/dashboard", component: Dashboard },
  { path: "/agform", component: Agform },
  { path: "/*", component: Dashboard },
];
