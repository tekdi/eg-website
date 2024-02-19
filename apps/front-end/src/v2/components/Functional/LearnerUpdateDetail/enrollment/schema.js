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
          type: "string",
          label: "ENROLLMENT_NUMBER",
          regex: /^\d{0,11}$/,
          _input: { keyboardType: "numeric" },
        },

        enrollment_date: {
          type: "string",
          label: "ENROLLMENT_DATE",
          format: "DMY",
        },
        subjects: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "SUBJECTS",
          items: {
            type: ["string", "number"],
          },
          uniqueItems: true,
        },
        payment_receipt_document_id: {
          label: "PAYMENT_RECEIPT",
          description: "PLEASE_CLEAN_CAMERA_LENSE_AND_STEADY_CAMERA",
          uploadTitle: "UPLOAD_CLEAR_AND_FULL_PHOTO_OF_ENROLLMENT_RECEIPT",
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
          title: "FIRST_NAME",
          label: "FIRST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
          description: "AS_PER_ENROLLMENT_RECEIPT",
        },
        enrollment_middle_name: {
          type: ["string", "null"],
          title: "MIDDLE_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
          label: "MIDDLE_NAME",
        },
        enrollment_last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
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
