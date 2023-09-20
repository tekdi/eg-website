export default {
  type: "step",
  properties: {
    title: "COMMUNITY_DETAILS",
    type: "object",
    properties: {
      reference_details: {
        title: "ADD_A_COMMUNITY_MEMBER",
        step_name: "COMMUNITY_DETAILS",
        type: "object",
        required: ["name", "contact_number"],
        properties: {
          name: {
            type: "string",
            title: "NAME",
            regex: /^(?!.*[\u0900-\u097F])[A-Za-z\s\p{P}]+$/,
          },
          designation: {
            type: "string",
            title: "DESIGNATION",
          },
          contact_number: {
            type: "number",
            format: "MobileNumber",
            title: "CONTACT_NUMBER",
          },
        },
      },
    },
  },
};
