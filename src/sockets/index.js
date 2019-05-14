import fs from 'fs';
import { VALID_ACTIVE_CONNECTIONS } from '../constants';

export default (io) => {
	/**
	 * this callback will be executed whenever a new client
	 * connection is made. Initially we can maintain a global
	 * to handle the number of active connections.
	 * For scalability propose and MVP, we can restrict it
	 * to just one process at a time or 2 for experimental purpose.
	 * Keep it in separate env file to make it easier to change
	 * without making a new build of the proposed system.
	 */
	io.on('connection', (socket) => {
		if (io.clients.length > VALID_ACTIVE_CONNECTIONS) {
			throw new Error(`Only ${VALID_ACTIVE_CONNECTIONS} nodes are allowed to connect.`);
		}
		const content = fs.readFileSync('logs/logs.json', { encoding: 'utf-8' });
		socket.emit('logbook-connected', JSON.parse(content));

		/**
		 * recursively load the files to handle the socket
		 * events
		 */
		const skip = ['index.js', '.DS_Store'];
		const files = fs.readFileSync(__dirname);

		files.map((file, index) => {
			const found = skip.find(skipThisFile => skipThisFile === file);
			if (!found) {
				const fileName = `${file.charAt(0).toUpperCase()}${file.split('.')[0].substring(1, file.length)}`;
				const callbackFunction = require(`./${file}`).default;
				callbackFunction({ socket, metric: `${filename}Metrics` });
			}
		});
	});
}