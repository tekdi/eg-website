export default {
  type: "object",
  properties: {
    documents_status: {
      label: "Reminder",
      type: "array",
      title: "DOCUMENT VERIFICATION",
      items: {
        type: "string",
        enum: ["Qualification Certificate", "Volunteer Proof", "Work Proof"],
      },
      uniqueItems: true,
    },
  },
};
