export default {
  type: "step",
  properties: {
    basic_details: {
      title: "FULL_NAME",
      step_name: "BASIC_DETAILS",
      type: "object",
      required: ["first_name"],
      properties: {
        first_name: {
          type: "string",
          title: "FIRST_NAME",
        },
        middle_name: {
          type: "string",
          title: "MIDDLE_NAME",
        },
        last_name: {
          type: ["string", "null"],
          title: "LAST_NAME",
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
          type: "number",
          title: "MOBILE_NUMBER",
        },
        device_ownership: {
          label: "DO_YOU_OWN_A_MOBILE_PHONE",
          type: "string",
          format: "RadioBtn",
          enumNames: ["Yes", "No, I use a Family member's"],
          enum: ["yes", "no"],
        },
        device_type: {
          label: "TYPE_OF_MOBILE_PHONE",
          type: "string",
          format: "CustomR",
          grid: 2,
          icons: [{ name: "AndroidLineIcon" }, { name: "AppleLineIcon" }],
        },
        alternative_mobile_number: {
          type: "number",
          title: "ALTERNATIVE_NUMBER",
          label: "ALTERNATIVE_NUMBER",
        },
        email_id: {
          type: ["string", "null"],
          format: "email",
          label: "EMAIL_ID",
          title: "EMAIL_ID",
        },
      },
    },
    address_details: {
      step_name: "ADDRESS_DETAILS",
      title: "ADDRESS",
      type: "object",
      required: ["state", "district", "block", "village"],
      properties: {
        state: {
          title: "STATE",
          type: "string",
          format: "select",
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
          type: ["string", "null"],
        },
      },
    },
    personal_details: {
      step_name: "PERSONAL_DETAILS",
      title: "PERSONAL_DETAILS",
      type: "object",
      required: ["aadhar_token"],
      properties: {
        gender: {
          title: "GENDER",
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
          enumNames: ["Female", "Male", "Other"],
          enum: ["female", "male", "other"],
        },
        marital_status: {
          label: "MARITAL_STATUS",
          type: "string",
          format: "CustomR",
        },
        social_category: {
          label: "SOCIAL_CATEGORY",
          type: "string",
          format: "CustomR",
          grid: 2,
        },
      },
    },
    reference_details: {
      title: "ADD_A_REFERENCE",
      step_name: "REFERENCE_DETAILS",
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          title: "NAME",
          help: "NAME_OF_YOUR_EMPLOYER",
        },
        designation: {
          type: "string",
          title: "DESIGNATION",
        },
        contact_number: {
          type: "number",
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
          type: "string",
          format: "CustomR",
          grid: 2,
          enum: ["part_time", "full_time"],
          enumNames: ["Part time", "Full time"],
        },
      },
    },
    qualification_details: {
      step_name: "QUALIFICATION_DETAILS",
      type: "object",
      properties: {
        qualification_master_id: {
          label: "YOUR_HIGHEST_QUALIFICATION",
          type: ["string", "number"],
          format: "CustomR",
          grid: 2,
        },
        type_of_document: {
          type: "string",
          title: "TYPE_OF_DOCUMENT",
        },
        qualification_reference_document_id: {
          label: "UPLOAD_YOUR_DOCUMENT",
          type: ["string", "number"],
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
  },
};
