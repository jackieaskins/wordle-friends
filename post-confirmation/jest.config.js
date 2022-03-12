module.exports = {
  clearMocks: true,
  collectCoverage: true,
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  preset: "ts-jest",
  setupFiles: ["<rootDir>/jest/setEnvVars.js"],
};
