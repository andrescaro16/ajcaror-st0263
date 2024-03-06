import PClient from './PClient/PClient.js';
import PServer from './PServer/PServer.js';

const main = async () => {
	const pServer = new PServer();
	await pServer.start();
	const pClient = new PClient();
	await pClient.start();
};

main();
