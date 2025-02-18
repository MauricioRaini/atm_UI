/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "<rootDir>/config/CSSStub.js"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
