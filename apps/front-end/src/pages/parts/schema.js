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
          type: ["string", "null"],
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
        //   type: ['string', 'null'],
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
          format: "CustomR",
          grid: 3,
          icons: [
            {
              name: "UserFollowLineIcon",
              _icon: { size: "30" },
            },
            {
              name: "UserLineIcon",
              _icon: { size: "30" },
            },
            {
              name: "UserStarLineIcon",
              _icon: { size: "30" },
            },
          ],
          enumNames: ["FEMALE", "MALE", "OTHER"],
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
          type: ["string", "null"],
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
          format: "Aadhaar",
        },
      },
    },
    7: {
      title: "YOUR_HIGHEST_QUALIFICATION",
      type: "object",
      required: ["qualification", "degree"],
      properties: {
        qualification: {
          type: ["string", "number"],
          format: "CustomR",
          grid: 2,
        },
        degree: {
          label: "DO_YOU_HAVE_ANY_TEACHING_DEGREE",
          type: ["string", "number"],
          format: "RadioBtn",
        },
      },
    },
    8: {
      type: "object",
      title: "DO_YOU_HAVE_ANY_VOLUNTEER_EXPERIENCE",
      properties: {
        vo_experience: {
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
                type: ["string", "null"],
                format: "textarea",
                rows: 5,
              },
              experience_in_years: {
                label: "EXPERIENCE_IN_YEARS",
                type: "string",
                format: "CustomR",
                grid: 3,
                enumNames: ["1", "2", "3", "4", "+5"],
                enum: ["1", "2", "3", "4", "5"],
              },
              related_to_teaching: {
                label: "IS_THE_JOB_RELATED_TO_TEACHING",
                type: ["string", "null"],
                format: "RadioBtn",
                enumNames: ["YES", "NO"],
                enum: ["yes", "no"],
              },
            },
          },
        },
      },
    },
    9: {
      title: "DO_YOU_HAVE_ANY_JOB_EXPERIENCE",
      type: "object",
      properties: {
        experience: {
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
                type: ["string", "null"],
                format: "textarea",
                rows: 5,
              },
              experience_in_years: {
                label: "EXPERIENCE_IN_YEARS",
                type: "string",
                format: "CustomR",
                grid: 3,
                enumNames: ["1", "2", "3", "4", "+5"],
                enum: ["1", "2", "3", "4", "5"],
              },
              related_to_teaching: {
                label: "IS_THE_JOB_RELATED_TO_TEACHING",
                type: ["string", "null"],
                format: "RadioBtn",
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
      required: [
        "availability",
        "device_ownership",
        "device_type",
        "sourcing_channel",
      ],
      properties: {
        availability: {
          label: "YOUR_WORK_AVAILABILITY_WILL_BE",
          type: "string",
          format: "CustomR",
          grid: 2,
          enum: ["part_time", "full_time"],
          enumNames: ["PART_TIME", "FULL_TIME"],
        },
        device_ownership: {
          label: "DO_YOU_OWN_A_MOBILE_PHONE",
          type: "string",
          format: "RadioBtn",
          enumNames: ["YES", "NO_I_USE_A_FAMILY_MEMBERS"],
          enum: ["yes", "no"],
        },
        device_type: {
          label: "TYPE_OF_MOBILE_PHONE",
          type: "string",
          format: "CustomR",
          grid: 2,
          icons: [{ name: "AndroidLineIcon" }, { name: "AppleLineIcon" }],
          enumNames: ["ANDROID", "IPHONE"],
          enum: ["android", "iphone"],
        },
        sourcing_channel: {
          label: "HOW_DID_YOU_FIND_OUT_ABOUT_PROJECT_PRAGATI",
          type: "string",
          format: "CustomR",
          grid: 2,

          enumNames: [
            "PRERAK_REFERRAL",
            "NGO_REFERRAL",
            "ADVERTISEMENTS",
            "DROPOUTS",
            "OLD_PRERAK",
            "OTHER",
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
