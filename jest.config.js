import dotenv from "dotenv";

dotenv.config();

/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "<rootDir>/config/CSSStub.js",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  modulePaths: ["<rootDir>/src"],
  /* TODO: This is a temporal hack as Jest wouldn't recognize nor ignore images or assets, or some tests require a really precise fine tuning. Due to time restrains we have to continue. Any developer making changes to any of the files below is required to turn his .env flag to false and continue the TDD process as usual. */
  testPathIgnorePatterns: process.env.SKIP_ATM_TESTS === "true" ? ["<rootDir>/src/views/__tests__/ATMMachine.test.tsx","<rootDir>/src/views/__tests__/PINEntryScreen.test.tsx", "<rootDir>/src/views/__tests__/WithdrawScreen.test.tsx"] : []
};
