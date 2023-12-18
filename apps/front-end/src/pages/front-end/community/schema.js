export default {
  type: "object",
  required: ["first_name", "contact_number", "designation"],
  properties: {
    first_name: {
      type: "string",
      title: "FIRST_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    middle_name: {
      type: ["string", "null"],
      title: "MIDDLE_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    last_name: {
      type: ["string", "null"],
      title: "LAST_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    designation: {
      type: "string",
      title: "DESIGNATION",
      format: "select",
    },
    contact_number: {
      type: "string",
      title: "MOBILE_NUMBER",
      format: "MobileNumber",
    },
  },
};
