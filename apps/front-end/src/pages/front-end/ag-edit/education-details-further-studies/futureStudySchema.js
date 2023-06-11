export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      title: "FURTHER_STUDIES",
      type: "object",
      required: ["career_aspiration"],
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

        edit_page_type: {
          type: "string",
          default: "edit_further_studies",
          format: "hidden",
        },
      },
    },
  },
};
