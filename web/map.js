(function() {
    var socket = io();
    var containers_by_ip = {};
    var containers_by_port = {};
    var views = {};

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

        views = setupViews(_containers);
    });

    socket.on('activity', function(ping) {
        var src = getContainer(ping.src_ip, ping.src_port);
        var dst = getContainer(ping.dst_ip, ping.dst_port);

        if (src && dst) {

            var src_view = views[src.name];
            var dst_view = views[dst.name];

            if (src_view && dst_view) {
                src_view.flash();
                dst_view.flash();
            }
        }
    });
})();
