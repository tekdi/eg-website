export const schema1 = {
  type: "object",
  required: ["description", "hours", "minutes"],
  properties: {
    village: {
      label: "VILLAGE_WARD",
      type: "string",
      format: "select",
    },
    description: {
      label: "DESCRIPTION",
      type: ["string", "number"],
      grid: 2,
      format: "Textarea",
    },
    labelTime: {
      type: "string",
    },
    hours: {
      type: "string",
      label: "HOURS",
      format: "select",
    },
    minutes: {
      type: "string",
      label: "MINUTES",
      format: "select",
    },
  },
};

export const activities = [
  "ATTENDED_TRAINING",
  "PRAGATI_SABHA",
  "PROVIDE_TRAINING",
  "LEARNER_WORKSHOP",
  "LEARNER_IDENTIFICATION_SUPPORT",
  "LEARNER_DOCUMENTATION_SUPPORT",
  "LEARNER_OS_ENR_SUPPORT",
  "ATTEND_NODAL_MEETING",
  "CONDUCT_PRI_MEETING",
  "CAMP_EXECUTION_SUPPORT",
  "CAMP_VISIT_FOR_MONITORING_AND_HH_SUPPORT",
  "COLLECT_CASE_STUDY_FROM_FIELD",
];
