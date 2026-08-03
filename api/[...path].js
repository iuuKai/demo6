export default function handler(req, res) {
	res.status(200).end(
		JSON.stringify({
			message: 'catch-all hit',
			url: req.url,
			method: req.method
		})
	)
}
