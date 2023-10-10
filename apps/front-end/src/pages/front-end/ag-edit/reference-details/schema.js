export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "REFERENCE_DETAILS",
      type: "object",
      properties: {
        referencefullname: {
          title: "REFERENCE_FULL_NAME",
          required: ["first_name", "contact_number", "relation"],
          type: "object",
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
            relation: {
              type: "string",
              title: "RELATION",
            },
            contact_number: {
              type: "number",
              title: "MOBILE_NUMBER",
            },
            edit_page_type: {
              type: "string",
              default: "edit_reference",
              format: "hidden",
            },
          },
        },
      },
    },
  },
};
