import NotFound from "pages/NotFound";
import React from "react";
import Home from "../pages/front-end/Home";
const LoginComponent = React.lazy(() => import("auth/Login"));

import PrerakProfileDetailsView from "pages/front-end/PrerakProfileDetailsView";
import Orientation from "pages/front-end/Orientation";
import AgLearnerProfileView from "pages/front-end/AgLearnerProfileView";
export default [
  {
    path: "/facilitator-self-onboarding/:id",
    component: Home,
  },
  {
    path: "/login",
    component: LoginComponent,
  },
  {
    path: "*",
    component: LoginComponent,
  },

  { path: "/prerakprofiledetails", component: PrerakProfileDetailsView },
  { path: "/orientation", component: Orientation },
  { path: "/agprofile", component: AgLearnerProfileView },
];
