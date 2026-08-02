// 仅本地调试使用
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { APPS_CONFIG } from '@repo/shared'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const port = APPS_CONFIG.devServer.port
const monorepoRoot = path.join(__dirname, '..', '..')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname))

for (const key in APPS_CONFIG) {
	const config = APPS_CONFIG[key]
	if (key === 'devServer' || !config?.prefix) {
		continue
	}

	const prefix = config.prefix
	const prefixPath = `/${prefix}`

	// 有 sourceDir 则直接服务静态资源，无需代理
	if (config.sourceDir) {
		app.use(prefixPath, express.static(path.join(monorepoRoot, config.sourceDir)))
		continue
	}

	// 有 port 则代理到子应用开发服务器
	const proxy = createProxyMiddleware({
		target: `http://localhost:${config.port}`,
		changeOrigin: true
	})

	app.use((req, res, next) => {
		if (!req.url.startsWith(prefixPath)) return next()
		proxy(req, res, next)
	})
}

app.listen(port, () => {
	console.log(`已启动 http://localhost:${port}`)
})
