export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "FAMILY_DETAILS",
      type: "object",
      properties: {
        father_details: {
          title: "FATHER_FULL_NAME",
          description: "FATHER_FULL_NAME",
          required: ["father_first_name"],
          type: "object",
          properties: {
            father_first_name: {
              type: "string",
              title: "FIRST_NAME",
              regex: /^[a-zA-Z]+$/,
            },
            father_middle_name: {
              type: ["string", "null"],
              title: "MIDDLE_NAME",
              regex: /^[a-zA-Z]+$/,
            },
            father_last_name: {
              type: ["string", "null"],
              title: "LAST_NAME",
              regex: /^[a-zA-Z]+$/,
            },
          },
        },
        mother_details: {
          title: "MOTHER_FULL_NAME",
          description: "MOTHER_FULL_NAME",
          required: ["mother_first_name"],
          type: "object",
          properties: {
            mother_first_name: {
              type: "string",
              title: "FIRST_NAME",
              regex: /^[a-zA-Z]+$/,
            },
            mother_middle_name: {
              type: ["string", "null"],
              title: "MIDDLE_NAME",
              regex: /^[a-zA-Z]+$/,
            },
            mother_last_name: {
              type: ["string", "null"],
              title: "LAST_NAME",
              regex: /^[a-zA-Z]+$/,
            },
          },
        },
      },
    },
  },
};
