import express from 'express'
import userRoutes from './_user.js'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
	const rawUrl = req.url
	if (rawUrl.includes('...path=')) {
		const u = new URL(rawUrl, 'http://localhost')
		const matchedPath = u.searchParams.get('...path')
		if (matchedPath) {
			req.url = '/' + matchedPath + (u.search.replace('?...path=' + encodeURIComponent(matchedPath), '') || '')
		}
	} else if (rawUrl.startsWith('/api/')) {
		req.url = rawUrl.slice(4) || '/'
	} else if (rawUrl === '/api') {
		req.url = '/'
	}
	next()
})

app.use('/user', userRoutes)

export default app
