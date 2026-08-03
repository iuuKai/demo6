import express from 'express'

const app = express()
app.use(express.json())

// 兼容 Vercel api/ 目录约定下 req.url 的不同形态
app.use((req, _res, next) => {
	if (!req.url.startsWith('/api')) {
		req.url = `/api${req.url}`
	}
	next()
})

const mockUsers = [
	{ id: 1, name: '张三', email: 'zhangsan@test.com', role: 'admin', age: 28 },
	{ id: 2, name: '李四', email: 'lisi@test.com', role: 'user', age: 32 },
	{ id: 3, name: '王五', email: 'wangwu@test.com', role: 'moderator', age: 25 }
]

app.get('/api/user/all', (_req, res) => {
	res.json({ code: 0, message: 'success', data: mockUsers })
})

app.get('/api/user/list', (req, res) => {
	const { page = 1, size = 10 } = req.query
	res.json({
		code: 0,
		data: {
			list: mockUsers.slice((page - 1) * size, page * size),
			total: mockUsers.length
		}
	})
})

app.get('/api/user/:id', (req, res) => {
	const user = mockUsers.find(u => u.id === parseInt(req.params.id))
	if (user) {
		res.json({ code: 0, data: user })
	} else {
		res.json({ code: 404, message: '用户不存在' })
	}
})

export default app
