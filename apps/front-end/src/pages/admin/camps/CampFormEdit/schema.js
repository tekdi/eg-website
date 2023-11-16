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
        lat: {
          type: "string",
          title: "LATITUDE",
          format: "ReadOnly",
        },
        long: {
          type: "string",
          title: "LONGITUDE",
          format: "ReadOnly",
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
    edit_family_consent: {
      step_name: "LEARNER_CONSENT_FORM",
      type: "object",
    },
  },
};
