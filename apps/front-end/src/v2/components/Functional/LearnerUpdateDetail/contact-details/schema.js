export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "BASIC_DETAILS",
      description: "CONTACT_DETAILS",
      type: "object",
      required: [
        "mobile",
        "mark_as_whatsapp_number",
        "device_type",
        "device_ownership",
      ],
      properties: {
        mobile: {
          type: "number",
          title: "MOBILE_NUMBER",
        },
        mark_as_whatsapp_number: {
          type: "string",
          label: "MARK_AS_WHATSAPP_REGISTER",
          format: "RadioBtn",
          _stack: { direction: "row", justifyContent: "space-between" },
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
          label: "ALTERNATIVE_NUMBER",
          type: ["number", "null"],
          title: "MOBILE_NUMBER",
        },
        alternative_device_type: {
          label: "TYPE_OF_MOBILE_PHONE",
          format: "RadioBtn",
          type: "string",
          enumNames: ["SMARTPHONE", "BASIC"],
          enum: ["smartphone", "basic"],
        },
        alternative_device_ownership: {
          type: "string",
          label: "MARK_OWNERSHIP",
          format: "RadioBtn",
          enumNames: ["SELF", "FAMILY_MEMBER", "NEIGHBOUR", "OTHER"],
          enum: ["self", "family_member", "neighbour", "other"],
        },

        email_id: {
          description: "EMAIL_ID",
          type: "string",
          format: "email",
          title: "EMAIL_ID",
        },
        edit_page_type: {
          type: "string",
          default: "edit_contact",
          format: "hidden",
        },
      },
    },
  },
};
