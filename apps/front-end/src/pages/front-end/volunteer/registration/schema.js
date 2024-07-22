export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "TELL_US_YOUR_NAME",
      description: "AS_PER_AADHAAR",
      type: "object",
      required: ["first_name", "last_name", "gender", "email_id", "dob"],
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
        gender: {
          label: "GENDER",
          type: "string",
          format: "CustomR",
          grid: 3,
          icons: [
            {
              name: "Female",
              _icon: { size: "30" },
            },
            {
              name: "Male",
              _icon: { size: "30" },
            },
            {
              name: "Other",
              _icon: { size: "30" },
            },
          ],
          enumNames: ["FEMALE", "MALE", "OTHER"],
          enum: ["female", "male", "other"],
        },

        email_id: {
          require,
          type: "string",
          format: "email",
          title: "EMAIL_ID",
          label: "EMAIL_ID",
        },
        dob: {
          label: "DATE_OF_BIRTH",
          type: "string",
          format: "date",
        },
      },
    },
    2: {
      title: "WHERE_DO_YOU_CURRENTLY_LIVE",
      type: "object",
      required: ["state", "pincode"],
      properties: {
        state: {
          title: "STATE",
          type: "string",
          format: "select",
        },
        // district: {
        //   title: "DISTRICT",
        //   type: "string",
        //   format: "select",
        // },
        // block: {
        //   title: "BLOCK",
        //   type: "string",
        //   format: "select",
        // },
        // village: {
        //   title: "VILLAGE_WARD",
        //   type: "string",
        //   format: "select",
        // },
        // grampanchayat: {
        //   title: "GRAMPANCHAYAT",
        //   type: "string",
        // },
        pincode: {
          title: "PINCODE",
          type: "string",
          regex: /^\d{0,6}$/,
        },
      },
    },
    3: {
      title: "YOUR_HIGHEST_QUALIFICATION",
      type: "object",
      required: ["qualification"],
      properties: {
        qualification: {
          label: "SELECT_HIGHEST_QUALIFICATION",
          title: "SELECT_HIGHEST_QUALIFICATION",
          type: "string",
          format: "RadioBtn",
          grid: 2,
        },
      },
    },
    4: {
      title: "CONTACT_INFORMATION",
      type: "object",
      required: ["mobile"],
      properties: {
        mobile: {
          type: "number",
          label: "MOBILE_NUMBER",
          title: "MOBILE_NUMBER",
          format: "MobileNumber",
        },
      },
    },
  },
};
