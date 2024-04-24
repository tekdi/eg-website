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
    3: {
      type: "object",
      required: ["device_ownership", "device_type"],
      properties: {
        device_type: {
          type: "string",
          label: "TYPE_OF_MOBILE_PHONE",
          format: "CustomR",
          enumNames: ["SMARTPHONE", "BASIC"],
          enum: ["smartphone", "basic"],
          grid: "2",
        },
        device_ownership: {
          type: "string",
          label: "MARK_OWNERSHIP",
          format: "RadioBtn",
          enumNames: ["SELF", "FAMILY_MEMBER", "NEIGHBOUR", "OTHER"],
          enum: ["self", "family_member", "neighbour", "other"],
        },
        edit_page_type: {
          type: "string",
          format: "hidden",
          default: "add_contact",
        },
      },
    },
    4: {
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
        },
      },
    },
  },
};
