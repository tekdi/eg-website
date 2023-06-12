export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      title: "EDUCATIONAL_DETAILS",
      type: "object",
      required: ["laststandard"],

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
        reason_of_leaving_education: {
          type: "string",
          title: "REASON_FOR_LEAVING_STUDIES",
        },
        edit_page_type: {
          type: "string",
          default: "add_education",
          format: "hidden",
        },
      },
    },
  },
};
