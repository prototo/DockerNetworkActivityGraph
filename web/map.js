(function() {
    var socket = io();
    var containers_by_ip = {};
    var containers_by_port = {};

    function getContainer(ip, port) {
        return containers_by_ip[ip] || containers_by_port[port];
    }

    socket.on('containers', function(_containers) {
        for (var index = 0; index < _containers.length; index++) {
            var container = _containers[index];
            var ip = container.ip;
            var ports = container.ports;

            containers_by_ip[ip] = container;

            for (var _index = 0; _index < ports.length; _index++) {
                var port = ports[_index];
                containers_by_port[port] = container;
            }
        }
    });

    socket.on('activity', function(ping) {
        var src = getContainer(ping.src_ip, ping.src_port);
        var dst = getContainer(ping.dst_ip, ping.dst_port);

        if (src && dst) {
            var p = document.createElement('p');
            p.textContent = src.name + ' > ' + dst.name;
            document.body.appendChild(p);
        }
    });
})();
