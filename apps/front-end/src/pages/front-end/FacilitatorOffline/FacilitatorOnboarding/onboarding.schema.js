export const dateOfBirthSchema = {
  type: "object",
  required: ["dob"],
  properties: {
    dob: {
      type: "string",
      label: "DATE_OF_BIRTH",
      description: "AS_PER_AADHAAR",
      format: "date",
    },
  },
};

export const contactDetailsSchema = {
  step_name: "CONTACT_DETAILS",
  title: "CONTACT_INFORMATION",
  type: "object",
  required: ["mobile"],
  properties: {
    mobile: {
      type: "number",
      title: "MOBILE_NUMBER",
      format: "MobileNumber",
    },
    device_ownership: {
      label: "DEVICE_OWNERSHIP",
      type: "string",
      format: "RadioBtn",
      enum: ["YES", "NO_I_USE_A_FAMILY_MEMBERS"],
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
    alternative_mobile_number: {
      type: "number",
      title: "ALTERNATIVE_NUMBER",
      format: "MobileNumber",
    },
    email_id: {
      type: "string",
      format: "email",
      title: "EMAIL_ID",
    },
  },
};

export const basicDetailsSchema = {
  type: "object",
  properties: {
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
    marital_status: {
      label: "MARITAL_STATUS",
      type: "string",
      format: "CustomR",
      grid: 2,
      enumNames: [
        "MARITAL_STATUS_MARRIED",
        "MARITAL_STATUS_UNMARRIED",
        "MARITAL_STATUS_SINGLE",
      ],
      enum: ["married", "unmarried", "single"],
    },
    social_category: {
      label: "SOCIAL_CATEGORY",
      type: "string",
      format: "CustomR",
      grid: 2,
      enumNames: [
        "BENEFICIARY_SOCIAL_STATUS_GENERAL",
        "BENEFICIARY_SOCIAL_STATUS_SC",
        "BENEFICIARY_SOCIAL_STATUS_ST",
        "BENEFICIARY_SOCIAL_STATUS_OBC",
        "BENEFICIARY_REASONS_FOR_DROPOUT_REASONS_OTHER",
      ],
      enum: ["general", "sc", "st", "obc", "other"],
    },
  },
};

export const volunteerExperienceSchema = {
  type: "object",
  required: ["aadharName"],
  properties: {
    vo_experience: {
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
                title: "VOLUNTEER_TITLE",
                type: "string",
              },
              organization: {
                title: "COMPANY_AND_ORGANIZATION_NAME",
                type: "string",
              },
              add_description: {
                title: "THE_ENROLLMENT_DETAILS",
                type: "string",
              },

              experience_in_years: {
                label: "EXPERIENCE_IN_YEARS",
                type: "string",
                format: "CustomR",
                grid: 5,
                enumNames: ["<=1", "2", "3", "4", "5+"],
                enum: ["1", "2", "3", "4", "5"],
              },

              related_to_teaching: {
                label: "IS_THE_JOB_RELATED_TO_TEACHING",
                type: "string",
                format: "RadioBtn",
                enumNames: ["YES", "NO"],
                enum: ["yes", "no"],
              },
              description: {
                title: "DESCRIPTION",
                type: "string",
                // format: "Textarea",
              },
            },
          },
        },
      },
    },
  },
};

export const jobExperienceSchema = {
  type: "object",
  required: ["aadharName"],
  properties: {
    job_experience: {
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
                type: "string",
                format: "Textarea",
                rows: 5,
              },
              experience_in_years: {
                label: "EXPERIENCE_IN_YEARS",
                type: "string",
                format: "CustomR",
                grid: 5,
                enumNames: ["<=1", "2", "3", "4", "+5"],
                enum: ["1", "2", "3", "4", "5"],
              },
              related_to_teaching: {
                label: "IS_THE_JOB_RELATED_TO_TEACHING",
                type: "string",
                format: "RadioBtn",
                enumNames: ["YES", "NO"],
                enum: ["yes", "no"],
              },
            },
          },
        },
      },
    },
  },
};

export const educationDetailsSchema = {
  title: "YOUR_HIGHEST_QUALIFICATION",
  type: "object",
  properties: {
    qualification_master_id: {
      type: ["string", "number"],
      format: "CustomR",
      grid: 2,
      enumNames: [
        "PURSUING_GRADUATION",
        "GRADUATION",
        "MASTERS",
        "PHD",
        "12TH_GRADE",
      ],
      enum: [
        "persuing_graduation",
        "graduation",
        "masters",
        "phd",
        "12th_grade",
      ],
    },
    degree: {
      label: "DO_YOU_HAVE_ANY_TEACHING_DEGREE",
      type: ["string", "number"],
      format: "CustomR",
      grid: 2,
      enumNames: ["NTT", "D.El.Ed", "DROPOUT_REASONS_OTHER", "NO_ONE"],
      enum: ["ntt", "ded", "other", "no"],
    },
  },
};

export const otherDetailsSchema = {
  title: "YOUR_WORK_AVAILABILITY_WILL_BE",
  type: "object",
  properties: {
    qualification_master_id: {
      type: ["string", "number"],
      format: "CustomR",
      grid: 2,
      enumNames: ["FACILITATOR_PART_TIME", "FACILITATOR_FULL_TIME"],
      enum: ["part_time", "full_time"],
    },
    degree: {
      label: "HOW_DID_YOU_FIND_OUT_ABOUT_PROJECT_PRAGATI",
      type: ["string", "number"],
      format: "CustomR",
      grid: 2,
      enumNames: [
        "अन्य प्रेरक से",
        "NGO_REFERRAL",
        "विज्ञापन",
        "मैं स्वयं एक पुराना प्रेरक हूं",
        "DROPOUT_REASONS_OTHER",
      ],
      enum: ["ntt", "ded", "other", "no", ""],
    },
  },
};

export const profilePictureSchema = {
  title: "YOUR_WORK_AVAILABILITY_WILL_BE",
  type: "object",
  properties: {
    qualification_master_id: {
      type: ["string", "number"],
      format: "CustomR",
      grid: 2,
      enumNames: ["FACILITATOR_PART_TIME", "FACILITATOR_FULL_TIME"],
      enum: ["part_time", "full_time"],
    },
  },
};
