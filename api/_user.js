import express from 'express'
import Mock from 'mockjs'

const router = express.Router()
const { Random } = Mock

const generateUser = id => ({
	id,
	name: Random.cname(),
	email: Random.email(),
	role: Random.pick(['admin', 'user', 'moderator']),
	age: Random.integer(18, 60),
	gender: Random.pick(['男', '女']),
	phone: `1${Random.integer(3, 9)}${Random.string('number', 9)}`,
	address: Random.city(true),
	avatar: Random.image('100x100', Random.color(), Random.word()),
	createTime: Random.date('yyyy-MM-dd HH:mm:ss'),
	status: Random.pick([0, 1])
})

const mockUsers = Array.from({ length: 10 }, (_, i) => generateUser(i + 1))

router.get('/list', (req, res) => {
	const { page = 1, size = 10, keyword = '' } = req.query
	const filtered = mockUsers.filter(
		user => user.name.includes(keyword) || user.email.includes(keyword)
	)
	const total = filtered.length
	const list = filtered.slice((page - 1) * size, page * size)
	res.json({
		code: 0,
		message: 'success',
		data: { list, total, page: parseInt(page), size: parseInt(size) }
	})
})

router.get('/all', (req, res) => {
	res.json({ code: 0, message: 'success', data: mockUsers })
})

router.get('/:id', (req, res) => {
	const user = mockUsers.find(u => u.id === parseInt(req.params.id))
	if (user) {
		res.json({ code: 0, message: 'success', data: user })
	} else {
		res.json({ code: 404, message: '用户不存在', data: null })
	}
})

router.post('/', (req, res) => {
	const newUser = {
		id: mockUsers.length + 1,
		...generateUser(mockUsers.length + 1),
		...req.body
	}
	mockUsers.push(newUser)
	res.json({ code: 0, message: '创建成功', data: newUser })
})

router.put('/:id', (req, res) => {
	const index = mockUsers.findIndex(u => u.id === parseInt(req.params.id))
	if (index !== -1) {
		mockUsers[index] = { ...mockUsers[index], ...req.body }
		res.json({ code: 0, message: '更新成功', data: mockUsers[index] })
	} else {
		res.json({ code: 404, message: '用户不存在', data: null })
	}
})

router.delete('/:id', (req, res) => {
	const index = mockUsers.findIndex(u => u.id === parseInt(req.params.id))
	if (index !== -1) {
		mockUsers.splice(index, 1)
		res.json({ code: 0, message: '删除成功', data: null })
	} else {
		res.json({ code: 404, message: '用户不存在', data: null })
	}
})

router.delete('/batch', (req, res) => {
	const { ids } = req.body
	if (!Array.isArray(ids)) {
		return res.json({ code: 400, message: '参数错误', data: null })
	}
	ids.forEach(id => {
		const index = mockUsers.findIndex(u => u.id === parseInt(id))
		if (index !== -1) {
			mockUsers.splice(index, 1)
		}
	})
	res.json({ code: 0, message: '批量删除成功', data: null })
})

export default router
