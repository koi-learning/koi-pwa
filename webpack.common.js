// Copyright (c) individual contributors.
// All rights reserved.
//
// This is free software; you can redistribute it and/or modify it
// under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 3 of
// the License, or any later version.
//
// This software is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details. A copy of the
// GNU Lesser General Public License is distributed along with this
// software and can be found at http://www.gnu.org/licenses/lgpl.html

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        bundle: ['./src/index.ts', './src/app.scss'],
        sw: ['./src/sw.ts']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.json',
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/resource',
            },
            {
                test: /\.(sass|css|scss)$/,
                use: [
                    /*{
                        loader: 'file-loader',
                        options: {
                            name: 'bundle.css',
                        },
                    },
                    { loader: 'extract-loader' }, */
                    { loader: 'style-loader' }, 
                    { loader: 'css-loader' },
                    { loader: 'resolve-url-loader'},
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer Dart Sass
                            implementation: require('sass'),

                            // See https://github.com/webpack-contrib/sass-loader/issues/804
                            webpackImporter: false,
                            sassOptions: {
                                includePaths: ['node_modules'],
                            },
                            sourceMap: true
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.scss'],
        alias: {
            '@src': path.resolve('./src'),
            '@components': path.resolve('./src/components'),
            '@store': path.resolve('./src/store'),
        },
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new webpack.DefinePlugin({
            'API_URL': JSON.stringify('/api/')
        }),
        new CopyWebpackPlugin({
            patterns: [
              { from: 'src/img/icon.png', to: 'img/icon.png' },
              { from: 'src/manifest.webmanifest', to: 'manifest.webmanifest' },
            ],
            options: {
              concurrency: 100,
            },
          })
    ],
};
