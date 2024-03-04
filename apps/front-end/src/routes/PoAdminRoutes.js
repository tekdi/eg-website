import { PoAdminLayout } from "@shiksha/common-lib";
import React, { lazy } from "react";

const NotFound = React.lazy(() => import("pages/NotFound"));
const PoAdminHome = React.lazy(() => import("pages/admin/PoAdmin/PoAdminHome"));
const PoDuplicateView = React.lazy(() =>
  import("pages/admin/PoAdmin/PoDuplicateView")
);
const FileView = React.lazy(() => import("pages/FileView"));
const Assessment = React.lazy(() => import("component/Assessment"));
const PrerakList = lazy(() => import("pages/admin/facilitator/List"));

const prerakListO = ({ userTokenInfo }) => {
  return (
    <PoAdminLayout>
      <PrerakList {...{ userTokenInfo, _layout: { withoutLayout: true } }} />
    </PoAdminLayout>
  );
};

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

  {
    path: "/assessment/:context/:context_id/:do_id",
    component: Assessment,
  },
  {
    path: "/poadmin/facilitator",
    component: prerakListO,
  },

  { path: "*", component: NotFound },
];
