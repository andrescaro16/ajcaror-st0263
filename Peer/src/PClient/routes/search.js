import express from 'express';
import PClient from '../PClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const { token, file } = req.body;

	try {
		const searchResponse = await new Promise((resolve, reject) => {
			PClient.client.Search({ token, file }, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});

		if (searchResponse.success) {
			res.send({ success: searchResponse.success, results: searchResponse.results });
			console.log('Index response:', searchResponse);
		} else {
			res.status(400).send({ error: 'Indexing failed' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'Internal server error' });
	}
});

export default router;
