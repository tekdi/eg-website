import React from "react";
const Dashboard = React.lazy(() => import("pages/front-end/Dashboard"));
const Home = React.lazy(() => import("pages/front-end/Home"));
const basicDetails = React.lazy(() =>
  import("../pages/front-end/ag-edit/parts/basicDetails")
);
const educationDetails = React.lazy(() =>
  import(
    "pages/front-end/ag-edit/education-details-further-studies/educationDetails"
  )
);
const contactDetailsEdit = React.lazy(() =>
  import("pages/front-end/ag-edit/contact-details/contactDetailsEdit")
);
const addressEdit = React.lazy(() =>
  import("pages/front-end/ag-edit/address/addressEdit")
);
const personaldetails = React.lazy(() =>
  import("pages/front-end/ag-edit/personal-details/personaldetails")
);
const referencedetails = React.lazy(() =>
  import("pages/front-end/ag-edit/reference-details/referencedetails")
);
const familydetails = React.lazy(() =>
  import("pages/front-end/ag-edit/family-details/familydetails")
);
const uploadphoto = React.lazy(() =>
  import("pages/front-end/ag-edit/upload-photo/uploadphoto")
);
const futureStudy = React.lazy(() =>
  import(
    "pages/front-end/ag-edit/education-details-further-studies/futureStudy"
  )
);
const otherdetails = React.lazy(() =>
  import("pages/front-end/ag-edit/other-details/otherdetails")
);

const EnrollmentForm = React.lazy(() =>
  import("pages/front-end/ag-edit/enrollment/EnrollmentForm")
);
const Agduplicate = React.lazy(() =>
  import("pages/front-end/ag-form/Agduplicate")
);
const Agform = React.lazy(() => import("pages/front-end/ag-form/Agform"));
const Docschecklist = React.lazy(() =>
  import("pages/front-end/ag-form/Docschecklist")
);
const LearnerProfile = React.lazy(() =>
  import("pages/front-end/ag-form/LearnerProfile")
);
const BenificiaryListView = React.lazy(() =>
  import("pages/front-end/BenificiaryListView")
);
const BenificiaryProfileView = React.lazy(() =>
  import("pages/front-end/BenificiaryProfileView")
);
const CountScreenView = React.lazy(() =>
  import("pages/front-end/CountScreenView")
);
const AgformUpdate = React.lazy(() =>
  import("pages/front-end/ag-form/Agformupdate")
);
const Agadhaar = React.lazy(() => import("pages/front-end/ag-form/Agadhaar"));
const Success = React.lazy(() => import("pages/front-end/Success"));
const Profile = React.lazy(() => import("pages/front-end/facilitator/Profile"));
const Certificate = React.lazy(() =>
  import("pages/front-end/facilitator/Certificate")
);
const AdharKyc = React.lazy(() =>
  import("pages/front-end/AadhaarKyc/AadhaarKyc")
);
const BenificiaryBasicDetails = React.lazy(() =>
  import("pages/front-end/BenificiaryBasicDetails")
);
const BenificiaryEducation = React.lazy(() =>
  import("pages/front-end/BenificiaryEducation")
);
const BenificiaryJourney = React.lazy(() =>
  import("pages/front-end/BenificiaryJourney")
);
const BenificiaryEnrollment = React.lazy(() =>
  import("pages/front-end/BenificiaryEnrollment")
);
const BenificiaryAadhaarDetails = React.lazy(() =>
  import("pages/front-end/BenificiaryAadhaarDetails")
);
const EditForm = React.lazy(() =>
  import("pages/front-end/facilitator/edit/Form")
);

const ArrayForm = React.lazy(() =>
  import("pages/front-end/facilitator/edit/ArrayForm")
);
const FacilitatorBasicDetails = React.lazy(() =>
  import("pages/front-end/facilitator/FacilitatorBasicDetails")
);
const FacilitatorQualification = React.lazy(() =>
  import("pages/front-end/facilitator/FacilitatorQualification")
);
const BenificiaryProfilePhoto = React.lazy(() =>
  import("pages/front-end/BenificiaryProfilePhoto")
);
const AadhaarDetails = React.lazy(() =>
  import("pages/front-end/facilitator/AadhaarDetails")
);
const BenificiaryAddress = React.lazy(() =>
  import("pages/front-end/BenificiaryAddress")
);
const CommunityView = React.lazy(() =>
  import("pages/front-end/community/CommunityView")
);

const CampDashboard = React.lazy(() =>
  import("pages/front-end/Camp/CampDashboard")
);
const CampSelectedLearners = React.lazy(() =>
  import("pages/front-end/Camp/CampSelectedLearners")
);
const CampRegistration = React.lazy(() =>
  import("pages/front-end/Camp/CampRegistration")
);

const CampForm = React.lazy(() => import("pages/front-end/Camp/CampForm/Form"));
const CampLeanerList = React.lazy(() =>
  import("pages/front-end/Camp/CampLearnerList")
);
const PcrDetails = React.lazy(() =>
  import("pages/front-end/PCRDetails.js/PcrDetails")
);
const PcrView = React.lazy(() =>
  import("pages/front-end/PCRDetails.js/PcrView")
);

const FileView = React.lazy(() => import("pages/FileView"));

const CampExecution = React.lazy(() =>
  import("pages/front-end/Camp/CampExecution/CampExecution")
);

const Attendance = React.lazy(() =>
  import("pages/front-end/Camp/Attendace/Attendance")
);

