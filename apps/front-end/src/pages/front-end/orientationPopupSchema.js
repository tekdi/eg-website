export default {
  type: "object",
  required: [
    "type",
    "user_id",
    "start_date",
    "start_time",
    "location",
    "location_type",
  ],
  properties: {
    // created_by: {
    //   title: "Created by",
    //   type: "string",
    //   format: "hidden",
    // },
    // context_id: {
    //   title: "Context by",
    //   type: "string",
    //   format: "hidden",
    // },
    // updated_by: {
    //   title: "Updated by",
    //   type: "string",
    //   format: "hidden",
    // },

    type: {
      type: "string",
      title: "Event type",
      format: "select",
      enum: ["Orientation", "Training", "Master Training", "Add a Prerak"],
    },
    mastertrainer: {
      title: "Master Trainer",
      type: "string",
    },
    user_id: {
      title: "Select Candidates",
      type: ["string", "array"],
    },
    start_date: {
      title: "Date",
      type: "string",
      format: "alt-date",
    },
    end_date: {
      title: "Date",
      type: "string",
      format: "alt-date",
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
    location_type: {
      title: "Location Type",
      type: "string",
      format: "RadioBtn",
      enumNames: ["online", "offline"],
      enum: ["online", "offline"],
    },
  },
};
