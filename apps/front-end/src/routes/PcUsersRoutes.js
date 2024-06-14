import React, { lazy } from "react";

// PC Users Routes

const PcDashboard = lazy(() => import("pages/PCusers/PcDashboard"));
const PrerakList = lazy(() => import("pages/PCusers/Prerak/PrerakList"));
const PrerakProfileView = lazy(() =>
  import("pages/PCusers/Prerak/PrerakProfileView")
);

// PC users Routes

export default [
  {
    path: "/pcUserDashboard",
    component: PcDashboard,
  },
  {
    path: "prerak/prerakList",
    component: PrerakList,
  },
  {
    path: "prerak/prerakProfileView/:id",
    component: PrerakProfileView,
  },
  { path: "/", component: PcDashboard },
  { path: "*", component: PcDashboard },
];
