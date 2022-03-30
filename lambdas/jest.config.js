module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["<rootDir>/src/tests"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/jest/setEnvVars.js"],
};
