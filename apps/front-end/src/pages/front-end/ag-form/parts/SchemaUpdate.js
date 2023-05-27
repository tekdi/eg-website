export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      // title: "Contact Information",
      // description: "PLEASE_WHATSAPP_NUMBER",
      type: "object",
      required: ["device_ownership"],
      properties: {
        device_ownership: {
          type: "string",
          label: "OWNERSHIP",
          format: "RadioBtn",
          enumNames: ["Self", "Family Member", "Neighbour", "Other"],
          enum: ["self", "family_member", "neighbour", "other"],
        },
        device_type: {
          type: "string",
          label: "TYPE_OF_MOBILE_PHONE",
          format: "CustomR",
          enumNames: ["Smartphone", "Basic"],
          enum: ["smartphone", "basic"],
        },
      },
    },
    2: {
      title: "Complete Address",
      type: "object",
      // required: ["state", "district", "block", "village"],
      properties: {
        state: {
          type: "string",
          title: "STATE",
          format: "select",
        },
        district: {
          label: "DISTRICT",
          type: "string",
          format: "select",
        },
        block: {
          label: "BLOCK",
          type: "string",
          format: "select",
        },
        village: {
          label: "VILLAGE_WARD",
          type: "string",
          format: "select",
        },
        grampanchayat: {
          title: "GRAMPANCHAYAT",
          type: "string",
        },
      },
    },

    3: {
      title: "Personal Details",
      type: "object",
      //required: ["marital_status", "social_category"],
      properties: {
        marital_status: {
          label: "MARITAL_STATUS",
          type: "string",
          format: "CustomR",
          enumNames: [
            "Married",
            "Unmarried",
            "Single (Divorced, widow, separated, etc.)",
          ],
          enum: ["married", "unmarried", "single"],
        },
        social_category: {
          label: "SOCIAL_CATEGORY",
          type: "string",
          format: "CustomR",

          enumNames: ["General", "S.C.", "S.T.", "O.B.C.", "Other"],
          enum: ["general", "sc", "st", "obc", "other"],
        },
      },
    },

    4: {
      title: "Education Details",
      type: "object",
      required: [],
      properties: {
        previous_school_type: {
          label: "TYPE_OF_STUDENT",
          type: "string",
          format: "select",
        },
        last_standard_of_education_year: {
          label: "LAST_YEAR_OF_EDUCATION",
          type: "string",
          format: "select",
        },
        last_standard_of_education: {
          label: "LAST_STANDARD_OF_EDUCATION",
          type: "string",
          format: "select",
        },
        reason_of_leaving_education: {
          label: "REASON_FOR_LEAVING_EDUCATION",
          type: "string",
          format: "select",
        },
      },
    },
  },
};
