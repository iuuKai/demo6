import { useState, useEffect } from 'react'
import axios from 'axios'

export default function LinkPage() {
	const [users, setUsers] = useState([])
	const [errorMsg, setErrorMsg] = useState('')

	useEffect(() => {
		const fetchUserList = async () => {
			try {
				const res = await axios.get('/api/user/all')
				// 校验返回数据结构
				if (res.data && Array.isArray(res.data.data)) {
					setUsers(res.data.data)
				} else {
					setErrorMsg('请求失败')
				}
			} catch (err) {
				console.error('请求异常：', err)
				setErrorMsg('请求失败')
			}
		}
		fetchUserList()
	}, [])

	return (
		<div className="link">
			<h2>User List</h2>
			{users.length > 0 ? (
				<ul className="user-list">
					{users.map(user => (
						<li key={user.id}>
							{user.name} - {user.email}
						</li>
					))}
				</ul>
			) : (
				<div className="error-tip">{errorMsg || '加载中...'}</div>
			)}
			<style>{`
        .user-list {
          margin-top: 20px;
          list-style: none;
        }
        .user-list li {
          padding: 10px 0;
          border-bottom: 1px solid #ccc;
        }
        .error-tip {
          margin-top: 20px;
          color: #ff4d4f;
          font-weight: 500;
        }
      `}</style>
		</div>
	)
}
