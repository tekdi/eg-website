export default {
  description: "1.AG Enrollment Details",
  type: "step",
  properties: {
    1: {
      title: "ENROLLMENT_DETAILS",
      type: "object",
      properties: {
        type_of_enrollement: {
          label: "TYPE_OF_ENROLLMENT",
          type: "string",
          format: "select",
          enumNames: ["New", "Old"],
          enum: ["new", "old"],
        },
        enrollment_status: {
          type: "string",
          label: "ENROLLMENT_STATUS",
          format: "select",
        },
        enrolled_for_board: {
          type: "string",
          title: "BOARD_OF_ENROLLMENT",
          format: "radio",
          enumNames: ["RSOS", "NIOS"], //title
          enum: ["rsos", "nios"], //values
        },
        enrollment_number: {
          type: "number",
          title: "ENROLLMENT_NUMBER",
        },
        subjects: {
          type: "array",
          title: "A multiple-choice list",

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
