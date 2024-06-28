export const schema1 = {
  type: "object",
  required: ["description", "hours", "minutes"],
  properties: {
    dob: {
      label: "DATE_OF_BIRTH",
      type: "string",
      format: "date",
    },
    qualification_reference_document_id: {
      label: "UPLOAD_YOUR_HIGHEST_QUALIFICATION_DOCUMENT",
      document_type: "highest_qualification_document",
      type: ["string", "number"],
      format: "OfflineFileUpload",
    },
  },
};
