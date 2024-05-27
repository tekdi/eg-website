import { jsonParse } from "@shiksha/common-lib";

let state = jsonParse(localStorage.getItem("program"));

export default {
  description: "1.AG Enrollment Details",
  type: "step",
  properties: {
    edit_enrollement: {
      title: "BOARD_EXAM_DETAILS",
      type: "object",
      required: ["exam_fee_date", "syc_subjects", "exam_fee_document_id"],
      properties: {
        exam_fee_date: {
          type: "string",
          label: "EXAM_FEE_DATE",
          format: "DMY",
        },
        syc_subjects: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "SUBJECTS",
          items: {
            type: ["string", "number"],
          },
          uniqueItems: true,
        },
        exam_fee_document_id: {
          label: "RECEIPT_OF_EXAM_FEES_PAYMENT",
          description: "RECEIPT_OF_EXAM_FEES_PAYMENT_DESCRIPTION",
          uploadTitle: "RECEIPT_OF_EXAM_FEES_PAYMENT",
          type: ["string", "number"],
          format: "FileUpload",
        },
      },
    },
  },
};
