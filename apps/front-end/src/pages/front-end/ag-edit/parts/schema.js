export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "FULL_NAME",
      type: "object",
      required: ["first_name"],
      properties: {
        first_name: {
          type: "string",
          title: "FIRST_NAME",
        },
        middle_name: {
          type: ["string", "null"],
          title: "MIDDLE_NAME",
        },
        last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
        },
        dob: {
          type: ["string", "null"],
          format: "date",
          title: "DATE_OF_BIRTH_AS_PER_AADHAAR",
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
