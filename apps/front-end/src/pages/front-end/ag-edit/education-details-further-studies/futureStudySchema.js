export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      // title: "FURTHER_STUDIES",
      type: "object",
      required: ["career_aspiration", "aspiration_mapping"],
      properties: {
        career_aspiration: {
          type: "string",
          label: "CAREER_ASPIRATION",
          format: "select",
        },

        career_aspiration_details: {
          type: "string",
          title: "TELL_IN_DETAIL",
        },

        aspiration_mapping: {
          type: "object",
          label: "ASPIRATION_MAPPING",
          required: ["learning_motivation", "type_of_support_needed"],
          properties: {
            learning_motivation: {
              title: "WHY_DOES_THE_LEARNER_WANT_TO_COMPLETE_10TH_GRADE",
              type: "string",
              format: "select",
            },
            type_of_support_needed: {
              title: "WHAT_SUPPORT_IS_THE_LEARNER_SEEKING_FROM_PRAGATI",
              type: "string",
              format: "select",
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
