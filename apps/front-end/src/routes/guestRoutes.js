import NotFound from "pages/NotFound";
import React from "react";
import Home from "../pages/front-end/Home";
const LoginComponent = React.lazy(() => import("auth/Login"));
const ForgetPasswordComponent = React.lazy(() => import("auth/ForgetPassword"));

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
];
