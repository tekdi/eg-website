import { lazy } from "react";

const NotFound = lazy(() => import("pages/NotFound"));
const PoAdminHome = lazy(() => import("pages/admin/PoAdmin/PoAdminHome"));
const PoDuplicateView = lazy(() =>
  import("pages/admin/PoAdmin/PoDuplicateView")
);
const IPList = lazy(() => import("pages/admin/PoAdmin/IP/List"));
const IpDetails = lazy(() => import("pages/admin/PoAdmin/IP/View"));
const IPForm = lazy(() => import("pages/admin/PoAdmin/IP/Form"));
const FileView = lazy(() => import("pages/FileView"));
const Assessment = lazy(() => import("component/Assessment"));
const PrerakListing = lazy(() => import("pages/admin/PoAdmin/Prerak/List"));
const CampListing = lazy(() => import("pages/admin/PoAdmin/Camp/List"));
const LearnerListing = lazy(() => import("pages/admin/PoAdmin/Learner/List"));
const CampViewDetails = lazy(() => import("pages/admin/PoAdmin/Camp/View"));
const LearnerViewDetails = lazy(() =>
  import("pages/admin/PoAdmin/Learner/View")
);
const PrerakViewDetails = lazy(() => import("pages/admin/PoAdmin/Prerak/View"));
const PoProfileDetails = lazy(() => import("pages/admin/PoAdmin/Profile"));
const Home = lazy(() => import("pages/admin/PoAdmin/Home/Home"));
const UserList = lazy(() => import("pages/admin/PoAdmin/IP/UserList"));
const IpUserForm = lazy(() => import("pages/admin/PoAdmin/IP/Users/Form"));
const IpUserView = lazy(() => import("pages/admin/PoAdmin/IP/Users/View"));
const ExistingIpForm = lazy(() =>
  import("pages/admin/PoAdmin/IP/ExistingIP/Form")
);

export default [
  {
    path: "/poadmin/profile",
    component: PoProfileDetails,
  },
  {
    path: "/poadmin/ips/:id/user-create",
    component: IpUserForm,
  },
  {
    path: "/poadmin/ips/exist/create",
    component: ExistingIpForm,
  },
  {
    path: "/poadmin/ips/user/:id",
    component: IpUserView,
  },
  {
    path: "/poadmin/ips",
    component: IPList,
  },
  {
    path: "/poadmin/ips/:id",
    component: IpDetails,
  },
  {
    path: "/poadmin/ips/create",
    component: IPForm,
  },
  {
    path: "/poadmin/facilitators",
    component: PrerakListing,
  },
  {
    path: "/poadmin/facilitators/:id",
    component: PrerakViewDetails,
  },
  {
    path: "/poadmin/camps",
    component: CampListing,
  },
  {
    path: "/poadmin/camps/:id",
    component: CampViewDetails,
  },
  {
    path: "/poadmin/learners",
    component: LearnerListing,
  },
  {
    path: "/poadmin/learners/:id",
    component: LearnerViewDetails,
  },
  { path: "/poadmin", component: PoAdminHome },
  {
    path: "/file/:id/view",
    component: FileView,
  },
  {
    path: "/poadmin/learners/duplicates/:aadhaarNo",
    component: PoDuplicateView,
  },
  { path: "/", component: Home },
  {
    path: "/assessment/:context/:context_id/:do_id",
    component: Assessment,
  },
  {
    path: "/poadmin/ips/:id/list",
    component: UserList,
  },
  { path: "*", component: NotFound },
];
