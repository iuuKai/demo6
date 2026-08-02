// 本地开发所有服务端口配置
export const APPS_CONFIG = {
	devServer: {
		port: 3000
	},
	'astro-ssg': {
		port: 1000,
		prefix: 'astro-ssg'
	},
	'hexo-ssg': {
		port: 1001,
		prefix: 'hexo-ssg'
	},
	'next-ssg': {
		port: 1002,
		prefix: 'next-ssg'
	},
	'nuxt4-ssg': {
		port: 1003,
		prefix: 'nuxt4-ssg'
	},
	'react-spa': {
		port: 1004,
		prefix: 'react-spa'
	},
	'vanilla-spa': {
		prefix: 'vanilla-spa',
		sourceDir: 'apps/vanilla-spa'
	},
	'vitepress-ssg': {
		port: 1005,
		prefix: 'vitepress-ssg'
	},
	'vue3-spa': {
		port: 1006,
		prefix: 'vue3-spa'
	},
	'vuepress-ssg': {
		port: 1007,
		prefix: 'vuepress-ssg'
	},
	'webpack-ejs-mpa': {
		port: 1008,
		prefix: 'webpack-ejs-mpa'
	}
}
