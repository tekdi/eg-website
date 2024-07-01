export const schema1 = {
  type: "object",
  required: ["gender", "dob"],
  properties: {
    dob: {
      label: "DATE_OF_BIRTH",
      type: "string",
      format: "date",
    },
    gender: {
      label: "GENDER",
      type: "string",
      format: "CustomR",
      enumNames: ["MALE", "FEMALE"],
      enum: ["male", "female"],
    },
  },
};
