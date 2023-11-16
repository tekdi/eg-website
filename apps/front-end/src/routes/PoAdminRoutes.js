import React from "react";

const NotFound = React.lazy(() => import("pages/NotFound"));
const PoAdminHome = React.lazy(() => import("pages/admin/PoAdmin/PoAdminHome"));
const PoDuplicateView = React.lazy(() =>
  import("pages/admin/PoAdmin/PoDuplicateView")
);
const FileView = React.lazy(() => import("pages/FileView"));

export default [
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
  { path: "*", component: NotFound },
];
