export default {
  description: "1.Basic details",
  type: "step",
  properties: {
    1: {
      title: "LEARNER_AADHAAR_NUMBER",
      type: "object",
      required: ["aadhar_no"],
      properties: {
        aadhar_no: {
          type: "string",
          title: "LEARNER_AADHAAR_NUMBER",
          format: "Aadhaar",
        },
        edit_page_type: {
          type: "string",
          format: "hidden",
          default: "add_ag_duplication",
        },
      },
    },
  },
};
