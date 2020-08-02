import {
  Configuration,
  HotModuleReplacementPlugin,
  WebpackPluginInstance,
} from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin"

const config: Configuration = {
  mode: "development",
  entry: "./client/src/main",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".json", ".wasm"],
  },
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
    new HtmlWebpackPlugin({
      template: "client/index.html",
    }),
    new WasmPackPlugin({
      forceMode: "development",
      crateDirectory: __dirname,
      watchDirectories: ["engine"],
    }) as WebpackPluginInstance,
  ],
  optimization: {
    splitChunks: {
      chunks: "async",
    },
  },
  experiments: {
    asyncWebAssembly: true,
    importAsync: true,
    importAwait: true,
  },
  devServer: {
    hot: true,
  },
}

export default config
