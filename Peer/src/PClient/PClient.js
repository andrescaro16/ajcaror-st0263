import dotenv from 'dotenv';
import url from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import login from './routes/login.js';
import logout from './routes/logout.js';
import index from './routes/index.js';
import search from './routes/search.js';

dotenv.config();

class PClient {
	static client;

	constructor() {
		this.app = express();
		const { host } = url.parse(process.env.PCLIENT_ADDRESS);
		this.PORT = host;

		this.app.use(bodyParser.json());

		this.setupRoutes();

		// Crear un cliente gRPC para el servicio PeerService
		this.PROTO_PATH = process.env.PROTO_PATH;
		this.SERVER_ADDRESS = process.env.SERVER_ADDRESS;

		this.packageDefinition = protoLoader.loadSync(this.PROTO_PATH);
		this.serviceProto = grpc.loadPackageDefinition(this.packageDefinition);

		PClient.client = new this.serviceProto.PeerService(this.SERVER_ADDRESS, grpc.credentials.createInsecure());
	}

	setupRoutes() {
		this.app.use('/login', login);
		this.app.use('/logout', logout);
		this.app.use('/index', index);
		this.app.use('/search', search);
	}

	start() {
		return new Promise((resolve, reject) => {
			this.app
				.listen(this.PORT, () => {
					console.log(`PClient running on port ${this.PORT}`);
					resolve();
				})
				.on('error', (err) => {
					reject(err);
				});
		});
	}
}

export default PClient;
