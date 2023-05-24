import Dashboard from "pages/front-end/Dashboard";
import Profile from "pages/admin/facilitator/Profile";
import FacilitatorView from "pages/admin/facilitator/View";
import AdminHome from "pages/admin/AdminHome";
import FacilitatorForm from "../pages/admin/FacilitatorForm";
import NotFound from "pages/NotFound";
import orientationScreen from "pages/front-end/orientation/orientationScreen";

import AdharKyc from "pages/front-end/AadhaarKyc/AadhaarKyc";
import AdharOTP from "pages/front-end/AadhaarKyc/AadhaarOTP";
import AdharSuccess from "pages/front-end/AadhaarKyc/AadhaarSuccess";
import AadhaarStartKyc from "pages/front-end/AadhaarKyc/AadhaarStartKyc";
import ManualUpload from "pages/front-end/AadhaarKyc/ManualUpload/ManualUpload";
import QrScannerKyc from "pages/front-end/AadhaarKyc/QrScannerKyc/QrScannerKyc";

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/orientation", component: orientationScreen },
  { path: "/admin", component: AdminHome },
  { path: "/", component: AdminHome },

  {
    path: '/aadhaarStart',
    component: AadhaarStartKyc,
  },
  {
    path: '/aadhaarNumber',
    component: AdharKyc,
  },
  {
    path: '/aadhaarOTP',
    component: AdharOTP,
  },
  {
    path: '/aadhaarSuccess',
    component: AdharSuccess,
  },
  {
    path: '/aadhaarManualUpload',
    component: ManualUpload,
  },
  {
    path: '/aadhaarQrScanner',
    component: QrScannerKyc,
  },

  // { path: "*", component: NotFound },
];
