export default {
  step_name: "VOLUNTEER_EXPERIENCE",
  type: "object",
  title: "DO_YOU_HAVE_ANY_VOLUNTEER_EXPERIENCE",
  properties: {
    role_title: {
      title: "JOB_TITLE",
      type: "string",
    },
    organization: {
      title: "COMPANY_NAME",
      type: "string",
    },
    description: {
      title: "DESCRIPTION",
      type: ["string", "null"],
      format: "textarea",
      rows: 5,
    },
    experience_in_years: {
      label: "EXPERIENCE_IN_YEARS",
      type: "string",
      format: "CustomR",
      grid: 3,
      enumNames: ["1", "2", "3", "4", "+5"],
      enum: ["1", "2", "3", "4", "5"],
    },
    related_to_teaching: {
      label: "IS_THE_JOB_RELATED_TO_TEACHING",
      type: ["string", "null"],
      format: "RadioBtn",
      enumNames: ["Yes", "No"],
      enum: ["yes", "no"],
    },
    reference_details: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        contact_number: {
          type: "string",
        },
        type_of_document: {
          type: "string",
        },
      },
    },
    document_id: {
      title: "UPLOAD_YOUR_DOCUMENT",
      type: "string",
      format: "FileUpload",
    },
  },
};
