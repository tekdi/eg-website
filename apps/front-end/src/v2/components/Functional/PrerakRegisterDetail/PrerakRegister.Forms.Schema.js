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
