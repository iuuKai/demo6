import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'

export default defineUserConfig({
	base: '/p/vuepress-ssg/',
	bundler: viteBundler({
		viteOptions: {
			publicDir: 'public',
			resolve: {
				alias: { '@': './docs/.vuepress' }
			}
		}
	}),
	title: 'VuePress SSG',
	description: 'VuePress SSG',
	theme: defaultTheme({
		navbar: [
			{ text: 'Home', link: '/' },
			{ text: 'About', link: '/about.html' },
			{ text: 'Link', link: '/link.html' }
		],
		sidebar: false
	})
})
