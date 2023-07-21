export default {
  description: "1.AG Enrollment Details",
  type: "step",
  properties: {
    1: {
      title: "ENROLLMENT_DETAILS",
      type: "object",
      required: [
        "enrollment_status",
        "enrolled_for_board",
        "enrollment_number",
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
        enrollment_date: {
          type: "string",
          label: "ENROLLMENT_DATE",
          format: "alt-date",
        },
        enrollment_number: {
          type: "number",
          label: "ENROLLMENT_NUMBER",
          regex: /^\d+$/,
          _input: { keyboardType: "numeric" },
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
  },
};
