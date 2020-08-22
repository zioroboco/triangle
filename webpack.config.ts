import {
  Configuration,
  HotModuleReplacementPlugin,
  WebpackPluginInstance,
} from "webpack"
import { resolve } from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin"

const config = (env: any): Configuration => {
  const mode = env?.production ? "production" : "development"
  return {
    mode,
    entry: ["./client/global.css", "./client/src/main"],
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json", ".wasm"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                plugins: mode === "development" ? ["react-refresh/babel"] : [],
              },
            },
            {
              loader: "ts-loader",
              options: {
                configFile: "client/tsconfig.json",
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: "[path][name]__[local]",
                  localIdentContext: resolve(__dirname, "client/src"),
                },
              },
            },
            "postcss-loader",
          ],
        },
      ],
    },
    plugins: [
      ...(mode === "development" ? [new ReactRefreshWebpackPlugin()] : []),
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
    },
    devServer: {
      hot: true,
    },
  }
}

export default config
