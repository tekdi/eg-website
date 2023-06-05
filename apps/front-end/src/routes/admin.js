import Dashboard from "pages/front-end/Dashboard";
import Profile from "pages/admin/facilitator/Profile";
import FacilitatorView from "pages/admin/facilitator/View";
import AdminHome from "pages/admin/AdminHome";
import FacilitatorForm from "../pages/admin/FacilitatorForm";
import NotFound from "pages/NotFound";
import Orientation from "pages/front-end/orientation/OrientationScreen";
import Attendence from "pages/front-end/Attendence/Attendence";

import AdharKyc from "pages/front-end/AadhaarKyc/AadhaarKyc";
import AdharOTP from "pages/front-end/AadhaarKyc/AadhaarOTP";
import AdharSuccess from "pages/front-end/AadhaarKyc/AadhaarSuccess";
import AadhaarStartKyc from "pages/front-end/AadhaarKyc/AadhaarStartKyc";
import ManualUpload from "pages/front-end/AadhaarKyc/ManualUpload/ManualUpload";
import QrScannerKyc from "pages/front-end/AadhaarKyc/QrScannerKyc/QrScannerKyc";
import { CheatSheet } from "@shiksha/common-lib";
// import AgMenuBar from "pages/admin/facilitator/view/AgMenuBar";

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/admin/orientation", component: Orientation },
  { path: "/admin", component: AdminHome },
  { path: "/", component: AdminHome },
  // { path: "/menubar", component: AgMenuBar },
  { path: "/attendence/:id", component: Attendence },
  {
    path: "/admin/aadhaarStart",
    component: AadhaarStartKyc,
  },
  {
    path: "/admin/aadhaarNumber",
    component: AdharKyc,
  },
  {
    path: "/admin/aadhaarOTP",
    component: AdharOTP,
  },
  {
    path: "/admin/aadhaarSuccess",
    component: AdharSuccess,
  },
  {
    path: "/admin/aadhaarManualUpload",
    component: ManualUpload,
  },
  {
    path: "/admin/aadhaarQrScanner",
    component: QrScannerKyc,
  },

  { path: "*", component: NotFound },

  { path: "/cheatsheet", component: CheatSheet },
];
