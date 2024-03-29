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
      title: "CONTACT_INFORMATION",
      description: "LEARNERS_WHATSAPP_NUMBER",
      type: "object",
      required: ["mobile"],
      properties: {
        mobile: {
          type: "string",
          title: "MOBILE_NUMBER",
          format: "MobileNumber",
        },
      },
    },
  },
};
