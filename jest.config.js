module.exports = {
  preset: "jest-preset-angular",
  setupTestFrameworkScriptFile: "<rootDir>/src/setupJest.ts",
  coveragePathIgnorePatterns: ["jestGlobalMocks.ts", "setupJest.ts"]
};
