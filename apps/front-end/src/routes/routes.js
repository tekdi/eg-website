import Dashboard from "pages/front-end/Dashboard";
import Home from "pages/front-end/Home";
import basicDetails from "../pages/front-end/ag-edit/basicDetails";
import educationDetails from "../pages/front-end/ag-edit/education-details-further-studies/educationDetails";
import contactDetailsEdit from "../pages/front-end/ag-edit/contact-details/contactDetailsEdit";
import addressEdit from "../pages/front-end/ag-edit/address/addressEdit";
import personaldetails from "../pages/front-end/ag-edit/personal-details/personaldetails";
import familydetails from "../pages/front-end/ag-edit/family-details/familydetails";
import uploadphoto from "../pages/front-end/ag-edit/upload-photo/uploadphoto";
import futureStudy from "../pages/front-end/ag-edit/education-details-further-studies/futureStudy";
import subjectDetails from "../pages/front-end/ag-edit/choose-subjects/subjectDetails";
import Agduplicate from "pages/front-end/ag-form/Agduplicate";
import Agform from "pages/front-end/ag-form/Agform";
import Docschecklist from "pages/front-end/ag-form/Docschecklist";
import LearnerProfile from "pages/front-end/ag-form/LearnerProfile";
import BenificiaryListView from "pages/front-end/BenificiaryListView";
import BenificiaryProfileView from "../pages/front-end/BenificiaryProfileView";
import CountScreenView from "../pages/front-end/CountScreenView";
import AgformUpdate from "pages/front-end/ag-form/Agformupdate";
import Agadhaar from "pages/front-end/ag-form/Agadhaar";
import Success from "pages/front-end/Success";
import Profile from "pages/front-end/PrerakProfileDetailsView";
import AdharKyc from "pages/front-end/AadhaarKyc/AadhaarKyc";
import BenificiaryBasicDetails from "pages/front-end/BenificiaryBasicDetails";
import BenificiaryEducation from "pages/front-end/BenificiaryEducation";
import BenificiaryEnrollment from "pages/front-end/BenificiaryEnrollment";
import FacilitatorBasicDetails from "pages/front-end/FacilitatorBasicDetails";
import FacilitatorQualification from "pages/front-end/FacilitatorQualification";
import FacilitatorExperience from "pages/front-end/FacilitatorExperience";

export default [
  { path: "/form", component: Home },
  {
    path: "/facilitator-self-onboarding/:id",
    component: Home,
  },
  { path: "/dashboard", component: Dashboard },
  { path: "/beneficiary/edit/:id", component: basicDetails },
  {
    path: "/beneficiary/edit/contact-details/:id",
    component: contactDetailsEdit,
  },
  {
    path: "/beneficiary/edit/address/:id",
    component: addressEdit,
  },
  {
    path: "/beneficiary/edit/personal-details/:id",
    component: personaldetails,
  },

  {
    path: "/beneficiary/edit/family-details/:id",
    component: familydetails,
  },

  {
    path: "/beneficiary/edit/upload-photo/:id",
    component: uploadphoto,
  },

  { path: "/beneficiary/edit/education/:id", component: educationDetails },
  {
    path: "/beneficiary/edit/future-education/:id",
    component: futureStudy,
  },

  {
    path: "/beneficiary/edit/enrollment-details/:id",
    component: subjectDetails,
  },
  //add a new route /ag/:ID(param), component:basic details
  { path: "/beneficiary", component: Agform },
  { path: "/beneficiary/2", component: AgformUpdate },
  { path: "/beneficiary/3", component: Agadhaar },
  { path: "/beneficiary/4", component: Agduplicate },
  { path: "/AgSuccess", component: Success },
  { path: "/learnerProfile", component: LearnerProfile },
  { path: "/beneficiary/:id/docschecklist", component: Docschecklist },
  { path: "/profile", component: Profile },
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
    path: "/beneficiary/:id/basicdetails",
    component: BenificiaryBasicDetails,
  },
  {
    path: "/beneficiary/:id/educationdetails",
    component: BenificiaryEducation,
  },
  {
    path: "/beneficiary/:id/enrollmentdetails",
    component: BenificiaryEnrollment,
  },
  {
    path: "/facilitatorbasicdetail",
    component: FacilitatorBasicDetails,
  },
  {
    path: "/facilitatorqualification",
    component: FacilitatorQualification,
  },
  {
    path: "/facilitator-experience/:type",
    component: FacilitatorExperience,
  },
  { path: "*", component: Dashboard },
];
