import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	output: 'export',
	basePath: '/next-ssg',
	images: {
		unoptimized: true
	}
}

export default nextConfig
