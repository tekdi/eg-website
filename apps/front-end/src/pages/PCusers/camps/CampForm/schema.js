export default {
  type: "step",
  properties: {
    edit_property_facilities: {
      step_name: "FACILITIES",
      type: "object",
      required: ["property_facilities"],
      properties: {
        property_facilities: {
          label: "FACILITIES_AT_CAMP",
          type: "object",
          properties: {},
          readOnly: true,
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
          readOnly: true,
        },
        kit_was_sufficient: {
          label: "DID_YOU_THINK_THE_KIT_WAS_SUFFICIENT",
          type: ["string", "null"],
          grid: 2,
          format: "RadioBtn",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
          readOnly: true,
        },
        kit_ratings: {
          label: "RATE_KIT",
          type: ["string", "number", "null"],
          format: "StarRating",
          totalStars: 5,
          ratingLabels: ["POOR", "NOT_BAD", "AVERAGE", "GOOD", "AMAZING"],
          readOnly: true,
        },
        kit_feedback: {
          label: "KIT_SUGGESTION",
          type: ["string", "number", "null"],
          grid: 2,
          format: "Textarea",
          readOnly: true,
        },
      },
    },
  },
};
