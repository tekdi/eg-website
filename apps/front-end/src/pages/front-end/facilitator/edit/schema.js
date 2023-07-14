export default {
  type: "step",
  properties: {
    basic_details: {
      title: "FULL_NAME",
      step_name: "BASIC_DETAILS",
      type: "object",
      required: ["first_name", "dob"],
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
        dob: {
          label: "DATE_OF_BIRTH",
          type: "string",
          format: "date",
        },
      },
    },
    contact_details: {
      step_name: "CONTACT_DETAILS",
      title: "CONTACT_INFORMATION",
      type: "object",
      required: ["mobile"],
      properties: {
        mobile: {
          type: ["number", "null"],
          title: "MOBILE_NUMBER",
          format: "MobileNumber",
        },
        device_ownership: {
          label: "DO_YOU_OWN_A_MOBILE_PHONE",
          type: ["string", "null"],
          format: "RadioBtn",
          enumNames: ["YES", "NO_I_USE_A_FAMILY_MEMBERS"],
          enum: ["yes", "no"],
        },
        device_type: {
          label: "TYPE_OF_MOBILE_PHONE",
          type: ["string", "null"],
          format: "CustomR",
          grid: 2,
          icons: [{ name: "AndroidLineIcon" }, { name: "AppleLineIcon" }],
        },
        alternative_mobile_number: {
          type: ["number", "null"],
          title: "ALTERNATIVE_NUMBER",
          format: "MobileNumber",
        },
        email_id: {
          type: ["string", "null"],
          format: "email",
          title: "EMAIL_ID",
        },
      },
    },
    address_details: {
      step_name: "ADDRESS_DETAILS",
      title: "ADDRESS",
      type: "object",
      required: ["state", "district", "block", "village", "grampanchayat"],
      properties: {
        state: {
          title: "STATE",
          type: ["string", "null"],
          format: "select",
        },
        district: {
          title: "DISTRICT",
          type: ["string", "null"],
          format: "select",
        },
        block: {
          title: "BLOCK",
          type: ["string", "null"],
          format: "select",
        },
        village: {
          title: "VILLAGE_WARD",
          type: ["string", "null"],
          format: "select",
        },
        grampanchayat: {
          title: "GRAMPANCHAYAT",
          type: ["string", "null"],
        },
      },
    },
    personal_details: {
      step_name: "PERSONAL_DETAILS",
      type: "object",
      required: ["gender", "marital_status", "social_category"],
      properties: {
        gender: {
          label: "GENDER",
          type: ["string", "null"],
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
        marital_status: {
          label: "MARITAL_STATUS",
          type: ["string", "null"],
          format: "CustomR",
          grid: 2,
        },
        social_category: {
          label: "SOCIAL_CATEGORY",
          type: ["string", "null"],
          format: "CustomR",
          grid: 2,
        },
      },
    },
    reference_details: {
      title: "ADD_A_REFERENCE",
      step_name: "REFERENCE_DETAILS",
      type: "object",
      required: ["name", "contact_number"],
      properties: {
        name: {
          type: ["string", "null"],
          title: "NAME",
          help: "NAME_OF_YOUR_EMPLOYER",
        },
        designation: {
          type: ["string", "null"],
          title: "DESIGNATION",
        },
        contact_number: {
          type: ["number", "null"],
          format: "MobileNumber",
          title: "CONTACT_NUMBER",
        },
      },
    },
    work_availability_details: {
      step_name: "OTHER_DETAILS",
      type: "object",
      properties: {
        availability: {
          label: "YOUR_WORK_AVAILABILITY_WILL_BE",
          type: ["string", "null"],
          format: "CustomR",
          grid: 2,
          enum: ["part_time", "full_time"],
          enumNames: ["Part time", "Full time"],
        },
      },
    },
    qualification_details: {
      step_name: "QUALIFICATION_DETAILS",
      title: "YOUR_HIGHEST_QUALIFICATION",
      type: "object",
      properties: {
        qualification_master_id: {
          //label: "YOUR_HIGHEST_QUALIFICATION",
          type: ["string", "number", "null"],
          format: "CustomR",
          grid: 2,
        },
        // type_of_document: {
        //   type: ["string", "null"],
        //   title: "TYPE_OF_DOCUMENT",
        // },
        qualification_reference_document_id: {
          label: "UPLOAD_YOUR_HIGHEST_QUALIFICATION_DOCUMENT",
          document_type: "highest_qualification_document",
          type: ["string", "number", "null"],
          format: "FileUpload",
        },
        qualification_ids: {
          type: "array",
          label: "TEACHING_RALATED_DEGREE",
          items: {
            type: ["string", "number"],
          },
          uniqueItems: true,
        },
      },
    },
    aadhaar_details: {
      step_name: "QUALIFICATION_DETAILS",
      title: "ID_VERIFICATION",
      description: "ENTER_THE_12_DIGIT_AADHAAR_CARD",
      type: "object",
      required: ["aadhar_no"],
      properties: {
        aadhar_no: {
          title: "AADHAAR_NUMBER",
          type: "number",
          format: "Aadhaar",
        },
      },
    },
  },
};
