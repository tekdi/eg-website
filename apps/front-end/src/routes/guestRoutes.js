import NotFound from "pages/NotFound";
import React from "react";
import Home from "../pages/front-end/Home";
const LoginComponent = React.lazy(() => import("auth/Login"));
const ForgetPasswordComponent = React.lazy(() => import("auth/ForgetPassword"));

import PrerakProfileDetailsView from "pages/front-end/PrerakProfileDetailsView";
import BenificiaryProfileView from "pages/front-end/BenificiaryProfileView";
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
  { path: "/benificiaryprofile", component: BenificiaryProfileView },
];
