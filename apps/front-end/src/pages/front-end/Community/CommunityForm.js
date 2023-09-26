export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "Community Details",
      type: "object",
      properties: {
        referencefullname: {
          title: "FULL_NAME",
          required: ["first_name", "contact_number", "relation"],
          type: "object",
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
            relation: {
              type: "string",
              title: "DESIGNATION",
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
