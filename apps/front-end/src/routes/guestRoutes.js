import NotFound from "pages/NotFound";
import React from "react";
import Home from "../pages/front-end/Home";
const LoginComponent = React.lazy(() => import("auth/Login"));

export default [
  {
    path: "/login",
    component: LoginComponent,
  },
  {
    path: "/facilitator/:id",
    component: Home,
  },
  {
    path: "*",
    component: NotFound,
  },
];
