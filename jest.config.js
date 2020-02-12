module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  snapshotSerializers: ["jest-html"]
};
