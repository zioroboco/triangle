import { Configuration, HotModuleReplacementPlugin } from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin"

const config: Configuration = {
  entry: "./client",
  devtool: "source-map",
  resolve: { extensions: [".ts", ".js", ".json", ".wasm"] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
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
  output: {
    filename: "main.js",
    chunkFilename: "[id].chunk.js",
  },
  devServer: {
    hot: true,
  },
}

export default config
