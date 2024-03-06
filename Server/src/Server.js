import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

class Server {
	constructor() {
		const PROTO_PATH = __dirname + '/' + process.env.PROTO_PATH;
		const packageDefinition = protoLoader.loadSync(PROTO_PATH);
		const serviceProto = grpc.loadPackageDefinition(packageDefinition);

		this.SERVER_ADDRESS = process.env.SERVER_ADDRESS;
		this.PeerService = serviceProto.PeerService;

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.index = this.index.bind(this);
		this.search = this.search.bind(this);

		// Generador de tokens
		let num = 0;
		this.generatePeerToken = () => {
			num++;
			return `peer-${num.toString().padStart(4, '0')}`;
		};

		this.server = new grpc.Server();
		this.server.addService(this.PeerService.service, {
			login: this.login,
			logout: this.logout,
			index: this.index,
			search: this.search,
		});

		// Base de datos en memoria
		this.db = {};
	}

	start() {
		this.server.bindAsync(this.SERVER_ADDRESS, grpc.ServerCredentials.createInsecure(), (err) => {
			if (err) {
				console.error(`Server failed to start: ${err}`);
				return;
			}

			this.server.start();

			console.log(`Server running at ${this.SERVER_ADDRESS}`);
		});
	}

	// Implementación de la lógica de los métodos del servicio
	login(call, callback) {
		console.log('Login request:', call.request);
		const token = Object.keys(this.db).find(key => this.db[key].username === call.request.username && this.db[key].password === call.request.password && this.db[key].url === call.request.url);
		console.log('Token with find...:', token);
		if (token) {
			console.log('Token exists:');
			this.db[token].up = true;
			console.log('DB:', this.db, '\n');
			callback(null, { success: true, token: token });
			return;
		} else {
			console.log('Token does not exist:');
			const token = this.generatePeerToken();
			this.db[token] = {...call.request, up: true, files: []};
			console.log('DB:', this.db, '\n');
			callback(null, { success: true, token: token });
		}
	}

	logout(call, callback) {
		console.log('Logout request:', call.request);
		if (this.db[call.request.token]) {
			this.db[call.request.token].up = false;
			console.log('DB:', this.db, '\n');
			callback(null, { success: true, up: this.db[call.request.token].up });
		} else {
			console.log('Token not found');
			callback(null, { success: false, up: false });
		}
	}

	index(call, callback) {
		console.log('Index request:', call.request);
		if (this.db[call.request.token] && this.db[call.request.token].up) {
			this.db[call.request.token].files = call.request.files;
			console.log('DB:', this.db, '\n');
			callback(null, { success: true });
		} else {
			console.log('Token not found or not up');
			callback(null, { success: false });
		}	
	}

	search(call, callback) {
		console.log('Search request:', call.request);
		if (this.db[call.request.token] && this.db[call.request.token].up) {
			const results = Object.keys(this.db)
				.filter(key => this.db[key].up && this.db[key].files.includes(call.request.file))
				.map(key => ({ token: key, url: this.db[key].url }));
			console.log('Results:', results);
			callback(null, { success: true, results: results });
		} else {
			console.log('Token not found or not up');
			callback(null, { success: false });
		}
	}
}

// Iniciar el servidor
const server = new Server();
server.start();
