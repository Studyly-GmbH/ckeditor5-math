const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
	// https://webpack.js.org/configuration/entry-context/
	entry: "./demo/app.js",

	// https://webpack.js.org/configuration/output/
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},

	devServer: {
		disableHostCheck: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		historyApiFallback: true,
		hot: true,
		inline: true,
		index: "./demo/index.html",
	},

	plugins: [
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			template: "./demo/index.html",
		}),
	],

module: {
    rules: [
            {
                test: /\.svg$/,
                type: 'asset/source'
            },

            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            import: false
                        }
                    }
                ]
            }
        ]
},

	// Useful for debugging.
	devtool: "source-map",

	// By default webpack logs warnings if the bundle is bigger than 200kb.
	performance: { hints: false },
};
