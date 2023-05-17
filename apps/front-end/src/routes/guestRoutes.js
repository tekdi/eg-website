import NotFound from "pages/NotFound";
import React from "react";
import Home from "../pages/front-end/Home";
const LoginComponent = React.lazy(() => import("auth/Login"));
import MyProfile from "../pages/front-end/MyProfile"
import MyProfileDashboard from "pages/front-end/MyProfileDashboard";

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
  { path: "/myprofile", component: MyProfile },
  { path: "/myprofile/myprofiledashboard", component: MyProfileDashboard },
  
  { path: "/prerakprofiledetails", component: PrerakProfileDetailsView },
  { path: "/orientation", component: Orientation},
  { path: "/agprofile", component: AgLearnerProfileView},
  
];
