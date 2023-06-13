export default {
  description: "IDENTIFY_BENEFICIARY",
  type: "step",
  properties: {
    1: {
      // title: "Contact Information",
      // description: "PLEASE_WHATSAPP_NUMBER",
      type: "object",
      required: ["device_ownership", "device_type"],
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
      required: ["state", "district", "block", "village"],
      properties: {
        lat: {
          type: "number",
          label: "LATITUDE",
          format: "readOnly",
        },
        long: {
          type: "number",
          label: "LONGITUDE",
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
      required: ["marital_status", "social_category"],
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
      required: [
        "type_of_learner",
        "last_standard_of_education_year",
        "last_standard_of_education",
        "reason_of_leaving_education",
      ],
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
        previous_school_type: {
          type: "string",
          label: "PREVIOUS_SCHOOL_TYPE",
          format: "select",
        },
        reason_of_leaving_education: {
          label: "SCHOOL_DROPOUT_REASON",
          type: "string",
          format: "select",
        },
        learning_level: {
          label: "WHAT_IS_THE_LEARNING_LEVEL_OF_THE_LEARNER",
          type: "string",
          format: "CustomR",
        },
      },
    },
    5: {
      type: "object",
      required: ["learning_motivation", "type_of_support_needed"],
      properties: {
        learning_motivation: {
          label: "WHY_DOES_THE_LEARNER_WANT_TO_COMPLETE_10TH_GRADE",
          type: "string",
          format: "select",
        },
        type_of_support_needed: {
          label: "WHAT_SUPPORT_IS_THE_LEARNER_SEEKING_FROM_PRAGATI",
          type: "string",
          format: "select",
        },
      },
    },
  },
};
