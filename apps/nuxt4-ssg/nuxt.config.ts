// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2026-06-18',
	devtools: { enabled: true },
	app: {
		baseURL: '/nuxt4-ssg/',
		head: {
			title: 'Nuxt4 SSG'
		}
	},
	nitro: {
		preset: 'static',
		output: {
			dir: './.output',
			publicDir: './.output/public'
		}
	}
})
