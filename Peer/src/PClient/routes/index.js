import express from 'express';
import PClient from '../PClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const { token, files } = req.body;

	try {
		const indexResponse = await new Promise((resolve, reject) => {
			PClient.client.Index({ token, files }, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});

		if (indexResponse.success) {
			res.send({ success: indexResponse.success });
			console.log('Index response:', indexResponse);
		} else {
			res.status(400).send({ error: 'Indexing failed' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'Internal server error' });
	}
});

export default router;
