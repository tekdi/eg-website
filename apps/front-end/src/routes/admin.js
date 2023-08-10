import AdminHome from "pages/admin/AdminHome";
import Attendence from "pages/front-end/Attendence/Attendence";
import AdharKyc from "pages/front-end/AadhaarKyc/AadhaarKyc";
import AdminBeneficiariesDuplicatesList from "pages/admin/beneficiaries/AdminBeneficiariesDuplicatesList";
import AdminBeneficiariesDuplicatesByAadhaar from "pages/admin/beneficiaries/AdminBeneficiariesDuplicatesByAadhaar";
import FacilitatorView from "pages/admin/facilitator/View";
import FacilitatorForm from "../pages/admin/FacilitatorForm";
import LearnerAdminHome from "pages/admin/learner/AdminHome";
import NotFound from "pages/NotFound";
import Orientation from "pages/front-end/orientation/Orientation";
import Profile from "pages/admin/facilitator/Profile";

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/admin/facilitator", component: AdminHome },
  { path: "/admin/learner", component: LearnerAdminHome },
  { path: "/admin", component: Orientation },
  { path: "/attendence/:id", component: Attendence },
  {
    path: "/admin/learner/duplicates",
    component: AdminBeneficiariesDuplicatesList,
  },
  {
    path: "/admin/view/duplicates/:adhaarNo",
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
