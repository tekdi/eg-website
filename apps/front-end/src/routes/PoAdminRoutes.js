import { lazy } from "react";

const NotFound = lazy(() => import("pages/NotFound"));
const PoAdminHome = lazy(() => import("pages/admin/PoAdmin/PoAdminHome"));
const PoDuplicateView = lazy(() =>
  import("pages/admin/PoAdmin/PoDuplicateView")
);
const IPList = lazy(() => import("pages/admin/PoAdmin/IP/List"));
const DoidList = lazy(() => import("pages/admin/PoAdmin/DoId/List"));
const DoidForm = lazy(() => import("pages/admin/PoAdmin/DoId/Form"));
const DoidDetails = lazy(() => import("pages/admin/PoAdmin/DoId/View"));
const IpDetails = lazy(() => import("pages/admin/PoAdmin/IP/View"));
const IPForm = lazy(() => import("pages/admin/PoAdmin/IP/Form"));
const IPEditForm = lazy(() => import("pages/admin/PoAdmin/IP/EditIP/Form"));
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
const ExitingUser = lazy(() =>
  import("pages/admin/PoAdmin/IP/ExistingUser/Form")
);

const ExamSchedule = lazy(() =>
  import("pages/admin/PoAdmin/Exam/ScheduleExam")
);

const PoReports = lazy(() => import("pages/admin/PoAdmin/IP/Report/Report"));
const AddressList = lazy(() => import("pages/admin/PoAdmin/Address/List"));
const AddressDetail = lazy(() => import("pages/admin/PoAdmin/Address/View"));
const AddressForm = lazy(() => import("pages/admin/PoAdmin/Address/Form"));

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
    path: "/poadmin/ips/:id/existing/user-create",
    component: ExitingUser,
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
  {
    path: "/assessment/:context/:context_id/:do_id",
    component: Assessment,
  },
  {
    path: "/poadmin/ips/:id/list",
    component: UserList,
  },
  {
    path: "/poadmin/exam-schedule",
    component: ExamSchedule,
  },
  { path: "/poadmin/reports/:name", component: PoReports },

  {
    path: "/poadmin/ip/:id/edit",
    component: IPEditForm,
  },
  {
    path: "/poadmin/address",
    component: AddressList,
  },
  {
    path: "/poadmin/do-ids",
    component: DoidList,
  },
  {
    path: "/poadmin/do-ids/create",
    component: DoidForm,
  },
  {
    path: "/poadmin/do-ids/:id/edit",
    component: DoidForm,
  },
  {
    path: "/poadmin/do-ids/:id",
    component: DoidDetails,
  },
  {
    path: "/poadmin/address/:id",
    component: AddressDetail,
  },
  {
    path: "/poadmin/address/create",
    component: AddressForm,
  },
  { path: "/", component: Home },
  { path: "*", component: NotFound },
];
