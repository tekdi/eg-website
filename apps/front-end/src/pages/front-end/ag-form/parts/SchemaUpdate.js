export default {
  description: "IDENTIFY_BENEFICIARY",
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
          label: "DEVICE_OWNERSHIP",
          format: "RadioBtn",
          enumNames: ["SELF", "FAMILY_MEMBER", "NEIGHBOUR", "OTHER"],
          enum: ["self", "family_member", "neighbour", "other"],
        },
        device_type: {
          type: "string",
          label: "TYPE_OF_MOBILE_PHONE",
          format: "CustomR",
          enumNames: ["SMARTPHONE", "BASIC"],
          enum: ["smartphone", "basic"],
        },
      },
    },
    2: {
      title: "COMPLETE_ADDRESS",
      type: "object",
      // required: ["state", "district", "block", "village"],
      properties: {
        lat: {
          type: "number",
          label: "Latitude",
          format: "readOnly",
        },
        long: {
          type: "number",
          label: "Latitude",
          format: "readOnly",
        },
        address: {
          title: "STREET_ADDRESS",
          type: "string",
        },
        state: {
          type: "string",
          label: "STATE",
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
      title: "PERSONAL_DETAILS",
      type: "object",
      //required: ["marital_status", "social_category"],
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

    4: {
      title: "EDUCATION_DETAILS",
      type: "object",
      required: [],
      properties: {
        type_of_learner: {
          label: "TYPE_OF_STUDENT",
          type: "string",
          format: "select",
        },
        last_standard_of_education_year: {
          label: "SCHOOL_DROPOUT_YEAR",
          type: "string",
          format: "select",
        },
        last_standard_of_education: {
          label: "SCHOOL_DROPOUT_CLASS",
          type: "string",
          format: "select",
        },
        reason_of_leaving_education: {
          label: "SCHOOL_DROPOUT_REASON",
          type: "string",
          format: "select",
        },
        // Why_does_AG_want_to_complete: {
        //   label: "Why does AG want to complete 10th grade?",
        //   type: "string",
        //   format: "select",
        // },
      },
    },
  },
};
