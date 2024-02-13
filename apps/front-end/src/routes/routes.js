import React, { lazy } from "react";
//v2 code
//online_facilitator_onboarding
const FacilitatorRegister = lazy(() =>
  import("v2/views/Facilitator/FacilitatorRegister/FacilitatorRegister")
);
const FacilitatorOnboarding = lazy(() =>
  import("v2/views/Facilitator/FacilitatorOnboarding/FacilitatorOnboarding")
);
//online_beneficiery_onboarding
const BeneficiaryRegister = lazy(() =>
  import("v2/views/Beneficiary/BeneficiaryRegister/BeneficiaryRegister")
);
const BeneficiaryOnboarding = lazy(() =>
  import("v2/views/Beneficiary/BeneficiaryOnboarding/BeneficiaryOnboarding")
);
const BeneficiaryUpdate = lazy(() =>
  import("v2/views/Beneficiary/BeneficiaryUpdate/BeneficiaryUpdate")
);
//end v2 code

const Dashboard = React.lazy(() => import("pages/front-end/Dashboard"));
//const Home = React.lazy(() => import("pages/front-end/Home"));
const Agduplicate = React.lazy(() =>
  import("pages/front-end/ag-form/Agduplicate")
);
//const Agform = React.lazy(() => import("pages/front-end/ag-form/Agform"));
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
//const Agadhaar = React.lazy(() => import("pages/front-end/ag-form/Agadhaar"));
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

const CampSessionList = React.lazy(() =>
  import("pages/admin/camps/CampSessionList")
);
const CampSession = React.lazy(() => import("pages/admin/camps/CampSession"));

const Assessment = React.lazy(() => import("component/Assessment"));

export default [
  //{ path: "/form", component: Home },
  //old facilitator registration
  /*{
    path: "/facilitator-self-onboarding",
    component: Home,
  },*/
  { path: "/dashboard", component: Dashboard },
  //add a new route /ag/:ID(param), component:basic details
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
  //old facilitator onboarding
  /*{ path: "/profile/edit/array-form/:type", component: ArrayForm },*/
  /*{ path: "/profile/edit/:step", component: EditForm },*/
  {
    path: "/profile/:id/aadhaardetails",
    component: AadhaarDetails,
  },
  //old facilitator onboarding
  /*{ path: "/profile/edit/:step/:photoNo", component: EditForm },*/
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
  { path: "/camps/:id/sessionslist", component: CampSessionList },
  // { path: "/camps/:id/sessionslist/:sessionId", component: CampSession },
  {
    path: "/assessment/:context/:context_id/:do_id",
    component: Assessment,
  },
  { path: "*", component: Dashboard },

  //v2 code
  //new facilitator registration
  {
    path: "/facilitator-self-onboarding",
    component: FacilitatorRegister,
  },
  //offline_facilitotor_Onboarding
  {
    path: "/profile/edit/:step",
    component: FacilitatorOnboarding,
  },
  { path: "/profile/edit/:step/:photoNo", component: FacilitatorOnboarding },
  //new beneficiary registration
  { path: "/beneficiary", component: BeneficiaryRegister },
  //new beneficiary onboarding
  { path: "/beneficiary/:id/:number", component: BeneficiaryOnboarding },
  //new beneficiary update
  { path: "/beneficiary/edit/:id/:type", component: BeneficiaryUpdate },
  //end v2 code
];
