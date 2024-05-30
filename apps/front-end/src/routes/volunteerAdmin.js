import React from "react";
// ip
const Dashboard = React.lazy(() => import("pages/volunteer-admin/Dashboard"));
const NotFound = React.lazy(() => import("pages/NotFound"));

export default [
  { path: "/admin-volunteer", component: Dashboard },
  { path: "/admin-volunteer/volunteers", component: Dashboard },
  { path: "/admin-volunteer/profile", component: Dashboard },
  { path: "/", component: Dashboard },
  { path: "*", component: NotFound },
];
