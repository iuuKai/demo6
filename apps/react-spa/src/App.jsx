import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import LinkPage from './pages/Link'
import './App.css'

function App() {
	document.title = 'React SPA'
	return (
		<Router basename={import.meta.env.BASE_URL}>
			<div className="app-container">
				<nav className="nav">
					<Link to="/">Home</Link>
					<Link to="/about">About</Link>
					<Link to="/link">Link</Link>
				</nav>
				<div className="page-content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/link" element={<LinkPage />} />
					</Routes>
				</div>
			</div>
		</Router>
	)
}

export default App
