import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
	const { token, url, file } = req.body;

	try {
		const success = await upload(url, file);

		if (success) {
			res.send({ success: true, message: 'File downloaded successfully' });
		} else {
			res.status(404).send({ error: 'File was not downloaded' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'Internal server error' });
	}
});

async function upload(url, file) {
	try {
		const response = await fetch(url, {
			method: 'POST',
			body: file,
		});

		await setTimeout(() => {}, 1000);

		if (response) {
			return true;
		} else {
			throw new Error('File upload failed');
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

router.post('/upload', async (req, res) => {
	try {
		const { file } = req.body;
		if (file) {
			res.send({ success: true, message: 'File uploaded successfully' });
		} else {
			res.status(404).send({ error: 'File was not uploaded' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'Internal server error' });
	}
});

export default router;
