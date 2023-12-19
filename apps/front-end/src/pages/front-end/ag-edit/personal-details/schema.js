export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      // title: "PERSONAL_DETAILS",
      type: "object",
      properties: {
        marital_status: {
          label: "MARITAL_STATUS",
          type: "string",
          format: "CustomR",
        },
        social_category: {
          label: "SOCIAL_CATEGORY",
          type: "string",
          format: "CustomR",
        },
      },
    },
  },
};
