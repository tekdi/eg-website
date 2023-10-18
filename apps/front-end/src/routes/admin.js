import React from "react";
const Profile = React.lazy(() => import("pages/admin/facilitator/Profile"));
const FacilitatorView = React.lazy(() =>
  import("pages/admin/facilitator/View")
);
const AdminHome = React.lazy(() => import("pages/admin/AdminHome"));
const LearnerAdminHome = React.lazy(() => import("pages/admin/AdminHome"));
const FacilitatorForm = React.lazy(() => import("pages/admin/FacilitatorForm"));
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

const AdminBeneficiariesDuplicatesList = React.lazy(() =>
  import("pages/admin/beneficiaries/AdminBeneficiariesDuplicatesList")
);
const AdminBeneficiariesDuplicatesByAadhaar = React.lazy(() =>
  import("pages/admin/beneficiaries/AdminBeneficiariesDuplicatesByAadhaar")
);
const AdminBeneficiariesList = React.lazy(() =>
  import("pages/admin/beneficiaries/AdminBeneficiariesList")
);

const EnrollmentVerificationList = React.lazy(() =>
  import("pages/admin/beneficiaries/enrollment/EnrollmentVerificationList")
);

const EnrollmentReceiptView = React.lazy(() =>
  import("pages/admin/beneficiaries/EnrollmentReceiptView")
);

const BeneficiaryAdminProfile = React.lazy(() =>
  import("pages/admin/beneficiaries/Profile")
);
const enrollmentForm = React.lazy(() =>
  import("pages/admin/beneficiaries/enrollment/EnrollmentForm")
);

const ReassignBeneficiaries = React.lazy(() =>
  import("pages/admin/ReassignBeneficiaries/ReassignBeneficiaries")
);

const ReassignBeneficiariesList = React.lazy(() =>
  import("pages/admin/ReassignBeneficiaries/ReassignBeneficiariesList")
);
const CampHome = React.lazy(() => import("pages/admin/camps/CampHome"));
// const CampsView = React.lazy(() => import("pages/admin/camps/View"));
const ViewCamp = React.lazy(() => import("pages/admin/camps/View"));

export default [
  { path: "/admin/view/:id", component: FacilitatorView },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/admin/facilitator", component: AdminHome },
  { path: "/admin/learner", component: LearnerAdminHome },
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
    path: "/admin/learners/reassignList/:prerakId",
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

  {
    path: "/admin/beneficiary/:id",
    component: BeneficiaryAdminProfile,
  },
  {
    path: "/admin/beneficiary/:id/editEnrollmentDetails",
    component: enrollmentForm,
  },
  { path: "/", component: Orientation },
  { path: "/admin/campHome", component: CampHome },
  // { path: "/admin/camp/:id/view", component: CampsView },
  { path: "/admin/camp/view/:id", component: ViewCamp },
  { path: "*", component: NotFound },
];
