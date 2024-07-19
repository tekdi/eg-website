export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "IDENTIFY_BENEFICIARY",
      type: "object",
      required: ["first_name", "dob", "career_aspiration"],
      properties: {
        first_name: {
          type: "string",
          title: "FIRST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        middle_name: {
          type: "string",
          title: "MIDDLE_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        career_aspiration: {
          minItems: 1,
          type: "string",
          label: "CAREER_ASPIRATION",
          grid: 1,
          format: "RadioBtn",
        },

        career_aspiration_details: {
          type: ["string", "null"],
          title: "TELL_IN_DETAIL",
        },

        dob: {
          type: "string",
          format: "date",
          label: "DATE_OF_BIRTH_AS_PER_AADHAAR",
        },
        role: {
          format: "hidden",
          type: "string",
          default: "beneficiary",
        },
      },
    },
    2: {
      type: "object",
      required: [
        "mobile",
        "mark_as_whatsapp_number",
        "device_ownership",
        "device_type",
      ],
      properties: {
        mobile: {
          type: "string",
          title: "MOBILE_NUMBER",
          format: "MobileNumber",
        },
        mark_as_whatsapp_number: {
          type: "string",
          label: "MARK_AS_WHATSAPP_REGISTER",
          format: "RadioBtn",
          enumNames: ["YES", "NO"],
          enum: ["yes", "no"],
        },
        device_type: {
          type: "string",
          label: "TYPE_OF_MOBILE_PHONE",
          format: "CustomR",
          grid: 2,
          icons: [
            { name: "SmartphoneLineIcon" },
            { name: "CellphoneLineIcon" },
          ],
          enumNames: ["SMARTPHONE", "BASIC"],
          enum: ["smartphone", "basic"],
        },
        device_ownership: {
          type: "string",
          label: "MARK_OWNERSHIP",
          format: "RadioBtn",
          enumNames: ["SELF", "FAMILY_MEMBER", "NEIGHBOUR", "OTHER"],
          enum: ["self", "family_member", "neighbour", "other"],
        },

        alternative_mobile_number: {
          description: "ALTERNATIVE_NUMBER",
          format: "MobileNumber",
          type: "string",
          title: "MOBILE_NUMBER",
        },

        email_id: {
          description: "EMAIL_ID",
          type: "string",
          format: "email",
          title: "EMAIL_ID",
        },
      },
    },
    3: {
      title: "COMPLETE_ADDRESS",
      type: "object",
      required: ["district", "block", "village", "grampanchayat"],
      properties: {
        lat: {
          type: ["number", "string"],
          title: "LATITUDE",
          format: "ReadOnly",
        },
        long: {
          type: ["number", "string"],
          title: "LONGITUDE",
          format: "ReadOnly",
        },
        address: {
          title: "STREET_ADDRESS",
          type: ["string", "null"],
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
          type: ["string", "null"],
        },
        pincode: {
          title: "PINCODE",
          type: "string",
          readOnly: "",
          regex: /^\d{0,6}$/,
          _input: { keyboardType: "numeric" },
        },
      },
    },
    4: {
      title: "PERSONAL_DETAILS",
      type: "object",
      required: ["marital_status", "social_category"],
      properties: {
        marital_status: {
          label: "MARITAL_STATUS",
          type: "string",
          format: "RadioBtn",
        },
        social_category: {
          label: "SOCIAL_CATEGORY",
          type: "string",
          format: "RadioBtn",
        },
      },
    },
    5: {
      title: "EDUCATION_DETAILS",
      type: "object",
      required: [
        "type_of_learner",
        "last_standard_of_education",
        "last_standard_of_education_year",
        "reason_of_leaving_education",
        "previous_school_type",
        "learning_level",
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
          title: "REASON",
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
          format: "RadioBtn",
        },
      },
    },
    6: {
      title: "FAMILY_DETAILS",
      type: "object",
      required: ["father_first_name", "mother_first_name"],

      properties: {
        father_first_name: {
          type: "string",
          title: "FIRST_NAME",
          label: "FATHER_FULL_NAME",
          regex: /^[a-zA-Z]+$/,
        },
        father_middle_name: {
          type: ["string", "null"],
          title: "MIDDLE_NAME",
          regex: /^[a-zA-Z]+$/,
        },
        father_last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
          regex: /^[a-zA-Z]+$/,
        },
        mother_first_name: {
          type: "string",
          title: "FIRST_NAME",
          label: "MOTHER_FULL_NAME",
          regex: /^[a-zA-Z]+$/,
        },
        mother_middle_name: {
          type: ["string", "null"],
          title: "MIDDLE_NAME",
          regex: /^[a-zA-Z]+$/,
        },
        mother_last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
          regex: /^[a-zA-Z]+$/,
        },
      },
    },
    7: {
      title: "LEARNER_ASPIRATIONS",
      type: "object",
      required: [
        "parent_support",
        "learning_motivation",
        "type_of_support_needed",
      ],
      properties: {
        parent_support: {
          label: "WILL_YOUR_PARENTS_SUPPORT_YOUR_STUDIES",
          type: "string",
          grid: 1,
          format: "RadioBtn",
        },

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
