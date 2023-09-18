export default {
  type: "step",
  properties: {
    camp_location: {
      // title: "CAMP_LOCATION",
      step_name: "CAMP_LOCATION",
      type: "object",
      // required: ["state", "district", "block", "village", "grampanchayat"],
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
        address: {
          title: "STREET_ADDRESS",
          type: ["string", "null"],
        },

        edit_page_type: {
          type: "string",
          format: "hidden",
          default: "edit_address",
        },
      },
    },
    camp_venue_photos: {
      step_name: "CAMP_VENUE_PHOTOS",
      type: "object",
      // required: ["building_view", "classroom_view", "other_view"],
      properties: {
        camp_front_view: {
          label: "CAMP_FRONT_VIEW",
          uploadTitle: "ADD_PHOTOS",
          type: ["string", "number"],
          document_type: "camp_photos",
          format: "FileUpload",
        },
        study_room: {
          label: "STUDY_ROOM",
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
      properties: {
        // facilities: {
        //   label: "FACILITIES_AT_CAMP",
        //   type: "array",
        //   grid: 1,
        //   format: "MultiCheck",
        //   uniqueItems: true,
        // },
        facilities: {
          label: "FACILITIES_AT_CAMP",
          type: "object",
          properties: {
            // facilities0: {
            //   label: "asd",
            //   type: "string",
            //   format: "CheckUncheck",
            // },
            // facilities1: {
            //   label: "sasdfgar",
            //   type: "string",
            //   format: "CheckUncheck",
            // },
            // facilities2: {
            //   label: "sagar",
            //   type: "string",
            //   format: "CheckUncheck",
            // },
          },
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
        kit_rating: {
          label: "RATE_KIT",
          type: ["string", "number"],
          format: "StarRating",
          totalStars: 5,
          ratingLabels: ["Poor", "Not Bad", "Average", "Good", "Amazing"],
        },
        kit_suggestion: {
          label: "KIT_SUGGESTION",
          type: "string",
          grid: 2,
          format: "textarea",
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
