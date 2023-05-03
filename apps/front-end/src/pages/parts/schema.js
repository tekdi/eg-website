export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "Tell us your Name As Per Aadhaar Card",
      type: "object",
      required: ["first_name"],
      properties: {
        first_name: {
          type: "string",
          title: "First Name ",
        },
        last_name: {
          type: "string",
          title: "Last name",
        },
      },
    },
    2: {
      title: "How can we Contact You?",
      type: "object",
      required: ["mobile"],
      properties: {
        mobile: {
          type: "number",
          title: "Mobile Number",
        },
        email_id: {
          type: "string",
          format: "email",
          title: "Email-id",
        },
      },
    },
    3: {
      title: "What is Your Date of Birth ? (As per Aadhaar)",
      type: "object",
      required: ["dob"],
      properties: {
        dob: {
          title: "Date of Birth",
          type: "string",
          format: "date",
        },
      },
    },
    4: {
      title: "What do you Identify as?",
      type: "object",
      required: ["gender"],
      properties: {
        gender: {
          title: "Gender",
          type: "string",
          enumNames: ["Female", "Male", "Other"],
          enum: ["female", "male", "other"],
        },
      },
    },
    5: {
      title: "What do you Identify as?",
      type: "object",
      required: ["state", "district", "block", "village"],
      properties: {
        state: {
          title: "State",
          type: "string",
          format: "select",
        },
        district: {
          title: "District",
          type: "string",
          format: "select",
        },
        block: {
          title: "Block",
          type: "string",
          format: "select",
        },
        village: {
          title: "Village/Ward",
          type: "string",
          format: "select",
        },
        grampanchayat: {
          title: "Grampanchayat",
          type: "string",
        },
      },
    },
    6: {
      title: "Aadhar Number",
      type: "object",
      required: ["aadhar_token"],
      properties: {
        aadhar_token: {
          title: "Aadhar Number",
          type: "string",
        },
      },
    },
    7: {
      title: "Your Highest Qualification:",
      type: "object",
      required: ["qualification"],
      properties: {
        qualification: {
          title: "Your Highest Qualification:",
          type: "string",
          format: "select",
        },
        degree: {
          title: "Do you have any teaching degree?",
          type: "string",
          format: "select",
        },
      },
    },
    8: {
      type: "object",
      properties: {
        vo_experience: {
          title: "Do you have any Volunteer Experience ?",
          type: "array",
          items: {
            title: "Volunteer Experience",
            required: [
              "role_title",
              "organization",
              "experience_in_years",
              "related_to_teaching",
            ],
            properties: {
              role_title: {
                title: "Job Title",
                type: "string",
              },
              organization: {
                title: "Company Name",
                type: "string",
              },
              description: {
                title: "Description",
                type: "string",
                format: "textarea",
              },
              experience_in_years: {
                title: "Experience in years",
                type: "string",
                enumNames: ["1", "2", "3", "4", "+5"],
                enum: ["1", "2", "3", "4", "5"],
              },
              related_to_teaching: {
                title: "Is the job related to teaching?",
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
          title: "Do you have any Work Experience ?",
          type: "array",
          items: {
            title: "Experience",
            required: [
              "role_title",
              "organization",
              "experience_in_years",
              "related_to_teaching",
            ],
            properties: {
              role_title: {
                title: "Job Title",
                type: "string",
              },
              organization: {
                title: "Company Name",
                type: "string",
              },
              experience_in_years: {
                title: "Experience in years",
                type: "string",
                enumNames: ["1", "2", "3", "4", "+5"],
                enum: ["1", "2", "3", "4", "5"],
              },
              related_to_teaching: {
                title: "Is the job related to teaching?",
                type: "string",
                enumNames: ["Yes", "No"],
                enum: ["yes", "no"],
              },
              description: {
                title: "Description",
                type: "string",
                format: "textarea",
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
          title: "Your work availability will be?",
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
          title: "Do you own a mobile phone?",
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
          title: "Type of mobile phone?",
          type: "string",
          enumNames: ["Android", "IPhone"],
          enum: ["android", "iphone"],
        },
      },
    },
    13: {
      type: "object",
      required: ["sourcing_channel"],
      properties: {
        sourcing_channel: {
          title: "How did you find out about Project Pragati?",
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
