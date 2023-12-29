export default {
  type: "step",
  properties: {
    edit_camp_location: {
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
        location: {
          type: ["number", "string", "object"],
          format: "Location",
          lat: "lat",
          long: "long",
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
      },
    },
    edit_photo_details: {
      step_name: "CAMP_VENUE_PHOTOS",
      type: "object",
      required: [
        "property_photo_other",
        "property_photo_building",
        "property_photo_classroom",
      ],
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
      },
    },
    edit_property_facilities: {
      step_name: "FACILITIES",
      type: "object",
      required: ["property_facilities"],
      properties: {
        property_facilities: {
          label: "FACILITIES_AT_CAMP",
          type: "object",
          properties: {},
        },
      },
    },
    edit_kit_details: {
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
          format: "RadioBtn",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        kit_was_sufficient: {
          label: "DID_YOU_THINK_THE_KIT_WAS_SUFFICIENT",
          type: ["string", "null"],
          grid: 2,
          format: "RadioBtn",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        kit_ratings: {
          label: "RATE_KIT",
          type: ["string", "number", "null"],
          format: "StarRating",
          totalStars: 5,
          ratingLabels: ["POOR", "NOT_BAD", "AVERAGE", "GOOD", "AMAZING"],
        },
        kit_feedback: {
          label: "KIT_SUGGESTION",
          type: ["string", "number", "null"],
          grid: 2,
          format: "Textarea",
        },
      },
    },
    edit_kit_material_details: {
      step_name: "KIT_MATERIAL",
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
          format: "RadioBtn",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        kit_was_sufficient: {
          label: "DID_YOU_THINK_THE_KIT_WAS_SUFFICIENT",
          type: ["string", "null"],
          grid: 2,
          format: "RadioBtn",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        kit_ratings: {
          label: "RATE_KIT",
          type: ["string", "number", "null"],
          format: "StarRating",
          totalStars: 5,
          ratingLabels: ["POOR", "NOT_BAD", "AVERAGE", "GOOD", "AMAZING"],
        },
        kit_feedback: {
          label: "KIT_SUGGESTION",
          type: ["string", "number", "null"],
          grid: 2,
          format: "Textarea",
        },
      },
    },
    edit_family_consent: {
      step_name: "LEARNER_CONSENT_FORM",
      type: "object",
    },
  },
};
