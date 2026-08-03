import express from 'express'
import userRoutes from './_user.js'

const app = express()
app.use(express.json())

// 兼容 Vercel api/ 目录约定下 req.url 的不同形态
// 无论 req.url 是 /user/all 还是 /api/user/all，都统一补成 /api/user/all
app.use((req, _res, next) => {
	if (!req.url.startsWith('/api')) {
		req.url = `/api${req.url}`
	}
	next()
})

const apiRouter = express.Router()

// 静态注册各模块路由
apiRouter.use('/user', userRoutes)

app.use('/api', apiRouter)

export default app
