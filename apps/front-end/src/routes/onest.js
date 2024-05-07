import React from "react";
const LandingPage = React.lazy(() => import("onest/LandingPage"));
const MediaPage = React.lazy(() => import("onest/content/MediaPage"));
const UserDetailsForm = React.lazy(() =>
  import("onest/content/UserDetailsForm")
);
const AutomatedForm = React.lazy(() => import("onest/AutomatedForm"));
const List = React.lazy(() => import("onest/List"));
const View = React.lazy(() => import("onest/View"));

export default [
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
