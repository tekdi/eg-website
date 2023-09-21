export default {
  type: "step",
  properties: {
    camp_location: {
      step_name: "CAMP_LOCATION",
      type: "object",
      required: [
        "property_type",
        "state",
        "district",
        "block",
        "village",
        "grampanchayat",
      ],
      properties: {
        lat: {
          type: "string",
          title: "LATITUDE",
          format: "readOnly",
        },
        long: {
          type: "string",
          title: "LONGITUDE",
          format: "readOnly",
        },
        property_type: {
          title: "PROPERTY_TYPE",
          type: "string",
          format: "select",
        },
        street: {
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
          default: "edit_photo_details",
        },
      },
    },
    camp_venue_photos: {
      step_name: "CAMP_VENUE_PHOTOS",
      type: "object",
      required: ["property_photo_building", "property_photo_classroom"],
      properties: {
        property_photo_building: {
          label: "CAMP_FRONT_VIEW",
          uploadTitle: "ADD_PHOTOS",
          type: ["string", "number", "null"],
          document_type: "camp_photos",
          format: "FileUpload",
        },
        property_photo_classroom: {
          label: "STUDY_ROOM",
          uploadTitle: "ADD_PHOTOS",
          type: ["string", "number", "null"],
          format: "FileUpload",
        },
        property_photo_other: {
          label: "OTHER",
          uploadTitle: "ADD_PHOTOS",
          type: ["string", "number", "null"],
          format: "FileUpload",
        },
        edit_page_type: {
          type: "string",
          format: "hidden",
          default: "edit_property_facilities",
        },
      },
    },
    // property_details: {
    //   step_name: "PROPERTY_DETAILS",
    //   title: "PROPERTY_TYPE",
    //   type: "object",
    //   required: ["property_type", "OWNER_OF_THE_PROPERTY"],
    //   properties: {
    //     property_type: {
    //       title: "PROPERTY_TYPE",
    //       type: "string",
    //       format: "select",
    //     },
    //     OWNER_OF_THE_PROPERTY: {
    //       label: "OWNER_OF_THE_PROPERTY",
    //       type: "object",
    //       required: ["first_name", "mobile"],
    //       properties: {
    //         first_name: {
    //           type: "string",
    //           title: "FIRST_NAME",
    //           regex: /^[a-zA-Z]+$/,
    //         },
    //         middle_name: {
    //           type: ["string", "null"],
    //           title: "MIDDLE_NAME",
    //           regex: /^[a-zA-Z]+$/,
    //         },
    //         last_name: {
    //           type: ["string", "null"],
    //           title: "LAST_NAME",
    //           regex: /^[a-zA-Z]+$/,
    //         },
    //         mobile: {
    //           type: "number",
    //           title: "MOBILE_NUMBER",
    //           format: "MobileNumber",
    //         },
    //       },
    //     },
    //   },
    // },
    facilities: {
      step_name: "FACILITIES",
      type: "object",
      required: ["property_facilities"],
      properties: {
        property_facilities: {
          label: "FACILITIES_AT_CAMP",
          type: "object",
          properties: {},
        },
        edit_page_type: {
          type: "string",
          format: "hidden",
          default: "edit_property_facilities",
        },
      },
    },
    kit: {
      step_name: "KIT",
      type: "object",
      required: [
        "kit_received",
        "kit_was_sufficient",
        "kit_feedback",
        "kit_ratings",
      ],
      properties: {
        kit_received: {
          label: "DID_YOU_RECEIVE_A_KIT",
          type: "string",
          format: "radio",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        kit_was_sufficient: {
          label: "DID_YOU_THINK_THE_KIT_WAS_SUFFICIENT",
          type: ["string", "null"],
          grid: 2,
          format: "radio",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        kit_ratings: {
          label: "RATE_KIT",
          type: ["string", "number", "null"],
          format: "StarRating",
          totalStars: 5,
          ratingLabels: ["Poor", "Not Bad", "Average", "Good", "Amazing"],
        },
        kit_feedback: {
          label: "KIT_SUGGESTION",
          type: ["string", "null"],
          grid: 2,
          format: "textarea",
        },
        edit_page_type: {
          type: "string",
          format: "hidden",
          default: "edit_kit_details",
        },
      },
    },
    // permission_documents: {
    //   step_name: "PERMISSION_DOCUMENTS",
    //   type: "object",
    //   required: ["permission_documents"],
    //   properties: {
    //     permission_documents: {
    //       label: "CAMP_PERMISSION",
    //       uploadTitle: "ADD_PHOTOS",
    //       type: ["string", "number"],
    //       format: "FileUpload",
    //     },
    //   },
    // },
    family_consent: {
      step_name: "LEARNER_CONSENT_FORM",
      type: "object",
    },
  },
};
