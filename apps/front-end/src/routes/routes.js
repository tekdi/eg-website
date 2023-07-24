import React from "react";
const Dashboard = React.lazy(() => import("pages/front-end/Dashboard"));
const Home = React.lazy(() => import("pages/front-end/Home"));
const basicDetails = React.lazy(() =>
  import("../pages/front-end/ag-edit/basicDetails")
);
const educationDetails = React.lazy(() =>
  import(
    "../pages/front-end/ag-edit/education-details-further-studies/educationDetails"
  )
);
const contactDetailsEdit = React.lazy(() =>
  import("../pages/front-end/ag-edit/contact-details/contactDetailsEdit")
);
const addressEdit = React.lazy(() =>
  import("../pages/front-end/ag-edit/address/addressEdit")
);
const personaldetails = React.lazy(() =>
  import("../pages/front-end/ag-edit/personal-details/personaldetails")
);
const referencedetails = React.lazy(() =>
  import("../pages/front-end/ag-edit/reference-details/referencedetails")
);
const familydetails = React.lazy(() =>
  import("../pages/front-end/ag-edit/family-details/familydetails")
);
const uploadphoto = React.lazy(() =>
  import("../pages/front-end/ag-edit/upload-photo/uploadphoto")
);
const futureStudy = React.lazy(() =>
  import(
    "../pages/front-end/ag-edit/education-details-further-studies/futureStudy"
  )
);
const otherdetails = React.lazy(() =>
  import("../pages/front-end/ag-edit/other-details/otherdetails")
);
const subjectDetails = React.lazy(() =>
  import("../pages/front-end/ag-edit/choose-subjects/subjectDetails")
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
  import("../pages/front-end/BenificiaryProfileView")
);
const CountScreenView = React.lazy(() =>
  import("../pages/front-end/CountScreenView")
);
const AgformUpdate = React.lazy(() =>
  import("pages/front-end/ag-form/Agformupdate")
);
const Agadhaar = React.lazy(() => import("pages/front-end/ag-form/Agadhaar"));
const Success = React.lazy(() => import("pages/front-end/Success"));
const Profile = React.lazy(() => import("pages/front-end/facilitator/Profile"));
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
  import("../pages/front-end/facilitator/edit/Form")
);
const ArrayForm = React.lazy(() =>
  import("../pages/front-end/facilitator/edit/ArrayForm")
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
const EnrollmentReceipt = React.lazy(() =>
  import("../pages/front-end/ag-edit/choose-subjects/ErollmentReceipt")
);
const AadhaarDetails = React.lazy(() =>
  import("pages/front-end/facilitator/AadhaarDetails")
);

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
    component: subjectDetails,
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
    path: "/beneficiary/:id/upload/:photoNo",
    component: BenificiaryProfilePhoto,
  },
  { path: "/profile", component: Profile },
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
  { path: "*", component: Dashboard },
  {
    path: "/beneficiary/edit/:id/enrollment-receipt",
    component: EnrollmentReceipt,
  },
];
