const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "lib"),
    filename: "index.js",
    library: "nutso"
  },
  resolve: {
    extensions: [".ts"]
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  }
};
