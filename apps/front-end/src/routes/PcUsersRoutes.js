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
const PcProfile = lazy(() => import("pages/PCusers/Profile/PcProfile"));
const PcProfileDetails = lazy(() =>
  import("pages/PCusers/Profile/PcProfileDetails")
);
const EditProfile = lazy(() => import("pages/PCusers/Profile/EditProfile"));
const PrerakList = lazy(() => import("pages/PCusers/Prerak/PrerakList"));
const LearnerList = lazy(() => import("pages/PCusers/Learner/LearnerList"));

const LearnerProfileView = lazy(() =>
  import("pages/PCusers/Learner/LearnerProfileView")
);
const LearnerListView = lazy(() =>
  import("pages/PCusers/Learner/LearnerListView")
);
const PrerakProfileView = lazy(() =>
  import("pages/PCusers/Prerak/PrerakProfileView")
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
    path: "/camps/:id",
    component: CampProfileView,
  },
  {
    path: "/camps/:id/learnerlist",
    component: CampLearnerList,
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
    path: "/learner/learnerList",
    component: LearnerList,
  },
  {
    path: "/learner/learnerListView",
    component: LearnerListView,
  },
  {
    path: "/learner/learnerProfileView",
    component: LearnerProfileView,
  },
  {
    path: "/prerak/prerakProfileView/:id",
    component: PrerakProfileView,
  },
  { path: "/", component: PcDashboard },
  { path: "*", component: PcDashboard },
];
