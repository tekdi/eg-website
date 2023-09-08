export default {
  type: "step",
  properties: {
    camp_location: {
      title: "CAMP_LOCATION",
      step_name: "camp_location",
      type: "object",
      required: ["state", "district", "block", "village", "grampanchayat"],
      properties: {
        lat: {
          type: ["number", "string"],
          label: "LATITUDE",
          format: "readOnly",
        },
        long: {
          type: ["number", "string"],
          label: "LONGITUDE",
          format: "readOnly",
        },
        address: {
          title: "STREET_ADDRESS",
          type: ["string", "null"],
        },
        state: {
          title: "STATE",
          type: "string",
          format: "select",
        },
        district: {
          title: "DISTRICT",
          type: "string",
          format: "select",
        },
        block: {
          title: "BLOCK",
          type: "string",
          format: "select",
        },
        village: {
          title: "VILLAGE_WARD",
          type: "string",
          format: "select",
        },
        grampanchayat: {
          title: "GRAMPANCHAYAT",
          type: "string",
        },

        edit_page_type: {
          type: "string",
          format: "hidden",
          default: "edit_address",
        },
      },
    },
    property_details: {
      step_name: "property_details",
      title: "PROPERTY_TYPE",
      type: "object",
      required: ["property_type", "OWNER_OF_THE_PROPERTY"],
      properties: {
        property_type: {
          title: "PROPERTY_TYPE",
          type: "string",
          format: "select",
        },
        OWNER_OF_THE_PROPERTY: {
          label: "OWNER_OF_THE_PROPERTY",
          type: "object",
          required: ["first_name", "mobile"],
          properties: {
            first_name: {
              type: "string",
              title: "FIRST_NAME",
              regex: /^[a-zA-Z]+$/,
            },
            middle_name: {
              type: ["string", "null"],
              title: "MIDDLE_NAME",
              regex: /^[a-zA-Z]+$/,
            },
            last_name: {
              type: ["string", "null"],
              title: "LAST_NAME",
              regex: /^[a-zA-Z]+$/,
            },
            mobile: {
              type: "number",
              title: "MOBILE_NUMBER",
              format: "MobileNumber",
            },
          },
        },
      },
    },
    facilities: {
      step_name: "Facilities",
      title: "FACILITIES_AT_CAMP",
      type: "object",
      required: ["state", "district", "block", "village"],
      properties: {
        learning_motivation: {
          minItems: 1,
          maxItems: 3,
          label: "WHY_DOES_THE_LEARNER_WANT_TO_COMPLETE_10TH_GRADE",
          type: "array",
          grid: 1,
          format: "MultiCheck",
          uniqueItems: true,
        },
        type_of_support_needed: {
          minItems: 1,
          maxItems: 3,
          label: "WHAT_SUPPORT_IS_THE_LEARNER_SEEKING_FROM_PRAGATI",
          grid: 1,
          type: "array",
          format: "MultiCheck",
          uniqueItems: true,
        },
      },
    },
    kit: {
      step_name: "KIT",
      type: "object",
      required: ["gender", "marital_status", "social_category"],
      properties: {
        gender: {
          label: "DID_YOU_RECEIVE_A_KIT",
          type: "string",
          format: "radio",
          enumNames: ["YES", "NO"],
          enum: ["Yes", "no"],
        },
        marital_status: {
          label: "MARITAL_STATUS",
          type: "string",
          format: "CustomR",
          grid: 2,
        },
        social_category: {
          label: "SOCIAL_CATEGORY",
          type: "string",
          format: "CustomR",
          grid: 2,
        },
      },
    },
  },
};
