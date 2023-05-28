export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "FULL_NAME",
      type: "object",
      required: ["first_name", "dob"],
      properties: {
        first_name: {
          type: "string",
          title: "FIRST_NAME",
        },
        middle_name: {
          type: "string",
          title: "MIDDLE_NAME",
        },
        last_name: {
          type: "string",
          title: "LAST_NAME",
        },
        dob: {
          type: "string",
          format: "date",
          title: "DOB",
        },
      },
    },
    2: {
      title: "CONTACT_1",

      type: "object",
      //required: ["mobile"],
      properties: {
        mobile: {
          type: "number",
          title: "MOBILE_NUMBER",
        },
        makeWhatsapp: {
          type: "string",
          title: "MARK_AS_WHATSAPP_NO",
          enumNames: ["Yes", "No"],
          enum: ["yes", "no"],
        },
        ownership: {
          type: "string",
          title: "MARK_OWNERSHIP",
          enumNames: ["Self", "Family member", "Neighbour", "Other"],
          enum: ["self", "family member", "neighbour", "other"],
        },
        device_type: {
          title: "TYPE_OF_MOBILE_PHONE",
          type: "string",
          enumNames: ["Android", "IPhone"],
          enum: ["android", "iphone"],
        },
        Altmobile: {
          type: "number",
          title: "ALTERNATIVE_NUMBER",
        },
        ownership: {
          type: "string",
          title: "MARK_OWNERSHIP",
          enumNames: ["Self", "Family member", "Neighbour", "Other"],
          enum: ["self", "family member", "neighbour", "other"],
        },
        device_type: {
          title: "TYPE_OF_MOBILE_PHONE",
          type: "string",
          enumNames: ["Android", "IPhone"],
          enum: ["android", "iphone"],
        },

        email_id: {
          type: "string",
          format: "email",
          title: "EMAIL_ID",
        },
      },
    },
    3: {
      title: "ADDRESS",
      type: "object",
      //required: ["state", "district", "block", "village"],
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
        addressdetails: {
          title: "ADDRESS_DETAIL",
          type: "string",
        },
      },
    },
    4: {
      title: "PERSONAL_DETAILS",
      type: "object",
      //required: ["maritalstatus"],
      properties: {
        maritalstatus: {
          title: "MARITAL_STATUS",
          type: "string",
          enumNames: ["Married", "Single", "Divorced", "Seperated", "Other"],
          enum: ["married", "single", "divorced", "seperated", "other"],
        },
        socialstatus: {
          title: "SOCIAL_CATEGORY",
          type: "string",
          enumNames: ["Open ", "S.C.", "S.T.", "O.B.C.", "Other"],
          enum: ["open", "sc", "st", "obc", "other"],
        },
      },
    },
    5: {},
    6: {
      title: "FAMILY_DETAILS",
      type: "object",
      // required: ["first_name"],
      properties: {
        fatherdetails: {
          title: "FATHER_FULL_NAME",
          type: "object",
          properties: {
            first_name: {
              type: "string",
              title: "FIRST_NAME",
            },
            middle_name: {
              type: "string",
              title: "MIDDLE_NAME",
            },
            last_name: {
              type: "string",
              title: "LAST_NAME",
            },
          },
        },
        motherdetails: {
          title: "MOTHER_FULL_NAME",
          type: "object",
          properties: {
            first_name: {
              type: "string",
              title: "FIRST_NAME",
            },
            middle_name: {
              type: "string",
              title: "MIDDLE_NAME",
            },
            last_name: {
              type: "string",
              title: "LAST_NAME",
            },
          },
        },
      },
    },
    7: {
      title: "REFERENCE_DETAILS",
      type: "object",
      // required: ["first_name"],
      properties: {
        referencefullname: {
          title: "REFERENCE_FULL_NAME",
          type: "object",
          properties: {
            first_name: {
              type: "string",
              title: "FIRST_NAME",
            },
            middle_name: {
              type: "string",
              title: "MIDDLE_NAME",
            },
            last_name: {
              type: "string",
              title: "LAST_NAME",
            },
          },
        },
        aglearnerrelationship: {
          title: "AG_LERNER_RELATIONSHP",
          type: "object",
          properties: {
            relation: {
              type: "string",
              title: "RELATION",
            },
            mobile: {
              type: "number",
              title: "MOBILE_NUMBER",
            },
          },
        },
      },
    },
  },
};
