export default {
  type: "object",
  required: [
    "type",
    "attendees",
    "master_trainer",
    "start_date",
    "location",
    "location_type",
  ],
  properties: {
    type: {
      type: "string",
      label: "Event Type",
      format: "select",
      enum: [
        "Prerak Orientation",
        "Prerak FLN Training",
        "Prerak Camp Execution Training",
      ],
    },
    name: {
      title: "Event Name (Batch Number)",
      type: "string",
    },
    master_trainer: {
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
      format: "string",
    },
    end_time: {
      title: "End time",
      type: "string",
      format: "string",
    },
    reminders: {
      label: "Reminder",
      type: "array",
      title: "A multiple-choice list",
      items: {
        type: "string",
        enum: ["1 Hour Before", "1 Day Before ", "1 Week Before"],
      },
      uniqueItems: true,
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
