export default {
  type: "step",
  properties: {
    camp_location: {
      title: "CAMP_LOCATION",
      step_name: "CAMP_LOCATION",
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
      step_name: "PROPERTY_DETAILS",
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
      step_name: "FACILITIES",
      type: "object",
      required: ["facilities"],
      properties: {
        facilities: {
          label: "FACILITIES_AT_CAMP",
          type: "array",
          grid: 1,
          format: "MultiCheck",
          uniqueItems: true,
        },
      },
    },
    kit: {
      step_name: "KIT",
      type: "object",
      required: [
        "kit_received",
        "kit_sufficient",
        "kit_suggestion",
        "kit_rating",
      ],
      properties: {
        kit_received: {
          label: "DID_YOU_RECEIVE_A_KIT",
          type: "string",
          format: "radio",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        kit_sufficient: {
          label: "DID_YOU_THINK_THE_KIT_WAS_SUFFICIENT",
          type: "string",
          grid: 2,
          format: "radio",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        kit_suggestion: {
          label: "KIT_SUGGESTION",
          type: "string",
          grid: 2,
          format: "textarea",
        },
        kit_rating: {
          label: "RATE_KIT",
          type: ["string", "number"],
          format: "StarRating",
          totalStars: 5,
          ratingLabels: ["Poor", "Not Bad", "Average", "Good", "Amazing"],
        },
      },
    },
    photos: {
      step_name: "photos",
      type: "object",
      required: ["building_view", "classroom_view", "other_view"],
      properties: {
        building_view: {
          label: "BUILDING_VIEW",
          uploadTitle: "ADD_PHOTOS",
          type: ["string", "number"],
          document_type: "camp_photos",
          format: "FileUpload",
        },
        classroom_view: {
          label: "CLASSROOM_VIEW",
          uploadTitle: "ADD_PHOTOS",
          type: ["string", "number"],
          format: "FileUpload",
        },
        other_view: {
          label: "OTHER",
          uploadTitle: "ADD_PHOTOS",
          type: ["string", "number"],
          format: "FileUpload",
        },
      },
    },
    permission_documents: {
      step_name: "PERMISSION_DOCUMENTS",
      type: "object",
      required: ["permission_documents"],
      properties: {
        permission_documents: {
          label: "CAMP_PERMISSION",
          uploadTitle: "ADD_PHOTOS",
          type: ["string", "number"],
          format: "FileUpload",
        },
      },
    },
    parents_and_learners_consent: {
      step_name: "LEARNER_CONSENT_FORM",
      type: "object",
    },
  },
};
