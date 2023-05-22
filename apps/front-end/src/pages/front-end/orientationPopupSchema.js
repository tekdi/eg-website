export default {
  type: "object",

  properties: {
    event_type: {
      title: "Event type",
      type: "string",
      format: "select",
      enum: ["Prerak Orientationb", "Prerak Training", "My MT", "Add a Prerak"],
    },
    mastertrainer: {
      title: "Master Trainer",
      type: "string",
      format: "select",
      enum: [""],
    },
    candidates: {
      title: "Candidates",
      type: "string",
      format: "select",
      enum: [""],
    },
    date: {
      title: "Date",
      type: "string",
      format: "date",
    },
    start_time: {
      title: "Start time",
      type: "string",
      format: "time",
    },
    end_time: {
      title: "End time",
      type: "string",
      format: "time",
    },
    reminder: {
      title: "Reminder",
      type: "string",
      format: "select",
      enum: ["1 Day Before ", "1 Week Before"],
    },
    location: {
      title: "Location",
      type: "string",
    },
  },
};
