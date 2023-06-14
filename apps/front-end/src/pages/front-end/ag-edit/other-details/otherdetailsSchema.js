export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      title: "OTHER_DETAILS",
      type: "object",
      required: ["learning_motivation", "type_of_support_needed"],

      properties: {
        learning_motivation: {
          label: "WHY_DOES_THE_LEARNER_WANT_TO_COMPLETE_10TH_GRADE",
          type: "string",
          format: "select",
        },
        type_of_support_needed: {
          label: "WHAT_SUPPORT_IS_THE_LEARNER_SEEKING_FROM_PRAGATI",
          type: "string",
          format: "select",
        },
        edit_page_type: {
          type: "string",
          default: "edit_other_details",
          format: "hidden",
        },
      },
    },
  },
};
