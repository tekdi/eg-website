export default {
  description: "1.AG Enrollment Details",
  type: "step",
  properties: {
    edit_enrollement: {
      title: "ENROLLMENT_DETAILS",
      type: "object",
      required: [
        "enrollment_status",
        "enrolled_for_board",
        "enrollment_number",
        "enrollment_aadhaar_no",
        "subjects",
        "enrollment_date",
        "payment_receipt_document_id",
      ],
      properties: {
        enrollment_status: {
          type: "string",
          label: "ENROLLMENT_STATUS",
          format: "select",
        },
        enrolled_for_board: {
          type: "string",
          label: "BOARD_OF_ENROLLMENT",
          format: "radio",
          enumNames: ["RSOS", "NIOS"], //title
          enum: ["rsos", "nios"], //values
        },
        enrollment_number: {
          type: "number",
          label: "ENROLLMENT_NUMBER",
          regex: /^\d+$/,
          _input: { keyboardType: "numeric" },
        },
        enrollment_aadhaar_no: {
          title: "AADHAAR_NUMBER",
          label: "AADHAAR_NUMBER",
          type: "number",
          regex: /^\d{0,12}$/,
        },
        enrollment_date: {
          type: "string",
          label: "ENROLLMENT_DATE",
          format: "alt-date",
        },
        subjects: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "SELECT_SUBJECTS",
          items: {
            type: ["string", "number"],
          },
          uniqueItems: true,
        },
        payment_receipt_document_id: {
          label: "PAYMENT_RECEIPT",
          uploadTitle: "UPLOAD_THE_PAYMENT_RECEIPT_FOR_ENROLLMENT",
          type: ["string", "number"],
          format: "FileUpload",
        },
      },
    },
    edit_enrollement_details: {
      title: "ENROLLMENT_RECEIPT",
      type: "object",
      required: ["enrollment_first_name", "enrollment_dob"],
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
      },
    },
  },
};
