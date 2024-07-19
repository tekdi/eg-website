export default {
  type: "step",
  properties: {
    basic_details: {
      title: "1_BASIC_DETAILS",
      description: "FULL_NAME",
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
      },
    },
    contact_details: {
      step_name: "CONTACT_DETAILS",
      title: "1_BASIC_DETAILS",
      description: "CONTACT_INFORMATION",
      type: "object",
      required: ["mobile", "device_ownership", "device_type"],
      properties: {
        mobile: {
          type: "number",
          title: "MOBILE_NUMBER",
          format: "MobileNumber",
        },
        device_ownership: {
          label: "DO_YOU_OWN_A_MOBILE_PHONE",
          type: "string",
          format: "RadioBtn",
          enumNames: ["YES", "NO_I_USE_A_FAMILY_MEMBERS"],
          enum: ["self", "family"],
          readOnly: "",
        },
        device_type: {
          label: "TYPE_OF_MOBILE_PHONE",
          type: "string",
          format: "CustomR",
          grid: 2,
          icons: [{ name: "AndroidLineIcon" }, { name: "AppleLineIcon" }],
          readOnly: "",
        },
        alternative_mobile_number: {
          description: "ALTERNATIVE_NUMBER",
          type: "number",
          title: "MOBILE_NUMBER",
          format: "MobileNumber",
        },
        email_id: {
          description: "EMAIL_ID",
          type: "string",
          format: "email",
          title: "EMAIL_ID",
        },
      },
    },

    address_details: {
      step_name: "ADDRESS_DETAILS",
      title: "1_BASIC_DETAILS",
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
          readOnly: "",
        },
        block: {
          title: "BLOCK",
          type: "string",
          format: "select",
          readOnly: "",
        },

        village: {
          title: "VILLAGE_WARD",
          type: "string",
          format: "select",
          readOnly: "",
        },
        grampanchayat: {
          title: "GRAMPANCHAYAT",
          type: "string",
          readOnly: "",
        },
        pincode: {
          title: "PINCODE",
          type: "string",
          readOnly: "",
        },
      },
    },
    personal_details: {
      step_name: "PERSONAL_DETAILS",
      title: "1_BASIC_DETAILS",
      type: "object",
      required: ["gender", "marital_status", "social_category"],
      properties: {
        gender: {
          label: "GENDER",
          type: "string",
          format: "CustomR",
          grid: 3,
          icons: [
            {
              name: "Female",
              _icon: { size: "30", color: "white" },
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
    },
    reference_details: {
      title: "1_BASIC_DETAILS",
      description: "ADD_A_REFERENCE",
      step_name: "REFERENCE_DETAILS",
      type: "object",
      required: ["name", "designation", "contact_number"],
      properties: {
        name: {
          type: "string",
          title: "NAME",
          help: "NAME_OF_YOUR_EMPLOYER",
          regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
        },
        designation: {
          type: "string",
          title: "DESIGNATION",
        },
        contact_number: {
          type: "number",
          format: "MobileNumber",
          title: "CONTACT_NUMBER",
        },
      },
    },
    work_availability_details: {
      title: "1_BASIC_DETAILS",
      type: "object",
      step_name: "OTHER_DETAILS",
      required: ["availability"],
      properties: {
        availability: {
          label: "YOUR_WORK_AVAILABILITY_WILL_BE",
          type: "string",
          format: "RadioBtn",
          _stack: { direction: "row", justifyContent: "space-between" },
          grid: 2,
          enum: ["part_time", "full_time"],
          enumNames: ["PART_TIME", "FACILITATOR_FULL_TIME"],
        },
      },
    },
    qualification_details: {
      step_name: "QUALIFICATION_DETAILS",
      required: [
        "qualification_master_id",
        "qualification_reference_document_id",
        "qualification_ids",
        "has_diploma",
        "diploma_details",
      ],
      type: "object",
      title: "4_QUALIFICATION_DETAILS",
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
        qualification_reference_document_id: {
          label: "UPLOAD_YOUR_HIGHEST_QUALIFICATION_DOCUMENT",
          document_type: "highest_qualification_document",
          type: ["string", "number"],
          format: "OfflineFileUpload",
          uploadTitle: "UPLOAD_FROM_PHONE",
        },
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
          description: "NAME_OF_THE_DIPLOMA",
          type: "string",
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
          description: "AADHAAR_NUMBER",
          type: ["string", "number"],
          format: "Aadhaar",
        },
      },
    },
  },
};
