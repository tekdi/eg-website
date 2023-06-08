export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "REFERENCE_DETAILS",
      type: "object",
      // required: ["first_name"],
      properties: {
        referencefullname: {
          title: "REFERENCE_FULL_NAME",
          type: "object",
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
