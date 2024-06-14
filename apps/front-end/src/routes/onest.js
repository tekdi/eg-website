import React, { lazy } from "react";
const VolunteerLandingPage = lazy(() => import("onest/VolunteerLandingPage"));
const Update = lazy(() => import("pages/front-end/volunteer/Update"));
// add profile page
const Profile = lazy(() => import("pages/front-end/volunteer/Profile"));
const NotFound = lazy(() => import("onest/NotFound"));
const LandingPage = lazy(() => import("onest/LandingPage"));
const MediaPage = lazy(() => import("onest/content/MediaPage"));
const UserDetailsForm = lazy(() => import("onest/content/UserDetailsForm"));
const AutomatedForm = lazy(() => import("onest/AutomatedForm"));
const List = lazy(() => import("onest/List"));
const View = lazy(() => import("onest/View"));
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
  { path: "/profile", component: Profile },
  { path: "/profile/:page/edit", component: Update },
  { path: "/*", component: VolunteerLandingPage },
];

export default route;
