var Inspect = require('../inspect');
var Docker = require('dockerode');

/**
 * Find the running tcpdump activity container and return its stdout stream
 * @param  {Function}	callback
 * @return {Stream}
 */
exports.getActivityStream = function(callback) {
	Inspect.listContainers(function(err, result) {
		// find the activity container, if it's running
		var activity_container;
		for (var index = 0; index < result.length; index++) {
			var container = result[index];
			if ('/activity' === container.name) {
				activity_container = container;
				break;
			}
		}

		// no activity container running, bail
		if (undefined === activity_container) {
			callback('activity container not found running, start the container with `--name activity` first');
			return false;
		}

		// get the activity container
		var docker = new Docker();
		activity_container = docker.getContainer(activity_container.id);

		// attach to the activity container and return its stdout stream
		activity_container.attach({stream: true, stdout: true, stderr: false}, callback);
	});
}
