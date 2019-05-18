import path from 'path';
import fs from 'fs';
import { MetricsListingUtility } from '.';
/**
 * @description This is an I/O utility function that runs along with
 * the socket logging services. The logging process is generic and hence
 * is encapsulated in a single utility finction which could be used
 * to perform a standard generic metric-based logging.
 * You can see the details about Metric Based Logging in the Logbook Brainstorming Document
 * while it is in development phase.
 * @author gaurav sharma
 * @since 18th May 2019
 */
export default ({ metric, payload }) => {
	try {
		const location = path.resolve(__dirname, '../', '../', 'logs', `${metric}.json`);
		/**
		 * check if file exists. The file must exists in order to handle
		 * logs. If file does not exists then create a new file for metrics.
		 * Maintain the valid metrics in a separate file.
		 */
		if (!fs.existsSync(location)) {
			/**
			 * check if metric is valid as per the metrics
			 * registered in the file
			 * @todo we can keep the metrics in cache to avoid
			 * frequent I/O while working Realtime because logs
			 * can be really continuous.
			 */
			const metrics = MetricsListingUtility();
			if (!metrics.includes(metric)) {
				throw new Error(`${metric} is a not a valid registered metric on Logbook.`);
			}
			// create the new file at this location
			fs.writeFileSync(location, Buffer.from(JSON.stringify([])), { encoding: 'utf-8' });
		}
		// write the payload to file
		/**
		 * We are handling the I/O read/write in a wrong way here
		 * It's just the conventional way of reading/writing data
		 * to/from a file. We have to maintain a buffer or cache of
		 * data and queue the I/O via queuing protocol rather than doing it
		 * realtime. For now keep the conventional but this needs to be changed
		 * as soon as possible.
		 * @todo adding queue based I/O or caching
		 */
		const metricsData = JSON.parse(fs.readFileSync(location, { encoding: 'utf-8' }));
		const data = { date: new Date(), type: 'Payload', payload };
		metricsData.push(data);
		fs.writeFileSync(location, JSON.stringify(metricsData));
		return data;
	} catch (err) {
		/**
		 * The error could be more descriptive.
		 */
		throw new Error(err);
	}
}