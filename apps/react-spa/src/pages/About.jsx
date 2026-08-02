import demoImg from '../assets/demo.jpg'

export default function About() {
	return (
		<div className="about">
			<h2>About Page</h2>
			<img src={demoImg} alt="demo" className="demo-img" />
			<style>{`
        .demo-img {
          max-width: 100%;
          margin-top: 20px;
          border-radius: 8px;
        }
      `}</style>
		</div>
	)
}
