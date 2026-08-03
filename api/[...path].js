export default function handler(req, res) {
	res.status(200).end(
		JSON.stringify(
			{
				url: req.url,
				method: req.method,
				query: req.query,
				headers: req.headers
			},
			null,
			2
		)
	)
}
