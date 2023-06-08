export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "FULL_NAME",
      type: "object",
      required: ["first_name", "last_name", "dob"],
      properties: {
        first_name: {
          type: "string",
          title: "FIRST_NAME",
        },
        middle_name: {
          type: "string",
          title: "MIDDLE_NAME",
        },
        last_name: {
          type: "string",
          title: "LAST_NAME",
        },
        dob: {
          type: "string",
          format: "date",
          title: "DOB",
        },
        edit_page_type: {
          type: "string",
          default: "edit_basic",
          format: "hidden",
        },
      },
    },
  },
};
