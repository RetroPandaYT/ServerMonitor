const Dotenv = require('dotenv-webpack');

var webpack = require('webpack');
var path = require('path');
process.noDeprecation = true

const config = {
    entry: {
        App: ['./App.js']
    },

    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/dist/'
    },
    devServer: {
        historyApiFallback:{
            index:'index.html'
        },
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules)/,
              use: [{
                loader: 'babel-loader',
                options: {
                  presets: [['es2015', {modules: false}], "react"],
                  plugins: [
                            'syntax-dynamic-import',
                            'transform-async-to-generator',
                            'transform-regenerator',
                            'transform-runtime'
                          ]
                }
              }]
            },
            {   test: /\.css$/,
                loaders: [ 'style-loader',
                    { loader: 'css-loader',
                        query: { sourceMap: true }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                loader: 'url-loader?limit=8192'
            },
            {
              test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
              test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
              test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'file-loader'
            }            

        ]
    },

    resolve: {
        extensions: [".js", ".jsx", ".css"],
        modules: [
          path.resolve('./'),
          'node_modules'
        ]
    },

    plugins: [
        new Dotenv({
          path: './.env', // Path to .env file (this is the default)
          safe: false // load .env.example (defaults to "false" which does not use dotenv-safe)
        })
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true
        },
        output: {
            comments: false
        },
      })
    );
}

module.exports = config;
