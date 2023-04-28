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
          anyOf: [
            { title: "Female", const: "female" },
            { title: "Male", const: "male" },
            { title: "Other", const: "other" },
          ],
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
          anyOf: [],
        },
        district: {
          title: "District",
          type: "string",
          anyOf: [],
        },
        block: {
          title: "Block",
          type: "string",
          anyOf: [],
        },
        village: {
          title: "Village/Ward",
          type: "string",
          anyOf: [],
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
          anyOf: [],
        },
        degree: {
          title: "Do you have any teaching degree?",
          type: "string",
          anyOf: [],
        },
      },
    },
    8: {
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
                anyOf: [
                  { title: "1", const: "1" },
                  { title: "2", const: "2" },
                  { title: "3", const: "3" },
                  { title: "4", const: "4" },
                  { title: "5+", const: "5" },
                ],
              },
              related_to_teaching: {
                title: "Is the job related to teaching?",
                type: "string",
                enum: ["Yes", "No"],
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
    9: {
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
                anyOf: [
                  { title: "1", const: "1" },
                  { title: "2", const: "2" },
                  { title: "3", const: "3" },
                  { title: "4", const: "4" },
                  { title: "5+", const: "5" },
                ],
              },
              related_to_teaching: {
                title: "Is the job related to teaching?",
                type: "string",
                enum: ["Yes", "No"],
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
          enum: ["Part time", "Full time"],
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
          enum: ["Yes", "No, I use a Family member's"],
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
          anyOf: [
            { title: "Android", const: "android" },
            { title: "IPhone", const: "iphone" },
          ],
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
          anyOf: [
            { title: "Prerak Referral", const: "prerak_referral" },
            { title: "NGO Referral", const: "ngo_referral" },
            { title: "Advertisements", const: "advertisements" },
            { title: "Dropouts", const: "dropouts" },
            { title: "Old Prerak", const: "old_prerak" },
            { title: "Other", const: "other" },
          ],
        },
      },
    },
  },
};
