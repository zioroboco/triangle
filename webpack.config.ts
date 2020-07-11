import {
  Configuration,
  HotModuleReplacementPlugin,
  WebpackPluginInstance,
} from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin"

const config: Configuration = {
  entry: "./client/src/main",
  devtool: "source-map",
  resolve: { extensions: [".ts", ".js", ".json", ".wasm"] },
  experiments: { asyncWebAssembly: true },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "client/tsconfig.json",
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
    }) as WebpackPluginInstance,
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
