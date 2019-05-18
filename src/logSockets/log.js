import { IOUtility } from '../utility';
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
	socket.on(metric, (data) => {
		try {
			const datum = IOUtility({ metric, payload: data });
			// emit the latest data on success
			socket.emit(`${metric}Updated`, datum)
		} catch (err) {
			// emit the LogMetricError socket event on error
			socket.emit(`${metric}Error`, { type: `${metric}Error`, date: new Date(), payload: {error: err, message: err.message}, type: 'error' });
		}
	});
};