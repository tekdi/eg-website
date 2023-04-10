const { dependencies } = require("./package.json");

module.exports = {
  name: "auth",
  exposes: {
    "./Login": "./src/pages/Login",
  },
  remotes: {},
  filename: "moduleEntry.js",
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies["react"],
    },
    "react-dom": {
      singleton: true,
      requiredVersion: dependencies["react-dom"],
    },
  },
};
