const { dependencies } = require("./package.json");

module.exports = {
  name: "frontend",
  exposes: {},
  remotes: {
    auth: `auth@[window.appModules.auth.url]/moduleEntry.js`,
    assessment: `assessment@[window.appModules.assessment.url]/moduleEntry.js`,
  },
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
