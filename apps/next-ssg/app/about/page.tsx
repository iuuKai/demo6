import Image from 'next/image'
import demo from '@/public/demo.jpg'

export default function About() {
	return (
		<>
			<h2>About Page</h2>
			<Image src={demo} alt="Demo 图片" width={800} height={400} className="demo-img" />
		</>
	)
}
