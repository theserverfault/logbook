import http from 'http';
import socketIO from 'socket.io';
import fs from 'fs';
/**
 * @description This is the default service that will be doing something and will
 * eventually be imported in index.js and hence exported. Feel free to play around
 * and happy coding.
 * @author gaurav sharma
 * @since 19th December 2018
 */
const encoding = 'utf-8';
const handler = (req, res) => {
	console.log(req.url);
	const { url } = req;
	switch (url) {
		case '/':
			const contentType = 'text/html';
			const content = fs.readFileSync('src/web/index.html', { encoding });
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(content, encoding);
			// const data = JSON.parse(fs.readFileSync('logs/logs.json', { encoding: 'utf-8' }));
			// res.end(JSON.stringify(data));
		default:
			res.end('Welcome to logbook logging server');
	}
};

fs.writeFileSync('logs/logs.json', JSON.stringify([{ date: new Date(), payload: { message: 'Connection Estabished' }}]));

const server = http.createServer(handler);
const io = socketIO(server, {});

io.on('connection', (socket) => {
	console.log(`Socket connetion established and it's id is ${socket.id}`);
	const content = fs.readFileSync('logs/logs.json', { encoding });
	// array
	socket.emit('logbook-connected', JSON.parse(content));

	socket.on('log-event', (data) => {
		const logsData = JSON.parse(fs.readFileSync('logs/logs.json', { encoding: 'utf-8' }));
		const datum = { date: new Date(), payload: data }
		logsData.push(datum);
		fs.writeFileSync('logs/logs.json', JSON.stringify(logsData));
		// single object
		io.emit('logs-data-received', datum);
	})
});

const port = 49100;
server.listen(port, done => console.log(`socket.io running on port ${port}`));
