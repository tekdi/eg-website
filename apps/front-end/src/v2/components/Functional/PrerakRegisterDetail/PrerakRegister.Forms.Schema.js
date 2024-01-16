export const basicRegister = {
    title: "TELL_US_YOUR_NAME",
    description: "AS_PER_AADHAAR",
    type: "object",
    required: ["first_name", "last_name"],
    properties: {
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

      first_name1: {
        type: "string",
        title: "FIRST_NAME",
        regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      middle_name1: {
        type: "string",
        title: "MIDDLE_NAME",
        regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
      last_name1: {
        type: "string",
        title: "LAST_NAME",
        regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
      },
    },
  };;
export const verifyOTP = {};
