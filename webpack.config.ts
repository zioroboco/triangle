import * as execa from "execa"
import {
  Configuration,
  HotModuleReplacementPlugin,
  WebpackPluginInstance,
} from "webpack"
import { repository } from "./package.json"
import { resolve } from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin"

const commitInfo = () => {
  const hash = execa.sync("git", ["rev-parse", "HEAD"]).stdout
  const [_, user, repo] = repository.match(/\:(.+)\/(.+)$/)!
  if (!user || !repo) throw new Error(`expected "github:user/repo"`)
  return `https://github.com/${user}/${repo}/commit/${hash}`
}

const config = (env: any): Configuration => {
  const mode = env?.production ? "production" : "development"
  return {
    mode,
    output: {
      path: resolve(__dirname, "public"),
    },
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
                plugins:
                  mode === "development"
                    ? [
                        "react-refresh/babel",
                        "@babel/plugin-syntax-top-level-await",
                      ]
                    : [],
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
        meta: { commit: commitInfo() },
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
      topLevelAwait: true,
    },
    devServer: {
      hot: true,
    },
  }
}

export default config
