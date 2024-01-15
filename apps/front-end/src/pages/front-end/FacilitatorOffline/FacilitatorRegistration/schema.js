export const idVerificationSchema = {
  type: "object",
  required: ["aadharName"],
  properties: {
    aadharName: {
      type: "string",
      title: "AADHAR_CARD",
    },
  },
};

export const enterBasicDetailsSchema = {
  type: "object",
  required: ["firstName", "lastName"],

  properties: {
    firstName: {
      type: "string",
      title: "FIRST_NAME",
    },
    lastName: {
      type: "string",
      title: "LAST_NAME",
    },
    mobile: {
      label: "HOW_CAN_CONTACT_YOU",
      type: "number",
      title: "MOBILE_NUMBER",
    },
  },
};

export const contactDetailsSchema = {
  type: "object",
  required: ["aadharName"],
  properties: {
    mobile: {
      type: "number",
      title: "MOBILE_NUMBER",
    },
  },
};
