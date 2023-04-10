const { dependencies } = require("./package.json");

module.exports = {
  name: "admin",
  exposes: {},
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
