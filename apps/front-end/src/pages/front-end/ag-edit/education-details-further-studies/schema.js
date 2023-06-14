export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      title: "EDUCATIONAL_DETAILS",
      type: "object",
      required: [
        "type_of_learner",
        "last_standard_of_education",
        "last_standard_of_education_year",
        "reason_of_leaving_education",
      ],
      properties: {
        type_of_learner: {
          type: "string",
          label: "Type of Student",
        },
        last_standard_of_education: {
          type: "string",
          title: "LAST_STANDARD_OF_EDUCATION",
        },
        last_standard_of_education_year: {
          type: "string",
          title: "LAST_YEAR_OF_EDUCATION",
        },
        previous_school_type: {
          type: "string",
          title: "PREVIOUS_SCHOOL_TYPE",
        },
        reason_of_leaving_education: {
          type: "string",
          title: "REASON_FOR_LEAVING_STUDIES",
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
