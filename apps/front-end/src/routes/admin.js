import React from "react";

const FacilitatorView = React.lazy(() =>
  import("pages/admin/facilitator/View")
);
const AdminHome = React.lazy(() => import("pages/admin/AdminHome"));
const FacilitatorForm = React.lazy(() =>
  import("../pages/admin/FacilitatorForm")
);
const NotFound = React.lazy(() => import("pages/NotFound"));
const Orientation = React.lazy(() =>
  import("pages/front-end/orientation/Orientation")
);
const Attendence = React.lazy(() =>
  import("pages/front-end/Attendence/Attendence")
);
const AdharKyc = React.lazy(() =>
  import("pages/front-end/AadhaarKyc/AadhaarKyc")
);

const Profile = React.lazy(() => import("pages/admin/facilitator/Profile"));

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/admin/facilitator", component: AdminHome },
  { path: "/admin", component: Orientation },
  { path: "/attendence/:id", component: Attendence },

  {
    path: "/aadhaar-kyc/:id",
    component: AdharKyc,
  },
  {
    path: "/aadhaar-kyc/:id/:type",
    component: AdharKyc,
  },

  { path: "/", component: Orientation },

  { path: "*", component: NotFound },
];
