import { Configuration } from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"

const config: Configuration = {
  entry: "./client",
  resolve: { extensions: [".ts", ".js", ".json", ".wasm"] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: { version: 3 },
                  targets: { browsers: "firefox 78" },
                },
              ],
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "client/index.html" })],
}

export default config
