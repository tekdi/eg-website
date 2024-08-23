import { jsonParse } from "@shiksha/common-lib";

let state = jsonParse(localStorage.getItem("program"));

const nameProperties = (labelPrefix) => ({
  type: ["string", "null"],
  regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
  label: `${labelPrefix}_NAME`,
});

const fileUploadProperties = (label, description) => ({
  label,
  description,
  uploadTitle: " ",
  type: ["string", "number"],
  format: "FileUpload",
});

const getLabelBasedOnState = (rajasthanLabel, otherLabel) => {
  return state?.state_name === "RAJASTHAN" ? rajasthanLabel : otherLabel;
};

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
        "sso_id",
        "enrollment_number",
        "enrollment_mobile_no",
        "enrollment_first_name",
        "enrollment_dob",
        "enrollment_date",
        "payment_receipt_document_id",
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
        sso_id: {
          type: "string",
          // _input: { keyboardType: "numeric" },
          label: "SSO_ID",
        },
        enrollment_number: {
          type: "string",
          regex: /^\d{0,11}$/,
          _input: { keyboardType: "numeric" },
          label: getLabelBasedOnState(
            "APPLICATION_ID",
            state?.state_name == "MADHYA PRADESH"
              ? "ROLL_NUMBER"
              : "ENROLLMENT_NO"
          ),
        },
        enrollment_mobile_no: {
          type: "string",
          label: "MOBILE_NUMBER",
          description: getLabelBasedOnState(
            "AS_PER_ENROLLMENT_RECEIPT",
            "AS_PER_APPLICATION_RECEIPT"
          ),
          format: "MobileNumber",
        },
        enrollment_date: {
          type: "string",
          label: getLabelBasedOnState("ENROLLMENT_DATE", "APPLICATION_DATE"),
          format: "DMY",
        },
        enrollment_first_name: {
          ...nameProperties("FIRST"),
          description: getLabelBasedOnState(
            "AS_PER_ENROLLMENT_RECEIPT",
            "AS_PER_APPLICATION_RECEIPT"
          ),
        },
        enrollment_middle_name: nameProperties("MIDDLE"),
        enrollment_last_name: nameProperties("LAST"),
        enrollment_dob: {
          type: "string",
          format: "alt-date",
          label: getLabelBasedOnState(
            "DATE_OF_BIRTH_AS_PER_ENROLLMENT",
            "DATE_OF_BIRTH_AS_PER_APPLICATION"
          ),
          help: "",
        },
        subjects: {
          type: "array",
          label: "SUBJECTS",
          grid: 3,
          items: {
            type: ["string", "number"],
          },
          format: "MultiCheckSubject",
          uniqueItems: true,
        },
        payment_receipt_document_id: fileUploadProperties(
          getLabelBasedOnState("ENROLLMENT_RECEIPT", "PAYMENT_RECEIPTS"),
          getLabelBasedOnState(
            "UPLOAD_CLEAR_AND_FULL_PHOTO_OF_ENROLLMENT_RECEIPT",
            "PLEASE_CLEAN_CAMERA_LENSE_AND_STEADY_CAMERA"
          )
        ),
        application_form: {
          ...fileUploadProperties(
            "APPLICATION_FORM",
            "PLEASE_CLEAN_CAMERA_LENSE_AND_STEADY_CAMERA"
          ),
          format: state?.state_name === "RAJASTHAN" ? "hidden" : "FileUpload",
        },
        application_login_id: {
          ...fileUploadProperties(
            "APPLICATION_LOGIN_ID_SCREENSHOT",
            "PLEASE_CLEAN_CAMERA_LENSE_AND_STEADY_CAMERA"
          ),
          isReduce: false,
          format: state?.state_name === "RAJASTHAN" ? "hidden" : "FileUpload",
        },
      },
    },
    edit_enrollement_details: {
      title: getLabelBasedOnState(
        "ENROLLMENT_RECEIPT_AS_PER_ENROLLMENT_RECEIPT",
        "ENROLLMENT_RECEIPT_DETAILS"
      ),
      type: "object",
      required: ["enrollment_first_name", "enrollment_dob"],
      properties: {
        enrollment_first_name: {
          ...nameProperties("FIRST"),
          title: "FIRST_NAME",
          description: getLabelBasedOnState(
            "AS_PER_ENROLLMENT_RECEIPT",
            "AS_PER_APPLICATION_RECEIPT"
          ),
        },
        enrollment_middle_name: {
          ...nameProperties("MIDDLE"),
          title: "MIDDLE_NAME",
        },
        enrollment_last_name: {
          ...nameProperties("LAST"),
          title: "LAST_NAME",
        },
        enrollment_dob: {
          type: "string",
          format: "alt-date",
          label: getLabelBasedOnState(
            "DATE_OF_BIRTH_AS_PER_ENROLLMENT",
            "DATE_OF_BIRTH_AS_PER_APPLICATION"
          ),
          help: "",
        },
      },
    },
  },
};
