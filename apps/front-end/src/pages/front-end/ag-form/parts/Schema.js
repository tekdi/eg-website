export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "IDENTIFY_THE_AG_LEARNER",
      type: "object",
      required: ["first_name", "last_name"],
      properties: {
        first_name: {
          type: "string",
          title: "FIRST_NAME",
        },
        last_name: {
          type: "string",
          title: "LAST_NAME",
        },
        role: {
          format: "hidden",
          type: "string",
          default: "beneficiaries",
        },
        email_id: {
          format: "hidden",
          type: "string",
          default: "joey@gmail.com",
        },
        role_fields: {
          properties: {
            facilitator_id: {
              format: "hidden",
              type: "string",
              default: localStorage.getItem("id"),
            },
          },
        },
      },
    },
    2: {
      title: "Contact Information",
      description: "PLEASE_WHATSAPP_NUMBER",
      type: "object",
      required: ["mobile"],
      properties: {
        mobile: {
          type: "string",
          title: "MOBILE_NUMBER",
        },

        // device_ownership: {
        //   type: "string",
        //   label: "OWNERSHIP",
        //   format: "RadioBtn",
        //   enumNames: ["Self", "Family Member", "Neighbour", "Other", "any"],
        //   enum: ["self", "family_member", "neighbour", "other", "any"],
        // },
        // device_type: {
        //   type: "string",
        //   label: "TYPE_OF_MOBILE_PHONE",
        //   format: "CustomR",
        //   enumNames: ["Smartphone", "Basic"],
        //   enum: ["smartphone", "basic"],
        // },
      },
    },

    3: {
      title: "Complete Address",
      type: "object",
      // required: ["state", "district", "block", "village"],
      properties: {
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

    4: {
      title: "Personal Details",
      type: "object",
      //required: ["marital_status", "social_category"],
      properties: {
        marital_status: {
          title: "MARITAL_STATUS",
          type: "string",
          enumNames: [
            "Married",
            "Unmarried",
            "Single (Divorced, widow, separated, etc.)",
          ],
          enum: ["married", "unmarried", "single"],
        },
        social_category: {
          title: "SOCIAL_CATEGORY",
          type: "string",
          enumNames: ["General", "S.C.", "S.T.", "O.B.C.", "Other"],
          enum: ["general", "sc", "st", "obc", "other"],
        },
      },
    },

    5: {
      title: "Education Details",
      type: "object",
      required: [],
      properties: {
        type_of_student: {
          title: "TYPE_OF_STUDENT",
          type: "string",
          format: "select",
          // enumNames: ["General", "S.C.","S.T.","O.B.C.","Other"],
          // enum: ["general", "sc","st","obc","other"],
        },
        last_year_of_education: {
          title: "LAST_YEAR_OF_EDUCATION",
          type: "string",
          format: "select",
        },
        last_standard_of_education: {
          title: "LAST_STANDARD_OF_EDUCATION",
          type: "string",
          format: "select",
        },
        reason_for_leaving_education: {
          title: "REASON_FOR_LEAVING_EDUCATION",
          type: "string",
          format: "select",
        },
      },
    },
  },
};
