import { jsonParse } from "@shiksha/common-lib";

let state = jsonParse(localStorage.getItem("program"));

export default {
  type: "step",
  properties: {
    edit_disability: {
      title: "BENEFICIARY_DISABILITY_DETAILS",
      type: "object",
      required: [
        "has_disability",
        "type_of_disability",
        "has_disability_certificate",
        "disability_percentage",
        "disability_occurence",
        "has_govt_advantage",
        "govt_advantages",
        "support_for_exam",
      ],
      properties: {
        has_disability: {
          type: "string",
          title: "BENEFICIARY_HAS_DISABILITY",
          format: "RadioBtn",
        },
        type_of_disability: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "BENEFICIARY_TYPE_OF_DISABILITY",
          grid: 1,
          items: {
            type: ["string", "number"],
          },
          format: "MultiCheck",
          uniqueItems: true,
        },
        has_disability_certificate: {
          type: "string",
          label: "BENEFICIARY_HAS_DISABILITY_CERTIFICATE",
          format: "RadioBtn",
        },
        disability_percentage: {
          type: "number",
          label: "BENEFICIARY_DISABILITY_PERCENTAGE",
        },
        disability_occurence: {
          type: "string",
          title: "BENEFICIARY_DISABILITY_OCCURANCE",
          format: "RadioBtn",
        },

        has_govt_advantage: {
          type: "string",
          label: "BENEFICIARY_HAS_GOVT_ADVANTAGE",
          format: "RadioBtn",
        },
        govt_advantages: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "BENEFICIARY_GOVT_ADVANTAGES",
          grid: 1,
          items: {
            type: ["string", "number"],
          },
          format: "MultiCheck",
          uniqueItems: true,
        },
        support_for_exam: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "BENEFICIARY_SUPPORT_FOR_EXAM",
          grid: 1,
          items: {
            type: ["string", "number"],
          },
          format: "MultiCheck",
          uniqueItems: true,
        },
      },
    },
  },
};
