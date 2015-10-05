var Docker = require('dockerode');
var Async = require('async');

var docker = new Docker();

/**
 * Process the data from `docker inspect` into something we can use.
 * Most importantly we want the identifiers and networking information.
 *
 * @param  {Object}     __container The container object as defined by dockerode
 * @param  {Function}   callback
 * @return {Object}     An object/hash of container details
 */
function getContainerInfo(__container, callback) {

	var container_id	= __container.Id;
	var container		= docker.getContainer(container_id);

	container.inspect(function(err, container_data) {
		var name				= container_data['Name'];
		var network				= container_data['NetworkSettings'];
		var ip					= network['IPAddress'];
		var ports				= network['Ports'];
		var port_keys			= Object.keys(ports);

		var exposed_ports = port_keys.map(function(port_key) {
			var port = ports[port_key];
			return port[0]['HostPort'];
		});

		callback(null, {
			id:		container_id,
			name:	name,
			ip:		ip,
			ports:	exposed_ports
		});
	});
}

/**
 * Build a list of the available containers and the details we're interested in
 *
 * @param  {Function}	callback
 * @return {Object}		An object/hash of container details
 */
exports.listContainers = function(callback) {
	docker.listContainers(function(err, containers) {
		Async.map(
			containers,
			getContainerInfo,
			function(err, results) {
				if (typeof(callback) === 'function') {
					callback(results);
				} else {
					// if we didn't get a callback, just stdout the results
					console.log('%j', results);
				}
			}
		);
	});
}

// run listContainers if run as CLI script, not a require
if (!module.parent) {
	exports.listContainers();
}
