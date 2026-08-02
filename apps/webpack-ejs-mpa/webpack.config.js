import path from 'node:path'
import { fileURLToPath } from 'node:url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pages = ['home', 'about', 'link']

const BASE_URL = '/webpack-ejs-mpa/'

export default (env, argv) => {
	const isProd = argv.mode === 'production'

	const entryObj = {}
	const htmlPlugins = []

	pages.forEach(page => {
		entryObj[page] = path.resolve(__dirname, `src/pages/${page}/index.js`)
		htmlPlugins.push(
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, `src/pages/${page}/index.ejs`),
				filename: `${page}/index.html`,
				chunks: [page],
				inject: true,
				// ✅ 关键：直接把 BASE_URL 作为模板参数传入
				templateParameters: {
					BASE_URL: BASE_URL
				}
			})
		)
	})

	return {
		entry: entryObj,
		output: {
			filename: 'js/[name].[contenthash].js',
			path: path.resolve(__dirname, 'dist'),
			publicPath: BASE_URL
		},
		module: {
			rules: [
				{
					test: /\.ejs$/,
					loader: 'ejs-loader',
					// ✅ 关闭 ES Module 模式，避免 with 语句问题
					options: {
						esModule: false
					}
				},
				{
					test: /\.css$/,
					use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
				},
				{
					test: /\.(jpg|png|svg)$/,
					type: 'asset/resource',
					generator: {
						filename: 'assets/[name].[contenthash][ext]'
					}
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.BASE_URL': JSON.stringify(BASE_URL)
			}),
			...htmlPlugins,
			isProd &&
				new MiniCssExtractPlugin({
					filename: 'css/[name].[contenthash].css'
				})
		].filter(Boolean),
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src')
			}
		},
		devServer: {
			static: path.resolve(__dirname, 'dist'),
			hot: true,
			historyApiFallback: false
		}
	}
}
