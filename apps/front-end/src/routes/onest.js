import React from "react";
const VolunteerLandingPage = React.lazy(() =>
  import("onest/VolunteerLandingPage")
);
const NotFound = React.lazy(() => import("onest/NotFound"));
const LandingPage = React.lazy(() => import("onest/LandingPage"));
const MediaPage = React.lazy(() => import("onest/content/MediaPage"));
const UserDetailsForm = React.lazy(() =>
  import("onest/content/UserDetailsForm")
);
const AutomatedForm = React.lazy(() => import("onest/AutomatedForm"));
const List = React.lazy(() => import("onest/List"));
const View = React.lazy(() => import("onest/View"));
export const notAccessRoute = [{ path: "*", component: NotFound }];
const route = [
  { path: "/onest", component: LandingPage },
  { path: "/onest/:type", component: List },
  { path: "/onest/:type/:jobId", component: View },
  {
    path: "/onest/:type/automatedForm/:jobId/:transactionId",
    component: AutomatedForm,
  },
  { path: "/onest/:type/confirm/:itemId/:transactionId", component: MediaPage },
  { path: "/onest/:type/form", component: UserDetailsForm },
];

export const volunteerRoute = [
  ...route.filter((e) => e.path != "/onest"),
  { path: "/*", component: VolunteerLandingPage },
];

export default route;
