import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 自动加载同目录下 _*.js 文件作为子路由模块
// _ 前缀文件不会被 Vercel 识别为独立 Function，仅作为模块被 require
// 例：_user.js → 挂载到 /api/user，_admin.js → 挂载到 /api/admin
const apiRouter = express.Router()

const moduleFiles = fs.readdirSync(__dirname).filter(f => f.startsWith('_') && f.endsWith('.js'))

for (const file of moduleFiles) {
	const name = file.slice(1, -3) // 去掉 _ 前缀和 .js 后缀
	const mod = await import(`./${file}`)
	apiRouter.use(`/${name}`, mod.default)
}

app.use('/api', apiRouter)

export default app
