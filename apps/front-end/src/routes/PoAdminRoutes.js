import React from "react";

const NotFound = React.lazy(() => import("pages/NotFound"));
const PoAdminHome = React.lazy(() => import("pages/admin/PoAdmin/PoAdminHome"));
const PoDuplicateView = React.lazy(() =>
  import("pages/admin/PoAdmin/PoDuplicateView")
);

export default [
  { path: "/", component: PoAdminHome },
  { path: "/poadmin", component: PoAdminHome },
  { path: "*", component: NotFound },
  {
    path: "/poadmin/learners/duplicates/:aadhaarNo",
    component: PoDuplicateView,
  },
];
