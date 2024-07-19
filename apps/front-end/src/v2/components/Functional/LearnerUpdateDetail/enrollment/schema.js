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
        "enrolled_for_board",
        "enrollment_number",
        "enrollment_mobile_no",
        "subjects",
        "enrollment_date",
        "payment_receipt_document_id",
      ],
      properties: {
        enrollment_status: {
          type: "string",
          description: "ENROLLMENT_STATUS",
          title: "ENROLLMENT_STATUS",
          format: "select",
        },
        enrolled_for_board: {
          type: "string",
          _stack: { direction: "row", justifyContent: "space-between" },
          label: "BOARD_OF_ENROLLMENT",
          format: "RadioBtn",
        },
        enrollment_number: {
          type: "string",
          description:
            state?.state_name === "RAJASTHAN"
              ? "ENROLLMENT_NO"
              : "APPLICATION_ID",
          regex: /^\d{0,11}$/,
          _input: { keyboardType: "numeric" },
          title:
            state?.state_name === "RAJASTHAN"
              ? "ENROLLMENT_NO"
              : "APPLICATION_ID",
        },
        enrollmentlabelMobile: {
          type: "string",
        },
        enrollment_mobile_no: {
          type: "string",
          title: "MOBILE_NUMBER",
          format: "MobileNumber",
        },

        enrollment_date: {
          type: "string",
          label:
            state?.state_name === "RAJASTHAN"
              ? "ENROLLMENT_DATE"
              : "FEES_PAID_DATE",
          format: "DMY",
        },
        subjects: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "SUBJECTS",
          grid: 1,
          items: {
            type: ["string", "number"],
          },
          format: "MultiCheck",
          uniqueItems: true,
        },
        payment_receipt_document_id: {
          label:
            state?.state_name === "RAJASTHAN"
              ? [
                  "ENROLLMENT_RECIEPT_AND_UPLOAD_CLEAR_AND_FULL_PHOTO_OF_ENROLLMENT_RECEIPT",
                ]
              : [
                  "PAYMENT_RECEIPTS_AND_PLEASE_CLEAN_CAMERA_LENSE_AND_STEADY_CAMERA",
                ],
          uploadTitle: "UPLOAD_FROM_PHONE",
          type: ["string", "number"],
          format: "FileUpload",
        },
        application_form: {
          label: "APPLICATION_FORM",
          description: "PLEASE_CLEAN_CAMERA_LENSE_AND_STEADY_CAMERA",
          uploadTitle: "UPLOAD_FROM_PHONE",
          type: ["string", "number"],
          format: state?.state_name === "RAJASTHAN" ? "hidden" : "FileUpload",
        },
        application_login_id: {
          label: "APPLICATION_LOGIN_ID_SCREENSHOT",
          description: "PLEASE_CLEAN_CAMERA_LENSE_AND_STEADY_CAMERA",
          uploadTitle: "UPLOAD_FROM_PHONE",
          isReduce: false,
          type: ["string", "number"],
          format: state?.state_name === "RAJASTHAN" ? "hidden" : "FileUpload",
        },
      },
    },
    edit_enrollement_details: {
      title:
        state?.state_name === "RAJASTHAN"
          ? "ENROLLMENT_RECEIPT"
          : "ENROLLMENT_RECEIPT_DETAILS",
      type: "object",
      required: ["enrollment_first_name", "enrollment_dob"],
      properties: {
        enrollment_first_name: {
          type: "string",
          title: "FIRST_NAME",
          description: "FIRST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
          description:
            state?.state_name === "RAJASTHAN"
              ? "AS_PER_ENROLLMENT_RECEIPT"
              : "AS_PER_APPLICATION_RECEIPT",
        },
        enrollment_middle_name: {
          type: ["string", "null"],
          title: "MIDDLE_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
          description: "MIDDLE_NAME",
        },
        enrollment_last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
          description: "LAST_NAME",
        },
        enrollment_dob: {
          type: "string",
          format: "alt-date",
          label:
            state?.state_name === "RAJASTHAN"
              ? "DATE_OF_BIRTH_AS_PER_ENROLLMENT"
              : "DATE_OF_BIRTH_AS_PER_APPLICATION",
          help: "hello",
        },
      },
    },
  },
};
