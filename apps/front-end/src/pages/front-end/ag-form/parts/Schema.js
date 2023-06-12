export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "IDENTIFY_BENEFICIARY",
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
          default: "beneficiary",
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
      title: "CONTACT_INFORMATION",
      description: "PLEASE_WHATSAPP_NUMBER",
      type: "object",
      required: ["mobile"],
      properties: {
        mobile: {
          type: "string",
          title: "MOBILE_NUMBER",
        },
      },
    },
  },
};
