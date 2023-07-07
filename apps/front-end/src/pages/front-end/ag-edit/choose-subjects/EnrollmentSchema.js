export default {
  description: "1.AG Enrollment Details",
  type: "step",
  properties: {
    1: {
      title: "ENROLLMENT_RECEIPT",
      type: "object",
      required: [
        "enrollment_first_name",
        "enrollment_dob",
        "enrollment_aadhaar_no",
      ],
      properties: {
        enrollment_first_name: {
          type: "string",
          title: "FIRST_NAME_AS_PER_ENROLLMENT",
          label: "FIRST_NAME_AS_PER_ENROLLMENT",
        },
        enrollment_middle_name: {
          type: ["string", "null"],
          title: "MIDDLE_NAME",
          label: "MIDDLE_NAME",
        },
        enrollment_last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
          label: "LAST_NAME",
        },
        enrollment_dob: {
          type: "string",
          format: "alt-date",
          label: "DATE_OF_BIRTH_AS_PER_ENROLLMENT",
          help: "hello",
        },
        enrollment_aadhaar_no: {
          title: "AADHAAR_NUMBER",
          label: "AADHAAR_NUMBER",
          type: "number",
          regex: /^\d{0,12}$/,
        },
      },
    },
  },
};
