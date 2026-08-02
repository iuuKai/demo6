import Link from 'next/link'
import './globals.css' // 全局样式文件

export const metadata = {
	title: 'Next SSG'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const base = process.env.NEXT_PUBLIC_BASE_PATH || ''

	return (
		<html lang="zh-CN">
			<body>
				<div className="app-container">
					<nav className="nav">
						<Link href={`${base}/`}>Home</Link>
						<Link href={`${base}/about`}>About</Link>
						<Link href={`${base}/link`}>Link</Link>
					</nav>
					<main className="page-content">{children}</main>
				</div>
			</body>
		</html>
	)
}
