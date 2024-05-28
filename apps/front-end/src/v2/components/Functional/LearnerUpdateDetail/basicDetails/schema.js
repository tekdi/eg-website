export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "BASIC_DETAILS",
      description: "FULL_NAME",
      type: "object",
      required: ["first_name"],
      properties: {
        first_name: {
          type: "string",
          title: "FIRST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        middle_name: {
          type: ["string", "null"],
          title: "MIDDLE_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        dob: {
          type: ["string", "null"],
          format: "date",
          description: "DATE_OF_BIRTH",
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
