const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = {
	devtool: 'source-map',
	entry: {
		filename: './app/app.js',
	},
	output: {
		filename: '_dist/js/main.min.js',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['env'],
			},
		}],
		rules: [{
			test: /\.scss$/,
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader'
			}, {
				loader: 'sass-loader'
			}],
		}],
	},
	plugins: [
		// uglify js
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false },
			output: { comments: false },
			sourcemap: true,
		}),

		// env plugin
		new webpack.DefinePlugin({
			'process.env': { node_modules: JSON.stringify(nodeEnv) },
		}),
		// BrowserSync
		new BrowserSyncPlugin({
			// browse to http://localhost:3000/ during development,
			// ./public directory is being served
			host: 'localhost',
			port: 3000,
			server: { baseDir: ['_dist'] },
		}),
	],
};
