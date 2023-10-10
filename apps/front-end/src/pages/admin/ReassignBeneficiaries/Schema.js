export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      type: "object",
      required: ["PRERAK_LIST"],
      properties: {
        PRERAK_LIST: {
          label: "PRERAK_LIST",
          type: "string",
          format: "select",
        },
      },
    },
  },
};
