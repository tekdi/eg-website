export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "PERSONAL_DETAILS",
      type: "object",
      properties: {
        marital_status: {
          title: "MARITAL_STATUS",
          description: "MARITAL_STATUS",
          type: "string",
          format: "RadioBtn",
        },
        social_category: {
          title: "SOCIAL_CATEGORY",
          description: "SOCIAL_CATEGORY",
          type: "string",
          format: "RadioBtn",
        },
      },
    },
  },
};
