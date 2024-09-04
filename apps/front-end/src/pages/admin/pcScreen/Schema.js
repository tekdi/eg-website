export const schema1 = {
  type: "object",
  required: [
    "first_name",
    "mobile",
    "email_id",
    "state",
    "district",
    "block",
    "village",
    "address",
  ],
  properties: {
    first_name: {
      type: "string",
      title: "FULL_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    mobile: {
      type: "number",
      title: "MOBILE_NUMBER",
      format: "MobileNumber",
      regex: /^\d{0,10}$/,
    },
    email_id: {
      type: "string",
      format: "email",
      title: "EMAIL_ID",
    },
    state: {
      title: "STATE",
      type: "string",
      // format: "select",
      readOnly: true,
    },
    district: {
      title: "DISTRICT",
      type: "string",
      format: "select",
    },
    block: {
      title: "BLOCK",
      type: "string",
      format: "select",
    },
    village: {
      title: "VILLAGE_WARD",
      type: "string",
      format: "select",
    },
    address: {
      title: "ADDRESS_DETAILS",
      type: ["string", "null"],
    },
  },
};
