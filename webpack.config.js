var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ("mltest." + env.NODE_ENV + ".js"));

var fileExtensions = ["csv"];

if (fileSystem.existsSync(secretsPath)) {
  alias["mltest"] = secretsPath;
}

var options = {
  mode: process.env.NODE_ENV||"development",
  entry: {
    popup: path.join(__dirname,"popup.js"),
    background: path.join(__dirname,"background.js"),
    content: path.join(__dirname,"content.js"),
    warning: path.join(__dirname,"warning.js")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [

      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: /node_modules/
      },
	{
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
	
   
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
node: {
    fs: "empty"
},
  resolve: {
    alias: alias
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin([{
      from: "manifest.json",
      transform: function (content, path) {
        // generates the manifest file using the package.json informations
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname,"popup.html"), 
	  filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname,"warning.html"), 
      filename: "warning.html",
      chunks: ["warning"]
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, "background.html"),
      filename: "background.html",
      chunks: ["background"]
    }),
    new WriteFilePlugin()
  ]
};


options.devtool = "cheap-module-eval-source-map";


module.exports = options;
