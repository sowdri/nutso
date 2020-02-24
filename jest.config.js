module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["**/?(*.)+(spec|test).[t]s?(x)"],
  snapshotSerializers: ["jest-html"]
};
