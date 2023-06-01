export default {
  type: "object",
  required: ["type", "attendees", "start_date", "location", "location_type"],
  properties: {
    type: {
      type: "string",
      label: "Event Type",
      format: "select",
      enum: ["Orientation", "Training", "Master Training", "Add a Prerak"],
    },
    mastertrainer: {
      title: "Master Trainer",
      type: "string",
    },
    attendees: {
      title: "Select Candidates",
      type: ["string", "array"],
    },
    start_date: {
      title: "Start Date",
      type: "string",
      format: "alt-date",
    },
    end_date: {
      title: "End Date",
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
      label: "Reminder",
      type: ["string", "array"],
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
