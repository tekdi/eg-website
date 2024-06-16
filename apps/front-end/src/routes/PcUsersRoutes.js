import React, { lazy } from "react";

// PC Users Routes

const PcDashboard = lazy(() => import("pages/PCusers/PcDashboard"));
const DailyActivitiesList = lazy(() =>
  import("pages/PCusers/DailyActivitiesList")
);
const DailyActivities = lazy(() => import("pages/PCusers/DailyActivites"));
const CampList = lazy(() => import("pages/PCusers/camps/CampList"));
const CampProfileView = lazy(() =>
  import("pages/PCusers/camps/CampProfileView")
);

// PC users Routes

export default [
  { path: "/", component: PcDashboard },
  { path: "*", component: PcDashboard },
  {
    path: "/pcUserDashboard",
    component: PcDashboard,
  },
  {
    path: "/pcuser/dailyactivities/list",
    component: DailyActivitiesList,
  },
  {
    path: "/pcuser/dailyactivities/:activity",
    component: DailyActivities,
  },
  {
    path: "/pcuser/camps",
    component: CampList,
  },
  {
    path: "/pcuser/camps/:id",
    component: CampProfileView,
  },
];
