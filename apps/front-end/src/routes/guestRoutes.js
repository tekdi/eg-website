import React from "react";
const Home = React.lazy(() => import("../pages/front-end/Home"));
const Test = React.lazy(() => import("../component/Test"));
const LoginComponent = React.lazy(() => import("auth/Login"));
const ForgetPasswordComponent = React.lazy(() => import("auth/ForgetPassword"));
export default [
  {
    path: "/facilitator-self-onboarding",
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