const CampKitMaterialDetails = React.lazy(() =>
  import("pages/front-end/Camp/CampKitMaterialDetails")
);

const CampSettings = React.lazy(() =>
  import("pages/front-end/Camp/CampSetting")
);

const CampOtherPlans = React.lazy(() =>
  import("pages/front-end/Camp/CampExecution/CampOtherPlans")
);

const CampSessionsList = React.lazy(() =>
  import("pages/admin/camps/CampSessionList")
);
const CampSession = React.lazy(() => import("pages/admin/camps/CampSession"));

const Assessment = React.lazy(() => import("component/Assessment"));

export default [
  { path: "/form", component: Home },
  {
    path: "/facilitator-self-onboarding/:id",
    component: Home,
  },
  { path: "/dashboard", component: Dashboard },
  { path: "/beneficiary/edit/:id/basic-info", component: basicDetails },
  {
    path: "/beneficiary/edit/:id/contact-info",
    component: contactDetailsEdit,
  },
  {
    path: "/beneficiary/edit/:id/address",
    component: addressEdit,
  },
  {
    path: "/beneficiary/edit/:id/personal-details",
    component: personaldetails,
  },

  {
    path: "/beneficiary/edit/:id/family-details",
    component: familydetails,
  },

  {
    path: "/beneficiary/edit/:id/upload-photo",
    component: uploadphoto,
  },

  { path: "/beneficiary/edit/:id/education", component: educationDetails },
  {
    path: "/beneficiary/edit/:id/future-education",
    component: futureStudy,
  },
  {
    path: "/beneficiary/edit/:id/otherdetails",
    component: otherdetails,
  },
  {
    path: "/beneficiary/edit/:id/enrollment-details",
    component: EnrollmentForm,
  },
  {
    path: "/beneficiary/edit/:id/reference-details",
    component: referencedetails,
  },
  //add a new route /ag/:ID(param), component:basic details
  { path: "/beneficiary", component: Agform },
  { path: "/beneficiary/:id/2", component: AgformUpdate },
  { path: "/beneficiary/:id/3", component: Agadhaar },
  { path: "/beneficiary/:id/4", component: Agduplicate },
  { path: "/AgSuccess", component: Success },
  { path: "/learnerProfile", component: LearnerProfile },
  { path: "/beneficiary/:id/docschecklist", component: Docschecklist },
  { path: "/beneficiary/profile/:id", component: BenificiaryProfileView },
  { path: "/beneficiary/:id", component: BenificiaryProfileView },
  {
    path: "/beneficiary/list",
    component: BenificiaryListView,
  },
  { path: "/table", component: CountScreenView },

  {
    path: "/aadhaar-kyc/:id",
    component: AdharKyc,
  },
  {
    path: "/aadhaar-kyc/:id/:type",
    component: AdharKyc,
  },
  {
    path: "/beneficiary/:id/basicdetails",
    component: BenificiaryBasicDetails,
  },
  {
    path: "/beneficiary/:id/educationdetails",
    component: BenificiaryEducation,
  },
  {
    path: "/beneficiary/:id/benificiaryJourney",
    component: BenificiaryJourney,
  },
  {
    path: "/beneficiary/:id/enrollmentdetails",
    component: BenificiaryEnrollment,
  },
  {
    path: "/beneficiary/:id/aadhaardetails",
    component: BenificiaryAadhaarDetails,
  },
  {
    path: "/beneficiary/:id/addressdetails",
    component: BenificiaryAddress,
  },
  {
    path: "/beneficiary/:id/upload/:photoNo",
    component: BenificiaryProfilePhoto,
  },
  {
    path: "/beneficiary/:id/pcrdetails",
    component: PcrDetails,
  },
  {
    path: "/beneficiary/:id/pcrview",
    component: PcrView,
  },
  { path: "/profile", component: Profile },
  { path: "/certificate", component: Certificate },
  { path: "/profile/edit/array-form/:type", component: ArrayForm },
  { path: "/profile/edit/:step", component: EditForm },
  {
    path: "/profile/:id/aadhaardetails",
    component: AadhaarDetails,
  },
  { path: "/profile/edit/:step/:photoNo", component: EditForm },
  {
    path: "/facilitatorbasicdetail",
    component: FacilitatorBasicDetails,
  },
  {
    path: "/facilitatorqualification",
    component: FacilitatorQualification,
  },
  {
    path: "/camps",
    component: CampDashboard,
  },

  {
    path: "/camps/:id",
    component: CampRegistration,
  },
  {
    path: "/camps/:id/:step",
    component: CampForm,
  },
  {
    path: "/camps/new/learners",
    component: CampLeanerList,
  },
  {
    path: "/file/:id/view",
    component: FileView,
  },
  {
    path: "/community-references",
    component: CommunityView,
  },
  {
    path: "/camps/:id/settings",
    component: CampSettings,
  },
  { path: "/camps/:id/Campexecution", component: CampExecution },
  { path: "/camps/:id/Campexecution/:step", component: CampExecution },

  { path: "/camps/:id/campotherplans", component: CampOtherPlans },
  {
    path: "/camps/:id/kit_material_details",
    component: CampKitMaterialDetails,
  },
  { path: "/camps/:id/sessionslist", component: CampSessionsList },
  { path: "/camps/:id/sessionslist/:sessionId", component: CampSession },
  {
    path: "/assessment/:context/:context_id/:do_id",
    component: Assessment,
  },
  { path: "*", component: Dashboard },
];
