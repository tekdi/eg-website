import React, { lazy } from "react";

const NotFound = React.lazy(() => import("pages/NotFound"));
const PoAdminHome = React.lazy(() => import("pages/admin/PoAdmin/PoAdminHome"));
const PoDuplicateView = React.lazy(() =>
  import("pages/admin/PoAdmin/PoDuplicateView")
);
const FileView = React.lazy(() => import("pages/FileView"));
const Assessment = React.lazy(() => import("component/Assessment"));
const PrerakListing = lazy(() => import("pages/admin/PoAdmin/Prerak/List"));
// const CampListing = lazy(() => import("pages/admin/PoAdmin/Camp/List"));
// const LearnerListing = lazy(() => import("pages/admin/PoAdmin/Learner/List"));
// const CampViewDetails = lazy(() => import("pages/admin/PoAdmin/Camp/View"));
// const LearnerViewDetails = lazy(() =>
//   import("pages/admin/PoAdmin/Learner/View")
// );
// const PrerakViewDetails = lazy(() => import("pages/admin/PoAdmin/Prerak/View"));

export default [
  {
    path: "/poadmin/facilitator",
    component: PrerakListing,
  },
  // {
  //   path: "/poadmin/facilitator/:id",
  //   component: PrerakViewDetails,
  // },
  // {
  //   path: "/poadmin/camps",
  //   component: CampListing,
  // },
  // {
  //   path: "/poadmin/camps/:id",
  //   component: CampViewDetails,
  // },
  // {
  //   path: "/poadmin/learner",
  //   component: LearnerListing,
  // },
  // {
  //   path: "/poadmin/learner/:id",
  //   component: LearnerViewDetails,
  // },
  { path: "/poadmin", component: PoAdminHome },
  {
    path: "/file/:id/view",
    component: FileView,
  },
  {
    path: "/poadmin/learners/duplicates/:aadhaarNo",
    component: PoDuplicateView,
  },
  { path: "/", component: PoAdminHome },
  {
    path: "/assessment/:context/:context_id/:do_id",
    component: Assessment,
  },
  { path: "*", component: NotFound },
];
