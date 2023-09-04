import AdminHome from "pages/admin/AdminHome";
import Attendence from "pages/front-end/Attendence/Attendence";
import AdharKyc from "pages/front-end/AadhaarKyc/AadhaarKyc";
import AdminBeneficiariesDuplicatesList from "pages/admin/beneficiaries/AdminBeneficiariesDuplicatesList";
import AdminBeneficiariesDuplicatesByAadhaar from "pages/admin/beneficiaries/AdminBeneficiariesDuplicatesByAadhaar";
import FacilitatorView from "pages/admin/facilitator/View";
import FacilitatorForm from "../pages/admin/FacilitatorForm";
import AdminBeneficiariesList from "pages/admin/beneficiaries/AdminBeneficiariesList";
import ReassignBeneficiariesList from "pages/admin/ReassignBeneficiaries/ReassignBeneficiariesList";
import NotFound from "pages/NotFound";
import Orientation from "pages/front-end/orientation/Orientation";
import EnrollmentReceiptView from "pages/admin/beneficiaries/EnrollmentReceiptView";
import Profile from "pages/admin/facilitator/Profile";
import ReassignBeneficiaries from "pages/admin/ReassignBeneficiaries/ReassignBeneficiaries";
import EnrollmentVerificationList from "pages/admin/beneficiaries/enrollment/EnrollmentVerificationList";

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/admin/facilitator", component: AdminHome },
  { path: "/admin", component: Orientation },
  { path: "/attendence/:id", component: Attendence },
  { path: "/admin/learners", component: AdminBeneficiariesList },
  {
    path: "/admin/learners/enrollmentVerificationList",
    component: EnrollmentVerificationList,
  },
  {
    path: "/admin/learners/enrollmentReceipt/:id",
    component: EnrollmentReceiptView,
  },
  {
    path: "/admin/learners/duplicates",
    component: AdminBeneficiariesDuplicatesList,
  },
  {
    path: "/admin/learners/duplicates/:aadhaarNo",
    component: AdminBeneficiariesDuplicatesByAadhaar,
  },
  {
    path: "/admin/learners/reassignList",
    component: ReassignBeneficiariesList,
  },
  {
    path: "/admin/learners/reassignList/learnerList/:prerakId",
    component: ReassignBeneficiaries,
  },
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

  // { path: "/cheatsheet", component: CheatSheet },
];
