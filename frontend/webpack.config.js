const path = require("path");
const DotenvWebpackPlugin = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
    },
    devtool: isDevelopment ? "cheap-module-source-map" : "source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                plugins: [
                  isDevelopment && require.resolve("react-refresh/babel"),
                ].filter(Boolean),
              },
            },
          ],
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
    },
    plugins: [
      new DotenvWebpackPlugin({ path: `./.env.${argv.mode}` }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
  };
};
