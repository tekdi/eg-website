import React, { lazy } from "react";

// PC Users Routes

const PcDashboard = lazy(() => import("pages/PCusers/PcDashboard"));
const DailyActivitiesList = lazy(
  () => import("pages/PCusers/DailyActivities/List"),
);
const CategoriesList = lazy(
  () => import("pages/PCusers/DailyActivities/CategoriesList"),
);
const CreateUpdateActivities = lazy(
  () => import("pages/PCusers/DailyActivities/Form"),
);
const SelectVillage = lazy(
  () => import("pages/PCusers/DailyActivities/SelectVillage"),
);
const DailyActivitiesView = lazy(
  () => import("pages/PCusers/DailyActivities/View"),
);
const CampList = lazy(() => import("pages/PCusers/camps/CampList"));
const CampProfileView = lazy(
  () => import("pages/PCusers/camps/CampProfileView"),
);
const CampLearnerList = lazy(
  () => import("pages/PCusers/camps/CampLearnerList"),
);
const CampForm = lazy(() => import("pages/PCusers/camps/CampForm/Form"));
const PcProfileDetails = lazy(() => import("pages/PCusers/Profile/Details"));
const EditProfile = lazy(() => import("pages/PCusers/Profile/EditProfile"));
const PrerakList = lazy(() => import("pages/PCusers/Prerak/PrerakList"));

const PrerakProfileView = lazy(
  () => import("pages/PCusers/Prerak/PrerakProfileView"),
);
const PrerakProfile = lazy(() => import("pages/PCusers/Prerak/PrerakProfile"));
const LearnerList = lazy(() => import("pages/PCusers/Learner/List"));
const LearnerProfileView = lazy(
  () => import("pages/PCusers/Learner/LearnerProfileView"),
);
const LearnerListView = lazy(
  () => import("pages/PCusers/Learner/LearnerListView"),
);
const LearnerBasicDetails = lazy(
  () => import("pages/PCusers/Learner/LearnerBasicDetails"),
);
const LearnerDocumentDetails = lazy(
  () => import("pages/PCusers/Learner/LearnerDocumentDetails"),
);
const LearnerAddAddress = lazy(
  () => import("pages/PCusers/Learner/LearnerAddAddress"),
);
const LearnerEducationDetails = lazy(
  () => import("pages/PCusers/Learner/LearnerEducationDetails"),
);
const LearnerEnrollMentDetails = lazy(
  () => import("pages/PCusers/Learner/LearnerEnrollMentDetails"),
);
const LearnerJourneyDetails = lazy(
  () => import("pages/PCusers/Learner/LearnerJourneyDetails"),
);
const PcProfilePhoto = lazy(
  () => import("pages/PCusers/Profile/PcProfilePhoto"),
);

// PC users Routes

export default [
  {
    path: "/select-village",
    component: SelectVillage,
  },
  {
    path: "/daily-activities/categories",
    component: CategoriesList,
  },
  {
    path: "/daily-activities/:category/list",
    component: DailyActivitiesList,
  },
  {
    path: "/daily-activities/:category/:activity/create",
    component: CreateUpdateActivities,
  },
  {
    path: "/daily-activities/:category/:activity/:id/edit",
    component: CreateUpdateActivities,
  },
  {
    path: "/daily-activities/:category/:activity/view",
    component: DailyActivitiesView,
  },
  {
    path: "/camps",
    component: CampList,
  },
  {
    path: "/camps/CampProfileView/:id",
    component: CampProfileView,
  },
  {
    path: "/camps/CampLearnerList/:id",
    component: CampLearnerList,
  },
  {
    path: "/camps/CampProfileView/:id/:step",
    component: CampForm,
  },
  {
    path: "/profile",
    component: PcProfileDetails,
  },
  {
    path: "/profile/:id/edit/:type",
    component: EditProfile,
  },
  {
    path: "/pcUserDashboard",
    component: PcDashboard,
  },
  {
    path: "/prerak/prerakList",
    component: PrerakList,
  },
  {
    path: "/prerak/prerakProfileView/:id",
    component: PrerakProfileView,
  },
  {
    path: "/prerak/prerakProfileView/:id/:type",
    component: PrerakProfile,
  },
  {
    path: "/learners",
    component: LearnerList,
  },
  {
    path: "/learners/list-view",
    component: LearnerListView,
  },
  {
    path: "/learners/list-view/:id",
    component: LearnerProfileView,
  },
  {
    path: "/learners/list-view/:id/learnerBasicDetails",
    component: LearnerBasicDetails,
  },
  {
    path: "/learners/list-view/:id/learnerAddAddress",
    component: LearnerAddAddress,
  },
  {
    path: "/learners/list-view/:id/learnerDocumentDetails",
    component: LearnerDocumentDetails,
  },
  {
    path: "/learners/list-view/:id/learnerEducationDetails",
    component: LearnerEducationDetails,
  },
  {
    path: "/learners/list-view/:id/learnerEnrollMentDetails",
    component: LearnerEnrollMentDetails,
  },
  {
    path: "/learners/list-view/:id/learnerJourneyDetails",
    component: LearnerJourneyDetails,
  },
  {
    path: "/profile/:id/upload/1",
    component: PcProfilePhoto,
  },
  { path: "/", component: PcDashboard },
  { path: "*", component: PcDashboard },
];
