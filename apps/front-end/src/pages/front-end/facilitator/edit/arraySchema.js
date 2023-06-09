export default {
  type: "step",
  properties: {
    experience: {
      step_name: "VOLUNTEER_EXPERIENCE",
      type: "object",
      title: "DO_YOU_HAVE_ANY_VOLUNTEER_EXPERIENCE",
      require: [
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
          title: "IS_THE_JOB_RELATED_TO_TEACHING",
          type: ["string", "null"],
          format: "RadioBtn",
          enumNames: ["Yes", "No"],
          enum: ["yes", "no"],
        },
        reference_details: {
          type: "object",
          title: "REFERENCE_DETAILS",
          require: ["name", "contact_number"],
          properties: {
            name: {
              type: "string",
              title: "NAME",
            },
            contact_number: {
              type: "string",
              title: "CONTACT_NUMBER",
            },
            type_of_document: {
              type: "string",
              title: "TYPE_OF_DOCUMENT",
            },
          },
        },
        document_id: {
          title: "UPLOAD_YOUR_DOCUMENT",
          type: ["string", "number"],
          format: "FileUpload",
        },
      },
    },
    reference_details: {
      step_name: "REFERENCE_DETAILS",
      title: "ADD_A_REFERENCE",
      type: "object",
      properties: {
        name: {
          type: "string",
          label: "NAME",
        },
        designation: {
          type: "string",
          label: "DESIGNATION",
        },
        contact_number: {
          type: "string",
          label: "CONTACT_NUMBER",
        },
      },
    },
  },
};
