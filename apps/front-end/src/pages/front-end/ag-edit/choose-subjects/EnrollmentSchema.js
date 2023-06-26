export default {
  description: "1.AG Enrollment Details",
  type: "step",
  properties: {
    1: {
      title: "ENROLLMENT_RECEIPT",
      type: "object",
      required: [
        "enrollment_date",
        "enrollment_first_name",
        "enrollment_last_name",
        "enrollment_dob",
        "enrollment_aadhaar_no",
      ],
      properties: {
        enrollment_date: {
          type: "string",
          label: "ENROLLMENT_DATE",
          format: "alt-date",
        },
        enrollment_first_name: {
          type: "string",
          title: "FIRST_NAME",
          label: "FIRST_NAME",
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
          label: "DATE_OF_BIRTH_AS_PER_AADHAAR",
          help: "hello",
        },
        enrollment_aadhaar_no: {
          title: "AADHAAR_NUMBER",
          label: "AADHAAR_NUMBER",
          type: "number",
          format: "Aadhaar",
        },
      },
    },
  },
};
