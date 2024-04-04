export const basicRegister = {
  type: "object",
  required: ["first_name", "mobile"],
  properties: {
    labelName: {
      type: "string",
    },
    first_name: {
      type: "string",
      title: "FIRST_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    middle_name: {
      type: "string",
      title: "MIDDLE_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    last_name: {
      type: "string",
      title: "LAST_NAME",
      regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
    },
    labelMobile: {
      type: "string",
    },
    mobile: {
      type: "number",
      title: "MOBILE_NUMBER",
      format: "MobileNumber",
      regex: /^[0-9]{0,10}$/,
    },
  },
};
export const address_details = {
  type: "object",
  required: ["district", "block", "village"],
  properties: {
    labelAddress: {
      type: "string",
    },
    state: {
      title: "STATE",
      type: "string",
      format: "hidden",
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
    grampanchayat: {
      title: "GRAMPANCHAYAT",
      type: "string",
    },
    village: {
      title: "VILLAGE_WARD",
      type: "string",
      format: "select",
    },
    pincode: {
      title: "PINCODE",
      type: "string",
      regex: /^\d{0,6}$/,
    },
  },
};
export const verifyOTP = {
  type: "object",
  required: ["verify_mobile"],
  properties: {
    labelVerifyName: {
      type: "string",
    },
    verify_mobile: {
      type: "number",
      title: "MOBILE_NUMBER",
      format: "MobileNumberReadOnly",
      regex: /^[0-9]{0,10}$/,
    },
  },
};
