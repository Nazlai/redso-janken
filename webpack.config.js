const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const path = require("path");
const isDevelopment = process.env.NODE_ENV === "development";

const webpackConfig = {
  entry: "/src/app/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss"],
    alias: {
      app: path.resolve(__dirname, "src/app"),
      components: path.resolve(__dirname, "src/app/components"),
      screens: path.resolve(__dirname, "src/app/screens"),
      firebaseUtils: path.resolve(__dirname, "src/app/firebase"),
      routes: path.resolve(__dirname, "src/app/routes"),
      constants: path.resolve(__dirname, "src/app/constants"),
      module: path.resolve(__dirname, "src/app/module"),
      theme: path.resolve(__dirname, "src/app/theme"),
      styles: path.resolve(__dirname, "src/assets/stylesheets"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.module\.scss$/i,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.scss|css$/i,
        exclude: /\.module\.scss$/i,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader",
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    open: true,
  },
  devtool: "source-map",
  plugins: [
    new Dotenv({ path: "./.env", systemvars: true }),
    new FaviconsWebpackPlugin("./favicon-32x32.png"),
    new HtmlWebpackPlugin({
      title: "Janken",
      template: "./src/app/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
    }),
    new CleanWebpackPlugin(),
  ],
};

module.exports = webpackConfig;
