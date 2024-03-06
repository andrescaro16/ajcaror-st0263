import express from 'express';
import PClient from '../PClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const { username, password, url } = req.body;

	try {
		const loginResponse = await new Promise((resolve, reject) => {
			PClient.client.Login({ username, password, url }, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});

		if (loginResponse.success) {
			res.send({ success: loginResponse.success, token: loginResponse.token });
			console.log('Login response:', loginResponse.token);
		} else {
			res.status(400).send({ error: 'Login failed' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'Internal server error' });
	}
});

export default router;
