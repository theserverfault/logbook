import fs from 'fs';
import {
	VALID_ACTIVE_CONNECTIONS,
} from '../constants';
import { default as LogSocket } from './log';
import { MetricsListingUtility } from '../utility';

export default (io) => {
	const clients = [];
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
		if (clients.length === Number(VALID_ACTIVE_CONNECTIONS)) {
			/**
			 * Emit a message when logbook connection is failed to establish
			 * This could be handled to notify the client that a specific pack
			 * con only link the following amount of nodes.
			 */
			socket.emit('logbook-connection-error', { message: `Cannot connect with more than ${VALID_ACTIVE_CONNECTIONS} node(s) at a time.` })
			socket.disconnect();
			return;
		}
		// keep a collection of connected clients/nodes
		clients.push(socket.client);
		const content = fs.readFileSync('logs/logs.json', { encoding: 'utf-8' });
		socket.emit('logbook-connected', JSON.parse(content));

		/**
		 * recursively load the files to handle the socket
		 * events
		 */
		const metrics = MetricsListingUtility();
		metrics.map((metric) => {
			LogSocket({ socket, metric });
			console.log(`Listening to socket ${metric}`);
		});

		socket.on('disconnect', () => {
			/**
			 * remove from the list of clients so that other clients can connect.
			 */
			clients.splice(clients.indexOf(socket.id.toString()), 1);
			console.log('Disconnected from client')
		});
	});
}