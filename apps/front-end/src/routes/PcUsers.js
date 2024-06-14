import React, { lazy } from "react";

// PC Users Routes

const PcDashboard = lazy(() => import("pages/PCusers/PcDashboard"));

// PC users Routes

export default [
  {
    path: "/pcUserDashboard",
    component: PcDashboard,
  },
];
