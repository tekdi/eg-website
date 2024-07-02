import React, { lazy } from "react";

// PC Users Routes

const PcDashboard = lazy(() => import("pages/PCusers/PcDashboard"));
const DailyActivitiesList = lazy(() =>
  import("pages/PCusers/DailyActivities/DailyActivitiesList")
);
const DailyActivities = lazy(() =>
  import("pages/PCusers/DailyActivities/DailyActivites")
);
const DailyActivitiesView = lazy(() =>
  import("pages/PCusers/DailyActivities/DailyActivitiesView")
);
const CampList = lazy(() => import("pages/PCusers/camps/CampList"));
const CampProfileView = lazy(() =>
  import("pages/PCusers/camps/CampProfileView")
);
const CampLearnerList = lazy(() =>
  import("pages/PCusers/camps/CampLearnerList")
);
const CampFacility = lazy(() => import("pages/PCusers/camps/CampFacility"));
const CampKitDetails = lazy(() => import("pages/PCusers/camps/CampKitDetails"));
const PcProfile = lazy(() => import("pages/PCusers/Profile/PcProfile"));
const PcProfileDetails = lazy(() =>
  import("pages/PCusers/Profile/PcProfileDetails")
);
const EditProfile = lazy(() => import("pages/PCusers/Profile/EditProfile"));
const PrerakList = lazy(() => import("pages/PCusers/Prerak/PrerakList"));

const PrerakProfileView = lazy(() =>
  import("pages/PCusers/Prerak/PrerakProfileView")
);
const LearnerList = lazy(() => import("pages/PCusers/Learner/LearnerList"));
const LearnerProfileView = lazy(() =>
  import("pages/PCusers/Learner/LearnerProfileView")
);
const LearnerListView = lazy(() =>
  import("pages/PCusers/Learner/LearnerListView")
);
const LearnerBasicDetails = lazy(() =>
  import("pages/PCusers/Learner/LearnerBasicDetails")
);
const LearnerDocumentDetails = lazy(() =>
  import("pages/PCusers/Learner/LearnerDocumentDetails")
);
const LearnerAddAddress = lazy(() =>
  import("pages/PCusers/Learner/LearnerAddAddress")
);
const LearnerEducationDetails = lazy(() =>
  import("pages/PCusers/Learner/LearnerEducationDetails")
);
const LearnerEnrollMentDetails = lazy(() =>
  import("pages/PCusers/Learner/LearnerEnrollMentDetails")
);
const LearnerPCRDetails = lazy(() =>
  import("pages/PCusers/Learner/LearnerPCRDetails")
);
const LearnerJourneyDetails = lazy(() =>
  import("pages/PCusers/Learner/LearnerJourneyDetails")
);
const PcProfilePhoto = lazy(() =>
  import("pages/PCusers/Profile/PcProfilePhoto")
);

// PC users Routes

export default [
  { path: "/", component: PcDashboard },
  { path: "*", component: PcDashboard },
  {
    path: "/Dashboard",
    component: PcDashboard,
  },
  {
    path: "/dailyactivities/list",
    component: DailyActivitiesList,
  },
  {
    path: "/dailyactivities/:activity/:step",
    component: DailyActivities,
  },
  {
    path: "/dailyactivities/:activity/view",
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
    path: "/camps/CampFacility/:id",
    component: CampFacility,
  },
  {
    path: "/camps/CampKitDetails/:id",
    component: CampKitDetails,
  },
  {
    path: "/profile",
    component: PcProfile,
  },
  {
    path: "/profile/:step",
    component: PcProfileDetails,
  },
  {
    path: "/profile/edit",
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
    path: "/learner/learnerList",
    component: LearnerList,
  },
  {
    path: "/learner/learnerListView",
    component: LearnerListView,
  },
  {
    path: "/learner/learnerListView/:id",
    component: LearnerProfileView,
  },
  {
    path: "/learner/learnerListView/:id/learnerBasicDetails",
    component: LearnerBasicDetails,
  },
  {
    path: "/learner/learnerListView/:id/learnerAddAddress",
    component: LearnerAddAddress,
  },
  {
    path: "/learner/learnerListView/:id/learnerDocumentDetails",
    component: LearnerDocumentDetails,
  },
  {
    path: "/learner/learnerListView/:id/learnerEducationDetails",
    component: LearnerEducationDetails,
  },
  {
    path: "/learner/learnerListView/:id/learnerEnrollMentDetails",
    component: LearnerEnrollMentDetails,
  },
  {
    path: "/learner/learnerListView/:id/learnerPCRDetails",
    component: LearnerPCRDetails,
  },
  {
    path: "/learner/learnerListView/:id/learnerJourneyDetails",
    component: LearnerJourneyDetails,
  },
  {
    path: "/profile/:id/upload/1",
    component: PcProfilePhoto,
  },

  { path: "/", component: PcDashboard },
  { path: "*", component: PcDashboard },
];
