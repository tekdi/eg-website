export const schema1 = {
  type: "object",
  required: ["description", "hours", "minutes"],
  properties: {
    village: {
      label: "VILLAGE_WARD",
      type: "string",
      readOnly: true,
    },
    description: {
      label: "DESCRIPTION",
      type: ["string", "number"],
      grid: 2,
      format: "Textarea",
    },
    labelTime: {
      type: "string",
    },
    hours: {
      type: "string",
      label: "HOURS",
      format: "select",
    },
    minutes: {
      type: "string",
      label: "MINUTES",
      format: "select",
    },
  },
};
