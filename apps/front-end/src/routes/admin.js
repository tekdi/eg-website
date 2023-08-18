import AdminHome from "pages/admin/AdminHome";
import Attendence from "pages/front-end/Attendence/Attendence";
import AdharKyc from "pages/front-end/AadhaarKyc/AadhaarKyc";
import AdminBeneficiariesDuplicatesList from "pages/admin/beneficiaries/AdminBeneficiariesDuplicatesList";
import AdminBeneficiariesDuplicatesByAadhaar from "pages/admin/beneficiaries/AdminBeneficiariesDuplicatesByAadhaar";
import FacilitatorView from "pages/admin/facilitator/View";
import FacilitatorForm from "../pages/admin/FacilitatorForm";
import AdminBeneficiariesList from "pages/admin/beneficiaries/AdminBeneficiariesList";
import NotFound from "pages/NotFound";
import Orientation from "pages/front-end/orientation/Orientation";
import ReciptView from "pages/admin/learner/ReciptView";
import Profile from "pages/admin/facilitator/Profile";

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/admin/facilitator", component: AdminHome },
  { path: "/admin", component: Orientation },
  { path: "/attendence/:id", component: Attendence },
  { path: "/admin/view/enrollmentRecipt/:id", component: ReciptView },
  { path: "/admin/learners", component: AdminBeneficiariesList },
  {
    path: "/admin/learners/duplicates",
    component: AdminBeneficiariesDuplicatesList,
  },
  {
    path: "/admin/learners/duplicates/:aadhaarNo",
    component: AdminBeneficiariesDuplicatesByAadhaar,
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
