import { Configuration, HotModuleReplacementPlugin } from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin"

const browsers = (() => {
  if (process.argv.indexOf("--chrome") >= 0) return ["chrome 86"]
  if (process.argv.indexOf("--firefox") >= 0) return ["firefox 78"]
  return ["chrome", "firefox"].map(browser => `last 2 ${browser} versions`)
})()

const config: Configuration = {
  entry: "./client",
  devtool: "source-map",
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
                  targets: { browsers },
                },
              ],
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ template: "client/index.html" }),
    new WasmPackPlugin({
      crateDirectory: __dirname,
      watchDirectories: ["engine"],
    }),
  ],
  devServer: {
    hot: true,
  },
}

export default config
