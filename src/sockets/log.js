import fs from 'fs';
import path from 'path';
/**
 * The connection that handles the looging of data into the
 * logging files and hence streaming it into the webapp
 * @author gaurav sharma
 * @since 14th May 2019
 *
 * The event handling details are as follows:
 * Receivers
 * - LogMetrics : Trigger this event with payload  to log data
 * Triggers
 * - LogMetricsUpdated : Triggered on success updation of log metric
 * - LogMetricsError : Triggered on error updating of log metrics
 */
export default ({ socket, metric }) => {
	const location = path.resolve(__dirname, '../../', `${metric}.json`);
	socket.on(metric, (data) => {
		try {
			const logsMetricData = JSON.parse(fs.readFileSync(location, { encoding: 'utf-8' }));
			const datum = { date: new Date(), payload: data, type: 'data' };
			logsMetricData.push(datum);
			fs.writeFileSync(location, JSON.stringify(logsMetricData));
			// emit the latest data on success
			io.emit(`${metric}Updated`, datum)
		} catch (err) {
			// emit the LogMetricError socket event on error
			io.emit(`${metic}Error`, { date: new Date(), payload: {error: err, message: err.message}, type: 'error' });
		}
	});
};