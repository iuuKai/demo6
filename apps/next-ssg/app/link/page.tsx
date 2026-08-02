'use client'

import { useEffect, useState } from 'react'

export default function LinkPage() {
	const [userList, setUserList] = useState<any[]>([])
	const [errorMsg, setErrorMsg] = useState('')

	useEffect(() => {
		async function fetchUser() {
			try {
				const response = await fetch('/api/user/all')
				if (!response.ok) throw new Error('接口请求异常')
				const res = await response.json()
				setUserList(res.data)
			} catch (err: any) {
				setErrorMsg(err.message)
			}
		}
		fetchUser()
	}, [])

	return (
		<>
			<h2>User List</h2>
			{errorMsg && <div className="error-tip">{errorMsg}</div>}
			{userList.length === 0 && !errorMsg && <div>加载中...</div>}
			<ul className="user-list">
				{userList.map(item => (
					<li key={item.id}>
						{item.name} - {item.email}
					</li>
				))}
			</ul>
		</>
	)
}
