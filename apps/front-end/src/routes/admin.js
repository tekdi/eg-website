import React from "react";
// ip
const Profile = React.lazy(() => import("pages/admin/facilitator/Profile"));

// events
const AdminHome = React.lazy(() => import("pages/admin/event/AdminHome"));
const EventView = React.lazy(() => import("pages/admin/event/View"));

// facilitator
const FacilitatorList = React.lazy(() =>
  import("pages/admin/facilitator/List")
);
const FacilitatorForm = React.lazy(() =>
  import("pages/admin/facilitator/Form")
);
const Certification = React.lazy(() =>
  import("pages/admin/facilitator/Certification")
);
const FacilitatorView = React.lazy(() =>
  import("pages/admin/facilitator/View")
);

// beneficiaries
const AdminBeneficiariesDuplicatesList = React.lazy(() =>
  import("pages/admin/beneficiaries/AdminBeneficiariesDuplicatesList")
);
const AdminBeneficiariesDuplicatesByAadhaar = React.lazy(() =>
  import("pages/admin/beneficiaries/AdminBeneficiariesDuplicatesByAadhaar")
);
const AdminBeneficiariesList = React.lazy(() =>
  import("pages/admin/beneficiaries/AdminBeneficiariesList")
);
const AdminReports = React.lazy(() =>
  import("pages/admin/reports/AdminReports")
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

// camps
const CampHome = React.lazy(() => import("pages/admin/camps/CampHome"));
const ViewCamp = React.lazy(() => import("pages/admin/camps/View"));
const ReassignCamp = React.lazy(() => import("pages/admin/camps/ReassignCamp"));
const ReassignPrerak = React.lazy(() =>
  import("pages/admin/camps/ReassignPrerak")
);
const CampForm = React.lazy(() =>
  import("pages/admin/camps/CampFormEdit/Form")
);

// other
const NotFound = React.lazy(() => import("pages/NotFound"));
const AdharKyc = React.lazy(() =>
  import("pages/front-end/AadhaarKyc/AadhaarKyc")
);
const FileView = React.lazy(() => import("pages/FileView"));
const Assessment = React.lazy(() => import("component/Assessment"));

const EventForm = React.lazy(() => import("pages/admin/event/EventForm"));

// Exam Schedule

const ExamSchedule = React.lazy(() =>
  import("pages/admin/examschedule/ExamSchedule")
);
const ExamResultList = React.lazy(() =>
  import("pages/admin/examschedule/ExamResult/ExamResultList")
);
const ManualExamResult = React.lazy(() =>
  import("pages/admin/examschedule/ExamResult/ManualExamResult")
);
const ExamResultView = React.lazy(() =>
  import("pages/admin/examschedule/ExamResult/ExamResultView")
);

export default [
  { path: "/admin/facilitator/:id", component: FacilitatorView },
  { path: "/admin/Certification/:id", component: Certification },
  { path: "/admin/facilitator-onbording", component: FacilitatorForm },
  { path: "/admin/profile", component: Profile },
  { path: "/admin/facilitator", component: FacilitatorList },
  { path: "/admin", component: AdminHome },
  { path: "/admin/event/:id", component: EventView },
  { path: "/admin/learners", component: AdminBeneficiariesList },
  { path: "/admin/reports/:name", component: AdminReports },
  {
    path: "/admin/learners/enrollmentVerificationList",
    component: EnrollmentVerificationList,
  },
  {
    path: "/admin/learners/enrollmentVerificationList/:type",
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
  {
    path: "/file/:id/view",
    component: FileView,
  },
  { path: "/", component: AdminHome },
  { path: "/admin/camps", component: CampHome },
  { path: "/admin/camps/:id", component: ViewCamp },
  { path: "/admin/camps/:id/reassign", component: ReassignCamp },
  {
    path: "/admin/camps/:id/reassignPrerak/:user_id",
    component: ReassignPrerak,
  },
  {
    path: "/admin/camps/:id/:step",
    component: CampForm,
  },
  // {
  //   path: "/admin/attendances",
  //   component: Attendances,
  // },

  {
    path: "/assessment/:context/:context_id/:do_id",
    component: Assessment,
  },

  { path: "/admin/event/create", component: EventForm },
  { path: "/admin/event/:id/:step", component: EventForm },

  { path: "*", component: NotFound },

  // Exam Schedule Routes
  { path: "/admin/exams/examschedule", component: ExamSchedule },
  { path: "/admin/exams/list", component: ExamResultList },
  { path: "/admin/exams/list/:id", component: ManualExamResult },
  { path: "/admin/exams/list/result/:id", component: ExamResultView },
];
