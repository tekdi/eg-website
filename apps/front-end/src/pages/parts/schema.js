export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "TELL_US_YOUR_NAME",
      description: "AS_PER_AADHAAR",
      type: "object",
      required: ["first_name"],
      properties: {
        first_name: {
          type: "string",
          title: "FIRST_NAME",
        },
        last_name: {
          type: "string",
          title: "LAST_NAME",
        },
      },
    },
    2: {
      title: "HOW_CAN_CONTACT_YOU",
      description: "PLEASE_WHATSAPP_NUMBER",
      type: "object",
      required: ["mobile"],
      properties: {
        mobile: {
          type: "number",
          title: "MOBILE_NUMBER",
        },
        // email_id: {
        //   type: "string",
        //   format: "email",
        //   title: "EMAIL_ID",
        // },
      },
    },
    3: {
      title: "WHAT_IS_YOUR_DATE_OF_BIRTH",
      description: "AS_PER_AADHAAR",
      type: "object",
      required: ["dob"],
      properties: {
        dob: {
          title: "DATE_OF_BIRTH",
          type: "string",
          format: "date",
        },
      },
    },
    4: {
      title: "WHAT_DO_YOU_IDENTIFY",
      type: "object",
      required: ["gender"],
      properties: {
        gender: {
          title: "GENDER",
          type: "string",
          enumNames: ["Female", "Male", "Other"],
          enum: ["female", "male", "other"],
        },
      },
    },
    5: {
      title: "WHERE_DO_YOU_CURRENTLY_LIVE",
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
          type: "string",
        },
      },
    },
    6: {
      title: "ID_VERIFICATION",
      description: "ENTER_THE_12_DIGIT_AADHAAR_CARD",
      type: "object",
      required: ["aadhar_token"],
      properties: {
        aadhar_token: {
          title: "AADHAAR_NUMBER",
          type: "number",
        },
      },
    },
    7: {
      type: "object",
      required: ["qualification", "degree"],
      properties: {
        qualification: {
          title: "YOUR_HIGHEST_QUALIFICATION",
          type: "string",
          format: "select",
        },
        degree: {
          title: "DO_YOU_HAVE_ANY_TEACHING_DEGREE",
          type: "string",
          format: "select",
        },
      },
    },
    8: {
      type: "object",
      properties: {
        vo_experience: {
          title: "DO_YOU_HAVE_ANY_VOLUNTEER_EXPERIENCE",
          type: "array",
          items: {
            title: "VOLUNTEER_EXPERIENCE",
            required: ["role_title", "organization", "experience_in_years"],
            properties: {
              role_title: {
                title: "JOB_TITLE",
                type: "string",
              },
              organization: {
                title: "COMPANY_NAME",
                type: "string",
              },
              description: {
                title: "DESCRIPTION",
                type: "string",
                format: "textarea",
              },
              experience_in_years: {
                title: "EXPERIENCE_IN_YEARS",
                type: "string",
                enumNames: ["1", "2", "3", "4", "+5"],
                enum: ["1", "2", "3", "4", "5"],
              },
              related_to_teaching: {
                title: "IS_THE_JOB_RELATED_TO_TEACHING",
                type: "string",
                enumNames: ["Yes", "No"],
                enum: ["yes", "no"],
              },
            },
          },
        },
      },
    },
    9: {
      type: "object",
      properties: {
        experience: {
          title: "DO_YOU_HAVE_ANY_JOB_EXPERIENCE",
          type: "array",
          items: {
            title: "EXPERIENCE",
            required: ["role_title", "organization", "experience_in_years"],
            properties: {
              role_title: {
                title: "JOB_TITLE",
                type: "string",
              },
              organization: {
                title: "COMPANY_NAME",
                type: "string",
              },
              description: {
                title: "DESCRIPTION",
                type: "string",
                format: "textarea",
              },
              experience_in_years: {
                title: "EXPERIENCE_IN_YEARS",
                type: "string",
                enumNames: ["1", "2", "3", "4", "+5"],
                enum: ["1", "2", "3", "4", "5"],
              },
              related_to_teaching: {
                title: "IS_THE_JOB_RELATED_TO_TEACHING",
                type: "string",
                enumNames: ["Yes", "No"],
                enum: ["yes", "no"],
              },
            },
          },
        },
      },
    },
    10: {
      type: "object",
      required: ["availability"],
      properties: {
        availability: {
          title: "YOUR_WORK_AVAILABILITY_WILL_BE",
          type: "string",
          enum: ["part_time", "full_time"],
          enumNames: ["Part time", "Full time"],
        },
      },
    },
    11: {
      type: "object",
      required: ["device_ownership"],
      properties: {
        device_ownership: {
          title: "DO_YOU_OWN_A_MOBILE_PHONE",
          type: "string",
          enumNames: ["Yes", "No, I use a Family member's"],
          enum: ["yes", "no"],
        },
      },
    },
    12: {
      type: "object",
      required: ["device_type"],
      properties: {
        device_type: {
          title: "TYPE_OF_MOBILE_PHONE",
          type: "string",
          enumNames: ["Android", "IPhone"],
          enum: ["android", "iphone"],
        },
      },
    },
    13: {
      type: "object",
      required: ["sourcing_channel"],
      title: "HOW_DID_YOU_FIND_OUT_ABOUT_PROJECT_PRAGATI",
      properties: {
        sourcing_channel: {
          title: "PLEASE_SELECT",
          type: "string",
          enumNames: [
            "Prerak Referral",
            "NGO Referral",
            "Advertisements",
            "Dropouts",
            "Old Prerak",
            "Other",
          ],
          enum: [
            "prerak_referral",
            "ngo_referral",
            "advertisements",
            "dropouts",
            "old_prerak",
            "other",
          ],
        },
      },
    },
  },
};
