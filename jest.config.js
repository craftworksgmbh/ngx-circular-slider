module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setupJest.ts"],
  coveragePathIgnorePatterns: ["jestGlobalMocks.ts", "setupJest.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!@ngrx|angular2-ui-switch|ng-dynamic)"
  ]
};
