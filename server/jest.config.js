module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Limit tests to modules and middlewares to focus coverage
  roots: ["<rootDir>/__tests__/modules", "<rootDir>/__tests__/middlewares"],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/modules/**/*.ts",
    "<rootDir>/src/middlewares/**/*.ts",
  ],
  coverageReporters: ["text-summary", "lcov"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.tests.json" }],
  },
};
