export default function handler(req, res) {
	const path = req.url
	res.setHeader('Content-Type', 'application/json; charset=utf-8')

	if (path === '/api/user/all' || path === '/user/all') {
		return res.status(200).end(
			JSON.stringify({
				code: 0,
				message: 'success',
				data: [
					{ id: 1, name: '张三', email: 'zhangsan@test.com', role: 'admin', age: 28 },
					{ id: 2, name: '李四', email: 'lisi@test.com', role: 'user', age: 32 }
				]
			})
		)
	}

	res.status(404).end(JSON.stringify({ code: 404, message: 'Not Found', path }))
}
