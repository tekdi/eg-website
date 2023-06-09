const { dependencies } = require("./package.json");

module.exports = {
  name: "facilitator",
  exposes: {
    "./SampleComponent": "./src/components/SampleComponent",
  },
  remotes: {
    auth: `auth@[window.appModules.auth.url]/moduleEntry.js`,
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
