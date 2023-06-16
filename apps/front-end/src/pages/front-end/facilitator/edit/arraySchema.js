export default {
  type: "step",
  properties: {
    experience: {
      step_name: "VOLUNTEER_EXPERIENCE",
      type: "object",
      required: [
        "role_title",
        "organization",
        "experience_in_years",
        "related_to_teaching",
      ],
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
          rows: 3,
        },
        experience_in_years: {
          label: "EXPERIENCE_IN_YEARS",
          type: "string",
          format: "CustomR",
          grid: 3,
          enumNames: ["1", "2", "3", "4", "5+"],
          enum: ["1", "2", "3", "4", "5"],
        },
        related_to_teaching: {
          label: "IS_THE_JOB_RELATED_TO_TEACHING",
          type: "string",
          format: "RadioBtn",
          enumNames: ["Yes", "No"],
          enum: ["yes", "no"],
        },
        reference_details: {
          type: "object",
          label: "REFERENCE_DETAILS",
          required: ["name", "contact_number"],
          properties: {
            name: {
              type: "string",
              title: "NAME",
              help: "NAME_OF_YOUR_EMPLOYER",
            },
            contact_number: {
              type: ["number", "null"],
              title: "CONTACT_NUMBER",
              format: "MobileNumber",
            },
            type_of_document: {
              type: ["string", "null"],
              title: "TYPE_OF_DOCUMENT",
            },
            document_id: {
              title: "UPLOAD_YOUR_DOCUMENT",
              type: ["string", "number", "null"],
              format: "FileUpload",
            },
          },
        },
      },
    },
  },
};
