module.exports = {
  clearMocks: true,
  collectCoverage: true,
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
};
