import React from "react";
// ip
const Dashboard = React.lazy(() => import("pages/volunteer-admin/Dashboard"));
const NotFound = React.lazy(() => import("pages/NotFound"));

// facilitator
const VolunteerView = React.lazy(() =>
  import("pages/volunteer-admin/volunteer/View")
);

const VolunteerReports = React.lazy(() =>
  import("pages/volunteer-admin/reports/VolunteerReports")
);

const VolunteerList = React.lazy(() =>
  import("pages/volunteer-admin/volunteer/list/List")
);

export default [
  { path: "/admin-volunteer", component: Dashboard },
  { path: "/admin-volunteer/volunteers", component: VolunteerList },
  { path: "/admin-volunteer/profile", component: Dashboard },
  { path: "/admin-volunteer/reports/:name", component: VolunteerReports },
  { path: "/admin-volunteer/volunteers/:id", component: VolunteerView },
  { path: "/", component: Dashboard },
  { path: "*", component: NotFound },
];
