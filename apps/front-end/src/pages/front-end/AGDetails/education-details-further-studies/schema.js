export default {
  description: "1.AG Educational Details (Educational)",
  type: "step",
  properties: {
    1: {
      title: "EDUCATIONAL_DETAILS",
      type: "object",
      properties: {
        laststandard: {
          type: "string",
          title: "LAST_STANDARD_OF_EDUCATION",
          enumNames: ["Third", "Fourth", "Fifth", "Sixth"],
          enum: ["third", "fourth", "fifth", "sixth"],
        },
        lastyeareducation: {
          type: "string",
          title: "LAST_YEAR_OF_EDUCATION",
          enumNames: ["2020", "2021", "2022", "2023"],
          enum: ["2020", "2021", "2022", "2023"],
        },
        previousschooltype: {
          type: "string",
          title: "PREVIOUS_SCHOOL_TYPE",
          enumNames: ["Full Time", "Half Time"],
          enum: ["full time", "half time"],
        },
        reasonforleaving: {
          type: "string",
          title: "REASON_FOR_LEAVING_STUDIES",
          enumNames: [
            "Due to the distance of the school",
            "Due to failure",
            "Because of the girl's lack of desire to study further",
            "Due to social/family pressure",
            " Due to financial difficulties",
            "Reasons for friend/friends leaving school",
            " Because of getting married",
            "Reasons for migration related to employment",
            "Other",
          ],
          enum: [
            "distance",
            "failure",
            "lack of desire",
            "social pressure",
            "financial difficulties",
            "friends leaving school",
            "getting married",
            " migration",
            "other",
          ],
        },
      },
    },
    2: {
      title: "FURTHER_STUDIES",

      type: "object",
      //required: ["mobile"],
      properties: {
        careeraspiration: {
          type: "number",
          title: "CAREER_ASPIRATION",
          enumNames: ["Start Own Business", "Motivation to learn", "Others"],
          enum: ["start own business", "motivation to learn", "others"],
        },

        tellindetail: {
          type: "string",
          title: "TELL_IN_DETAIL",
        },
      },
    },
    3: {
      title: "ADDRESS",
      type: "object",
      //required: ["state", "district", "block", "village"],
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
        addressdetails: {
          title: "ADDRESS_DETAIL",
          type: "string",
        },
      },
    },
    4: {
      title: "PERSONAL_DETAILS",
      type: "object",
      //required: ["maritalstatus"],
      properties: {
        maritalstatus: {
          title: "MARITAL_STATUS",
          type: "string",
          enumNames: ["Married", "Single", "Divorced", "Seperated", "Other"],
          enum: ["married", "single", "divorced", "seperated", "other"],
        },
        socialstatus: {
          title: "SOCIAL_CATEGORY",
          type: "string",
          enumNames: ["Open ", "S.C.", "S.T.", "O.B.C.", "Other"],
          enum: ["open", "sc", "st", "obc", "other"],
        },
      },
    },
    5: {
      title: "FAMILY_DETAILS",
      type: "object",
      // required: ["first_name"],
      properties: {
        fatherdetails: {
          title: "FATHER_FULL_NAME",
          type: "object",
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
              type: "string",
              title: "LAST_NAME",
            },
          },
        },
        motherdetails: {
          title: "MOTHER_FULL_NAME",
          type: "object",
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
              type: "string",
              title: "LAST_NAME",
            },
          },
        },
      },
    },
    6: {
      title: "REFERENCE_DETAILS",
      type: "object",
      // required: ["first_name"],
      properties: {
        referencefullname: {
          title: "REFERENCE_FULL_NAME",
          type: "object",
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
              type: "string",
              title: "LAST_NAME",
            },
          },
        },
        aglearnerrelationship: {
          title: "AG_LERNER_RELATIONSHP",
          type: "object",
          properties: {
            relation: {
              type: "string",
              title: "RELATION",
            },
            mobile: {
              type: "number",
              title: "MOBILE_NUMBER",
            },
          },
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
          title: "DO_YOU_HAVE_ANY_WORK_EXPERIENCE",
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
