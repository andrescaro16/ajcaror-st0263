import dotenv from 'dotenv';
import url from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import download from './routes/download.js';

dotenv.config();

class PServer {
	constructor() {
		this.app = express();
		const { host } = url.parse(process.env.PSERVER_ADDRESS);
		this.PORT = host;

		this.app.use(bodyParser.json());

		this.setupRoutes();
	}

	setupRoutes() {
		this.app.use('/download', download);
	}

	start() {
		return new Promise((resolve, reject) => {
			this.app
				.listen(this.PORT, () => {
					console.log(`PServer running on port ${this.PORT}`);
					resolve();
				})
				.on('error', (err) => {
					reject(err);
				});
		});
	}
}

export default PServer;
