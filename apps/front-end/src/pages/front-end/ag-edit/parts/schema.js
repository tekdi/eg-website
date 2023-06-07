export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "FULL_NAME",
      type: "object",
      required: ["first_name", "last_name", "dob"],
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
        edit_page_type: {
          type: "string",
          default: "edit_basic",
          format: "hidden",
        },
      },
    },
    // 2: {
    //   title: "CONTACT_1",

    //   type: "object",
    //   //required: ["mobile"],
    //   properties: {
    //     mobile: {
    //       type: "number",
    //       title: "MOBILE_NUMBER",
    //     },
    //     mark_as_whatsapp_number: {
    //       type: "string",
    //       label: "MARK_AS_WHATSAPP_NO",
    //       format: "RadioBtn",

    //       enumNames: ["Yes", "No"],
    //       enum: ["yes", "no"],
    //     },
    //     device_ownership: {
    //       type: "string",
    //       label: "MARK_OWNERSHIP",
    //       format: "RadioBtn",
    //       enumNames: ["Self", "Family member", "Neighbour", "Other"],
    //       enum: ["self", "family member", "neighbour", "other"],
    //     },
    //     device_type: {
    //       type: "string",
    //       label: "TYPE_OF_MOBILE_PHONE",
    //       format: "CustomR",
    //       enumNames: ["Smartphone", "Basic"],
    //       enum: ["smartphone", "basic"],
    //     },
    //     alternative_mobile_number: {
    //       type: "number",
    //       title: "ALTERNATIVE_NUMBER",
    //     },
    //     alternative_device_ownership: {
    //       type: "string",
    //       label: "MARK_OWNERSHIP",
    //       format: "RadioBtn",
    //       enumNames: ["Self", "Family member", "Neighbour", "Other"],
    //       enum: ["self", "family member", "neighbour", "other"],
    //     },
    //     alternative_device_type: {
    //       label: "TYPE_OF_MOBILE_PHONE",
    //       format: "CustomR",
    //       type: "string",
    //       enumNames: ["Smartphone", "Basic"],
    //       enum: ["smartphone", "basic"],
    //     },

    //     email_id: {
    //       type: "string",
    //       format: "email",
    //       label: "EMAIL_ID",
    //     },
    //   },
    // },
    // 3: {
    //   title: "ADDRESS",
    //   type: "object",
    //   //required: ["state", "district", "block", "village"],
    //   properties: {
    //     state: {
    //       title: "STATE",
    //       type: "string",
    //       format: "select",
    //     },
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
    //       type: "string",
    //     },
    //     address: {
    //       title: "ADDRESS_DETAIL",
    //       type: "string",
    //     },
    //   },
    // },
    // 4: {
    //   title: "PERSONAL_DETAILS",
    //   type: "object",
    //   //required: ["maritalstatus"],
    //   properties: {
    //     marital_status: {
    //       label: "MARITAL_STATUS",
    //       type: "string",
    //       format: "CustomR",
    //       enumNames: ["Married", "Single", "Divorced", "Seperated", "Other"],
    //       enum: ["married", "single", "divorced", "seperated", "other"],
    //     },
    //     social_category: {
    //       label: "SOCIAL_CATEGORY",
    //       type: "string",
    //       format: "CustomR",
    //       enumNames: ["Open ", "S.C.", "S.T.", "O.B.C.", "Other"],
    //       enum: ["open", "sc", "st", "obc", "other"],
    //     },
    //   },
    // },
    // 5: {},
    // 6: {
    //   title: "FAMILY_DETAILS",
    //   type: "object",
    //   // required: ["first_name"],
    //   properties: {
    //     fatherdetails: {
    //       title: "FATHER_FULL_NAME",
    //       type: "object",
    //       properties: {
    //         father_first_name: {
    //           type: "string",
    //           title: "FIRST_NAME",
    //         },
    //         father_middle_name: {
    //           type: "string",
    //           title: "MIDDLE_NAME",
    //         },
    //         father_last_name: {
    //           type: "string",
    //           title: "LAST_NAME",
    //         },
    //       },
    //     },
    //     motherdetails: {
    //       title: "MOTHER_FULL_NAME",
    //       type: "object",
    //       properties: {
    //         mother_first_name: {
    //           type: "string",
    //           title: "FIRST_NAME",
    //         },
    //         mother_middle_name: {
    //           type: "string",
    //           title: "MIDDLE_NAME",
    //         },
    //         mother_last_name: {
    //           type: "string",
    //           title: "LAST_NAME",
    //         },
    //       },
    //     },
    //   },
    // },
    // 7: {},
  },
};
