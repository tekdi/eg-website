export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "Tell us your Name",
      description: "(As Per Aadhaar Card)",
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
      description: "(Please Enter Your Whatsapp Number)",
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
      title: "What is Your Date of Birth ?",
      description: "(As per Aadhaar)",
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
      title: "Where do you currently Live?",
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
      title: "ID Verification",
      description: "Enter the 12 digit number on your Aadhaar Card",
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
      title: "Your work availability will be?",
      type: "object",
      required: ["availability"],
      properties: {
        availability: {
          type: "string",
          enum: ["part_time", "full_time"],
          enumNames: ["Part time", "Full time"],
        },
      },
    },
    11: {
      title: "Do you own a mobile phone?",
      type: "object",
      required: ["device_ownership"],
      properties: {
        device_ownership: {
          title: " ",
          type: "string",
          enumNames: ["Yes", "No, I use a Family member's"],
          enum: ["yes", "no"],
        },
      },
    },
    12: {
      title: "Type of mobile phone?",
      type: "object",
      required: ["device_type"],
      properties: {
        device_type: {
          title: "Please select",
          type: "string",
          enumNames: ["Android", "IPhone"],
          enum: ["android", "iphone"],
        },
      },
    },
    13: {
      type: "object",
      required: ["sourcing_channel"],
      title: "How did you find out about Project Pragati?",
      properties: {
        sourcing_channel: {
          type: "string",
          title: "Please select",
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
