export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      title: "EDUCATION_DETAILS",
      type: "object",
      required: [
        "type_of_learner",
        "last_standard_of_education",
        "last_standard_of_education_year",
        "reason_of_leaving_education",
        "previous_school_type",
        "learning_level",
        "education_10th_exam_year",
        "education_10th_date",
      ],
      properties: {
        type_of_learner: {
          type: "string",
          title: "TYPE_OF_LEARNER",
          description: "TYPE_OF_LEARNER",
          format: "select",
        },
        alreadyOpenLabel: {
          type: "string",
        },
        last_standard_of_education: {
          type: "string",
          title: "LAST_STANDARD_OF_EDUCATION",
          format: "select",
        },
        last_standard_of_education_year: {
          type: "string",
          title: "LAST_YEAR_OF_EDUCATION",
          format: "select",
        },
        previous_school_type: {
          type: "string",
          title: "PREVIOUS_SCHOOL_TYPE",
          format: "select",
        },
        reason_of_leaving_education: {
          type: "string",
          title: "REASON",
          format: "select",
        },

        education_10th_date: {
          type: "string",
          format: "date",
          label: "REGISTERED_IN_TENTH_DATE",
        },
        education_10th_exam_year: {
          type: "string",
          format: "select",
          title: "IN_WHICH_YEAR_DID_I_GIVE_THE_MAINS_EXAM",
        },

        learning_level: {
          label: "WHAT_IS_THE_LEARNING_LEVEL_OF_THE_LEARNER",
          type: "string",
          format: "RadioBtn",
        },

        edit_page_type: {
          type: "string",
          default: "edit_education",
          format: "hidden",
        },
      },
    },
  },
};
