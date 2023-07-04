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
          _input: { keyboardType: "numeric" },
        },
        subjects: {
          type: "array",
          label: "SELECT_SUBJECTS",

          items: {
            type: "number",
          },
          uniqueItems: true,
        },
        edit_page_type: {
          type: "string",
          default: "edit_enrollement",
          format: "hidden",
        },
      },
    },
  },
};
