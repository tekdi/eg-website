export default {
  description: "IDENTIFY_BENEFICIARY",
  type: "step",
  properties: {
    // 1: {
    //   // title: "Contact Information",
    //   // description: "PLEASE_WHATSAPP_NUMBER",
    //   type: "object",
    //   required: ["device_ownership", "device_type"],
    //   properties: {
    //     device_type: {
    //       type: "string",
    //       label: "TYPE_OF_MOBILE_PHONE",
    //       format: "CustomR",
    //       enumNames: ["SMARTPHONE", "BASIC"],
    //       enum: ["smartphone", "basic"],
    //       grid: "2",
    //     },
    //     device_ownership: {
    //       type: "string",
    //       label: "MARK_OWNERSHIP",
    //       format: "RadioBtn",
    //       enumNames: ["SELF", "FAMILY_MEMBER", "NEIGHBOUR", "OTHER"],
    //       enum: ["self", "family_member", "neighbour", "other"],
    //     },
    //     edit_page_type: {
    //       type: "string",
    //       format: "hidden",
    //       default: "add_contact",
    //     },
    //   },
    // },
    // 2: {
    //   title: "COMPLETE_ADDRESS",
    //   type: "object",
    //   required: ["state", "district", "block", "village", "grampanchayat"],
    //   properties: {
    //     lat: {
    //       type: ["number", "string"],
    //       title: "LATITUDE",
    //       format: "ReadOnly",
    //     },
    //     long: {
    //       type: ["number", "string"],
    //       title: "LONGITUDE",
    //       format: "ReadOnly",
    //     },
    //     address: {
    //       title: "STREET_ADDRESS",
    //       type: ["string", "null"],
    //     },
    //     // state: {
    //     //   type: "string",
    //     //   title: "STATE",
    //     //   format: "select",
    //     // },
    //     district: {
    //       title: "DISTRICT",
    //       type: "string",
    //       format: "select",
    //     },
    //     block: {
    //       title: "BLOCK",
    //       type: "string",
    //       format: "select",
    //     },

    //     village: {
    //       title: "VILLAGE_WARD",
    //       type: "string",
    //       format: "select",
    //     },
    //     grampanchayat: {
    //       title: "GRAMPANCHAYAT",
    //       type: ["string", "null"],
    //     },
    //     pincode: {
    //       title: "PINCODE",
    //       type: "string",
    //       readOnly: "",
    //     },
    //   },
    // },

    3: {
      title: "PERSONAL_DETAILS",
      type: "object",
      required: ["marital_status", "social_category"],
      properties: {
        marital_status: {
          label: "MARITAL_STATUS",
          type: "string",
          format: "RadioBtn",
          grid: 2,
        },
        social_category: {
          label: "SOCIAL_CATEGORY",
          type: "string",
          format: "RadioBtn",
          grid: 2,
        },
      },
    },

    4: {
      title: "EDUCATION_DETAILS",
      type: "object",
      required: [
        "type_of_learner",
        "last_standard_of_education",
        "last_standard_of_education_year",
        "reason_of_leaving_education",
        "previous_school_type",
        "learning_level",
        "education_10th_exam_year",
        "education_10th_date",
      ],
      properties: {
        type_of_learner: {
          type: "string",
          title: "TYPE_OF_LEARNER",
          description: "TYPE_OF_LEARNER",
          format: "select",
        },
        alreadyOpenLabel: {
          type: "string",
        },
        last_standard_of_education: {
          type: "string",
          title: "LAST_STANDARD_OF_EDUCATION",
          format: "select",
        },
        last_standard_of_education_year: {
          type: "string",
          title: "LAST_YEAR_OF_EDUCATION",
          format: "select",
        },
        previous_school_type: {
          type: "string",
          title: "PREVIOUS_SCHOOL_TYPE",
          format: "select",
        },
        reason_of_leaving_education: {
          type: "string",
          title: "REASON_FOR_BEING_DEPRIVED_OF_EDUCATION",
          format: "select",
        },

        education_10th_date: {
          type: "string",
          format: "date",
          label: "REGISTERED_IN_TENTH_DATE",
        },
        education_10th_exam_year: {
          type: "string",
          format: "select",
          title: "IN_WHICH_YEAR_DID_I_GIVE_THE_MAINS_EXAM",
        },

        learning_level: {
          label: "WHAT_IS_THE_LEARNING_LEVEL_OF_THE_LEARNER",
          type: "string",
          format: "CustomR",
          grid: "1",
        },
      },
    },
    5: {
      // title: "ASPIRATION_MAPPING",
      type: "object",
      required: ["learning_motivation", "type_of_support_needed"],
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
  },
};
