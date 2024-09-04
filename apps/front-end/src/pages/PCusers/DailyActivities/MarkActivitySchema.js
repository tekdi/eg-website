export const schema1 = {
  type: "object",
  required: ["district", "block", "village"],
  properties: {
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
  },
};
