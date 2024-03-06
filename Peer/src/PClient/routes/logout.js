import express from 'express';
import PClient from '../PClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const { token } = req.body;

	try {
		const logoutResponse = await new Promise((resolve, reject) => {
			PClient.client.Logout({ token }, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});

		if (logoutResponse.success) {
			res.send({ success: logoutResponse.success, up: logoutResponse.up });
			console.log('Logout response:', logoutResponse);
		} else {
			res.status(400).send({ error: 'Logging out failed' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'Internal server error' });
	}
});

export default router;
