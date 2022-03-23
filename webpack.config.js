const webpack = require(`webpack`)
const path = require(`path`)
const FontConfigWebpackPlugin = require(`font-config-webpack-plugin`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)
const TerserPlugin = require(`terser-webpack-plugin`)
const Dotenv = require(`dotenv-webpack`)
const HtmlMinifierPlugin = require(`html-minifier-webpack-plugin`)


module.exports = {
  mode: `production`,
  plugins: [
    new Dotenv({ path: `./.env` }),
    new FontConfigWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: `[name].css`, chunkFilename: `[id].css` }),
    new HtmlMinifierPlugin({}),
  ],
  resolve: {
    alias: {
      Fonts: path.resolve(__dirname, `./assets/fonts/`),
      Sass: path.resolve(__dirname, `./src/sass/`),
    },
  },
  entry: {
    'global': path.resolve(__dirname, `./src/js/global.js`),
    'post': path.resolve(__dirname, `./src/js/posts.js`),
    'page': path.resolve(__dirname, `./src/js/pages.js`),
    'author': path.resolve(__dirname, `./src/js/author.js`),
    'tag': path.resolve(__dirname, `./src/js/tag.js`),
    'series': path.resolve(__dirname, `./src/js/series.js`),
    'error': path.resolve(__dirname, `./src/js/error.js`),
  },
  output: {
    path: path.resolve(__dirname, `./assets/js`),
    filename: `[name].js`,
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      }, {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: `./assets/js`,
            },
          },
          `css-loader`,
        ],
      }, {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: `babel-loader`,
          options: {
            presets: [`@babel/preset-env`],
          },
        },
      }, {
        test: /\.html$/,
        loaders: [`file-loader?name=[name].html`, `extract-loader`, `html-loader`],
      }, {
        test: /\.gql$/,
        exclude: /node_modules/,
        loader: `graphql-tag/loader`,
      },
    ],
  },
}