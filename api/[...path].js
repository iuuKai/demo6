import express from 'express'
import userRoutes from './_user.js'

const app = express()
app.use(express.json())

const apiRouter = express.Router()

// 静态注册各模块路由
apiRouter.use('/user', userRoutes)

app.use('/api', apiRouter)

export default app
