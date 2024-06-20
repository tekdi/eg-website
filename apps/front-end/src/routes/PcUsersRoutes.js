import React, { lazy } from "react";

// PC Users Routes

const PcDashboard = lazy(() => import("pages/PCusers/PcDashboard"));
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

// PC users Routes

export default [
  {
    path: "/pcUserDashboard",
    component: PcDashboard,
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
  { path: "/", component: PcDashboard },
  { path: "*", component: PcDashboard },
];
