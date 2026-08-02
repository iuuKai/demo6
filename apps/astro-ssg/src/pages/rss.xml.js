import rss from '@astrojs/rss'

export async function GET() {
	return rss({
		site: 'https://example.com',
		title: 'Astro SSG',
		description: 'Astro SSG Feed',
		items: []
	})
}
