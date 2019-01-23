import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import pagesConfig from '../src/pages-config';
import { resolveApp } from './kit';

const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');

const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const devMode: boolean = process.env.NODE_ENV !== 'production';

const MiniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {}
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: devMode
  }
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: devMode,
    localIdentName: '[local]__[path][name]--[hash:base64:5]'
  }
};

const lessLoader = {
  loader: 'less-loader',
  options: {
    sourceMap: devMode
  }
};

const scssLoader = devMode
  ? {
      loader: 'sass-loader',
      options: {
        sourceMap: devMode
      }
    }
  : 'fast-sass-loader';

function entryBuild(): webpack.Entry {
  const entry: webpack.Entry = {};
  for (let page of pagesConfig) {
    const { name } = page;
    const indexFile = resolveApp(
      `src/${name}/${page.entry ? page.entry : 'index.tsx'}`
    );
    if (fs.existsSync(indexFile)) {
      entry[name] = [ require.resolve('./polyfills'), indexFile ];
    } else {
      console.error(`${name} doesn't exsits! `);
    }
  }
  return entry;
}

export default {
  entry: entryBuild(),
  module: {
    // loaders
    rules: [
      {
        test: /\.(js)|(jsx)|(mjs)/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(ts)|(tsx)/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              compilerOptions: {
                sourceMap: devMode
              }
            }
          }
        ]
      },
      {
        test: /\.(sa|sc)ss/,
        exclude: /node_modules/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPluginLoader,
          cssLoader,
          postcssLoader,
          scssLoader
        ]
      },
      {
        test: /\.less/,
        exclude: /node_modules/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPluginLoader,
          cssLoader,
          postcssLoader,
          lessLoader
        ]
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPluginLoader,
          postcssLoader,
          cssLoader
        ]
      },
      {
        test: /\.((png)|(jpe?g)|(gif)|(bmp))$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: 'static/media/[name].[hash:8].[ext]',
          fallback: 'file-loader'
        }
      },
      {
        test: /\.(txt)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },

  // how to resolve modules
  resolve: {
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ],

    plugins: [ new TsconfigPathsPlugin({}) ]
  },

  // plugins
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(devMode)
    }),
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      watch: resolveApp('src')
    }),
    new ForkTsCheckerNotifierWebpackPlugin({
      excludeWarnings: true,
      skipSuccessful: true,
      alwaysNotify: false,
      skipFirstNotification: true
    }),
    ...htmlWebpackPluginBuild(),
    new HtmlWebpackInlineSourcePlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]-[hash:8].css',
      chunkFilename: 'static/css/[id]-[hash:8].css'
    })
  ],

  optimization: {
    minimizer: [ new TerserPlugin() ]
  }
} as webpack.Configuration;

function htmlWebpackPluginBuild(): HtmlWebpackPlugin[] {
  return pagesConfig.map((p) => {
    return new HtmlWebpackPlugin({
      chunks: [ p.name ],
      filename: `${p.filename ? p.filename : p.name}.html`, // 配置输出文件名和路径
      template: p.template
        ? resolveApp(`src/${p.name}/${p.template}`)
        : resolveApp('public/index.html'), // 配置文件模板
      title: p.title ? p.title : p.name,
      inject: true,
      ...p.inlineSource ? { inlineSource: p.inlineSource } : {},
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    });
  });
}
