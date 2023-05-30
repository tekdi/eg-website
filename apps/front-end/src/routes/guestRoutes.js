import NotFound from "pages/NotFound";
import React from "react";
import Home from "../pages/front-end/Home";
const LoginComponent = React.lazy(() => import("auth/Login"));
const ForgetPasswordComponent = React.lazy(() => import("auth/ForgetPassword"));

import PrerakProfileDetailsView from "pages/front-end/FacilitatorProfileDetailsView";
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
    path: "/reset-password",
    component: ForgetPasswordComponent,
  },
  {
    path: "*",
    component: LoginComponent,
  },

  { path: "/prerakprofiledetails", component: PrerakProfileDetailsView },
  { path: "/orientation", component: Orientation },
  { path: "/agprofile", component: AgLearnerProfileView },
];
