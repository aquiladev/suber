var path = require('path'),
	webpack = require('webpack'),
	targetDir = "./dist";

module.exports = {
	output: {
		filename: path.join(targetDir, "[name].js")
	},

	entry: [
		'./src/app.jsx'
	],

	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json' },
			{
				loader: "babel-loader",
				// Skip any files outside of your project's `src` directory
				include: [
					path.resolve(__dirname, "src"),
				],
				// Only run `.js` and `.jsx` files through Babel
				test: [/\.jsx?$/, /\.es6$/],
				// Options to configure babel with
				query: {
					plugins: ['transform-runtime'],
					presets: ['es2015', 'react'],
				}
			}
		]
	},

	resolve: {
		extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
	},

	externals: {
		"react": "React",
		"react-dom": "ReactDOM"
	},

	node: {
		console: true,
		fs: "empty",
		net: "empty",
		tls: "empty"
	}
};