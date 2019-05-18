import fs from 'fs';
import {
	VALID_ACTIVE_CONNECTIONS,
	DEFAULT_METRICS,
} from '../constants';
import { default as LogSocket } from './log';
import { MetricsListingUtility } from '../utility';

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
		console.log(`${io.clients.length} clients connected`);
		if (io.clients.length > VALID_ACTIVE_CONNECTIONS) {
			throw new Error(`Only ${VALID_ACTIVE_CONNECTIONS} nodes are allowed to connect.`);
		}
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

		socket.on('disconnect', () => console.log('Disconnected from client'));
	});
}