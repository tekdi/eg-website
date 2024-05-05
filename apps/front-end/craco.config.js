const cracoModuleFederation = require("craco-module-federation");
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  devServer: {
    port: 4000,
  },
  webpack: {
    plugins: [new ExternalTemplateRemotesPlugin()],
  },
  plugins: [
    {
      plugin: cracoModuleFederation,
    },
  ],
};
