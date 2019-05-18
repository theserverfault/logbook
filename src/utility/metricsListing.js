import fs from 'fs';
import path from 'path';
/**
 * @description the utility function to read the utility file
 * and returns the list of valid metrics identifiers.
 * The valid metrics identifiers are stored in configurations/metrics.json
 * These metrics are subjected to be updated added/removed by the
 * admin APIs.
 */
export default () => {
	const location = path.resolve(__dirname, '../', '../', 'configurations', 'metrics.json');
	/**
	 * check if metrics.json exists
	 */
	if(!fs.existsSync(location)) {
		throw new Error('metrics.json does not exists. Contact Admin.');
	}
	const validMetricsListing = JSON.parse(fs.readFileSync(location,  { encoding: 'utf-8' }));
	return validMetricsListing;
}