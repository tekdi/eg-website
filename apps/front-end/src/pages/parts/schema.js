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
            { title: "Female", const: "Female" },
            { title: "Male", const: "Male" },
            { title: "Other", const: "Other" },
          ],
        },
      },
    },
    5: {
      title: "What do you Identify as?",
      type: "object",
      required: ["state_id", "district_id", "block_id", "village_Ward_id"],
      properties: {
        state_id: {
          title: "State",
          type: "string",
          anyOf: [{ title: "Rajasthan", const: "Rajasthan" }],
        },
        district_id: {
          title: "District",
          type: "string",
          anyOf: [
            { title: "BARAN", const: "BARAN" },
            { title: "BARMER", const: "BARMER" },
            { title: "DAUSA", const: "DAUSA" },
            { title: "JAIPUR", const: "JAIPUR" },
            { title: "JODHPUR", const: "JODHPUR" },
          ],
        },
        block_id: {
          title: "Block",
          type: "string",
          anyOf: [
            { title: "ANTA", const: "ANTA" },
            { title: "ATRU", const: "ATRU" },
            { title: "BARAN", const: "BARAN" },
            { title: "CHHABRA", const: "CHHABRA" },
            { title: "CHHIPABAROD", const: "CHHIPABAROD" },
            { title: "BALOTRA", const: "BALOTRA" },
            { title: "BARMER", const: "BARMER" },
            { title: "BARMER RURAL", const: "BARMER RURAL" },
            { title: "CHOHTAN", const: "CHOHTAN" },
            { title: "DHANAU", const: "DHANAU" },
            { title: "LALSOT", const: "LALSOT" },
            { title: "LAWAN", const: "LAWAN" },
            { title: "MAHWA", const: "MAHWA" },
            { title: "NANGAL RAJAWATAN", const: "NANGAL RAJAWATAN" },
            { title: "RAMGARH PACHWARA", const: "RAMGARH PACHWARA" },
            { title: "AMBER", const: "AMBER" },
            { title: "ANDHI", const: "ANDHI" },
            { title: "BASSI", const: "BASSI" },
            { title: "CHAKSU", const: "CHAKSU" },
            { title: "DUDU", const: "DUDU" },
            { title: "AAU", const: "AAU" },
            { title: "BALESAR", const: "BALESAR" },
            { title: "BAORI", const: "BAORI" },
            { title: "BAP", const: "BAP" },
            { title: "BAPINI", const: "BAPINI" },
          ],
        },
        village_Ward_id: {
          title: "Village/Ward",
          type: "string",
          anyOf: [
            { title: "AKHERI", const: "AKHERI" },
            { title: "DELAHERI", const: "DELAHERI" },
            { title: "DATURIYA", const: "DATURIYA" },
            { title: "DABRIKAKAKAJI", const: "DABRIKAKAKAJI" },
            { title: "DABRI NAKKI", const: "DABRI NAKKI" },
            { title: "UMMEDGANJ", const: "UMMEDGANJ" },
            { title: "BANPUR", const: "BANPUR" },
            { title: "BARALA", const: "BARALA" },
            { title: "BARAVDI", const: "BARAVDI" },
            { title: "BARKHEDI", const: "BARKHEDI" },
            {
              title: "ND_BARAN - Ward No.- 12",
              const: "ND_BARAN - Ward No.- 12",
            },
            {
              title: "ND_BARAN - Ward No.- 13",
              const: "ND_BARAN - Ward No.- 13",
            },
            {
              title: "ND_BARAN - Ward No.- 15",
              const: "ND_BARAN - Ward No.- 15",
            },
            {
              title: "ND_BARAN - Ward No.- 16",
              const: "ND_BARAN - Ward No.- 16",
            },
            { title: "PIPALDA", const: "PIPALDA" },
            { title: "KHATOLI", const: "KHATOLI" },
            { title: "AHAMAD PURA", const: "AHAMAD PURA" },
            { title: " AKODIYAPAR", const: "AKODIYAPAR" },
            { title: "ALAMPURA", const: "ALAMPURA" },
            { title: "ALI NAGAR", const: "ALI NAGAR" },
          ],
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
          anyOf: [
            { title: "Bachelors", const: "Bachelors" },
            { title: "Masters", const: "Masters" },
            { title: "Diploma", const: "Diploma" },
            { title: "Post Graduate", const: "Post Graduate" },
            { title: "Ph.D.", const: "Ph.D." },
            { title: "Other", const: "Other" },
          ],
        },
        degree: {
          title: "Do you have any teaching degree?",
          type: "string",
          anyOf: [
            { title: "No", const: "No" },
            { title: "B.Ed", const: "B.Ed" },
            { title: "D.Ed", const: "D.Ed" },
            { title: "M.Ed", const: "M.Ed" },
          ],
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
              "job_title",
              "Company_Name",
              "experience_in_years",
              "related_to_teaching",
            ],
            properties: {
              job_title: {
                title: "Job Title",
                type: "string",
              },
              Company_Name: {
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
              "job_title",
              "Company_Name",
              "experience_in_years",
              "related_to_teaching",
            ],
            properties: {
              job_title: {
                title: "Job Title",
                type: "string",
              },
              Company_Name: {
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
            { title: "Android", const: "Android" },
            { title: "IPhone", const: "IPhone" },
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
            { title: "Prerak Referral", const: "Prerak Referral" },
            { title: "NGO Referral", const: "NGO Referral" },
            { title: "Advertisements", const: "Advertisements" },
            { title: "Dropouts", const: "Dropouts" },
            { title: "Old Prerak", const: "Old Prerak" },
            { title: "Other", const: "Other" },
          ],
        },
      },
    },
  },
};
