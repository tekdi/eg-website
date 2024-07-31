import { jsonParse } from "@shiksha/common-lib";

let state = jsonParse(localStorage.getItem("program"));

export default {
  description: "1.AG Enrollment Details",
  type: "step",
  properties: {
    edit_enrollement: {
      title: "ENROLLMENT_DETAILS",
      type: "object",
      required: [
        "enrollment_status",
        "type_of_enrollement",
        "enrolled_for_board",
        "enrollment_number",
        "enrollment_mobile_no",
        "enrollment_first_name",
        "enrollment_dob",
        "enrollment_date",
      ],
      properties: {
        enrollment_status: {
          type: "string",
          label: "ENROLLMENT_STATUS",
          format: "select",
        },
        type_of_enrollement: {
          type: "string",
          _stack: { direction: "row", justifyContent: "space-between" },
          label: "ENROLLMENT_TYPE",
          format: "RadioBtn",
        },
        enrolled_for_board: {
          type: "string",
          _stack: { direction: "row", justifyContent: "space-between" },
          label: "BOARD_OF_ENROLLMENT",
          format: "RadioBtn",
        },
        enrollment_number: {
          type: "string",
          regex: /^\d{0,11}$/,
          _input: { keyboardType: "numeric" },
          label:
            state?.state_name == "BIHAR"
              ? "APPLICATION_ID"
              : state?.state_name == "MADHYA PRADESH"
              ? "ROLL_NUMBER"
              : "ENROLLMENT_NO",
        },
        enrollment_mobile_no: {
          type: "string",
          label: "MOBILE_NUMBER",
          description:
            state?.state_name === "RAJASTHAN"
              ? "AS_PER_ENROLLMENT_RECEIPT"
              : "AS_PER_APPLICATION_RECEIPT",
          format: "MobileNumber",
        },

        enrollment_date: {
          type: "string",
          label:
            state?.state_name === "RAJASTHAN"
              ? "ENROLLMENT_DATE"
              : "APPLICATION_DATE",
          format: "DMY",
        },
        enrollment_first_name: {
          type: "string",
          label: "FIRST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
          description:
            state?.state_name === "RAJASTHAN"
              ? "AS_PER_ENROLLMENT_RECEIPT"
              : "AS_PER_APPLICATION_RECEIPT",
        },
        enrollment_middle_name: {
          type: ["string", "null"],
          label: "MIDDLE_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        enrollment_last_name: {
          type: ["string", "null"],
          label: "LAST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        enrollment_dob: {
          type: "string",
          format: "alt-date",
          label:
            state?.state_name === "RAJASTHAN"
              ? "DATE_OF_BIRTH_AS_PER_ENROLLMENT"
              : "DATE_OF_BIRTH_AS_PER_APPLICATION",
          help: "",
        },
      },
    },
    edit_enrollement_details: {
      title:
        state?.state_name === "RAJASTHAN"
          ? "ENROLLMENT_RECEIPT_AS_PER_ENROLLMENT_RECEIPT"
          : "ENROLLMENT_RECEIPT_DETAILS",
      type: "object",
      required: ["subjects", "payment_receipt_document_id"],
      properties: {
        subjects: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "SUBJECTS",
          grid: 2,
          items: {
            type: ["string", "number"],
          },
          format: "MultiCheckSubject",
          uniqueItems: true,
        },
        payment_receipt_document_id: {
          label:
            state?.state_name === "RAJASTHAN"
              ? [
                  "RECEIPT_UPLOAD_AND_UPLOAD_CLEAR_AND_FULL_PHOTO_OF_ENROLLMENT_RECEIPT",
                ]
              : [
                  "RECEIPT_UPLOAD_AND_UPLOAD_CLEAR_AND_FULL_PHOTO_OF_ENROLLMENT_RECEIPT",
                ],
          uploadTitle: "UPLOAD_FROM_PHONE",
          type: ["string", "number"],
          format: "FileUpload",
        },
      },
    },
  },
};
