const webpack = require("webpack");
const path = require("path");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const nodeExternals = require("webpack-node-externals");

/** @type {webpack.Configuration} */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index.js",
    library: "",
    libraryTarget: "commonjs",
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  externals: [
    nodeExternals({
      whitelist: ["store"],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              useCache: true,
            },
          },
        ],
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: { implementation: require("sass") },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: "[name].css",
    }),
    process.env.ANALYZE === "1" && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
};
