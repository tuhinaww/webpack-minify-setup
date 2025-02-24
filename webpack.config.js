const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const jsFiles = glob.sync("./src/**/*.js", { ignore: ["./src/index.js"] });
const cssFiles = glob.sync("./src/**/*.css");
const htmlFiles = glob.sync("./src/**/*.html");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/index.js",
    ...Object.fromEntries(
      jsFiles.map((file) => [
        path.relative("./src", file).replace(/\\/g, "/").replace(/\.js$/, ""),
        file,
      ])
    ),
  },
  output: {
    filename: "js/[name].min.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "css/[name].min.css" }),

    ...htmlFiles.map((file) => {
      return new HtmlWebpackPlugin({
        filename: path.relative("./src", file),
        template: file,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      });
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
};
