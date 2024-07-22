export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      title: "LEARNER_ASPIRATIONS",
      type: "object",
      required: ["career_aspiration", "aspiration_mapping", "parent_support"],
      properties: {
        career_aspiration: {
          minItems: 1,
          type: "string",
          label: "CAREER_ASPIRATION",
          grid: 1,
          format: "RadioBtn",
        },

        career_aspiration_details: {
          type: ["string", "null"],
          title: "TELL_IN_DETAIL",
        },

        parent_support: {
          label: "WILL_YOUR_PARENTS_SUPPORT_YOUR_STUDIES",
          type: "string",
          grid: 1,
          format: "RadioBtn",
        },

        aspiration_mapping: {
          type: "object",
          required: ["learning_motivation", "type_of_support_needed"],
          properties: {
            learning_motivation: {
              minItems: 1,
              maxItems: 3,
              label: "WHY_DOES_THE_LEARNER_WANT_TO_COMPLETE_10TH_GRADE",
              type: "array",
              grid: 1,
              format: "MultiCheck",
              uniqueItems: true,
            },

            type_of_support_needed: {
              minItems: 1,
              maxItems: 3,
              label: "WHAT_SUPPORT_IS_THE_LEARNER_SEEKING_FROM_PRAGATI",
              grid: 1,
              type: "array",
              format: "MultiCheck",
              uniqueItems: true,
            },
          },
        },

        edit_page_type: {
          type: "string",
          default: "edit_further_studies",
          format: "hidden",
        },
      },
    },
  },
};
