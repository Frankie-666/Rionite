var webpack = require('webpack');

module.exports = {
	output: {
		library: 'rista',
		libraryTarget: 'umd'
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},

	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	}
};
