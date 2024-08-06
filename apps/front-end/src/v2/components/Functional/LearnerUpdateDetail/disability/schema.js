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
          title: "has_disability",
          format: "RadioBtn",
        },
        type_of_disability: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "type_of_disability",
          grid: 1,
          items: {
            type: ["string", "number"],
          },
          format: "MultiCheck",
          uniqueItems: true,
        },
        has_disability_certificate: {
          type: "string",
          label: "has_disability_certificate",
          format: "RadioBtn",
        },
        disability_percentage: {
          type: "number",
          label: "disability_percentage",
        },
        disability_occurence: {
          type: "string",
          title: "disability_occurence",
          format: "RadioBtn",
        },

        has_govt_advantage: {
          type: "string",
          label: "has_govt_advantage",
          format: "RadioBtn",
        },
        govt_advantages: {
          minItems: 1,
          maxItems: 7,
          type: "array",
          label: "govt_advantages",
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
          label: "support_for_exam",
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
