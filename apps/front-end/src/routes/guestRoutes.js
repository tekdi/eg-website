import NotFound from "pages/NotFound";
import React from "react";
import Home from "../pages/front-end/Home";
const LoginComponent = React.lazy(() => import("auth/Login"));
import MyProfile from "../pages/front-end/MyProfile"
import MyProfileDashboard from "pages/front-end/MyProfileDashboard";




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
  
  
];
