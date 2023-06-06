export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "PERSONAL_DETAILS",
      type: "object",
      //required: ["maritalstatus"],
      properties: {
        marital_status: {
          label: "MARITAL_STATUS",
          type: "string",
          format: "CustomR",
          enumNames: ["Married", "Single", "Divorced", "Seperated", "Other"],
          enum: ["married", "single", "divorced", "seperated", "other"],
        },
        social_category: {
          label: "SOCIAL_CATEGORY",
          type: "string",
          format: "CustomR",
          enumNames: ["Open ", "S.C.", "S.T.", "O.B.C.", "Other"],
          enum: ["open", "sc", "st", "obc", "other"],
        },
      },
    },
  },
};
