const path = require("path");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");
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

        // CKEditor package CSS only.
        {
            test: /node_modules[/\\]@ckeditor[/\\]ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: styles.getPostCssConfig( {
                            minify: true
                        } )
                    }
                }
            ]
        },

        // Your custom plugin CSS: ./styles/*.css, ./theme/*.css, etc.
        {
            test: /\.css$/,
            exclude: /node_modules[/\\]@ckeditor[/\\]ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 0,
                        url: false
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: []
                        }
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
