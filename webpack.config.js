const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'production';
const extractSass = new ExtractTextPlugin('css/styles.css');

module.exports = {
	context: path.resolve(__dirname, 'app'),
	devtool: 'source-map',
	entry: {
		filename: './js/app.js',
	},
	output: {
		path: path.resolve(__dirname, '_dist'),
		filename: 'js/main.min.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['env'],
				},
			}, {
				test: /\.scss$/,
				loader: extractSass.extract(['css-loader', 'sass-loader']),
			}],
	},
	plugins: [
		// uglify js
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: { warnings: false },
				output: { comments: false },
				sourcemap: true,
			},
		}),

		// env plugin
		new webpack.DefinePlugin({
			'process.env': { node_modules: JSON.stringify(nodeEnv) },
		}),
		extractSass,
	],
};
