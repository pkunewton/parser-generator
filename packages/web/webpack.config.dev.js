import { resolve } from "path";
import webpack from "webpack";
import merge from "webpack-merge";
import baseConfig from "./webpack.config";

export default merge(baseConfig, {
	mode: "development",
	// devtool: "eval-source-map",
	devtool:false,
	stats:"normal",
	output: {
		publicPath: "/",
		globalObject: "this"
	},
	devServer: {
		contentBase: [resolve("public/")],
		host: "localhost",
		port: 4092,
		index: "index.html",
		open: false,
		openPage: "index.html",
		historyApiFallback: true,
		hot: true,
		clientLogLevel: "info",
		proxy: {

		},
		overlay: {
			warnings: false,
			errors: false
		},
		watchOptions: {
			aggregateTimeout: 500,
			// ignored: /node_modules/
		}
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	]
});