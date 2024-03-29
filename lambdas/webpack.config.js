const path = require("path");

module.exports = {
  entry: {
    api: "./src/handlers/api.ts",
    notifications: "./src/handlers/notifications.ts",
    postConfirmation: "./src/handlers/postConfirmation.ts",
    reminders: "./src/handlers/reminders.ts",
  },
  module: { rules: [{ test: /\.ts$/, loader: "ts-loader" }] },
  output: {
    filename: "[name]/index.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: { extensions: [".js", ".ts"] },
  target: "node",
};
