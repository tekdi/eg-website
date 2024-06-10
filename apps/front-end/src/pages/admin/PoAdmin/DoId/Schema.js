const Schema = {
  type: "object",
  required: ["do_id", "event_type", "status"],
  properties: {
    do_id: {
      type: "string",
      title: "DO-ID",
      label: "DO-ID",
    },
    event_type: {
      type: "string",
      label: "EVENT_TYPE",
      title: "EVENT_TYPE",
      format: "select",
    },
    status: {
      type: "string",
      title: "STATUS",
      label: "STATUS",
      format: "select",
      enum: ["active", "inactive"],
      enumNames: ["Active", "Inactive"],
    },
  },
};

export default Schema;
