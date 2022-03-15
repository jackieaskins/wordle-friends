module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ["<rootDir>/src/testUtils.ts"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
};
