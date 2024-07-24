export const basicRegister = {
  type: "object",
  required: ["first_name", "mobile", "dob", "gender"],
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

    dob: {
      label: "DATE_OF_BIRTH",
      type: "string",
      format: "date",
    },
    gender: {
      label: "GENDER",
      type: "string",
      format: "CustomR",
      grid: 3,
      icons: [
        {
          name: "Female",
          px: "8",
          _icon: { size: "30", activeColor: "white", color: "#D53546" },
        },
        {
          name: "Male",
          px: "8",
          _icon: { size: "30", activeColor: "white", color: "#D53546" },
        },
        {
          name: "Other",
          px: "8",
          _icon: { size: "30", activeColor: "white", color: "#D53546" },
        },
      ],
      enumNames: ["FEMALE", "MALE", "OTHER"],
      enum: ["female", "male", "other"],
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

export const contact_details = {
  type: "object",
  required: [
    "device_ownership",
    "device_type",
    "marital_status",
    "social_category",
  ],
  properties: {
    device_ownership: {
      label: "DO_YOU_OWN_A_MOBILE_PHONE",
      type: "string",
      format: "RadioBtn",
      enumNames: ["YES", "NO_I_USE_A_FAMILY_MEMBERS"],
      enum: ["self", "family"],
    },
    device_type: {
      label: "TYPE_OF_MOBILE_PHONE",
      type: "string",
      format: "CustomR",
      grid: 2,
      icons: [{ name: "AndroidLineIcon" }, { name: "AppleLineIcon" }],
    },
    marital_status: {
      label: "MARITAL_STATUS",
      type: "string",
      format: "RadioBtn",
      grid: 2,
    },
    social_category: {
      label: "SOCIAL_CATEGORY",
      type: "string",
      format: "RadioBtn",
      grid: 2,
    },
  },
};

export const qualification_details = {
  step_name: "QUALIFICATION_DETAILS",
  required: [
    "qualification_master_id",
    // "qualification_reference_document_id",
    "qualification_ids",
    "has_diploma",
    "diploma_details",
  ],
  type: "object",
  // title: "4_QUALIFICATION_DETAILS",
  properties: {
    qualification_master_id: {
      label: "YOUR_HIGHEST_QUALIFICATION",
      type: ["string", "number"],
      format: "RadioBtn",
      grid: 2,
    },
    // type_of_document: {
    //   type: "string",
    //   title: "TYPE_OF_DOCUMENT",
    // },
    // qualification_reference_document_id: {
    //   label: "UPLOAD_YOUR_HIGHEST_QUALIFICATION_DOCUMENT",
    //   document_type: "highest_qualification_document",
    //   type: ["string", "number"],
    //   format: "FileUpload",
    //   uploadTitle: "UPLOAD_FROM_PHONE",
    // },
    qualification_ids: {
      label: "TEACHING_RALATED_DEGREE",
      format: "MultiCheck",
      type: "array",
      grid: 1,
      items: {
        type: ["string", "number"],
      },
      uniqueItems: true,
    },
    has_diploma: {
      label: "HAVE_YOU_DONE_YOUR_DIPLOMA",
      type: "boolean",
      format: "RadioBtn",
      _stack: { direction: "row", justifyContent: "space-between" },
    },
    diploma_details: {
      label: "NAME_OF_THE_DIPLOMA",
      type: "string",
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
    village: {
      title: "VILLAGE_WARD",
      type: "string",
      format: "select",
    },
    grampanchayat: {
      title: "GRAMPANCHAYAT",
      type: "string",
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
