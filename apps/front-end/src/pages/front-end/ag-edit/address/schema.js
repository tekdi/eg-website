export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "ADDRESS",
      type: "object",
      required: ["state", "district", "block", "village", "address"],
      properties: {
        address: {
          title: "STREET_ADDRESS",
          type: "string",
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

        edit_page_type: {
          type: "string",
          format: "hidden",
          default: "edit_address",
        },
      },
    },
  },
};
